import Row from "./Row";

const Board = ( { gameStatus, currWord }) => {
  let currWordRendered = false
    return (
        <div className="board">
        { gameStatus.usedWords.map((wordObj, index) => {
          const word = Object.keys(wordObj)[0]
          if(!word && !currWordRendered) {
            currWordRendered = true
            return <Row word={ currWord } key={index} dataStates={ "" }/>
          }
          if(!word) return <Row word="" key={index} dataStates={ "" }/>
          return <Row word={word} key={index} dataStates={ wordObj[word] }/>
        })}     
      </div>
    );
  }
  
  export default Board;
  