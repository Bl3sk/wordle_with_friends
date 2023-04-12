require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const wordChecker = require("./wordsChecker");
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



wordChecker.startChecking(3000);




app.listen(PORT, () => {
    console.log('listening for requests on port', PORT)
})
