import Keyboard from "./Keyboard";
import Board from "./Board";
import ToastInvalidWord from "./ToastInvalidWord";
import Modal from "./Modal";
import useGame from "../hooks/useGame";
import { useEffect } from "react";

function Game( { solutions, gameType } ) {
  const { gameStatus, currWord, handleKeyClick } = useGame(solutions ,gameType) 
  useEffect(() => {
    window.addEventListener('keyup', handleKeyClick);
    return () => window.removeEventListener('keyup', handleKeyClick);
  }, [gameStatus, handleKeyClick])
  return (
    <div className="game">
      <ToastInvalidWord/>
      <Modal gameStatus={ gameStatus } solutions={ solutions } gameType={ gameType }/>
      <Board gameStatus={ gameStatus } currWord={ currWord }/>
      <Keyboard gameStatus={ gameStatus } handleKeyClick={ handleKeyClick }/>
    </div>
  );
}

export default Game;
