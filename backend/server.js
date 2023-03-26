require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const wordsRoute = require("./routes/words")
const usersRoute = require("./routes/users")

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan("tiny"))

app.use(cors({
    origin: '*'
}));

app.use("/words", wordsRoute)
app.use("/users", usersRoute)


const libraryDao = require("./dao/library-dao");
let lastDay;
const wordlist = require("wordle-wordlist")
const answersOnly = wordlist.cache.answers
setInterval(async () => {
    //const date = new Date()
    //const today = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    const today = new Date().getDate()
    if (lastDay === today) {
        console.log("Už máme slovo na tento den")
        return
    } else {
        lastDay = today
        console.log("Jdeme ověřit jestli nemáme už slova.")
        let words = await libraryDao.getNewestWord();
        console.log(words)
        let lastDate
        if (words[0] !== undefined) lastDate = new Date(words[0].date).getDate()
        console.log({lastDate})
        console.log(today, lastDate)
        if (today === lastDate) return
        console.log("Opravdu nemáme slova.")
        const newClassic = answersOnly[Math.floor(Math.random()*answersOnly.length)]
        const newChallenge = answersOnly[Math.floor(Math.random()*answersOnly.length)]
        try {
            await libraryDao.addWords({
                words: {
                    classic_word: newClassic,
                    challenge_word: newChallenge
                },
                date: new Date()
            });
        } catch (error) {
            console.log("Při vkládání slov došlo k chybě:", error)
            return
        }
        console.log("Nová slova vložena.")
    }
}, 3000) 



app.listen(PORT, () => {
    console.log('listening for requests on port', PORT)
})
