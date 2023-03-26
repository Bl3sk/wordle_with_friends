const express = require("express")
const libraryDao = require("../dao/library-dao");
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
        console.log(req.query.date)
        const date = req.query.date
        let words = await libraryDao.getNewestWord();
        res.json(words[0])
        console.log(words);
    } catch (err) {
        next(err);
    }
})

router.post("/", async (req, res) => {
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

router.use((err, req, res) => {
    console.log(err);
    res.status(500).json({msg: err});
  });

module.exports = router