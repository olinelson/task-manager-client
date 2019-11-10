import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { getAuthToken, setAuthToken, authTokenIsStored } from '../utils/auth_utils'

function Tasks(props) {

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        getUsersTasks()
    }, [])

    const getUsersTasks = async () => {
        const res = await fetch('http://localhost:3000/tasks', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json',
            }
        })

        try {
            let tasks = await res.json()
            setTasks(tasks)
        } catch (error) {
            console.log(error)
        }
    }

    return <>
        <h1>Tasks</h1>
        {tasks.map(t => <p key={t._id}>{t.description}</p>)}
    </>
}

export default withRouter(Tasks)