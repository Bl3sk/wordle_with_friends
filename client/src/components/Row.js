const Row = ( {word, dataStates} ) => {
    return (
        <div className="row">
            <div className={`${word.charAt(0) && !dataStates ? "currentGuess" : "box"}`} data-state={ dataStates[0] }>{ word.charAt(0) }</div>
            <div className={`${word.charAt(1) && !dataStates ? "currentGuess" : "box"}`} data-state={ dataStates[1] }>{ word.charAt(1) }</div>
            <div className={`${word.charAt(2) && !dataStates ? "currentGuess" : "box"}`} data-state={ dataStates[2] }>{ word.charAt(2) }</div>
            <div className={`${word.charAt(3) && !dataStates ? "currentGuess" : "box"}`} data-state={ dataStates[3] }>{ word.charAt(3) }</div>
            <div className={`${word.charAt(4) && !dataStates ? "currentGuess" : "box"}`} data-state={ dataStates[4] }>{ word.charAt(4) }</div>
        </div>
    );
  }
  
  export default Row;
  