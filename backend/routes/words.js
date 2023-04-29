const express = require("express")
const libraryDao = require("../dao/library-dao");
const wordlist = require("wordle-wordlist");
const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
        console.log(req.query.date)
        const date = req.query.date
        let words = await libraryDao.getWords(date);
        res.json(words)
        console.log(words);
    } catch (err) {
        next(err);
    }
})

router.get("/newest", async (req, res, next) => {
    try {
        let words = await libraryDao.getNewestWord();
        res.json(words[0])
        console.log(words);
    } catch (err) {
        next(err);
    }
})

router.post("/", async (req, res, next) => {
    const words = req.body
    try {
        await libraryDao.addWords({
            words
        });
    } catch (error) {
        next(err);
    }
    res.status(200).json({
        msg: "Data uložena.", 
        data: words
    })
})

router.put("/challenge", async (req, res, next) => {
    console.log("PUTTT")
    const wordsArr = wordlist.cache.answers;
    const word = req.query.word;
    const nickname = req.query.nickname
    const user = await libraryDao.getUser({nickname: nickname});
    console.log({word})
    console.log({user})
    if (!user || !wordsArr.includes(word)) {
        res.status(404).json({
            msg: "User or word dont exist!"
        })  
        return
    }
    if (user.challengeWord !== "" && word) {
        res.status(409).json({
            msg: "User already have a challenge!"
        })  
        return
    }
    try {
        await libraryDao.updateChallenge({
            word, nickname
        });
    } catch (error) {
        next(err);
    }
    res.status(200).json({
        msg: "Chalennge přidělena."
    })
})

router.delete("/challenge", async (req, res, next) => {
    console.log("delete")
    const word = ""
    const nickname = req.query.nickname
    console.log({word})
    try {
        await libraryDao.updateChallenge({
            word, nickname
        });
    } catch (error) {
        next(err);
    }
    res.status(200).json({
        msg: "Chalennge přidělena."
    })
})

router.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({msg: err});
  });
  

module.exports = router