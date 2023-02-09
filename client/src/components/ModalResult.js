import { useContext } from "react";
import { GameContext } from "./Game";
import * as bootstrap from 'bootstrap';

const Modal = ( { solutions, gameType } ) => {
    const gameStatus = useContext(GameContext);
    const thumbIcon = gameStatus.status === "win" ? "bi bi-hand-thumbs-up" : "bi bi-hand-thumbs-down";
    const resultTries = gameStatus.round + "/6";
    const score = 600 - (gameStatus.round - 1) * 100;
    console.log(gameStatus)
    const result = gameStatus.usedWords.filter((word) => {
      if (Object.keys(word).length === 0) return false
      return true
    }).map(row => {
      const key = Object.keys(row)
      const arr = row[key[0]]
      let resultRow = "";
      if (!arr) return resultRow
      for(let style of arr){
        if (style === "correct") resultRow += "🟩"
        if (style === "wrongPosition") resultRow += "🟨"
        if (style === "wrongLetter") resultRow += "⬛"
      }
      return resultRow
    })
    function copyResult() {
      const tooltipEl = document.querySelector('[data-bs-toggle="tooltip"]');
      var tooltip = new bootstrap.Tooltip(tooltipEl, {
        animation: true,
        trigger: "manual",
        placement: "top",
        title: "Result coppied"
      })
      tooltip.show()
      setTimeout(()=> {
        tooltip.hide()
      }, 2000)
      let resultString = "";
      for (let row of result){
        resultString += row+"\n";
      };
      const resultToCopy = `Wordle with friends\n${gameType} ${resultTries}\n${resultString}`;
      navigator.clipboard.writeText(resultToCopy);
    }
    return ( 
      <div className="modal fade text-dark" id="resultModal" aria-labelledby="resultModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modalHeader bg-primary bg-gradient text-white">
              <button type="button" style={{ visibility: "hidden" }} className="btn-close mx-1 my-auto" data-bs-dismiss="modal" aria-label="Close"></button>
              <div className="fs-4 text p-1">Result <i className={thumbIcon + " text-white fs-4"}></i></div>
              <button type="button" className="btn-close mx-1 my-auto" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div>Wordle with friends</div>
              <div>{ gameType }</div>
              <div>{ resultTries }</div>
              {result.map((row, index) => (
                <div key={index}>{row}</div>
              ))}
              <p>+{score}XP</p>
              <p>Total score: 1521XP</p>
              <button type="button" className="btn btn-primary m-1"><i className="bi bi-trophy-fill"></i> Leaderboards</button>
              <button type="button" className="btn btn-primary" onClick={() => {copyResult()}}  data-bs-toggle="tooltip">
                <i className="bi bi-share-fill"></i> Share result
              </button>
            </div>
            <div className="bg-primary bg-gradient text-white p-2">
             <p className="m-1">Solution: { gameType === "classic" ? solutions.classic_word.toUpperCase() : solutions.challenge_word.toUpperCase() }</p>
            </div>
          </div>
        </div>
      </div>
     );
}
 
export default Modal;
