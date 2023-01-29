const ToastInvalidWord = () => {
    return (
        <div className="toast bg-dark bg-gradient position-absolute top-25 start-50 translate-middle-x" 
             id="invalidWordToast" 
             data-bs-delay="1500" 
             data-bs-autohide="true"
             >
            <div className="toast-body p-2">
                Word not found in list!
            </div>
        </div>
    );
  }
  
  export default ToastInvalidWord;