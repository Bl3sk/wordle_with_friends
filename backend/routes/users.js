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


module.exports = router