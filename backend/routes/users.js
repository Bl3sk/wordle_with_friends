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
            await libraryDao.addUser({
                nickname: newUser.nickname,
                email: newUser.email,
                password: hash,
                avatar: false
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
            let avatar = await libraryDao.getAvatar({userId: user._id});
            const token = createToken(user._id);
            res.json({
                    user: {
                        nickname: user.nickname,
                        _id: user._id,
                        avatarId: user.avatarId,
                        jwt_token: token
                    },
                    avatar: avatar.avatar 
                }
            );
        } else {
            res.status(400).json({
                msg: "Incorrect login data."
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: err
        })
        return
    }
})

router.get("/getUser", async (req, res) => {
    try {
        console.log("query", req.query)
        let filter;
        if (req.query.userId) filter = { _id: ObjectId(req.query.userId)}
        if (req.query.nickname) filter = { nickname: (req.query.nickname)}
        let user = await libraryDao.getUser(filter);
        res.json(user)
        console.log("user,",user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: err });
    }
})

router.get("/getUserData", async (req, res) => {
    try {
        console.log("query", req.query)
        const userfilter = { _id: ObjectId(req.query.userId)}
        const avatarfilter = { userId: ObjectId(req.query.userId)}
        let user = await libraryDao.getUser(userfilter);
        let avatar = await libraryDao.getAvatar(avatarfilter);
        avatar = avatar.avatar
        res.json({user, avatar})
        console.log("user a avatar",{user, avatar});
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: err });
    }
})

router.put('/updateUser', authenticateToken, async (req, res) => {
  try {
    let update;
    const inputData = req.body;
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
    }   else {
            res.status(500).json({ msg: "Error while updating user." });
        }
    }
});

router.get("/getAvatar", async (req, res, next) => {
    try {
        console.log("query", req.query)
        const filter = { _id: ObjectId(req.query.userId)}
        let avatar = await libraryDao.getAvatar(filter);
        res.json(avatar)
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: err });
    }
})

const multer = require("multer");
const upload = multer().single("avatar");

router.post("/uploadAvatar", upload, async (req, res) => {
    const file = req.file;
    const userId = req.body.userId;
    const hasAvatar = req.body.avatarId
    const avatar = {
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        data: file.buffer
      }
    console.log(hasAvatar)
    console.log(req.body)
    try {
        if (hasAvatar) {
            console.log("nmic")
        } else {
            await libraryDao.addAvatar({
                userId: ObjectId(userId), avatar: avatar
            });
            const update = {
                name: "avatarId",
                data: "nějaké id"
            }
            await libraryDao.updateUser({
                id: userId,
                update
            });
        }
        res.json({ msg: "User updated." });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: err
        })
    }
})

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