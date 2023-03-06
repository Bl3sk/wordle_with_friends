import { useContext } from "react";
import { GameContext } from "./Game";

const Keyboard = ({ handleKeyClick }) => {
  const gameStatus = useContext(GameContext);
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
        <i className="bi bi-arrow-return-right" style={{fontSize: "1.5rem"}}></i>
      </button>
        {keyboardRow3.map((key) => (
          <button type="button" data-key={key} className={usedKeys[key]} onClick={ (event => handleKeyClick(event)) } key={key}>
            {key}
          </button>
        ))}
      <button type="button" data-key="backspace" className={"key"} onClick={ (event => handleKeyClick(event)) }>
        <i className="bi bi-backspace"></i>
      </button>
    </div>
  );
}

export default Keyboard;
