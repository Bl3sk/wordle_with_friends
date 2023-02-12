const FormLogin = ( {setDisplayForm} ) => {
    const buttonParentDiv = "form-floating mb-3 w-75 mx-auto d-flex flex-row align-items-center gap-2";
    const input = { height: "3rem", fontSize: "0.8rem" }
    const label = { fontSize: "1rem", padding: "0.6rem 2.7rem" }
    return ( 
        <div>
            <form className="p-3" autoComplete="on">
              <div className={buttonParentDiv}>
                <i className="bi bi-person-fill" style={{fontSize: "1.5rem"}}></i>
                <input style={input}type="text" className="form-control" id="floatingText" placeholder="Alex"/>
                <label style={label} htmlFor="floatingInput">Nickname</label>
              </div>
              <div className={buttonParentDiv}>
                <i className="bi bi-key-fill" style={{fontSize: "1.5rem"}}></i>
                <input style={input}type="password" className="form-control" id="floatingPassword" placeholder="Password" autoComplete="on"/>
                <label style={label} htmlFor="floatingPassword">Password</label>
              </div>
              <button type="submit" className="btn btn-primary w-50 fs-5 text" value="login">Login</button>
            </form>
            <a href="http://localhost:3000/">Forgotten password?</a>
            <hr style={{width:"90%", margin: "0.5rem auto", opacity: 0.6}}></hr>
            <div>
                <span style={{ fontSize: "0.85rem" }}>Haven't an account yet?</span>
                <button type="submit" className="btn btn-dark m-2" style={{fontSize: "0.9rem", padding: "5px"}} onClick={() => {setDisplayForm("Register")}}>Create an account</button>
            </div>
        </div>
     );
}
 
export default FormLogin;
