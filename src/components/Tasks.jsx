import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'

import { Switch, Checkbox, Button } from '@blueprintjs/core'

import { getAuthToken, setAuthToken, authTokenIsStored } from '../utils/auth_utils'

// components
import AddTask from './AddTask'
import EditTask from './EditTask'

function Tasks(props) {

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        getUsersTasks()
    }, [])

    const getUsersTasks = async () => {
        console.log('getting tasks')
        const res = await fetch('http://localhost:3000/tasks?sortBy=completed:asc', {
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

    const toggleTaskCompleted = async (task) => {

        const res = await fetch(`http://localhost:3000/tasks/${task._id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                completed: !task.completed
            })
        })

        try {
            let updatedTask = await res.json()

            let filteredTasks = tasks.filter(t => t._id !== task._id)
            setTasks([...filteredTasks, updatedTask])
        } catch (error) {
            console.log(error)
        }
    }

    const updateTaskAction = (task) => {
        let filteredTasks = tasks.filter(t => t._id !== task._id)
        setTasks([...filteredTasks, task])
    }


    const deleteTask = async (task) => {
        const res = await fetch(`http://localhost:3000/tasks/${task._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            }
        })

        try {
            // let updatedTask = await res.json()

            let filteredTasks = tasks.filter(t => t._id !== task._id)
            setTasks(filteredTasks)
        } catch (error) {
            console.log(error)
        }
    }

    const addTaskAction = (data) => {
        setTasks([...tasks, data])
    }

    return <>
        <h1>Tasks</h1>
        <AddTask addTaskAction={(data) => addTaskAction(data)} />

        {tasks.sort((b, a) => new Date(a.createdAt) - new Date(b.createdAt)).map(t => <div key={t._id}>
            <Checkbox onChange={() => toggleTaskCompleted(t)} checked={t.completed} label={t.description} />
            <Button onClick={() => deleteTask(t)} icon="trash" />
            <EditTask updateTaskAction={(e) => updateTaskAction(e)} task={t} />
        </div>)}
    </>
}

export default withRouter(Tasks)