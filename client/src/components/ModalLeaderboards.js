import React from "react"

const ModalLeaderboards = ( {ownScore, leaderboards} ) => {
  console.log(leaderboards)
    return ( 
        <div className="modal fade text-dark" id="leaderboardsModal" aria-labelledby="leaderboardsModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modalHeader bg-primary bg-gradient text-white">
                <div className="fs-4 text p-1 mx-auto">Leaderboards <i className="bi bi-trophy-fill"></i></div>
                <button type="button" className="btn-close mx-1 my-auto" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <h3>TOP 5 players</h3>
                <div className="leaderboards-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Nickname</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      <>
                        {leaderboards && leaderboards.map((player, index) => (
                          <tr key={player._id}>
                            <td>{index + 1}.</td>
                            <td>{player.nickname}</td>
                            <td>{player.score}</td>
                          </tr>
                        ))}
                      </>
                    </tbody>
                  </table>
                </div>
                <p>Your score: {ownScore}</p>
            </div>
          </div>
        </div>
      </div>
     );
}


 
export default ModalLeaderboards 