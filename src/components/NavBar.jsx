import React, { useState } from 'react'

import { Navbar, Alignment, Button, Dialog, Classes, InputGroup, FormGroup } from '@blueprintjs/core'

// import SignIn from './SignIn'

import { AppToaster } from "./Toaster";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
export default function NavBar(props) {

    const { currentUser, history, autoLogin, setCurrentUser } = props

    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)


    const signOutHandler = () => {
        setCurrentUser(undefined)
        localStorage.clear()
        history.push('/')
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
        try {
            let data = await res.json()
            localStorage.setItem('authToken', data.token)
            await props.autoLogin()

            setLoginDialogOpen(false)
            AppToaster.show({ intent: 'success', message: "Sign In Successful" });
            history.push('/tasks')

        } catch (error) {
            console.log(error)
            AppToaster.show({ intent: 'danger', message: 'something went wrong' });
        }

    }


    return (
        <Navbar>
            <Navbar.Group align={Alignment.LEFT}>
                <Link className="bp3-button bp3-minimal" to="/" >Home</Link>
                {currentUser ? <Link className="bp3-button bp3-minimal" to="/tasks">Tasks</Link> : null}

            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Navbar.Divider />
                {currentUser ? <Button minimal onClick={() => signOutHandler()}>Sign Out</Button>
                    :
                    <Button minimal onClick={() => setLoginDialogOpen(true)}>Sign In</Button>
                }
            </Navbar.Group>

            {/* Sign in Dialog */}
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

                        <Button type="submit" loading={isLoading} >Sign In</Button>
                    </form>


                </div>
            </Dialog>
        </Navbar>
    )
}