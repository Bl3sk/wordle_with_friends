import Keyboard from "./Keyboard";
import Board from "./Board";
import Toast from "./Toast";
import Modal from "./Modal";
import useGame from "../hooks/useGame";
import { useEffect } from "react";

function Game( { solutions, gameType } ) {
  const { gameStatus, currWord, messageToast, handleKeyClick } = useGame(solutions ,gameType) 
  useEffect(() => {
    window.addEventListener('keyup', handleKeyClick);
    return () => window.removeEventListener('keyup', handleKeyClick);
  }, [gameStatus, handleKeyClick])
  return (
    <div className="game">
      <Toast message={ messageToast }></Toast>
      <Modal gameStatus={ gameStatus } solutions={ solutions } gameType={ gameType }/>
      <Board gameStatus={ gameStatus } currWord={ currWord }/>
      <Keyboard gameStatus={ gameStatus } handleKeyClick={ handleKeyClick }/>
    </div>
  );
}

export default Game;
