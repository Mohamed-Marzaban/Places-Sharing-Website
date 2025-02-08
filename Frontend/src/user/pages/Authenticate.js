import Input from "../../shared/components/FormElements/Input"
import './Auth.css'
import Button from "../../shared/components/FormElements/Button"
import Card from "../../shared/components/UIElements/Card"
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators"
import { useForm } from "../../shared/hooks/form-hook";
import { useState, useContext } from "react"
import AuthContext from "../../shared/context/auth-context"
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from "../../shared/hooks/http-hook"
import ImageUpload from "../../shared/components/FormElements/ImageUpload"
const Auth = props => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const auth = useContext(AuthContext)
    const [isLogin, setIsLogin] = useState(true)
    const [formState, inputHandler, setFormData] = useForm({
        email: { value: '', isValid: false },
        password: { value: '', isValid: false }
    }, false)
    const authSubmitHandler = async event => {
        event.preventDefault()


        if (isLogin) {
            try {
                const response = await sendRequest('http://localhost:5000/api/users/login', 'POST', JSON.stringify({
                    email: formState.inputs.email.value, password: formState.inputs.password.value
                }), {
                    'Content-Type': 'application/json'
                },)


                console.log(111)
                console.log(response)

                auth.login(response.userId, response.token)
            }

            catch (error) {

            }

        }
        else {
            try {
                const formData = new FormData()
                formData.append('email', formState.inputs.email.value)
                formData.append('name', formState.inputs.name.value)
                formData.append('password', formState.inputs.password.value)
                formData.append('image', formState.inputs.image.value)
                const response = await sendRequest('http://localhost:5000/api/users/signup', 'POST', formData)
                auth.login(response.userId, response.token)

            }
            catch (error) {
                console.log(error)
            }

        }




    }

    const switchModeHandler = _ => {
        if (!isLogin) {
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid)
        }
        else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false)
        }
        setIsLogin(p => !p)
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && (<div className="center"><LoadingSpinner asOverlay /></div>)}
                <h2 className="">Login Required</h2>
                <hr />
                <form action="" onSubmit={authSubmitHandler}>
                    {!isLogin && <Input element='input' id='name' type='text' label='Your Name' validators={[VALIDATOR_REQUIRE()]} errorText='Please enter a name' onInput={inputHandler} />}
                    {!isLogin && <ImageUpload id='image' center onInput={inputHandler} errorText='Please provide an image' />}
                    <Input onInput={inputHandler} id="email" element="input" label="E-Mail" type="email" validators={[VALIDATOR_EMAIL()]} errorText="Please enter a valid email address" />
                    <Input onInput={inputHandler} id="password" element="input" label="Password" type="password" validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid password ,min length 5" />
                    <Button type='submit' disabled={!formState.isValid}>{isLogin ? 'LOGIN' : 'SIGNUP'}</Button>
                </form>
                <Button inverse onClick={switchModeHandler}>{isLogin ? 'SWITCH TO SIGNUP' : 'SWITCH TO LOGIN'}</Button>
            </Card>
        </>
    )
}

export default Auth