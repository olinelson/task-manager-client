import React, { useState } from 'react'

import { Dialog, FormGroup, InputGroup, Classes, Button } from '@blueprintjs/core'
import { getAuthToken } from '../utils/auth_utils'
import { AppToaster } from "./Toaster";



export default function AddTask(props) {
    const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false)
    const [newTaskData, setNewTaskData] = useState({
        description: '',
        completed: false
    })
    const [isLoading, setIsLoading] = useState(false)

    const createTask = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify(newTaskData)
            })
            let data = await res.json()
            setAddTaskDialogOpen(false)
            AppToaster.show({ intent: 'success', message: 'New Task Created!' });
            props.addTaskAction(data)
        } catch (error) {
            AppToaster.show({ intent: 'danger', message: 'Couldn\'t create task' });
        }

        setIsLoading(false)
    }

    return <>
        <Button onClick={() => setAddTaskDialogOpen(true)}>Create New</Button>
        <Dialog
            isOpen={addTaskDialogOpen}
            icon="add"
            onClose={() => setAddTaskDialogOpen(false)}
            title="Create New Task"
        >
            <div className={Classes.DIALOG_BODY}>
                <form onSubmit={(e) => createTask(e)}>
                    <FormGroup
                        label="Description"
                        labelFor="text-input"
                        labelInfo="(required)"
                    >
                        <InputGroup value={newTaskData.description} onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })} id="text-input" placeholder="Placeholder text" />
                    </FormGroup>
                    <Button loading={isLoading} type="submit">Create</Button>
                </form>


            </div>
        </Dialog>
    </>
}