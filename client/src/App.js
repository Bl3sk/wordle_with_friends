import Game from './components/Game';
import Countdown from './components/Countdown';
import useWords from './hooks/useWords';
import { useState } from 'react';

function App() {
  const { solutions } = useWords()
  const [gameType, setGameType] = useState("classic")
  return (
    <div className="App">
      <header>
        <div className="dropdown dropdown-menu-end">
          <button type="button" className="btn text-white dropdown-toggle p-1" data-bs-toggle="dropdown">
            <div className="material-icons">menu</div>
          </button>
          <ul className="dropdown-menu ms-1">
            <li><a className="dropdown-item" href="/#"><i className="bi bi-person-fill"></i> Profil</a></li>
            <li><a className="dropdown-item" href="/#"><i className="bi bi-trophy-fill"></i> Statistics</a></li>
            <li><a className="dropdown-item" href="/#"><i className="bi bi-gear-fill"></i> Settings</a></li>
            <div className="dropdown-divider"></div>
            <li><a className="dropdown-item" href="/#"><i className="bi bi-info-circle-fill"></i> About game</a></li>
            <li><a className="dropdown-item" href="/#"><i className="bi bi-box-arrow-in-right"></i> Log out</a></li>
          </ul>
        </div>
        <div className="header-title">Wordle with friends</div>
        <div>
          <button type="button" className="btn text-white p-1">
            Login / Register
          </button>
        </div>
      </header>
      <hr/>
      <button className={ gameType==="classic" ? "button selected classic" : "button classic" } onClick={ () => setGameType("classic") }>Classic</button>
      <button className={ gameType==="challenge" ? "button selected chall" : "button chall" } onClick={ () => setGameType("challenge") }>Challenge</button>
      <Countdown />
      { solutions===false && <div><div className="spinner-border m-5" role="status"/> <p>If page is loading too long, please try to refresh the page.</p></div> }
      { gameType==="classic" && solutions && <Game solutions={ solutions } gameType="classic" /> }
      { gameType==="challenge" && solutions && <Game solutions={ solutions }  gameType="challenge"/> }
    </div>
  );
}

export default App;
