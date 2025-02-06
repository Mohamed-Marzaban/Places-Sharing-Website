import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import './PlaceForm.css'
import { useHttpClient } from '../../shared/hooks/http-hook'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import AuthContext from '../../shared/context/auth-context'
const UpdatePlace = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [loadedPlace, setLoadedPlace] = useState()
    const placeId = useParams().placeId
    const history = useHistory()
    const auth = useContext(AuthContext)
    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false)

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const result = await sendRequest(`http://localhost:5000/api/places/${placeId}`)

                setLoadedPlace(result.place)
                setFormData({
                    title: {
                        value: result.place.title,
                        isValid: true
                    },
                    description: {
                        value: result.place.description,
                        isValid: true
                    }
                }, true)
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchPlace()

    }, [sendRequest, placeId, setFormData])

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        )
    }
    if (!loadedPlace && !error) {
        return (
            <div className="center">
                <Card><h2>Could not find place.</h2>
                </Card>
            </div>
        )
    }

    async function placeUpdateSubmitHandler(e) {
        e.preventDefault()
        try {
            await sendRequest(`http://localhost:5000/api/places/${placeId}`, 'PATCH', JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value
            }), {
                'Content-Type': 'application/json'
            })
            history.push(`/${auth.userId}/places`)
        }
        catch (error) {
            console.log(error)
        }

    }



    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && <form action="" className='place-form' onSubmit={placeUpdateSubmitHandler}>
                <Input id="title" element='input' type='text' label='Title' validators={[VALIDATOR_REQUIRE()]} errorText='Please enter valid input.' initialValue={loadedPlace.title} initialValid={true} onInput={inputHandler} ></Input>
                <Input id="description" element='textarea' type='text' label='Description' validators={[VALIDATOR_MINLENGTH(5)]} errorText='Please enter valid description (min. 5 characters).' initialValue={loadedPlace.description} onInput={inputHandler} initialValid={true}></Input>
                <Button type='submit' disabled={!formState.isValid}>UPDATE PLACE</Button>
            </form>}
        </>
    )
}

export default UpdatePlace