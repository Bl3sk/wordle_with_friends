const FormLogin = ( {setDisplayForm} ) => {
    return ( 
        <div>
            <form className="p-3" autoComplete="on">
              <div className="form-container w-100">
                <i className="bi bi-person-fill"></i>
                <div className="form-floating form-container">
                  <input type="text" className="form-control" id="floatingText" placeholder="Alex"/>
                  <label htmlFor="floatingInput">Nickname</label>
                </div>
              </div>
              <div className="form-container w-100">
                <i className="bi bi-key-fill"></i>
                <div className="form-floating form-container">
                  <input type="password" className="form-control" id="floatingPassword" placeholder="Password" autoComplete="on"/>
                  <label htmlFor="floatingPassword">Password</label>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-50 fs-5 text" value="login">Login</button>
            </form>
            <a href="/#" onClick={() => {console.log("Forgotten pass")}}>Forgotten password?</a>
            <hr style={{width:"90%", margin: "0.5rem auto", opacity: 0.6}}></hr>
            <div>
              <span style={{ fontSize: "0.85rem" }}>Haven't an account yet?</span>
              <button type="submit" className="btn btn-dark button-sec m-2" onClick={() => {setDisplayForm("Register")}}>Create an account</button>
            </div>
        </div>
     );
}
 
export default FormLogin;
