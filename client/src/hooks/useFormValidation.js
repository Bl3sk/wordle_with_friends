import { useCallback } from "react"

const useFormValidation = () => {
    const showFeedback = useCallback((el, option) => {
        el.classList.remove("is-valid",  "is-invalid");
        el.classList.add("is-" + option); 
    }, []);

    const checkValidationNickname = useCallback((nickname) => {
        if (nickname.length >= 3 && nickname.length <= 12) return "valid"
        if (nickname.length < 3 || nickname.length > 12) return "invalid"     
      }, []);
  
    const checkValidationEmail = useCallback((email) => {
        //eslint-disable-next-line
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email.match(mailformat)) return "valid"
        if (!email.match(mailformat)) return "invalid"
      }, []);
  
      const checkValidationPassword = useCallback((password) => {
        if (password.length >= 6 && password.length <= 30) return "valid" 
        if (password.length < 6 || password.length > 30) return "invalid"
      }, []);
  
      const checkValidationRepeatedPassword = useCallback((password, repeatedPassword) => {
        if (password === repeatedPassword) return "valid"
        if (password !== repeatedPassword) return "invalid"
      }, []);
    return ( 
        {checkValidationNickname, checkValidationEmail, checkValidationPassword, checkValidationRepeatedPassword, showFeedback}
     );
}
 
export default useFormValidation;