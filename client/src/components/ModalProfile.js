import React, { useState, useEffect } from 'react';
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
const ModalProfile = ( { userData } ) => {
    const [avatarImage, setAvatarImage] = useState(null);

    console.log("avatar", avatarImage)

    useEffect(() => {
      if (avatarImage) {
        var image = new Image();
        image.src = avatarImage;
        const divEl = document.getElementById("imagediv")
        divEl.appendChild(image);
      } 
    }, [avatarImage]);

   useEffect(() => {
      const todayDate = "image"; // replace with the date or identifier for the image you want to retrieve
      axiosInstance({
        url: `/users/getAvatar?image=${todayDate}`,
        method: "GET",
        data: "image"
    })
        .then((response) => {
          const data = response.data;
          console.log("res", data)
          const imageUrl = `data:${data.type};base64,${data.data}`;
          setImageURL(imageUrl);
        })
        .catch((error) => {
          console.log("An error occurred while fetching the image:", error);
        });
    }, []);
    const [imageURL, setImageURL] = useState('');
    console.log("imageURL", imageURL)
  //server="http://localhost:8080/users/uploadAvatar"
  //getBase64String(files[0].file)
  /*onupdatefiles={(files) => {
    const result = getBase64String(files[0].file)
    console.log("result", result)
    setAvatarImage(result);
  }}*/
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
                  <img src={process.env.PUBLIC_URL + "/wordle_icon.jpg"} alt="Avatar"/>
                  <span>{userData.nickname}</span>
                </div>
                <div className="App">
                  <FilePond
                    files={avatarImage && avatarImage}
                    onupdatefiles={async (files) => {
                      //const base64String = await getBase64String(files[0].file)
                      //console.log("result", base64String)
                      setAvatarImage(files[0].file);
                    }}
                    allowFileEncode={false}
                    allowImagePreview={true}
                    allowMultiple={false}
                    acceptedFileTypes={['image/png', 'image/jpeg']}
                    maxFileSize= {2 * 1024 * 1024}
                    server="http://localhost:8080/users/uploadAvatar"
                    allowImageTransform={true}
                    imageResizeTargetWidth={30}
                    imageResizeTargetHeight={30}
                    imageCropAspectRatio={'1:1'}
                    imagePreviewHeight={100}
                    name="files"
                    labelIdle='Drag & Drop your avatar or <span class="filepond--label-action">Browse</span>'
                  />
                  <div id="imagediv"></div>
                  {imageURL && <img src={imageURL} alt="hovno" />}
              </div>
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
