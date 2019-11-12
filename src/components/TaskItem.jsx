import React, { useState } from 'react'
import styled from 'styled-components'
import { Checkbox, Button } from '@blueprintjs/core'

export default function TaskItem(props) {

    const [isHovering, setIsHovering] = useState(false)

    const TaskContainer = styled.div`
        display: grid;
        grid-template-columns: 1fr auto 2rem 2rem;
    `

    return (
        <TaskContainer onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} >
            <Checkbox style={{ columnSpan: 3 }} onChange={() => props.toggleTaskCompleted()} checked={props.t.completed} label={props.t.description} />
            <div />

            <Button style={{ visibility: isHovering ? 'default' : 'hidden' }} minimal onClick={() => props.deleteTask()} icon="trash" />
            <Button style={{ visibility: isHovering ? 'default' : 'hidden' }} minimal onClick={() => props.setEditingTask()} icon="edit" />


        </TaskContainer>
    )
}