import Link from 'next/link';
import CollectionPopup from '../components/collection-popup';
import ToolBar from '../components/toolbar';
import '../../styles/dark.css';
import SideBar from '../components/sidebar';
import MarkdownContainer from '../components/markdown-container';
import { useState, useEffect } from 'react';
import TopBar from '../components/topbar';
import Cookies from 'js-cookie';

export default function HomePage() {
    const [folderData, setFolderData] = useState(null);
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [editorContent, setEditorContent] = useState('');
    const [json, setJson] = useState(null);
    const [currentFolder, setCurrentFolder] = useState({});
    const [createState, setCreateState] = useState('');
    const [newFileChange, setNewFileChange] = useState('');
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [toggleState, setToggleState] = useState(false);
    const [latestFiles, setLatestFiles] = useState([]);
    
    const handleIconClick = () => {
        setToggleState(prev => !prev);
        const latestFilesFromCookies = JSON.parse(Cookies.get('latestFiles') || '[]');
        setLatestFiles(latestFilesFromCookies);
    };

    const closePopup = () => {
        handleIconClick();
    };

    useEffect(() => {
        async function fetchFolderData() {
            try {
                const response = await fetch('http://localhost:3001/getFolders');
                if (!response.ok) {
                    throw new Error('Failed to fetch folder data');
                }
                const data = await response.json();
                setFolderData(data);
            } catch (error) {
                console.error('Error fetching folder data:', error);
            }
        }
        fetchFolderData();
    }, [triggerFetch]);

    const createNewSubject = async (inputValue) => {
        await fetch('http://localhost:3001/createSubject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: inputValue })
        });
        setTriggerFetch(prev => !prev);
    };

    const handleFolderSelect = async (folder) => {
        console.log("Handling folder selection:", folder);
        setCurrentFolder(folder); // Set the current folder immediately
        if (folder) {
            try {
                const response = await fetch(`http://localhost:3001/getNotesInSubject/${folder.title}`);
                if (!response.ok) throw new Error('Failed to fetch folder data');
                const data = await response.json();
                setNotes(data);
            } catch (error) {
                console.error('Error fetching folder data:', error);
            }
        }
    };

    const createNewNote = async (inputValue, newFileChange) => {
        try {
            await fetch('http://localhost:3001/createNote', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject: newFileChange, title: inputValue })
            });
            handleFolderSelect(newFileChange);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const stupidJankCode = (subjectName) => {
        console.log("Setting folder to:", subjectName.subject);
        const folderObject = { title: subjectName.subject };
        setCurrentFolder(folderObject); // Ensure the parent gets the correctly formatted object
    };

    const handleNoteSelect = (note) => {
        console.log(note)
        const folderObject = { title: note.subject };
        setCurrentFolder(folderObject);
        setSelectedNote(note); // Select the note after updating the current folder
    };

    useEffect(() => {
        if (currentFolder.title && selectedNote) {
            const fetchContent = async () => {
                try {
                    const response = await fetch('http://localhost:3001/getContentsOfFolder', {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ subject: currentFolder.title, title: selectedNote.title })
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch folder data');
                    }
                    const data = await response.json();
                    setEditorContent(data.content);
                    updateLatestFiles(selectedNote.title, currentFolder.title);
                } catch (error) {
                    console.error('Error fetching folder data:', error);
                }
            };
            fetchContent();
        }
    }, [currentFolder, selectedNote]); // Run the effect whenever currentFolder or selectedNote changes

    const updateLatestFiles = (title, subject) => {
        const latestFilesFromCookies = JSON.parse(Cookies.get('latestFiles') || '[]');
        const newFileEntry = { subject, title };
        console.log("fuck you", newFileEntry);

        const updatedLatestFiles = latestFilesFromCookies.filter(file => 
            file.subject !== subject || file.title !== title
        );
        updatedLatestFiles.unshift(newFileEntry);

        const latestFilesToStore = updatedLatestFiles.slice(0, 8);

        Cookies.set('latestFiles', JSON.stringify(latestFilesToStore), { expires: 7 });
    };

    const createNewSomething = async (inputValue) => {
        if (createState === "subject") {
            createNewSubject(inputValue);
        } else {
            createNewNote(inputValue, newFileChange);
        }
    };

    useEffect(() => {
        if (selectedNote && currentFolder && json) {
            const interval = setInterval(() => {
                uploadContent(selectedNote.title, currentFolder.title, json);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [selectedNote, currentFolder, json]);

    const uploadContent = async (title, subject, content) => {
        try {
            const response = await fetch('http://localhost:3001/uploadContent', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, subject, content })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                console.log('Response:', data);
            } else {
                throw new Error('Response is not JSON');
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleJSONChange = (json) => {
        setJson(json);
    };

    return (
        <>
            {toggleState && 
                <CollectionPopup 
                    folderData={folderData}
                    onFolderSelect={handleFolderSelect}
                    createNewSomething={createNewSomething}
                    noteData={notes}
                    createState={createState}
                    setCreateState={setCreateState}
                    setSelectedNote={setSelectedNote}
                    setNewFileChange={setNewFileChange}
                    newFileChange={newFileChange}
                    setCurrentFolder={setCurrentFolder}
                    onNoteSelect={handleNoteSelect}
                    closePopup={closePopup} 
                    latestFiles={latestFiles}
                    currentFolder={currentFolder}
                />
            }

            <div className='flex'>
                {folderData ? (
                    <ToolBar 
                        handleIconClick={handleIconClick}
                    />
                ) : (
                    <p>Loading...</p>
                )}
                <div className="activity-container flex column">
                    <MarkdownContainer
                        onJSONChange={handleJSONChange}
                        content={editorContent}
                        selectednote={selectedNote ? selectedNote.title : "none"}
                    />
                </div>
            </div>
        </>
    );
}
