import React, { useState } from 'react'
import { Button, Dialog, Classes, FormGroup, InputGroup } from '@blueprintjs/core'
import { AppToaster } from "./Toaster";

import { getAuthToken } from '../utils/auth_utils'

export default function EditTask(props) {
    const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false)
    const [editedTask, setEditedTask] = useState({
        _id: props.task._id,
        description: props.task.description
    })
    const [isLoading, setIsLoading] = useState(false)

    const updateTask = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
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

            let updatedTask = await res.json()
            props.updateTaskAction(updatedTask)
            setEditTaskDialogOpen(false)
            AppToaster.show({ intent: 'success', message: 'Task updated successfully' });

        } catch (error) {
            AppToaster.show({ intent: 'danger', message: 'Couldn\'t update task' });
        }

        setIsLoading(false)
    }

    return <>
        <Button minimal icon="edit" onClick={() => setEditTaskDialogOpen(true)} />
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
                        <InputGroup required value={editedTask.description} onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })} id="text-input" placeholder="Placeholder text" />
                    </FormGroup>
                    <Button loading={isLoading} type="submit">Save</Button>
                </form>


            </div>
        </Dialog>
    </>
}