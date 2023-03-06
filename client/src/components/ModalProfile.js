import React, { useState, useRef } from 'react';
import { axiosInstance } from '../config/config'
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageTransform,
  FilePondPluginImageResize,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);
const ModalProfile = ( { loggedUser, setLoggedUser } ) => {
    const [avatarImage, setAvatarImage] = useState("");
    const pond = useRef(null);
    console.log("avatarImage", avatarImage)
    console.log("User", loggedUser)
    console.log("userAvatar",loggedUser.avatar)
    function updateUser() {
        axiosInstance({
            url: `/users?userId=${loggedUser.id}`,
            method: "GET"
        })
        .then((data) => {
            console.log("Získana data: ", data)
            if(!data.data) {
                console.log("Nedostali jsme žádná data.")
                return
            } 
            setTimeout(() => {
              setLoggedUser({...loggedUser, 
                nickname: data.data.nickname,
                avatar: data.data.avatar
                              })
              pond.current.removeFiles();
            },3000)
            setTimeout(() => {
              pond.current.removeFiles();
            },3100)
        })
        .catch(err => {
            console.log("Během získávání uživatele se něco pokazilo.", err)
        })
    }
  

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
                </div>   
                <a href="#edit" data-bs-toggle="collapse">Edit profile</a>  
                <div id="edit" className="collapse">
                  <div className="editForm">
                    <FilePond ref={pond}
                        name="files"
                        files={avatarImage && avatarImage}
                        onupdatefiles={async (files) => {
                          setAvatarImage({
                            avatar: files[0].file});
                        }}
                        acceptedFileTypes={['image/png', 'image/jpeg']}
                        maxFileSize= {5 * 1024 * 1024}
                        server={{
                          url: 'http://localhost:8080/users/updateUser',
                          process: {
                            url: '/',
                            method: 'PUT',
                            ondata: (formData) => {
                              formData.append('userId', loggedUser.id);
                              return formData;
                            },
                            onload: (response) => {
                              updateUser()
                              /*setTimeout(() => {
                                //handleUploadSuccess();
                                setNewAvatar(true)
                              }, 6000)*/
                            }
                          }
                        }}
                        allowFileEncode={false}
                        allowImagePreview={true}
                        allowMultiple={false}
                        allowImageTransform={true}
                        imageResizeTargetWidth={30}
                        imageResizeTargetHeight={30}
                        imageCropAspectRatio={'1:1'}
                        imagePreviewHeight={100}
                        labelIdle='<span class="filepond--label-action">Change Avatar</span>'
                      /> 
                       <div className="form-floating form-container">
                          <input type="text" className="form-control"
                            id="floatingEditNick" placeholder="Alex" autoComplete="on"/>
                          <label htmlFor="floatingEditNick">New nickname</label>
                        </div>     
                  </div> 
                  <button>Confirm changes</button>
                </div>
                <hr></hr>
                  <p>Nějaký content</p>       
            </div>
            <div className="bg-primary bg-gradient text-white p-2">
            nevim
            </div>
          </div>
        </div>
      </div>
     );
}
 
export default ModalProfile;
