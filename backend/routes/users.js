const express = require("express")
const libraryDao = require("../dao/library-dao");
const router = express.Router()

router.post("/", async (req, res) => {
    const user = req.body;
    const userExist = await libraryDao.getUser({
        nickname: user.nickname,
        email: user.email
    });
    try {
        console.log(userExist)
        const userExistArr = await userExist.toArray();
        console.log("poleee",userExistArr)
        if (userExistArr.length > 0) {
            res.status(409).json({
                msg: "Uživatel existuje", 
                data: userExistArr
            })
            return
        }        
    } catch (err) {
        res.status(500).json({
            msg: err
        })
        return
    }
    try {
        await libraryDao.addUser({
            nickname: user.nickname,
            email: user.email,
            password: user.password
        });
    } catch (err) {
        res.status(500).json({
            msg: err
        })
        return
    }
    res.status(200).json({
        msg: "Data uložena.", 
        data: user
    })
})






module.exports = router