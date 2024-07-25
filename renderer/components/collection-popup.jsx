import React from 'react'
import { useState } from 'react';
export default function collectionPopup({ folderData, onFolderSelect, createNewSomething, createState, setCreateState, noteData, setSelectedNote, setNewFileChange, newFileChange, onNoteSelect  }) {
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedFolderContainer, setSelectedFolderContainer] = useState(null);
    const [newState, setNewState] = useState(false);
    const [queryNameState, setQueryNameState] = useState(false);
    const [queryTypeState, setQueryTypeState] = useState(true);
    const [inputValue, setInputValue] = useState(""); // State to store input value


    const handleSelectedNote = (note) => {
        setSelectedNote(note)

    }

    const handleNewFileChange = (folder) => {
        setNewFileChange(folder)
    }

    const handleCreateStateChange = (newState) => {
        setCreateState(newState);
    };

    const handleFolderClick = (folder) => {
        console.log(folder)
        setSelectedFolder((prevSelectedFolder) =>
            prevSelectedFolder === folder ? null : folder
        );
        setSelectedFolderContainer((prevSelectedFolderContainer) =>
            prevSelectedFolderContainer === folder ? null : folder
        );
        onFolderSelect(folder);
    };
    const reset = () => {
        setQueryNameState(false)
        setQueryTypeState(true)
        setNewState(false)
    }

    const buttonClicked = () => {
        setNewState(!newState)
        if (newState) {
            reset()
        }
        
    }
    return (
        <> 
            <div className='cover darken'></div>
            <div className="cover popup-container">
                 <div className="popup">
                     Recent Files
                     Folders
                 
                {folderData.map((folder) => (
                    <div
                        className={`flex subject column ${selectedFolderContainer === folder ? 'selected-folder-container' : ''}`} 
                        style={{gap: "10px"}}
                        key={folder.id}
                    >   
                        <div className={`subject folder-title ${selectedFolder === folder ? 'selected-folder' : 'not-selected-folder'}`} onClick={() => handleFolderClick(folder)}>
                            <p style={{ textTransform: 'capitalize', fontSize: '14px' } } >
                                {folder.title}
                            </p>
                        </div>
                        <div>
                                {selectedFolder === folder && noteData && (
                                    <div className='note-data-container'>
                                        <div>
                                            {noteData.map((note, index) => (
                                                <li key={index} onClick={() => onNoteSelect(note)}>{note.title}</li>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                        </div>
                    </div>
                ))}
         
                     
                </div>
            </div>
           
        </>
    )
}