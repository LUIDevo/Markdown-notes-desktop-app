import React , { useState, useEffect } from 'react'
import '../../styles/dark.css'

export default function SideBar({ folderData, onFolderSelect, createNewSomething, createState, setCreateState, noteData, setSelectedNote, setNewFileChange, newFileChange, onNoteSelect  }) {
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

    const createNewSomethingHandler = () => {
        createNewSomething(inputValue, newFileChange); // Call the function passed from the parent with inputValue as argument
        reset()
    };

    // const createNewSomething = () => {
    //     console.log("Input value:", inputValue);
    //     if (createState=="subject"){
    //         createNewSubject(newFileSubject)
    //     }  
    //     else{
    //         createNewNote()
    //     }
    // }

    const handleInputChange = (event) => {
        setInputValue(event.target.value); // Update input value state
    };

    return (
        <div className='folder-container flex column'>
            <div className='subjects-container flex column'>
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
            <div className='flex column lower-nav-container'>
                <div className='button-content'>
                    Create new 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" onClick={buttonClicked}>
                        <path d="M4.66659 6.66667L7.99992 10L11.3333 6.66667" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                {newState && 
                    <div className='dropdown'>
                        {queryTypeState &&
                            <>
                                <div className='full' onClick={() => {handleCreateStateChange("note"); setQueryNameState(true); setQueryTypeState(false);}}>Create New Note</div>
                                <div className='full' onClick={() => {handleCreateStateChange("subject"); setQueryNameState(true); setQueryTypeState(false);}}>Create New Subject</div>
                            </>
                        }
                        {queryNameState && 
                            <>
                                <div>
                                    <div style={{ color: "#696860" }}>name</div>
                                    <input required placeholder='Untitled' type='text' name='name' value={inputValue} onChange={handleInputChange} />
                                </div>
                                {createState == "note" &&
                                    <div>
                                        <div style={{ color: "#696860" }}>subject</div>
                                        {folderData.map((folder, index) => ( 
                                            <div onClick={() => handleNewFileChange(folder.title)} className='add-folder-title'>{folder.title}</div>
                                        ))}
                                    </div>
                                }
                                
                                <div className='finish-create-button' onClick={() => createNewSomethingHandler()}>
                                    Create
                                </div>
                            </>
                        }
                    </div>
                }
                
            </div>
        </div>
    );
}
