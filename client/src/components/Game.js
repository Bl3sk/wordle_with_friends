import Keyboard from "./Keyboard";
import Board from "./Board";
import Toast from "./Toast";
import ResultModal from "./ModalResult";
import useGame from "../hooks/useGame";
import { WordContext } from "../App";
import { useEffect, createContext, useContext } from "react";

export const GameContext = createContext()

function Game( { solutions, gameType, totalScore } ) {
  const {handleFinishedWord, getLeaderboards} = useContext(WordContext);
  const { gameStatus, currWord, messageToast, handleKeyClick } = useGame(solutions, gameType, handleFinishedWord);
  useEffect(() => {
    window.addEventListener('keyup', handleKeyClick);
    return () => window.removeEventListener('keyup', handleKeyClick);
  }, [gameStatus, handleKeyClick])
  return (
    <div className="game">
      <GameContext.Provider value={gameStatus}>
        <ResultModal solutions={ solutions } gameType={ gameType } totalScore={ totalScore } getLeaderboards={ getLeaderboards } />
        <Board currWord={ currWord }/>
        <Keyboard handleKeyClick={ handleKeyClick }/>
      </GameContext.Provider>
      <Toast message={ messageToast }></Toast>
    </div>
  );
}

export default Game;
