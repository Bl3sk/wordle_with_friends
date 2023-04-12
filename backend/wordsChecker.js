const libraryDao = require("./dao/library-dao");
const wordlist = require("wordle-wordlist");

class WordChecker {
  constructor() {
    this.lastDay = null;
    this.answersOnly = wordlist.cache.answers;
  }

  async checkWords() {
    const today = new Date().getDate();
    if (this.lastDay === today) {
      console.log("Už máme slovo na tento den");
      return;
    } else {
      this.lastDay = today;
      console.log("Jdeme ověřit jestli nemáme už slova.");
      let words = await libraryDao.getNewestWord();
      console.log(words);
      let lastDate;
      if (words[0] !== undefined) lastDate = new Date(words[0].date).getDate();
      console.log({ lastDate });
      console.log(today, lastDate);
      if (today === lastDate) return;
      console.log("Opravdu nemáme slova.");
      this.insertWord()
    }
  }
  async insertWord () {
    const newClassic = this.getRandomWord();
    const newChallenge = this.getRandomWord();
    try {
      await libraryDao.addWords({
        words: {
          classic_word: newClassic,
          challenge_word: newChallenge,
        },
        date: new Date(),
      });
    } catch (error) {
      console.log("Při vkládání slov došlo k chybě:", error);
      return;
    }
    console.log("Nová slova vložena.");
  }

  getRandomWord() {
    return this.answersOnly[Math.floor(Math.random() * this.answersOnly.length)];
  }

  startChecking(interval) {
    setInterval(() => {
      this.checkWords();
    }, interval);
  }
}


module.exports = new WordChecker();