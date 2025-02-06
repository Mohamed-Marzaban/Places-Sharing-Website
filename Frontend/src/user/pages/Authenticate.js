import Input from "../../shared/components/FormElements/Input"
import './Auth.css'
import Button from "../../shared/components/FormElements/Button"
import Card from "../../shared/components/UIElements/Card"
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators"
import { useForm } from "../../shared/hooks/form-hook";
import { useState, useContext } from "react"
import AuthContext from "../../shared/context/auth-context"
const Auth = props => {
    const auth = useContext(AuthContext)
    const [isLogin, setIsLogin] = useState(true)
    const [formState, inputHandler, setFormData] = useForm({
        email: { value: '', isValid: false },
        password: { value: '', isValid: false }
    }, false)

    const authSubmitHandler = event => {
        event.preventDefault()
        auth.login()

    }

    const switchModeHandler = _ => {
        if (!isLogin) {
            setFormData({
                ...formState.inputs,
                name: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid)
        }
        else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                }
            }, false)
        }
        setIsLogin(p => !p)
    }
    return (
        <Card className="authentication">
            <h2 className="">Login Required</h2>
            <hr />
            <form action="" onSubmit={authSubmitHandler}>
                {!isLogin && <Input element='input' id='name' type='text' label='Your Name' validators={[VALIDATOR_REQUIRE()]} errorText='Please enter a name' onInput={inputHandler} />}
                <Input onInput={inputHandler} id="email" element="input" label="E-Mail" type="email" validators={[VALIDATOR_EMAIL()]} errorText="Please enter a valid email address" />
                <Input onInput={inputHandler} id="password" element="input" label="Password" type="password" validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid password ,min length 5" />
                <Button type='submit' disabled={!formState.isValid}>{isLogin ? 'LOGIN' : 'SIGNUP'}</Button>
            </form>
            <Button inverse onClick={switchModeHandler}>{isLogin ? 'SWITCH TO SIGNUP' : 'SWITCH TO LOGIN'}</Button>
        </Card>
    )
}

export default Auth