import React, { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../config/config'
import { FilePond, registerPlugin } from 'react-filepond';
import useFormValidation from '../hooks/useFormValidation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageTransform,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);
const ModalProfile = ( { loggedUser, updateLoggedUser } ) => {
    const { checkValidationNickname, checkValidationPassword, checkValidationRepeatedPassword, showFeedback, alert } = useFormValidation()
    const [avatarImage, setAvatarImage] = useState();
    const [alreadyUsed, setAlreadyUsed] = useState({
      usedNicknames: [],
      usedEmails: []
    })
    const [editData, setEditData] = useState({
      nickname: "",
      password: "",
      repeatedPassword: ""
    })
    console.log({editData})
    const pond = useRef(null);
    console.log("avatarImage", avatarImage)
    console.log("User", loggedUser)
    console.log("userAvatar",loggedUser.avatar)

    const dropdownItems = document.querySelectorAll('.edit-option');
    dropdownItems.forEach(item => {
      item.addEventListener('click', (event) => {
        const target = event.target.getAttribute('href');
        const collapseDivs = document.querySelectorAll('.collapse.show');
        collapseDivs.forEach(div => {
          div.classList.remove('show');
        });
        const targetDiv = document.querySelector(target);
        targetDiv.classList.add('show');
        });
    });

    function handleChangeNickname() {
      axiosInstance({
        url: '/users/updateUser',
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + loggedUser.jwt_token
        },
        data: {...editData, userId: loggedUser._id} 
      })
      .then((res) => {
        console.log(res.data.msg, res);
        console.log(res.status)
        if (res.status === 200) {
          const alertPlaceholder = document.getElementById('editNicknameAlert')
          alert(alertPlaceholder, 'Your nickname has been succesfully changed!', 'success')
          updateLoggedUser()
        }
      })
      .catch((err) => {
        console.log(err, err.response);
        const usedData = err.response.data.data;
        console.log(usedData)
        const nicknamesArr = [...alreadyUsed.usedNicknames]
        if (err.response.status === 409) nicknamesArr.push(editData.nickname)
        setAlreadyUsed({
          usedNicknames: nicknamesArr
        })
      })
    }

    useEffect(() => {
      const input = document.querySelector("#floatingEditNick")
      if (editData.nickname.length === 0) {
        input.classList.remove("is-valid", "is-invalid");
        return
      } 
      if (alreadyUsed.usedNicknames.includes(editData.nickname)) {
        showFeedback(input, "invalid") 
        return
      }
      showFeedback(input, checkValidationNickname(editData.nickname))
    }, [editData.nickname, alreadyUsed, checkValidationNickname, showFeedback]);
    return ( 
      <div className="modal fade text-dark" id="profileModal" aria-labelledby="profileModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modalHeader bg-primary bg-gradient text-white">
              <div className="fs-4 text p-1 mx-auto">Your profile</div>
              <button type="button" className="btn-close mx-1 my-auto" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="user-preview">
                  <img src={loggedUser.avatar ? `data:${loggedUser.avatar.type};base64,${loggedUser.avatar.data}` : process.env.PUBLIC_URL + "/wordle_icon.jpg"} alt="Avatar" />
                  {loggedUser && <span>{loggedUser.nickname}</span> }
                  <div className="dropdown-center">
                    <a className="dropdown-toggle" href="/#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <i className="bi bi-pencil-square edit-btn"></i>
                    </a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item edit-option" href="#editNickname" data-bs-toggle="collapse">Edit nickname</a> </li>
                      <li><a className="dropdown-item edit-option" href="#editAvatar" data-bs-toggle="collapse">Edit avatar</a></li>
                      <li><a className="dropdown-item edit-option" href="#editPassword" data-bs-toggle="collapse">Edit password</a></li>
                    </ul>
                  </div> 
                </div>   
                <div id="editNickname" className="collapse">
                    <a className="collapsed" href="#editNickname" data-bs-toggle="collapse"><i className="bi bi-x-circle btn-hide"></i></a>
                    <div id="editNicknameAlert"></div>
                    <div className="form-floating form-container">
                        <input type="text" className="form-control" id="floatingEditNick" placeholder="Nickname" autoComplete="on"
                            onChange={
                              (e) => {setEditData({...editData, nickname: e.target.value})
                              }} 
                          />
                        <label htmlFor="floatingEditNick">New nickname</label>
                        <div className="invalid-feedback">
                            {alreadyUsed.usedNicknames.includes(editData.nickname) ? "This nickname is already in use!" :"Must be 3-12 characters long!"}
                        </div>
                    </div>     
                    <button type="submit" className="btn btn-primary p-1 m-2" value="confirm" onClick={() => handleChangeNickname()}>Confirm changes</button>
                </div>
                <div id="editPassword" className="collapse">
                  <a className="collapsed" href="#editPassword" data-bs-toggle="collapse"><i className="bi bi-x-circle btn-hide"></i></a>
                  <div className="form-floating form-container">
                    <input type="password" className="form-control" 
        
                      id="floatingEditPassword" placeholder="Password" autoComplete="on" required/>
                    <label htmlFor="floatingEditPassword">Password</label>
                    <div className="invalid-feedback">
                      Must be 6-30 characters long!
                    </div>
                  </div>
                </div>
                <div id="editAvatar" className="collapse">
                    <a className="collapsed" href="#editAvatar" data-bs-toggle="collapse"><i className="bi bi-x-circle btn-hide"></i></a>
                    {loggedUser && 
                    <FilePond ref={pond}
                    name="avatar"
                    files={avatarImage}
                    onupdatefiles={async (files) => {
                      if (!avatarImage) return
                      setAvatarImage({
                        avatar: files[0].file});
                    }
                  }
                    server={{
                      url: axiosInstance.defaults.baseURL,
                      process: {
                        url: '/users/uploadAvatar',
                        method: 'POST',
                        headers: {
                          'Authorization': 'Bearer ' + loggedUser.jwt_token
                        },
                        ondata: (formData) => {
                          console.log("fooormDATAAA", formData)
                          formData.append("userId", loggedUser._id);
                          formData.append("avatarId", loggedUser.avatarId);
                          return formData;
                        },
                        onload: async (response) => {
                          const msg = JSON.parse(response).msg
                          console.log({msg})
                          if(msg === "User updated.") {
                            setAvatarImage()
                            updateLoggedUser()
                          }
                        }
                      },
                      revert: {
                        url: `/users/deleteAvatar?userId=${loggedUser._id}`,
                        headers: {
                          'Authorization': 'Bearer ' + loggedUser.jwt_token
                        },
                        onload: async (response) => {
                          const msg = JSON.parse(response).msg
                          console.log({msg})
                          if(msg === "Avatar deleted.") {
                            updateLoggedUser()
                          }
                        }
                      }
                    }}
                    acceptedFileTypes={['image/png', 'image/jpeg']}
                    maxFileSize= {5 * 1024 * 1024}
                    allowFileEncode={false}
                    allowImagePreview={true}
                    allowMultiple={false}
                    allowImageTransform={true}
                    imageCropAspectRatio={'1:1'}
                    imagePreviewHeight={100}
                    labelIdle='<span className="filepond--label-action">Upload new avatar</span>'
                  /> }
                </div>
                <hr></hr>
                <div class="user-info">
                  <ul class="list-info">
                    <li>
                      <h3>Registered</h3>
                      <p>{loggedUser.registered}</p>
                    </li>
                    <li>
                      <h3>Email</h3>
                      <p>{loggedUser.email}</p>
                    </li>
                    <li>
                      <h3>Total Score</h3>
                      <p>{loggedUser.score}</p>
                    </li>
                  </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
     );
}
 
export default ModalProfile;
