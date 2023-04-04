import { useEffect, useState, useRef  } from 'react'
import * as bootstrap from 'bootstrap';
function useGame( solutions, gameType, handleFinishedWord ) {
    // npm seznam wordle slov (guessesOnly = wordlist.cache.guesses)
    const wordlist = require("wordle-wordlist")
    const allWords = wordlist.cache.all

    // useState pro informace o hře
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

    const [gameStatus, setGameStatus] = useState({
      usedWords: [{}, {}, {}, {}, {}, {}],
      usedKeys: defaultUsedKeys,
      round: 0,
      status: "in progress"
    })
    const [currWord, setcurrWord] = useState("")
    const solutionWord = gameType === "classic" ? solutions.classic_word : solutions.challenge_word
    const [messageToast, setMessageToast] = useState("")
    const messageId = useRef(0);
    const pauseGame = useRef(false);
    const usedKeysHelper = useRef(defaultUsedKeys);
    console.log(solutionWord, "v use Game")

    // update score
    if (gameStatus.status !== "in progress" && gameType === "classic"  ) {
      const increase = 600 - (gameStatus.round - 1) * 100
      handleFinishedWord(increase, solutions._id)
    } 

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
      setGameStatus(wordsStorage)
    },[gameType]) 

    // zobrazení Modalu na konci hry
    useEffect(() => {
      if (gameStatus.status !== "in progress") {
        const myModal = new bootstrap.Modal(document.getElementById('resultModal'));
        myModal.show();
      }
    }, [gameStatus.status])


    // aktualizace local storage po zadání slova, zobrazení po modalu po konci hry
    useEffect(() => {
      // funkce
      const objectsMatch = (obj1, obj2) => {
        const objValues1 = Object.values(obj1)
        const objValues2 = obj2 === "default" ? "key,".repeat(25)+"key" : Object.values(obj2)
        if (objValues1.toString() === objValues2.toString()){
          return true
        } else {
          return false
        }
      }
      const finishGame = (text, status) => {
        const oldLocalStorage = JSON.parse(localStorage.getItem(gameType))
        const newLocalStorage = {...oldLocalStorage, 
            status: status,
            usedKeys: usedKeysHelper.current
        };
        localStorage.setItem(gameType, JSON.stringify(newLocalStorage))
        messageId.current = messageId.current + 1;
        setTimeout(() => {
          setMessageToast({
            text: text,
            id: messageId.current
          })
        }, 1950)
        setTimeout(() => {
          setGameStatus({
            ...gameStatus, 
            status: status,
            usedKeys: usedKeysHelper.current});
        }, 2950)
      }
      // aktualizace klávesnice s delayem
      if (!objectsMatch(usedKeysHelper.current, "default") && !objectsMatch(usedKeysHelper.current, gameStatus.usedKeys)) {
        setTimeout(() => {
          setGameStatus({
            ...gameStatus, 
            usedKeys: usedKeysHelper.current
          })
        }, 1970)
      }
      // aktualizace local storage
      if (gameStatus.round !== 0 && gameStatus.status === "in progress") {
        localStorage.setItem(gameType, JSON.stringify(gameStatus))
      } else {
        return
      }
      // výhra nebo prohra
      if (Object.keys(gameStatus.usedWords[gameStatus.round-1])[0] === solutionWord) {        
        finishGame("Well played!", "win")
      } 
      if (gameStatus.round >= 6) {
        finishGame("Better luck next time!", "lose")
      }
    },[gameStatus, gameType, solutionWord])

    // funkce
    const handleKeyClick = (e) => {
        const modalShown = document.getElementsByClassName("modal fade text-dark show").length
        if (pauseGame.current || gameStatus.status !== "in progress" || modalShown !== 0) return
        let key = !e.target.getAttribute("data-key") ? e.key : e.target.getAttribute("data-key")
        key = key.toLowerCase()
        if(currWord.length >= 5 && key !== "enter" && key !== "backspace") return
        if(currWord.length < 5 && key === "enter") {
          const rows = document.getElementsByClassName("game-row")
          rows[gameStatus.round].classList.add("invalidWord")
          setTimeout(() => {
            rows[gameStatus.round].classList.remove("invalidWord")
          }, 500)
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
        let newUsedKeys = {...gameStatus.usedKeys}
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
        usedKeysHelper.current = newUsedKeys
        return styles
      }

      const handleAddWord = () => {
        pauseGame.current = true
        setTimeout(() => {
          pauseGame.current = false
        }, 1970)
        const rowStyles = getLetterStyles()
        let newUsedWords = gameStatus.usedWords
        newUsedWords[gameStatus.round] = {[currWord]: rowStyles}
        setGameStatus({
          ...gameStatus, 
          usedWords: newUsedWords,
          round: gameStatus.round + 1
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

