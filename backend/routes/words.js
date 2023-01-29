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

router.post("/", async (req, res) => {
    const words = req.body
    try {
        await libraryDao.addWords({
            words
        });
    } catch (error) {
        res.status(500).json({
            msg: "Došlo k chybě."
        })
        return
    }
    res.status(200).json({
        msg: "Data uložena.", 
        data: words
    })
})

router.patch("/", async (req, res) => {
    let book = await libraryDao.updateBook("ltlp");
    res.json(book)
})

router.delete("/", async (req, res) => {
    await libraryDao.deleteBook("ltlp");
})




module.exports = router