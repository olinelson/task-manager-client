import React from 'react'
import { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Dialog, FormGroup, InputGroup, Classes, Tooltip, Button, AnchorButton, Intent } from '@blueprintjs/core'

import { AppToaster } from "./Toaster";



function SignIn(props) {

    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const showToast = () => {
        // create toasts in response to interactions.
        // in most cases, it's enough to simply create and forget (thanks to timeout).
        AppToaster.show({ message: "Toasted." });
    }

    const loginUser = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const res = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: loginData.email,
                password: loginData.password
            })
        })

        setIsLoading(false)

        if (!res.ok) {
            AppToaster.show({ intent: 'warning', message: 'Incorrect password or email' });
            return
        }
        try {
            let data = await res.json()
            localStorage.setItem('authToken', data.token)
            props.autoLogin()
            props.history.push('/tasks')
            setLoginDialogOpen(false)
            AppToaster.show({ intent: 'success', message: "Sign In Successful" });
        } catch (error) {
            console.log(error)
            AppToaster.show({ intent: 'danger', message: 'something went wrong' });
        }

    }


    return <>
        <Button minimal onClick={() => setLoginDialogOpen(true)}>Sign In</Button>
        <Dialog
            isOpen={loginDialogOpen}
            icon="log-in"
            onClose={() => setLoginDialogOpen(false)}
            title="Sign in to your account"
        >
            <div className={Classes.DIALOG_BODY}>
                <form onSubmit={(e) => loginUser(e)}>
                    <FormGroup
                        label="Email"
                        labelFor="text-input"
                    >
                        <InputGroup type="email" required value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} id="text-input" placeholder="Placeholder text" />
                    </FormGroup>

                    <FormGroup
                        label="Password"
                        labelFor="text-input"

                    >
                        <InputGroup required value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} id="text-input" type="password" placeholder="Placeholder text" />
                    </FormGroup>

                    {/* <input type="text" /> */}
                    {/* <input onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} type="password" /> */}
                    <Button type="submit" loading={isLoading} >Sign In</Button>
                </form>


            </div>
        </Dialog>
    </>

}

export default withRouter(SignIn)
