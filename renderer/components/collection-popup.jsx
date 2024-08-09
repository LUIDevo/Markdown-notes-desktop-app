import React, { useState } from 'react';
import "../../styles/popup.css";

export default function CollectionPopup({ 
    folderData, 
    onFolderSelect, 
    createNewSomething, 
    createState, 
    setCreateState, 
    noteData, 
    setSelectedNote, 
    closePopup,
    setNewFileChange, 
    newFileChange, 
    onNoteSelect, 
    setCurrentFolder,
    latestFiles 
}) {
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedFolderContainer, setSelectedFolderContainer] = useState(null);
    const [newState, setNewState] = useState(false);
    const [queryNameState, setQueryNameState] = useState(false);
    const [queryTypeState, setQueryTypeState] = useState(true);
    const [inputValue, setInputValue] = useState(""); // State to store input value

    const handleFolderClick = (folder) => {
        setSelectedFolder((prevSelectedFolder) =>
            prevSelectedFolder === folder ? null : folder
        );  
        setSelectedFolderContainer((prevSelectedFolderContainer) =>
            prevSelectedFolderContainer === folder ? null : folder
        );
        onFolderSelect(folder);
    };
    const reset = () => {
        setQueryNameState(false);
        setQueryTypeState(true);
        setNewState(false);
    };

const stupidJankCode = (subjectName) => {
    console.log("Setting folder to:", subjectName.subject);
    const folderObject = { title: subjectName.subject };
    setCurrentFolder(folderObject); // Ensure the parent gets the correctly formatted object
    onFolderSelect(folderObject); // Update the notes or other state based on this selection
};

  const moreStupidShit = (folder, file) => {
    console.log(folder, file)
    let dumbObject = {
        title: folder.title,
        subject: file.title 
    }
    console.log("yay", dumbObject)
    onNoteSelect(dumbObject);
  }

    const buttonClicked = () => {
        setNewState(!newState);
        if (newState) {
            reset();
        }
    };

    return (
        <>
            <div className='cover darken'></div>
            <div className="cover popup-container">
                <div className="popup">
                    {selectedFolder ? (
                        <div className="folder-outer-container"> 
                            <div className="folder-container"> 
                                {folderData.map((folder) => (
                                    selectedFolder === folder && (
                                        <div
                                            className={`flex subject column ${selectedFolderContainer === folder ? 'selected-folder-container' : ''}`} 
                                            key={folder.id}
                                        >   
                                            <div className={`${selectedFolder === folder ? 'selected-folder' : 'not-selected-folder'}`} onClick={() => handleFolderClick(folder)}>
                                                <p className="folder-title "  style={{ textTransform: 'capitalize', fontSize: '16px' }}>
                                                    {folder.title}
                                                </p>
                                            </div>
                                            <div>
                                                {selectedFolder === folder && noteData && (
                                                    <div className='note-data-container'>
                                                        <div>
                                                            {noteData.map((note, index) => (
                                                                <li key={index} onClick={() => { console.log("HI I GOt CLICKed"); moreStupidShit(note, folder)}}>{note.title}</li>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="folder-outer-container"> 
                                <h5>Folders</h5>
                                <div className="folder-container"> 
                                    {folderData.map((folder) => (
                                        <div
                                            className={`flex subject column ${selectedFolderContainer === folder ? 'selected-folder-container' : ''}`} 
                                            key={folder.id}
                                        >   
                                            <div className={`${selectedFolder === folder ? 'selected-folder' : 'not-selected-folder'}`} onClick={() => handleFolderClick(folder)}>
                                                <p className="folder-title "  style={{ textTransform: 'capitalize', fontSize: '16px' }}>
                                                    {folder.title}
                                                </p>
                                            </div>
                                            <div>
                                                {selectedFolder === folder && noteData && (
                                                    <div className='note-data-container'>
                                                        <div>
                                                            {noteData.map((note, index) => (
                                                                <li key={index} onClick={() => {onNoteSelect(note); closePopup()}}>{note.title}</li>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="line-container"><div className="line"></div></div>
                            <h3 style={{fontSize: "16px", fontWeight: "200"}}>Recent Files</h3>
                            {latestFiles.map((file, index) => (
                                <div key={index} onClick={() => { stupidJankCode(file); onNoteSelect(file)}}>
                                    {file.title} - {file.subject}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
