const Keyboard = ({ gameStatus, handleKeyClick }) => {
  const usedKeys = gameStatus.usedKeys
  const keyboardRow1 = ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p"]
  const keyboardRow2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"]
  const keyboardRow3 = ["y", "x", "c", "v", "b", "n", "m"]
  return (
    <div className="keyboard">
        {keyboardRow1.map((key) => (
            <button type="button" data-key={key} className={usedKeys[key]} onClick={ (event => handleKeyClick(event)) } key={key}>
              {key}
            </button>
          ))}
  
      <div className="space"></div>
        {keyboardRow2.map((key) => (
          <button type="button" data-key={key} className={usedKeys[key]} onClick={ (event => handleKeyClick(event)) } key={key}>
            {key}
          </button>
        ))}
      <div className="space"></div>
      
      <button type="button" data-key="enter" className={"key"} onClick={ (event => handleKeyClick(event)) }>
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-corner-down-right" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M6 6v6a3 3 0 0 0 3 3h10l-4 -4m0 8l4 -4"></path>
        </svg>
      </button>
        {keyboardRow3.map((key) => (
          <button type="button" data-key={key} className={usedKeys[key]} onClick={ (event => handleKeyClick(event)) } key={key}>
            {key}
          </button>
        ))}
      <button type="button" data-key="backspace" className={"key"} onClick={ (event => handleKeyClick(event)) }>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="game-icon" data-testid="icon-backspace"><path fill="var(--color-tone-1)" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path></svg>
      </button>
    </div>
  );
}

export default Keyboard;
