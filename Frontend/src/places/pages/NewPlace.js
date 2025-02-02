import Input from "../../shared/components/FormElements/Input";
import { useCallback } from "react";
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import Button from '../../shared/components/FormElements/Button'
import './PlaceForm.css'


const NewPlace = () => {
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

    }
  }, false)


  const placeSubmitHandles = event => {
    event.preventDefault();
    console.log(formState.inputs)
  }
  return <form action="" className='place-form' onSubmit={placeSubmitHandles}>
    <Input id='title' type="text" label="Title" element="input" onInput={inputHandler} errorText='please enter a valid title.' validators={[VALIDATOR_REQUIRE()]} />
    <Input id='description' type="text" label="Description" element="textarea" onInput={inputHandler} errorText='please enter a valid description (at least 5 characters).' validators={[VALIDATOR_MINLENGTH(5)]} />
    <Input id='address' type="text" label="Address" element="textarea" onInput={inputHandler} errorText='please enter a valid title.' validators={[VALIDATOR_REQUIRE()]} />
    <Button type='submit' disabled={!formState.isValid}>
      ADD PLACE
    </Button>
  </form>
};

export default NewPlace;