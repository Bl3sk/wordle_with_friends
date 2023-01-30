require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const wordsRoute = require("./routes/words")


const app = express()
const PORT = process.env.PORT || 8080

/*
if (process.env.NODE_ENV === "production") {
    app.use(express.static("../client/build"))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}*/

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan("tiny"))

app.use(cors({
    origin: '*'
}));

// funguje API na samotném serveru, akorát ne na frontendu
/*app.use(
    cors({
        origin: ["http://localhost:3000", "https://wordle_with_friends2.onrender.com"]
    })
    );*/

app.use("/words", wordsRoute)


const libraryDao = require("./dao/library-dao");
let lastDay;
const wordlist = require("wordle-wordlist")
const answersOnly = wordlist.cache.answers
setInterval(async () => {
    const date = new Date()
    const today = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    if (lastDay === today) {
        console.log("Už máme slovo na tento den")
        return
    } else {
        lastDay = today
        console.log("Jdeme ověřit jestli nemáme už slova.")
        let words = await libraryDao.getWords(today);
        console.log(words)
        if (words !== null) return
        console.log("Opravdu nemáme slova.")
        const newClassic = answersOnly[Math.floor(Math.random()*answersOnly.length)]
        const newChallenge = answersOnly[Math.floor(Math.random()*answersOnly.length)]
        try {
            await libraryDao.addWords({
                words: {
                    classic_word: newClassic,
                    challenge_word: newChallenge
                },
                date: today
            });
        } catch (error) {
            console.log("Při vkládání slov došlo k chybě:", error)
            return
        }
        console.log("Nová slova vložena.")
    }
}, 3000) 




app.use("/", (req, res) => {
    res.json("funguje")
    console.log("log funguje")
})



app.listen(PORT, () => {
    console.log('listening for requests on port', PORT)
})
