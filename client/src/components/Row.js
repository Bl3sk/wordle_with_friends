import { useContext } from "react";
import { GameContext } from "./Game";

const Row = ( {word, dataStates} ) => {
    const gameStatus = useContext(GameContext);
    const animationOption = gameStatus.status === "in progress" ? "" : " noAnimation";
    return (
        <div className="row">
            {dataStates.map((dataState, index) => {
               return <div key={index}
                    className={`${word.charAt(index) && !dataStates ? "currentGuess" : "box" + animationOption}`} 
                    data-state={ dataState }>{ word.charAt(index) }
                </div>
            })}
        </div>
    );
  }
  
  export default Row;
  