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
                finishedWords: [],
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

router.get("/leaderboards", async (req, res) => {
    try {
        const leaderboards = await libraryDao.getLeaderboards();
        res.json(leaderboards)
        console.log("leaderboards", leaderboards);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: err });
    }
})

router.get("/userdata", async (req, res) => {
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

router.get("/search", async (req, res) => {
    try {
        const searchString = req.query.q;
        const users = await libraryDao.getUsers(searchString);
        res.json(users)
        console.log("users", users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: err });
    }
})

router.put('/user', authenticateToken, async (req, res) => {
  try {
    const inputData = req.body;
    if (inputData.nickname) {
        const nicknameExist = await libraryDao.getUser({nickname: inputData.nickname});
        if (nicknameExist) {
            throw new Error('User exist') // Express will catch this on its own.
        }
    }
    console.log("inputData", inputData)
    await libraryDao.updateUser({
        id: inputData.userId,
        name: "nickname",
        data: inputData.nickname,
        operator: "$set"
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

router.put('/score', authenticateToken, async (req, res) => {
    try {
      const inputData = req.body;
      await libraryDao.updateScore({
            userId: inputData.userId,
            name: "score",
            data: inputData.score,
            operator: "$inc"
      });
      await libraryDao.updateUser({
            id: inputData.userId,
            name: "finishedWords",
            data: inputData.wordId,
            operator: "$push"
    });
      res.json({ msg: "Score updated." });
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

router.post("/uploadAvatar", authenticateToken, upload, async (req, res) => {
    const {originalname, mimetype, size, buffer} = req.file;
    const {userId, avatarId} = req.body
    const newAvatar = {
        name: originalname,
        type: mimetype,
        size: size,
        data: buffer
      }
    console.log({avatarId})
    console.log(req.body)
    try {
        if (avatarId == "") {
            const addedAvatar = await libraryDao.addAvatar({
                userId: ObjectId(userId), avatar: newAvatar
            });
            await libraryDao.updateUser({
                id: userId,
                operator: "$set",
                name: "avatarId",
                data: addedAvatar.insertedId
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

router.delete("/avatar", authenticateToken, async (req, res) => {
    try {
        console.log("query delete", req.query)
        await libraryDao.deleteAvatar(ObjectId(req.query.userId));
        await libraryDao.updateUser({
            id: req.query.userId,
            operator: "$set",
            name: "avatarId",
            data: ""
        });
        res.json({ msg: "Avatar deleted." });
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "Error while deleting avatar." });
    }
})

module.exports = router