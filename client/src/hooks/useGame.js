import { useEffect, useState, useRef  } from 'react'
import * as bootstrap from 'bootstrap';

function useGame( solutions, gameType ) {
    // npm seznam wordle slov (guessesOnly = wordlist.cache.guesses)
    const wordlist = require("wordle-wordlist")
    const allWords = wordlist.cache.all

    // useState pro informace o hře
    const defaultUsedWords = [{}, {}, {}, {}, {}, {}]
    const defaultUsedKeys = {
        q: "key",
        w: "key",
        e: "key",
        r: "key",
        t: "key",
        z: "key",
        u: "key",
        i: "key",
        o: "key",
        p: "key",
        a: "key",
        s: "key",
        d: "key",
        f: "key",
        g: "key",
        h: "key",
        j: "key",
        k: "key", 
        l: "key",
        y: "key", 
        x: "key",
        c: "key", 
        v: "key",
        b: "key", 
        n: "key", 
        m: "key"
    }
    const defaultGameStatus = {
      usedWords: defaultUsedWords,
      usedKeys: defaultUsedKeys,
      round: 0,
      status: "in progress"
    }
    const [gameStatus, setGamesStatus] = useState(defaultGameStatus)
    const [currWord, setcurrWord] = useState("")
    const solutionWord = gameType === "classic" ? solutions.classic_word : solutions.challenge_word
    const [messageToast, setMessageToast] = useState("")
    const messageId = useRef(0);
    console.log(solutionWord, "v use Game")
    console.log(messageToast)
    // při reloadu stránky se získají zpět data z local storage
    useEffect(() => {     
      const date = new Date()
      const todayDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
      const dateStorage = JSON.parse(localStorage.getItem("lastPlayed"))
      if (dateStorage !== todayDate) {
        localStorage.clear();
        localStorage.setItem("lastPlayed", JSON.stringify(todayDate)) 
      }
      const wordsStorage = JSON.parse(localStorage.getItem(gameType));
      if (wordsStorage == null) return
      setGamesStatus(wordsStorage)
    },[gameType]) 

    // aktualizace local storage po zadání slova, zobrazení po modalu po konci hry
    useEffect(() => {
      if (gameStatus.round !== 0 && gameStatus.status === "in progress") {
        localStorage.setItem(gameType === "classic" ? "classic" : "challenge", JSON.stringify(gameStatus))
      } else {
        return
      }
      let myModal = new bootstrap.Modal(document.getElementById('resultModal'))
      if (Object.keys(gameStatus.usedWords[gameStatus.round-1])[0] === solutionWord) {
        messageId.current = messageId.current + 1;
        setMessageToast({
          text: "Well played!",
          id: messageId.current
        })
        setGamesStatus({
          ...gameStatus, 
          status: "win"})
        myModal.show()
        return
      } 
      if (gameStatus.round >= 6 ) {
        messageId.current = messageId.current + 1;
        setMessageToast({
          text: "Better luck next time!",
          id: messageId.current
        })
        setGamesStatus({
          ...gameStatus, 
          status: "lose"})
        myModal.show()
        return
      }
    },[gameStatus, gameType, solutionWord])


    // funkce
    const handleKeyClick = (e) => {
      console.log(gameStatus)
        if (gameStatus.status !== "in progress") return
        let key = !e.target.getAttribute("data-key") ? e.key : e.target.getAttribute("data-key")
        key = key.toLowerCase()
        if(currWord.length >= 5 && key !== "enter" && key !== "backspace") return
        if(currWord.length < 5 && key === "enter") {
          messageId.current = messageId.current + 1;
          setMessageToast({
            text: "Not enough letters!",
            id: messageId.current
          })
          return
        }
        if(key.match(/[a-z]/) && key.length === 1 ) {
          setcurrWord(currWord + key)
          return
        }
        if(key === "backspace") {
            setcurrWord(currWord.slice(0, -1))
            return
          }
        if(key === "enter" && currWord.length === 5) {
            if(!checkCorrectWord(currWord)){
              handleNotValidWord()
              return
            }
            handleAddWord()
          }
      }

      const getLetterStyles = () => {
        const styles = []
        const newUsedKeys = gameStatus.usedKeys
        let i = 0
        for(let letter of currWord){
          if(letter === solutionWord.charAt(i)) {
            styles.push("correct")
            newUsedKeys[letter] = "key correct"
          } else if(solutionWord.includes(letter)) {
            styles.push("wrongPosition");
            if(newUsedKeys[letter] === "key correct") continue
            newUsedKeys[letter] = "key wrongPosition"
          } else {
            newUsedKeys[letter] = "key wrongLetter"
            styles.push("wrongLetter");
          }
          i++;
        }
        const newData = {
          usedKeys: newUsedKeys,
          styles: styles
        }
        return newData
      }

      const handleAddWord = () => {
        const newData = getLetterStyles()
        let newUsedWords = gameStatus.usedWords
        newUsedWords[gameStatus.round] = {[currWord]: newData.styles}
        setGamesStatus({
          ...gameStatus, 
          usedWords: newUsedWords,
          round: gameStatus.round + 1,
          usedKeys: newData.usedKeys
        })
        setcurrWord("")
        return
      }

      const checkCorrectWord = (word) => {
        return (allWords.includes(word) ? true : false)
      }

      const handleNotValidWord = () => {
        const rows = document.getElementsByClassName("row")
        rows[gameStatus.round].classList.add("invalidWord")
        setTimeout(() => {
          rows[gameStatus.round].classList.remove("invalidWord")
        }, 500)
        messageId.current = messageId.current + 1;
        setMessageToast({
          text: "Word not found in list!",
          id: messageId.current
        })
      }
      
  return (
    { gameStatus, currWord, messageToast, handleKeyClick }
  )
}

export default useGame

