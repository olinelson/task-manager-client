import React, { useState } from 'react'
import { Button, Dialog, Classes, FormGroup, InputGroup } from '@blueprintjs/core'

import { getAuthToken } from '../utils/auth_utils'

export default function EditTask(props) {
    const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false)
    const [editedTask, setEditedTask] = useState({
        _id: props.task._id,
        description: props.task.description
    })

    const updateTask = async (e) => {
        e.preventDefault()
        const res = await fetch(`http://localhost:3000/tasks/${editedTask._id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description: editedTask.description
            })
        })

        try {
            let updatedTask = await res.json()
            // let filteredTasks = tasks.filter(t => t._id !== task._id)
            props.updateTaskAction(updatedTask)
            setEditTaskDialogOpen(false)
        } catch (error) {
            console.log(error)
        }
    }

    return <>
        <Button icon="edit" onClick={() => setEditTaskDialogOpen(true)} />
        <Dialog
            isOpen={editTaskDialogOpen}
            icon="edit"
            onClose={() => setEditTaskDialogOpen(false)}
            title="Edit Task"
        >
            <div className={Classes.DIALOG_BODY}>
                <form onSubmit={(e) => updateTask(e)}>
                    <FormGroup
                        label="Description"
                        labelFor="text-input"
                        labelInfo="(required)"
                    >
                        <InputGroup value={editedTask.description} onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })} id="text-input" placeholder="Placeholder text" />
                    </FormGroup>
                    <button className="bp3-button">Save</button>
                </form>


            </div>
        </Dialog>
    </>
}