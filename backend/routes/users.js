const express = require("express")
const libraryDao = require("../dao/library-dao");
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const ObjectId = require('mongodb').ObjectID;
const multer = require("multer");
const upload = multer().single("avatar");

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
                registered: new Date(),
                password: hash,
                avatarId: ""
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
           /* let userData = await libraryDao.getScoreAndAvatar({userId: user._id});
            console.log({userData})
            const score = userData[0].score
            let avatar;
            if (userData[0].avatarResult.length === 0) {
                avatar = ""
            } 
            if (userData[0].avatarResult.length > 0) {
                avatar = userData[0].avatarResult[0].avatar
            } 
            console.log({userData})
            console.log(avatar)*/
            const token = createToken(user._id);
            res.json({
                    nickname: user.nickname,
                    _id: user._id,
                    jwt_token: token,
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
/*
router.get("/getUser", async (req, res) => {
    try {
        console.log("query getUser", req.query)
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
})*/

router.get("/getUserData", async (req, res) => {
    try {
        console.log("query getUserDAta", req.query)
        const userfilter = { _id: ObjectId(req.query.userId)}
        //const avatarfilter = { userId: ObjectId(req.query.userId)}
        let user = await libraryDao.getUser(userfilter);
        let userData = await libraryDao.getScoreAndAvatar({userId: user._id});
        const score = userData[0].score
        user.score = score
        let avatar;
        if (userData[0].avatarResult.length === 0) {
            avatar = ""
        } 
        if (userData[0].avatarResult.length > 0) {
            avatar = userData[0].avatarResult[0].avatar
        } 
        res.json({...user, avatar})
        console.log("user",{user});
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
/*
router.get("/getAvatar", async (req, res, next) => {
    try {
        console.log("query getAvatar", req.query)
        const filter = { _id: ObjectId(req.query.userId)}
        let avatar = await libraryDao.getAvatar(filter);
        res.json(avatar)
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: err });
    }
})*/

router.post("/uploadAvatar", authenticateToken, upload, async (req, res) => {
    const {originalname, mimetype, size, buffer} = req.file;
    const {userId, avatarId} = req.body
    const newAvatar = {
        name: originalname,
        type: mimetype,
        size: size,
        data: buffer
      }
    console.log(avatarId)
    console.log(req.body)
    try {
        if (avatarId == "") {
            const addedAvatar = await libraryDao.addAvatar({
                userId: ObjectId(userId), avatar: newAvatar
            });
           const update = {
                name: "avatarId",
                data: addedAvatar.insertedId
            }
            await libraryDao.updateUser({
                id: userId,
                update
            });
        } else {
            console.log("Jdeme na update")
            await libraryDao.updateAvatar({
                id: avatarId, avatar: newAvatar
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
        console.log("query delete", req.query)
        await libraryDao.deleteAvatar(ObjectId(req.query.userId));
        const update = {
            name: "avatarId",
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