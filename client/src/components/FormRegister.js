import useFormValidation from '../hooks/useFormValidation';
import { axiosInstance } from '../config/config'
import { useState, useEffect } from "react"

const FormRegister = ( {setDisplayForm} ) => {
    const { checkValidationNickname, checkValidationEmail, checkValidationPassword, checkValidationRepeatedPassword, checkInputValidation, showFeedback, alert } = useFormValidation()
    const [registerData, setRegisterData] = useState({
      nickname: "",
      email: "",
      password: "",
      repeatedPassword: ""
    })
    const [alreadyUsed, setAlreadyUsed] = useState({
      usedNicknames: [],
      usedEmails: []
    })
    function handleSubmit(e) {
      e.preventDefault()
      const alertPlaceholder = document.getElementById('registrationAlert')
      alertPlaceholder.innerHTML = ""
      const email = checkValidationEmail(registerData.email)
      const nickname = checkValidationNickname(registerData.nickname)
      const psw = checkValidationPassword(registerData.password)
      const rptPsw = checkValidationRepeatedPassword(registerData.password, registerData.repeatedPassword)
      if (email !== "valid" || nickname !== "valid" || psw !== "valid" || rptPsw !== "valid") return
      console.log("Jdeme registrovat:", registerData)
      axiosInstance({
        url: `/users/register`,
        method: "POST",
        data: registerData
      })
      .then((res) => {
        console.log(res.data.msg, res);
        console.log(res.status)
        const alertPlaceholder = document.getElementById('registrationAlert')
        if (res.status === 200) alert(alertPlaceholder, 'You have been succesfully registered! <br> You can login now.', 'success')
      })
      .catch((err) => {
        console.log(err.response.data.msg, err);
        const usedData = err.response.data.data;
        console.log(usedData)
        const nicknamesArr = [...alreadyUsed.usedNicknames]
        const emailsArr = [...alreadyUsed.usedEmails]
        if (usedData.nicknameExist) nicknamesArr.push(registerData.nickname)
        if (usedData.emailExist) emailsArr.push(registerData.email)
        setAlreadyUsed({
          usedNicknames: nicknamesArr,
          usedEmails: emailsArr
        })
      })
    }

    useEffect(() => {
      const input = document.querySelector("#floatingNick")
      checkInputValidation(input, alreadyUsed.usedNicknames, registerData.nickname, checkValidationNickname)
    }, [registerData.nickname, alreadyUsed, checkValidationNickname, checkInputValidation, showFeedback]);

    useEffect(() => {
      const input = document.querySelector("#floatingEmail")
      checkInputValidation(input, alreadyUsed.usedEmails, registerData.email, checkValidationEmail)
    }, [registerData.email, alreadyUsed, checkValidationEmail, checkInputValidation, showFeedback]);

    useEffect(() => {
      const input = document.querySelector("#floatingPassword");
      checkInputValidation(input, null, registerData.password, checkValidationPassword)
    }, [registerData.password, checkValidationPassword, checkInputValidation, showFeedback]);

    useEffect(() => {
      const input = document.querySelector("#floatingPassword2");
      checkInputValidation(input, null, {password: registerData.password, repeatedPassword: registerData.repeatedPassword}, checkValidationRepeatedPassword)
    }, [registerData.repeatedPassword, registerData.password, checkValidationRepeatedPassword, checkInputValidation, showFeedback]);
    console.log(alreadyUsed)
    return ( 
        <div>
            <div id="registrationAlert">
            </div>
            <form className="p-3" onSubmit={handleSubmit} autoComplete="on">
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
                    {alreadyUsed.usedNicknames.includes(registerData.nickname) ? "This nickname is already in use!" :"Must be 3-12 characters long!"}
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
                    {alreadyUsed.usedEmails.includes(registerData.email) ? "This email is already in use!" :"Invalid email!"}
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
                    Must be 6-30 characters long!
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
                <button className="btn btn-dark button-sec m-2" onClick={() => {setDisplayForm("Login")}}>Login</button>
            </div>
        </div>
     );
}
 
export default FormRegister;
