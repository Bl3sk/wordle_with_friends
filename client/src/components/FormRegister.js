import { useState, useEffect } from "react"
const FormRegister = ( {setDisplayForm} ) => {
    const [registerData, setRegisterData] = useState({
      nickname: "",
      email: "",
      password: "",
      repeatedPassword: ""
    })
    console.log(registerData)
    function showFeedback(el, option) {
      el.classList.remove("is-valid",  "is-invalid");
      el.classList.add("is-" + option);
    }
    useEffect(() => {
      const input = document.querySelector("#floatingNick")
      if (registerData.nickname.length === 0) {
        input.classList.remove("is-valid", "is-invalid");
      } 
      else if (registerData.nickname.length < 3 || registerData.nickname.length > 10) {
        showFeedback(input, "invalid")
      }
      else if (registerData.nickname.length >= 3 || registerData.nickname.length <= 10) {
        showFeedback(input, "valid")
      }
    }, [registerData.nickname])

    useEffect(() => {
      const input = document.querySelector("#floatingEmail")
      //eslint-disable-next-line
      var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (registerData.email.length === 0) {
        input.classList.remove('is-valid', 'is-invalid');
        return
      } 
      if (!registerData.email.match(mailformat)) {
        showFeedback(input, "invalid")
      } else {
        showFeedback(input, "valid")
      }
    }, [registerData.email])

    useEffect(() => {
      const input = document.querySelector("#floatingPassword")
      if (registerData.password.length === 0) {
        input.classList.remove("is-valid", "is-invalid");
      } 
      else if (registerData.password.length < 6 || registerData.password.length > 15) {
        showFeedback(input, "invalid")
      }
      else if (registerData.password.length >= 6 || registerData.password.length <= 15) {
        showFeedback(input, "valid")
      }
    }, [registerData.password])

    useEffect(() => {
      const input = document.querySelector("#floatingPassword2")
      if (registerData.repeatedPassword.length === 0) {
        input.classList.remove("is-valid", "is-invalid");
      } 
      else if (registerData.password !== registerData.repeatedPassword) {
        showFeedback(input, "invalid")
      }
      else if (registerData.password === registerData.repeatedPassword) {
        showFeedback(input, "valid")
      }
    }, [registerData.repeatedPassword, registerData.password])
    return ( 
        <div>
            <form className="p-3" autoComplete="on">
              <div className="form-container w-100">
                <i className="bi bi-person-fill"></i>
                <div className="form-floating form-container">
                  <input type="text" className="form-control inputForm" 
                  onChange={
                    (e) => {setRegisterData({...registerData, nickname: e.target.value})
                    }} 
                  id="floatingNick" placeholder="Your nickname" required/>
                  <label htmlFor="floatingNick">Nickname</label>
                  <div className="invalid-feedback">
                    Must be 3-10 characters long!
                  </div>
                </div>
              </div>
              <div className="form-container w-100">
                <i className="bi bi-envelope-fill"></i>
                <div className="form-floating form-container">
                  <input type="email" className="form-control" 
                  onChange={
                    (e) => {setRegisterData({...registerData, email: e.target.value})
                    }} 
                    id="floatingEmail" placeholder="name@example.com" required/>
                  <label htmlFor="floatingInput">Email address</label>
                  <div className="invalid-feedback">
                    Invalid email!
                  </div>
                </div>
              </div>
              <div className="form-container w-100">
                <i className="bi bi-lock-fill"></i>
                <div className="form-floating form-container">
                  <input type="password" className="form-control" 
                  onChange={
                    (e) => {setRegisterData({...registerData, password: e.target.value})
                    }}  
                    id="floatingPassword" placeholder="Password" autoComplete="on" required/>
                  <label htmlFor="floatingPassword">Password</label>
                  <div className="invalid-feedback">
                    Must be 6-15 characters long!
                  </div>
                </div>
              </div>
              <div className="form-container w-100">
                <i className="bi bi-key-fill"></i>
                <div className="form-floating form-container">
                  <input type="password" className="form-control" 
                  onChange={
                    (e) => {setRegisterData({...registerData, repeatedPassword: e.target.value})
                    }}  
                    id="floatingPassword2" placeholder="Password" autoComplete="on" required/>
                  <label htmlFor="floatingPassword2">Repeat password</label>
                  <div className="invalid-feedback">
                    Passwords must match!
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-50 fs-5 text" value="register">Register</button>
            </form>
            <hr style={{width:"90%", margin: "0.5rem auto", opacity: 0.6}}></hr>
            <div>
                <span style={{ fontSize: "0.85rem" }}>Already have an account?</span>
                <button type="submit" className="btn btn-dark button-sec m-2" onClick={() => {setDisplayForm("Login")}}>Login</button>
            </div>
        </div>
     );
}
 
export default FormRegister;
