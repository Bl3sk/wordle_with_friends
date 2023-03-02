const express = require("express")
const libraryDao = require("../dao/library-dao");
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

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
        console.log(user)
        if (await bcrypt.compare(inputData.password, user.password)) {
            console.log("první IF")
            const token = createToken(user._id);
            res.status(200).json({
                msg: "Uživatel přihlášen.", 
                data: {
                    nickname: user.nickname,
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

const multer = require('multer');
const upload = multer().single('files');

router.get("/getAvatar", async (req, res, next) => {
    try {
        console.log(req.query.image)
        const image = {image: req.query.image}
        let words = await libraryDao.getUser(image);
        res.json(words)
        console.log(words);
    } catch (err) {
        next(err);
    }
})

router.post('/uploadAvatar', upload, async (req, res) => {
  // extract the file data from the request
  const file = req.file;
  // extract the encoded file string from the file buffer
  //const encodedFileString = file.buffer.toString('base64');
    //console.log(encodedFileString)
    console.log(file)
    await libraryDao.registerUser({
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        data: file.buffer,
        image: "image"
    });

  res.status(200).json({ message: 'File uploaded successfully.' });
});

module.exports = router