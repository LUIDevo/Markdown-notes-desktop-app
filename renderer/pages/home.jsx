import Link from 'next/link';
import CollectionPopup from '../components/collection-popup';
import ToolBar from '../components/toolbar';
import '../../styles/dark.css';
import SideBar from '../components/sidebar';
import MarkdownContainer from '../components/markdown-container';
import { useState, useEffect } from 'react';
import TopBar from '../components/topbar';
import Toolbar from '../components/toolbar';
import Cookies from 'js-cookie';

export default function HomePage() {
    const [folderData, setFolderData] = useState(null);
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [editorContent, setEditorContent] = useState('');
    const [json, setJson] = useState(null);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [createState, setCreateState] = useState('');
    const [newFileChange, setNewFileChange] = useState('');
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [toggleState, setToggleState] = useState(false);

    const [latestFiles, setLatestFiles] = useState([]);

    const handleIconClick = () => {
        setToggleState(prev => !prev);
        console.log(toggleState);

        const latestFilesFromCookies = JSON.parse(Cookies.get('latestFiles') || '[]');
        setLatestFiles(latestFilesFromCookies);
    };

    useEffect(() => {
        async function fetchFolderData() {
            try {
                const response = await fetch('http://localhost:3001/getFolders');
                if (!response.ok) {
                    throw new Error('Failed to fetch folder data');
                }
                const data = await response.json();
                console.log(data);
                setFolderData(data);
            } catch (error) {
                console.error('Error fetching folder data:', error);
            }
        }
        fetchFolderData();
    }, [triggerFetch]);

    const createNewSubject = async (inputValue) => {
        console.log(inputValue);
        const response = await fetch('http://localhost:3001/createSubject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: inputValue })
        });
        setTriggerFetch(prev => !prev);
        console.log(response);
    };

    const handleFolderSelect = async (folder) => {
        console.log("Selected folder:", folder);
        setCurrentFolder(folder);
        if (folder) {
            try {
                const folderString = folder.title;
                const response = await fetch(`http://localhost:3001/getNotesInSubject/${folderString}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch folder data');
                }
                const data = await response.json();
                console.log(data);
                setNotes(data);
            } catch (error) {
                console.error('Error fetching folder data:', error);
            }
        }
    };

    const createNewNote = async (inputValue, newFileChange) => {
        try {
            console.log(newFileChange, inputValue);
            const response = await fetch('http://localhost:3001/createNote', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject: newFileChange, title: inputValue })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Response:', data);
            handleFolderSelect(newFileChange);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleNoteSelect = async (note) => {
        console.log("Selected Note:", note);
        if (note) {
            try {
                const noteString = note.title;
                const response = await fetch(`http://localhost:3001/getContentsOfFolder`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ subject: currentFolder.title, title: noteString })
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch folder data');
                }
                const data = await response.json();
                console.log(data);
                setEditorContent(data.content);
                updateLatestFiles(currentFolder.title, note.title);
            } catch (error) {
                console.error('Error fetching folder data:', error);
            }
        }
        setSelectedNote(note);
    };

    const updateLatestFiles = (subject, title) => {
        const latestFilesFromCookies = JSON.parse(Cookies.get('latestFiles') || '[]');
        const newFileEntry = { subject, title };

        const updatedLatestFiles = latestFilesFromCookies.filter(file => file.subject !== subject || file.title !== title);

        updatedLatestFiles.unshift(newFileEntry);

        const latestFilesToStore = updatedLatestFiles.slice(0, 6);
        console.log(JSON.stringify(latestFilesToStore))
        Cookies.set('latestFiles', JSON.stringify(latestFilesToStore), { expires: 7 });
    };

    const createNewSomething = async (inputValue) => {
        console.log("Input value:", inputValue);
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

    const handleJSONChange = async (json) => {
        console.log(json);
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
                    onNoteSelect={handleNoteSelect}
                    latestFiles={latestFiles}
                />
            }

            <div className='flex'>
                {folderData ? (
                    <>
                        <Toolbar 
                            handleIconClick={handleIconClick}
                        />
                    </>
                ) : (
                    <p>Loading...</p>
                )}
                <div className="activity-container flex column">
                    <MarkdownContainer
                        onJSONChange={handleJSONChange}
                        content={editorContent}
                        selectednote={selectedNote && selectedNote.title ? selectedNote.title : "none"}
                    />
                </div>
            </div>
        </>
    );
}
