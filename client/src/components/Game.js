import Keyboard from "./Keyboard";
import Board from "./Board";
import Toast from "./Toast";
import ResultModal from "./ModalResult";
import RegistrationModal from "./ModalRegistration";
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
      <ResultModal gameStatus={ gameStatus } solutions={ solutions } gameType={ gameType }/>
      <RegistrationModal/>
      <Board gameStatus={ gameStatus } currWord={ currWord }/>
      <Keyboard gameStatus={ gameStatus } handleKeyClick={ handleKeyClick }/>
    </div>
  );
}

export default Game;
