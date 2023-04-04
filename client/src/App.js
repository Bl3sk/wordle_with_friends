import Game from './components/Game';
import Countdown from './components/Countdown';
import useWords from './hooks/useWords';
import useAuthContext from './hooks/useAuthContext';
import ModalProfile from "./components/ModalProfile";
import ModalForm from "./components/ModalForm";
import ModalLeaderboards from './components/ModalLeaderboards';
import { useState } from 'react';
import { Link } from "react-router-dom";
import * as bootstrap from 'bootstrap';


function App() {
  const { solutions } = useWords()
  const { loggedUser, leaderboards, setLoggedUser, updateLoggedUser, handleLogout, getLeaderboards, handleFinishedWord } = useAuthContext()
  const [gameType, setGameType] = useState("classic")
  console.log(solutions, loggedUser)
  return (
    <div className="App">
      <header>
        <div className="dropdow">
          <button type="button" className="btn text-white dropdown-toggle p-1" data-bs-toggle="dropdown" data-bs-offset="5, 5">
            <div className="material-icons">menu</div>
          </button>
          <ul className="dropdown-menu">
            {loggedUser && 
            <li>
              <a className="dropdown-item" href="/#" onClick={() => {new bootstrap.Modal(document.getElementById('profileModal')).show();}}>
                <i className="bi bi-person-fill"></i> Profile
              </a>
            </li>}
            <li>
              <a className="dropdown-item" href="/#" onClick={() => { getLeaderboards() }}>
                <i className="bi bi-trophy-fill"></i> Leaderboards
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="/#">
                <i className="bi bi-gear-fill"></i> Settings
              </a>
            </li>
            <div className="dropdown-divider"></div>
            <li>
              <Link className="dropdown-item" to="/about"><i className="bi bi-info-circle-fill"></i> About game</Link>
            </li>
        {loggedUser && 
            <li>
              <a className="dropdown-item" href="/#" onClick={() => {handleLogout()}}>
                <i className="bi bi-box-arrow-in-right"></i> Log out
              </a>
            </li>}
          </ul>
        </div>
        <div className="header-title">Wordle with friends</div>
        { !loggedUser &&  
        <div>
          <button type="button" className="btn text-white p-1" onClick={() => {new bootstrap.Modal(document.getElementById('registrationModal')).show();}}>
            Login / Register
          </button>
        </div> }
        { loggedUser &&  
        <div>
            <button type="button" className="btn text-white p-1" onClick={() => {new bootstrap.Modal(document.getElementById('profileModal')).show();}}>
                  <div className="user-preview">
                    <img src={loggedUser.avatar ? `data:${loggedUser.avatar.type};base64,${loggedUser.avatar.data}` : process.env.PUBLIC_URL + "/wordle_icon.jpg"} alt="Avatar" />
                    <span>{loggedUser.nickname}</span>
                </div>
            </button>
        </div> }
      </header>
      <hr/>
      <button className={ gameType==="classic" ? "button selected classic" : "button classic" } onClick={ () => setGameType("classic") }>Classic</button>
      <button className={ gameType==="challenge" ? "button selected chall" : "button chall" } onClick={ () => setGameType("challenge") }>Challenge</button>
      <Countdown />
      { solutions.classic_word === null && <div><div className="spinner-border m-5" role="status"/> <p>If page is loading too long, please try to refresh the page.</p></div> }
      { solutions.classic_word !== null && gameType==="classic" && <Game solutions={ solutions } totalScore={loggedUser.score} gameType="classic" handleFinishedWord={handleFinishedWord} getLeaderboards={getLeaderboards} /> }
      { solutions.challenge_word !== null && gameType==="challenge" && <Game solutions={ solutions }  gameType="challenge" getLeaderboards={getLeaderboards}/> }
      <ModalForm setLoggedUser={setLoggedUser}/>
      <ModalProfile loggedUser={loggedUser} updateLoggedUser={updateLoggedUser}/>
      <ModalLeaderboards ownScore={loggedUser.score} leaderboards={leaderboards}/>
    </div>
  );
}

export default App;
