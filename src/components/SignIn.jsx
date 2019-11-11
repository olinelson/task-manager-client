import React from 'react'
import { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Dialog, FormGroup, InputGroup, Classes, Tooltip, Button, AnchorButton, Intent } from '@blueprintjs/core'


function SignIn(props) {

    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)


    const loginUser = async (e) => {
        e.preventDefault()
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
        let data = await res.json()
        try {
            localStorage.setItem('authToken', data.token)
            props.autoLogin()
            props.history.push('/tasks')
            setLoginDialogOpen(false)
        } catch (error) {
            console.log(error)
        }

    }


    return <>
        <Button onClick={() => setLoginDialogOpen(true)}>Sign In</Button>
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
                        labelInfo="(required)"
                    >
                        <InputGroup value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} id="text-input" placeholder="Placeholder text" />
                    </FormGroup>

                    <FormGroup
                        label="Password"
                        labelFor="text-input"
                        labelInfo="(required)"
                    >
                        <InputGroup value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} id="text-input" type="password" placeholder="Placeholder text" />
                    </FormGroup>

                    {/* <input type="text" /> */}
                    {/* <input onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} type="password" /> */}
                    <button className="bp3-button">Sign In</button>
                </form>


            </div>
        </Dialog>
    </>

}

export default withRouter(SignIn)
