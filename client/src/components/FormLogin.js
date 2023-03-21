import { axiosInstance } from '../config/config';
import { useState } from "react";

const FormLogin = ( {setDisplayForm, setLoggedUser} ) => {

  const [loginData, setLoginData] = useState({
    nickname: "",
    password: "",
  });

  function handleSubmit(e) {
    e.preventDefault()
    axiosInstance({
        url: `/users/login`,
        method: "POST",
        data: loginData
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          showFeedback("d-none")
          //window.location.reload();
          setLoggedUser(res.data)
          console.log("RESSSSSSSSSSSSSSSSSSSSSS", res.data.data)
        }
      })
      .catch((err) => {
        console.log(err)
        showFeedback("d-block")
      })
  }

  function showFeedback(option) {
    const loginErr = document.querySelector("#loginError")
    loginErr.classList.remove("d-none", "d-block");
    loginErr.classList.add(option);
  };
    return ( 
        <div>
            <form className="p-3" onSubmit={handleSubmit} autoComplete="on">
              <div className="form-container w-100">
                <i className="bi bi-person-fill"></i>
                <div className="form-floating form-container">
                  <input type="text" className="form-control" 
                    onChange={
                    (e) => {setLoginData({...loginData, nickname: e.target.value})
                    }}  
                     id="floatingText" placeholder="Alex" autoComplete="on"/>
                  <label htmlFor="floatingText">Nickname</label>
                </div>
              </div>
              <div className="form-container w-100">
                <i className="bi bi-key-fill"></i>
                <div className="form-floating form-container">
                  <input type="password" className="form-control" 
                    onChange={
                    (e) => {setLoginData({...loginData, password: e.target.value})
                    }}   
                    id="floatingPassword" placeholder="Password" autoComplete="on"/>
                  <label htmlFor="floatingPassword">Password</label>
                  <div id="loginError" className="invalid-feedback d-none">
                    Incorrect nickname or password!
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-50 fs-5 text" value="login">Login</button>
            </form>
            <a href="/#" onClick={() => {alert("This function is not availaible yet.")}}>Forgotten password?</a>
            <hr style={{width:"90%", margin: "0.5rem auto", opacity: 0.6}}></hr>
            <div>
              <span style={{ fontSize: "0.85rem" }}>Haven't an account yet?</span>
              <button className="btn btn-dark button-sec m-2" onClick={() => {setDisplayForm("Register")}}>Create an account</button>
            </div>
        </div>
     );
}
 
export default FormLogin;
