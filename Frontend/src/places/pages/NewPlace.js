import Input from "../../shared/components/FormElements/Input";
import { useContext } from "react";
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import Button from '../../shared/components/FormElements/Button'
import './PlaceForm.css'
import { useHttpClient } from '../../shared/hooks/http-hook'
import AuthContext from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
const NewPlace = () => {
  const auth = useContext(AuthContext)
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [formState, inputHandler] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
    address: {
      value: '',
      isValid: false

    },
    image: {
      value: null,
      isValid: false
    }
  }, false)


  const history = useHistory()
  const placeSubmitHandles = async event => {
    event.preventDefault();
    try {
      const formData = new FormData()
      formData.append('title', formState.inputs.title.value)
      formData.append('description', formState.inputs.description.value)
      formData.append('address', formState.inputs.address.value)
      formData.append('creator', auth.userId)
      formData.append('image', formState.inputs.image.value)
      await sendRequest('http://localhost:5000/api/places', 'POST', formData, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push('/')
    }
    catch (error) {

    }
  }
  return <>
    <ErrorModal error={error} onClear={clearError} />
    <form action="" className='place-form' onSubmit={placeSubmitHandles}>
      {isLoading && <LoadingSpinner asOverlay />}
      <Input id='title' type="text" label="Title" element="input" onInput={inputHandler} errorText='please enter a valid title.' validators={[VALIDATOR_REQUIRE()]} />
      <Input id='description' type="text" label="Description" element="textarea" onInput={inputHandler} errorText='please enter a valid description (at least 5 characters).' validators={[VALIDATOR_MINLENGTH(5)]} />
      <Input id='address' type="text" label="Address" element="textarea" onInput={inputHandler} errorText='please enter a valid title.' validators={[VALIDATOR_REQUIRE()]} />
      <ImageUpload id='image' errorText='Please provide an image' onInput={inputHandler} />
      <Button type='submit' disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
  </>
};

export default NewPlace;