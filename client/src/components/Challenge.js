import React, { useState } from 'react';
import { axiosInstance } from '../config/config';
import Game from './Game';

function Challenge({loggedUser, handleFinishedWord, getLeaderboards}) {
  const [searchResults, setSearchResults] = useState([]);
  const [nicknameValue, setNicknameValue] = useState("");
  const [wordValue, setWordValue] = useState("");
  console.log(searchResults, nicknameValue) 

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setNicknameValue(value)
    if (value.length < 2) {
        setSearchResults([])
        return
    }
    axiosInstance(`/users/search?q=${value}`)
      .then(response => setSearchResults(response.data))
      .catch(error => console.log(error));
  };

  const handleWordChange = (event) => {
    const value = event.target.value;
    setWordValue(value)
  }

  const handleUserSelect = (user) => {
    setNicknameValue(user) 
    console.log(user);
  };

  const showAlert = (text) => {
    const el = document.querySelector("#alertChallenge")
    el.classList.remove("d-none");
    el.classList.add("d-block");
    el.innerHTML = text
  }

  const handleSubmitChallenge = () => {
    axiosInstance({
      url: `/words/challenge?word=${wordValue}&nickname=${nicknameValue}`,
      method: "PUT"
    })
      .then(response => {
        console.log(response.data)
        showAlert("User received challenge!")
        setNicknameValue("")
        setWordValue("")
        setSearchResults([])
      })
      .catch(error => {
        console.log(error)
        console.log(error.response.status)
        if (error.response.status === 404) {
          showAlert("User or word dont exist!")
        }
        if (error.response.status === 409) {
          showAlert("User already have a challenge word!")
        }
      });
  }

  return (
    <div>
      <div className="container my-3">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="input-group m-0">
              <input type="text" className="form-control" value={nicknameValue} placeholder="Nickname" aria-label="Nickname" onChange={handleSearchChange} autoComplete="off"/>
              <input type="text" className="form-control" value={wordValue} placeholder="Word" aria-label="Word" onChange={handleWordChange}/>
              <div className="input-group-append">
                <button className="btn btn-dark" type="button" onClick={handleSubmitChallenge}>Challenge friend</button>
              </div>
              <div id="alertChallenge" className="invalid-feedback d-none text-center text-dark">
                User or word dont exist!
              </div>
            </div>
            <div className="w-25 user-search">
              <ul>
                {searchResults.map(user => {
                    if (user === nicknameValue) return null
                    return <li key={user._id} onClick={() => {handleUserSelect(user)}}>{user}</li>
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {loggedUser.challengeWord && <Game solutions={ {words:loggedUser.challengeWord} } totalScore={loggedUser.score} gameType="challenge" handleFinishedWord={handleFinishedWord} getLeaderboards={getLeaderboards}/>}
      {!loggedUser.challengeWord && <div>You have no challenge word.</div>}
    </div>
  );
}

export default Challenge;
