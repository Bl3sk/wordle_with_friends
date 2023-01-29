const Modal = ( { gameStatus, solutions, gameType } ) => {
    return ( 
      <div className="modal fade text-dark" id="resultModal" tabIndex="-1" aria-labelledby="resultModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="resultModalLabel">{ gameStatus.status }</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Solution: { gameType === "classic" ? solutions.classic_word : solutions.challenge_word }</p>
              <p>aaaa</p>
              <p>aaaa</p>
              <p>aaaa</p>
              <p>aaaa</p>
              <p>aaaa</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
     );
}
 
export default Modal;
