import { useCallback } from "react"

const useFormValidation = () => {
    const showFeedback = useCallback((el, option) => {
        el.classList.remove("is-valid",  "is-invalid");
        el.classList.add("is-" + option); 
    }, []);

    function alert(alertPlaceholder, message, type) {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert" style="border-radius: 0">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
      ].join('')
      alertPlaceholder.append(wrapper)
    };

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
  
      const checkValidationRepeatedPassword = useCallback((pass) => {
        const {password, repeatedPassword} = pass
        console.log({password, repeatedPassword})
        if (repeatedPassword.length === 0) return
        if (password === repeatedPassword) return "valid"
        if (password !== repeatedPassword) return "invalid"
      }, []);

      const checkInputValidation = useCallback((input, usedValues, value, validationFunction) => {
        console.log({value})
        if (value.length === 0) {
          input.classList.remove("is-valid", "is-invalid");
          return
        } 
        if (usedValues && usedValues.includes(value)) {
          showFeedback(input, "invalid") 
          return
        }
        showFeedback(input, validationFunction(value))
      }, [showFeedback]);

    return ( 
        {checkValidationNickname, checkValidationEmail, checkValidationPassword, checkValidationRepeatedPassword, checkInputValidation, showFeedback, alert}
     );
}
 
export default useFormValidation;