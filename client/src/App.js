import Game from './components/Game';
import Countdown from './components/Countdown';
import useWords from './hooks/useWords';
import useAuthUser from './hooks/useAuthUser';
import ModalProfile from "./components/ModalProfile";
import ModalForm from "./components/ModalForm";
import { useState } from 'react';
import * as bootstrap from 'bootstrap';

function App() {
  const { solutions } = useWords()
  const { loggedUser, setLoggedUser } = useAuthUser()
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
              <a className="dropdown-item" href="/#">
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
              <a className="dropdown-item" href="/#">
                <i className="bi bi-info-circle-fill"></i> About game
              </a>
            </li>
        {loggedUser && 
            <li>
              <a className="dropdown-item" href="/#" onClick={() => {setLoggedUser("")}}>
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
      { solutions.classic_word !== null && gameType==="classic" && <Game solutions={ solutions } gameType="classic" /> }
      { solutions.challenge_word !== null && gameType==="challenge" && <Game solutions={ solutions }  gameType="challenge"/> }
      <ModalForm setLoggedUser={setLoggedUser}/>
      <ModalProfile loggedUser={loggedUser} setLoggedUser={setLoggedUser}/>
    </div>
  );
}

export default App;
