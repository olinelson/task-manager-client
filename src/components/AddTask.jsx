import React, { useState } from 'react'

import { Dialog, FormGroup, InputGroup, Classes, Button } from '@blueprintjs/core'
import { getAuthToken } from '../utils/auth_utils'


export default function AddTask(props) {
    const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false)
    const [newTaskData, setNewTaskData] = useState({
        description: '',
        completed: false
    })

    const createTask = async (e) => {
        e.preventDefault()
        const res = await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify(newTaskData)
        })
        let data = await res.json()
        if (data.errors) return console.log(data)

        setAddTaskDialogOpen(false)

        return props.addTaskAction(data)

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
                    <button className="bp3-button">Create</button>
                </form>


            </div>
        </Dialog>
    </>
}