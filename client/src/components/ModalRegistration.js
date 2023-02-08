const Modal = (  ) => {
    const buttonParentDiv = "form-floating mb-3 w-75 mx-auto d-flex flex-row align-items-center gap-2";
    const input = { height: "3rem", fontSize: "0.8rem" }
    const label = { fontSize: "1rem", padding: "0.6rem 2.7rem" }
    return ( 
      <div className="modal fade text-dark" id="registrationModal" aria-labelledby="resultModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modalHeader bg-primary bg-gradient text-white">
              <button type="button" style={{ visibility: "hidden" }} className="btn-close mx-1 my-auto" data-bs-dismiss="modal" aria-label="Close"></button>
              <div className="fs-4 text p-1">Registration</div>
              <button type="button" className="btn-close mx-1 my-auto" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form className="p-3" autoComplete="on">
              <div className={buttonParentDiv}>
                <i className="bi bi-person-fill" style={{fontSize: "1.5rem"}}></i>
                <input style={input}type="text" className="form-control" id="floatingText" placeholder="Alex"/>
                <label style={label} htmlFor="floatingInput">Nickname</label>
              </div>
              <div className={buttonParentDiv}>
                <i className="bi bi-envelope-fill" style={{fontSize: "1.5rem"}}></i>
                <input style={input} type="email" className="form-control" id="floatingEmail" placeholder="name@example.com"/>
                <label style={label} htmlFor="floatingInput">Email address</label>
              </div>
              <div className={buttonParentDiv}>
                <i className="bi bi-lock-fill" style={{fontSize: "1.5rem"}}></i>
                <input style={input}type="password" className="form-control" id="floatingPassword" placeholder="Password" autoComplete="on"/>
                <label style={label} htmlFor="floatingPassword">Password</label>
              </div>
              <div className={buttonParentDiv}>
                <i className="bi bi-unlock-fill font" style={{fontSize: "1.5rem"}}></i>
                <input style={input}type="password" className="form-control" id="floatingPassword2" placeholder="Password" autoComplete="on"/>
                <label style={label} htmlFor="floatingPassword">Repeat password</label>
              </div>
              <button type="submit" className="btn btn-primary m-2" value="register">Register</button>
            </form>
          </div>
        </div>
      </div>
     );
}
 
export default Modal;
