import React from 'react';

export default function Checkbox({ checked = false, onClick }) {
    return (
        <div onClick={onClick}>
            {checked && (
                <div className="checkbox unchecked">
                    <div>✔</div>
                </div>
            )}
            {!checked && (
                <div className="checkbox checked">
                    <div>✔</div>
                </div>
            )}
        </div>
    );
}
