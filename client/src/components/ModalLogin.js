import { useState } from "react";
import FormLogin from "./FormLogin";
import FormRegister from "./FormRegister";

const Modal = (  ) => {
    const [displayForm, setDisplayForm] = useState("Login")
    return ( 
      <div className="modal fade text-dark" id="registrationModal" aria-labelledby="resultModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modalHeader bg-primary bg-gradient text-white">
              <button type="button" style={{ visibility: "hidden" }} className="btn-close mx-1 my-auto" data-bs-dismiss="modal" aria-label="Close"></button>
              <div className="fs-4 text p-1">{displayForm}</div>
              <button type="button" className="btn-close mx-1 my-auto" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            { displayForm === "Login" && <FormLogin setDisplayForm={setDisplayForm}/> }
            { displayForm === "Register" && <FormRegister setDisplayForm={setDisplayForm}/>}
          </div>
        </div>
      </div>
     );
}
 
export default Modal;
