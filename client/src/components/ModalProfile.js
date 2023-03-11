import React, { useState, useRef } from 'react';
import { axiosInstance } from '../config/config'
import { FilePond, registerPlugin } from 'react-filepond';
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
    const [avatarImage, setAvatarImage] = useState();
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
                  <span>{loggedUser.nickname}</span> 
                  <div className="dropdown-center">
                    <a className="dropdown-toggle" href="/#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-pencil-square"></i>Ediiit
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
                    <div className="form-floating form-container">
                        <input type="text" className="form-control" id="floatingEditNick" placeholder="Nickname" autoComplete="on"/>
                        <label htmlFor="floatingEditNick">New nickname</label>
                    </div>     
                    <button type="submit" className="btn btn-primary p-1 m-2" value="confirm">Confirm changes</button>
                </div>
                <div id="editPassword" className="collapse">
                  <a className="collapsed" href="#editPassword" data-bs-toggle="collapse"><i className="bi bi-x-circle btn-hide"></i></a>
                  Nové heslo
                </div>
                <div id="editAvatar" className="collapse">
                    <a className="collapsed" href="#editAvatar" data-bs-toggle="collapse"><i className="bi bi-x-circle btn-hide"></i></a>
                    <FilePond ref={pond}
                        name="files"
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
                            url: '/users/updateUser',
                            method: 'PUT',
                            ondata: (formData) => {
                              console.log("fooormDATAAA", formData)
                              formData.append("userId", loggedUser.id);
                              return formData;
                            },
                            onload: async (response) => {
                              const msg = JSON.parse(response).message
                              if(msg === "User updated.") {
                                setAvatarImage()
                                updateLoggedUser()
                              }
                            }
                          },
                          revert: {
                            url: `/users/deleteAvatar?userId=${loggedUser.id}`,
                            onload: async (response) => {
                              const msg = JSON.parse(response).message
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
                      /> 
                </div>
                <hr></hr>
                  <p>Nějaký content</p>       
            </div>
          </div>
        </div>
      </div>
     );
}
 
export default ModalProfile;
