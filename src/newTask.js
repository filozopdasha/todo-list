import Checkbox from './Checkbox';
import React from 'react';


export default function NewTask({name, done, onToggle, onTrash}){
    return(
        <div className={'task ' + (done?'done':'')}>
            <Checkbox checked={done} onClick={() => onToggle(!done)}/>
            {name}
            <div onClick={onTrash} className="delete-button">
                ✖
            </div>
        </div>
    )
}