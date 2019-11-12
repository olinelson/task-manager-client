import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'

import styled from 'styled-components'

import { Checkbox, Button, Dialog, Classes, InputGroup, FormGroup } from '@blueprintjs/core'
import { AppToaster } from "./Toaster";

import { getAuthToken } from '../utils/auth_utils'

// components
import AddTask from './AddTask'
import TaskItem from './TaskItem'

function Tasks(props) {

    const [tasks, setTasks] = useState([])
    const [editingTask, setEditingTask] = useState({ description: '' })
    const [formIsLoading, setFormIsLoading] = useState(false)

    useEffect(() => {
        getUsersTasks()
    }, [])



    const getUsersTasks = async () => {
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


    const deleteTask = async (task) => {
        await fetch(`http://localhost:3000/tasks/${task._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            }
        })

        try {

            let filteredTasks = tasks.filter(t => t._id !== task._id)
            setTasks(filteredTasks)
        } catch (error) {
            console.log(error)
        }
    }

    const updateTask = async (e) => {
        e.preventDefault()
        setFormIsLoading(true)
        try {
            const res = await fetch(`http://localhost:3000/tasks/${editingTask._id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: editingTask.description
                })
            })

            let updatedTask = await res.json()
            let filteredTasks = tasks.filter(t => t._id !== updatedTask._id)
            setTasks([...filteredTasks, updatedTask])
            setEditingTask({ description: '' })
            AppToaster.show({ intent: 'success', message: 'Task updated successfully' });

        } catch (error) {
            AppToaster.show({ intent: 'danger', message: 'Couldn\'t update task' });
        }

        setFormIsLoading(false)
    }

    const addTaskAction = (data) => {
        setTasks([...tasks, data])
    }


    return <>
        <h1>Tasks</h1>
        <AddTask addTaskAction={(data) => addTaskAction(data)} />

        {tasks.sort((b, a) => new Date(a.createdAt) - new Date(b.createdAt)).map(t => {
            return (
                <TaskItem
                    key={t._id}
                    deleteTask={() => deleteTask(t)}
                    setEditingTask={() => setEditingTask(t)}
                    toggleTaskCompleted={() => toggleTaskCompleted(t)}
                    t={t}
                />
            )
        })}



        {/* edit task dialog */}
        <Dialog
            isOpen={editingTask._id ? true : false}
            icon="edit"
            onClose={() => setEditingTask({ description: '' })}
            title="Edit Task"
        >
            <div className={Classes.DIALOG_BODY}>
                <form onSubmit={(e) => updateTask(e)}>
                    <FormGroup
                        label="Description"
                        labelFor="text-input"
                        labelInfo="(required)"
                    >
                        <InputGroup required value={editingTask.description} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} id="text-input" placeholder="Placeholder text" />
                    </FormGroup>
                    <Button loading={formIsLoading} type="submit">Save</Button>
                </form>


            </div>
        </Dialog>
    </>
}

export default withRouter(Tasks)