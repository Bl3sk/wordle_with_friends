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
                msg: "Uživatel existuje",
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
            res.status(200).json({
                msg: "Data uložena.", 
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
            res.status(200).json({
                msg: "Uživatel přihlášen.", 
                data: {
                    nickname: user.nickname,
                    id: user._id,
                    avatar: user.avatar,
                    jwt_token: token
                }
            });
        } else {
            res.status(400).json({
                msg: "Zadané nesprávné přihlašovací údaje."
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
    const file = req.file;
    const inputData = req.body;
    console.log("inputData", inputData)
    console.log(req.file)
    await libraryDao.updateUser({
        id: inputData.userId,
        image: {
            name: file.originalname,
            type: file.mimetype,
            size: file.size,
            data: file.buffer
        }
    });
  res.status(200).json({ message: 'User updated.' });
});

module.exports = router