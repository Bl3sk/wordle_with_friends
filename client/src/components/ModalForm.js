import { useState } from "react";
import FormLogin from "./FormLogin";
import FormRegister from "./FormRegister";

const ModalForm = ( {setLoggedUser} ) => {
    const [displayForm, setDisplayForm] = useState("Login")
    return ( 
      <div className="modal fade text-dark" id="registrationModal" aria-labelledby="resultModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modalHeader bg-primary bg-gradient text-white">
              <div className="fs-4 text p-1 mx-auto">{displayForm}</div>
              <button type="button" className="btn-close my-auto m-1" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            { displayForm === "Login" && <FormLogin setDisplayForm={setDisplayForm} setLoggedUser={setLoggedUser}/> }
            { displayForm === "Register" && <FormRegister setDisplayForm={setDisplayForm}/>}
            </div>
          </div>
        </div>
      </div>
     );
}
 
export default ModalForm;
