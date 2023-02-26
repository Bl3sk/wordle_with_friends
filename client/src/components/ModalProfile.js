
const ModalProfile = ( { userData } ) => {
    return ( 
      <div className="modal fade text-dark" id="profileModal" aria-labelledby="profileModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modalHeader bg-primary bg-gradient text-white">
              <div className="fs-4 text p-1 mx-auto">Your profile</div>
              <button type="button" className="btn-close mx-1 my-auto" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                {userData.nickname}
            </div>
            <div className="bg-primary bg-gradient text-white p-2">
            nevim
            </div>
          </div>
        </div>
      </div>
     );
}
 
export default ModalProfile;
