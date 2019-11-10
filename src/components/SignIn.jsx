import React from 'react'
import { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Dialog, Classes, Tooltip, Button, AnchorButton, Intent } from '@blueprintjs/core'


function SignIn(props) {

    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)


    const loginUser = async () => {
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
            icon="info-sign"
            onClose={() => setLoginDialogOpen(false)}
            title="Palantir Foundry"
        >
            <div className={Classes.DIALOG_BODY}>
                <h1>Sign In</h1>
                <form>
                    <input onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} type="text" />
                    <input onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} type="password" />
                </form>
                <button onClick={() => loginUser()}>login</button>

            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Tooltip content="This button is hooked up to close the dialog.">
                        <Button onClick={() => setLoginDialogOpen(false)}>Close</Button>
                    </Tooltip>
                    <AnchorButton
                        intent={Intent.PRIMARY}
                        href="https://www.palantir.com/palantir-foundry/"
                        target="_blank"
                    >
                        Visit the Foundry website
                            </AnchorButton>
                </div>
            </div>
        </Dialog>
    </>

}

export default withRouter(SignIn)
