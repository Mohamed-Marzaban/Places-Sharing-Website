import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import './PlaceForm.css'
const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most sky scrapers in the world',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St,New York ,NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empireeee State Building',
        description: 'One of the most sky scrapers in the world',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St,New York ,NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    }
]

const UpdatePlace = () => {

    const [isLoading, setIsLoading] = useState(true)

    const placeId = useParams().placeId


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

    const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId)

    useEffect(() => {
        if (identifiedPlace) {
            setFormData({
                title: {
                    value: identifiedPlace.title,
                    isValid: true
                },
                description: {
                    value: identifiedPlace.description,
                    isValid: true
                }
            }, true)
        }
        setIsLoading(false)

    }, [identifiedPlace, setFormData])
    if (!identifiedPlace) {
        return (
            <div className="center">
                <Card><h2>Could not find place.</h2>
                </Card>
            </div>
        )
    }

    function placeUpdateSubmitHandler(e) {
        e.preventDefault()

    }

    if (isLoading) {
        return (
            <div className="center">
                <h2>Loading</h2>
            </div>
        )
    }

    return (
        <form action="" className='place-form' onSubmit={placeUpdateSubmitHandler}>
            <Input id="title" element='input' type='text' label='Title' validators={[VALIDATOR_REQUIRE()]} errorText='Please enter valid input.' initialValue={formState.inputs.title.value} initialValid={formState.inputs.title.isValid} onInput={inputHandler} ></Input>
            <Input id="description" element='textarea' type='text' label='Description' validators={[VALIDATOR_MINLENGTH(5)]} errorText='Please enter valid description (min. 5 characters).' initialValue={formState.inputs.description.value} onInput={inputHandler} initialValid={formState.inputs.description.isValid}></Input>
            <Button type='submit' disabled={!formState.isValid}>UPDATE PLACE</Button>
        </form>
    )
}

export default UpdatePlace