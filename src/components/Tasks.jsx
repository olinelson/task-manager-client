import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'

import styled from 'styled-components'

import { Checkbox, Button, Dialog, Classes, InputGroup, FormGroup } from '@blueprintjs/core'
import { AppToaster } from "./Toaster";

import { getAuthToken } from '../utils/auth_utils'

// components
import TaskItem from './TaskItem'

function Tasks(props) {

    const [tasks, setTasks] = useState([])
    const [selectedTask, setSelectedTask] = useState()
    const [formIsLoading, setFormIsLoading] = useState(false)
    const [formIntent, setFormIntent] = useState(undefined)

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

    const createTask = async (e) => {
        e.preventDefault()
        setFormIsLoading(true)
        try {
            const res = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify(selectedTask)
            })
            let data = await res.json()
            setSelectedTask(undefined)
            AppToaster.show({ intent: 'success', message: 'New Task Created!' });
            setTasks([...tasks, data])
        } catch (error) {
            AppToaster.show({ intent: 'danger', message: 'Couldn\'t create task' });
        }

        setFormIsLoading(false)
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

    const updateSelectedTask = async (e) => {
        e.preventDefault()
        setFormIsLoading(true)
        try {
            const res = await fetch(`http://localhost:3000/tasks/${selectedTask._id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: selectedTask.description
                })
            })

            let updatedTask = await res.json()
            let filteredTasks = tasks.filter(t => t._id !== updatedTask._id)
            setTasks([...filteredTasks, updatedTask])
            setSelectedTask(undefined)
            AppToaster.show({ intent: 'success', message: 'Task updated successfully' });

        } catch (error) {
            AppToaster.show({ intent: 'danger', message: 'Couldn\'t update task' });
        }

        setFormIsLoading(false)
    }



    const onDeleteButtonClick = (t) => {
        deleteTask(t)
    }

    const onEditButtonClick = (t) => {
        setFormIntent('edit')
        setSelectedTask(t)
    }
    const onToggleClick = (t) => {
        toggleTaskCompleted(t)
    }


    return <>
        <h1>Tasks</h1>
        <Button onClick={() => setSelectedTask({ description: '' })} icon="add"></Button>


        {tasks.sort((b, a) => new Date(a.createdAt) - new Date(b.createdAt)).map(t => {
            return (
                <TaskItem
                    key={t._id}
                    onDeleteButtonClick={() => onDeleteButtonClick(t)}
                    onEditButtonClick={() => onEditButtonClick(t)}
                    onToggleClick={() => onToggleClick(t)}
                    t={t}
                />
            )
        })}

        {/* edit task dialog */}
        <Dialog
            isOpen={selectedTask ? true : false}
            icon={formIntent === 'edit' ? 'edit' : 'add'}
            onClose={() => setSelectedTask(undefined)}
            title={formIntent === 'edit' ? 'Edit' : 'Create'}
        >
            <div className={Classes.DIALOG_BODY}>
                <form onSubmit={formIntent === 'edit' ? (e) => updateSelectedTask(e) : (e) => createTask(e)}>
                    <FormGroup
                        label="Description"
                        labelFor="text-input"
                        labelInfo="(required)"
                    >
                        <InputGroup required value={selectedTask ? selectedTask.description : ''} onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })} id="text-input" placeholder="Placeholder text" />
                    </FormGroup>
                    <Button loading={formIsLoading} type="submit">Save</Button>
                </form>


            </div>
        </Dialog>
    </>
}

export default withRouter(Tasks)