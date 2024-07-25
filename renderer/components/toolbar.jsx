import React from 'react';

export default function Toolbar({ handleIconClick }) {
    return (
        <div className='toolbar-container'>
            <div className="toolbar">
                <div onClick={handleIconClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <path d="M19.4333 14.9V11.1H24.9V14.9H19.4333ZM11.1 18.2333V11.1H16.5667V18.2333H11.1ZM19.4333 24.9V17.7667H24.9V24.9H19.4333ZM11.1 24.9V21.1H16.5667V24.9H11.1Z" stroke="white" strokeWidth="1.2"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}
