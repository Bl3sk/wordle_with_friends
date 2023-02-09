import Keyboard from "./Keyboard";
import Board from "./Board";
import Toast from "./Toast";
import ResultModal from "./ModalResult";
import RegistrationModal from "./ModalRegistration";
import useGame from "../hooks/useGame";
import { useEffect, createContext } from "react";

export const GameContext = createContext()

function Game( { solutions, gameType } ) {
  const { gameStatus, currWord, messageToast, handleKeyClick } = useGame(solutions ,gameType);
  useEffect(() => {
    window.addEventListener('keyup', handleKeyClick);
    return () => window.removeEventListener('keyup', handleKeyClick);
  }, [gameStatus, handleKeyClick])
  return (
    <div className="game">
      <GameContext.Provider value={gameStatus}>
        <ResultModal solutions={ solutions } gameType={ gameType }/>
        <Board currWord={ currWord }/>
        <Keyboard handleKeyClick={ handleKeyClick }/>
      </GameContext.Provider>
      <Toast message={ messageToast }></Toast>
      <RegistrationModal/>
    </div>
  );
}

export default Game;
