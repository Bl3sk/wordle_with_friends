const express = require("express")
const libraryDao = require("../dao/library-dao");
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const ObjectId = require('mongodb').ObjectID;

function createToken (id) {
    return jwt.sign({id}, process.env.SECRET_STRING, { expiresIn: "7d" })
}


router.post("/register", async (req, res) => {
    const newUser = req.body;
    const nicknameExist = await libraryDao.getUser({nickname: newUser.nickname});
    const emailExist = await libraryDao.getUser({email: newUser.email});
    console.log(nicknameExist, emailExist)
    try {
        if (nicknameExist || emailExist) {
            res.status(409).json({
                msg: "User exists",
                data: {
                    nicknameExist: nicknameExist,
                    emailExist: emailExist
                }
            })
        } else {
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(newUser.password, salt)
            await libraryDao.registerUser({
                nickname: newUser.nickname,
                email: newUser.email,
                password: hash
            });
            res.json({
                msg: "Data saved.", 
                data: newUser
            })
        }
    } catch (err) {
        res.status(500).json({
            msg: err
        })
    }
})

router.post("/login", async (req, res) => {
    const inputData = req.body;
    console.log("inputData", inputData)
    try {
        const user = await libraryDao.getUser({nickname: inputData.nickname});
        console.log("uživatel v loginu ", user)
        if (await bcrypt.compare(inputData.password, user.password)) {
            console.log("první IF")
            const token = createToken(user._id);
            res.json({
                msg: "User successfully logged in.", 
                data: {
                    nickname: user.nickname,
                    id: user._id,
                    avatar: user.avatar,
                    jwt_token: token
                }
            });
        } else {
            res.status(400).json({
                msg: "Incorrect login data."
            })
        }
    } catch (err) {
        res.status(500).json({
            msg: err
        })
        return
    }
})

router.get("/", async (req, res, next) => {
    try {
        console.log("query", req.query)
        let filter;
        if (req.query.userId) filter = { _id: ObjectId(req.query.userId)}
        if (req.query.nickname) filter = { nickname: (req.query.nickname)}
        let user = await libraryDao.getUser(filter);
        res.json(user)
        console.log({user});
    } catch (err) {
        next(err);
    }
})

const multer = require('multer');
const upload = multer().single('files');

router.put('/updateUser', authenticateToken, upload, async (req, res) => {
  try {
    let update;
    const file = req.file;
    const inputData = req.body;
    if (file) {
        update = {
            name: "avatar",
            data: {
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
            data: file.buffer
          }}
    }
    if (inputData.nickname) {
        const nicknameExist = await libraryDao.getUser({nickname: inputData.nickname});
        if (nicknameExist) {
            throw new Error('User exist') // Express will catch this on its own.
        }
        update = {
            name: "nickname",
            data: inputData.nickname
        }
    }
    console.log("inputData", inputData)
    console.log({update})
    console.log(inputData.userId)
    await libraryDao.updateUser({
        id: inputData.userId,
        update
    });
    res.json({ msg: "User updated." });
  } catch (err) {
    console.error(err);
    if (err = "User exist") {
        res.status(409).json({
            msg: err
        })
    } else {
        res.status(500).json({ msg: "Error while updating user." });
    }
  }
});


router.delete("/deleteAvatar", authenticateToken, async (req, res) => {
    try {
        console.log("query", req.query)
        const update = {
            name: "avatar",
            data: ""
        }
        await libraryDao.updateUser({
            id: req.query.userId,
            update
        });
        res.json({ msg: "Avatar deleted." });
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "Error while deleting avatar." });
    }
})

module.exports = router