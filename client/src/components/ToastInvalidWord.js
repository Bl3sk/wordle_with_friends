import { useRef  } from 'react'
import * as bootstrap from 'bootstrap';

const ToastInvalidWord = ({ message }) => {
    const messId = useRef(0);
    console.log(messId.current);
    console.log(messId, message.id)
    if (message.id !== messId.current && message.text){
        messId.current = message.id
        let toast = document.getElementById("invalidWordToast")
        toast = new bootstrap.Toast(toast)
        toast.show()
    }
    return (
        <div className="toast bg-dark bg-gradient position-absolute top-25 start-50 translate-middle-x" 
             id="invalidWordToast" 
             data-bs-delay="1500" 
             data-bs-autohide="true"
             >
            <div className="toast-body p-2">
                { message.text }
            </div>
        </div>
    );
  }
  
  export default ToastInvalidWord;