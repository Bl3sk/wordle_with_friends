const express = require("express")
const libraryDao = require("../dao/library-dao");
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const ObjectId = require('mongodb').ObjectID;

function createToken (id) {
    return jwt.sign({id}, "testString", { expiresIn: "7d" })
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
        console.log(req.query.userId)
        const userId = { _id: ObjectId(req.query.userId)}
        let user = await libraryDao.getUser(userId);
        res.json(user)
        console.log(user);
    } catch (err) {
        next(err);
    }
})

const multer = require('multer');
const upload = multer().single('files');

router.put('/updateUser', upload, async (req, res) => {
  try {
    const file = req.file;
    const inputData = req.body;
    console.log("inputData", inputData)
    console.log(req.file)
    await libraryDao.updateUser({
      id: inputData.userId,
      avatar: {
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        data: file.buffer
      }
    });
    res.json({ message: "User updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error while updating user." });
  }
});


router.delete("/deleteAvatar", async (req, res) => {
    try {
        console.log(req.query)
        await libraryDao.updateUser({
            id: req.query.userId,
            avatar: ""
        });
        res.json({ message: "Avatar deleted." });
    } catch (err) {
        res.status(500).json({ message: "Error while deleting avatar." });
    }
})

module.exports = router