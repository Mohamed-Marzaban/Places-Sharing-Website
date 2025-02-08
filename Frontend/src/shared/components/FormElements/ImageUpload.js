import Button from './Button'
import { useRef, useState, useEffect } from 'react'
import './ImageUpload.css'
import './Input.css'
const ImageUpload = props => {
    const [file, setFile] = useState()
    const [previewUrl, setPreviewUrl] = useState()
    const [isValid, setIsValid] = useState(false)
    const filePicker = useRef()
    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file)
    }, [file])
    function pickHandler(event) {
        let pickedFile;
        let fileIsValid;
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0]
            setFile(pickedFile)
            setIsValid(true)
            fileIsValid = true

        }
        else {
            setIsValid(false)
            fileIsValid = false
        }
        props.onInput(props.id, pickedFile, fileIsValid)
    }
    function pickImageHandler() {
        filePicker.current.click()
    }
    return (
        <div className='form-control'>
            <input ref={filePicker} type="file" id={props.id} style={{ display: 'none' }} accept='.jpg,.png,.jpeg' onChange={pickHandler} />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview'>
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p>Please pick an image.</p>}
                </div>
                <Button type='button' onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    )
}

export default ImageUpload