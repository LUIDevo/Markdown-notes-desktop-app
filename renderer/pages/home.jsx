import Link from 'next/link';
import '../../styles/dark.css';
import SideBar from '../components/sidebar';
import MarkdownContainer from '../components/markdown-container';
import { useState, useEffect } from 'react';

export default function HomePage() {
    const [folderData, setFolderData] = useState(null);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [notes, setNotes] = useState(null);
    const [createState, setCreateState] = useState("note");
    const [selectedNote, setSelectedNote] = useState("hi");
    const [newFileChange, setNewFileChange] = useState(null);
    const [json, setJson] = useState(null);
    const [editorContent, setEditorContent] = useState('<p>Hello World!</p>');
    const [triggerFetch, setTriggerFetch] = useState(false);
    // When page loads get the folders and set it to sidebar
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
        setTriggerFetch(prev => !prev)
        console.log(response);
    };
    // Gets all the folders in a certain folder
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
    // Creates a new note
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
            handleFolderSelect(newFileChange)
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };
    // Detects changes in note, gets content of folder and sets the editor content
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
                setEditorContent(data.content); // Update editor content here
            } catch (error) {
                console.error('Error fetching folder data:', error);
            }
        }
        setSelectedNote(note);
    };
    // Base catch before creating either subject or note
    const createNewSomething = async (inputValue) => {
        console.log("Input value:", inputValue);
        if (createState === "subject") {
            createNewSubject(inputValue);
        } else {
            createNewNote(inputValue, newFileChange);
        }
    };
    // Loop that uploads content of current note to database every 5 seconds
    useEffect(() => {
        if (selectedNote && currentFolder && json) {
            const interval = setInterval(() => {
                uploadContent(selectedNote.title, currentFolder.title, json);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [selectedNote, currentFolder, json]);
    // Uploads content of local note to database
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
    // Sets the editor content to variable json
    const handleJSONChange = async (json) => {
        console.log(json);
        setJson(json);
    };

    return (
        <div className='flex'>
            {folderData ? (
                <SideBar
                    onFolderSelect={handleFolderSelect}
                    createNewSomething={createNewSomething}
                    folderData={folderData}
                    noteData={notes}
                    createState={createState}
                    setCreateState={setCreateState}
                    setSelectedNote={setSelectedNote}
                    setNewFileChange={setNewFileChange}
                    newFileChange={newFileChange}
                    onNoteSelect={handleNoteSelect}
                />
            ) : (
                <p>Loading...</p>
            )}
            <div className="activity-container flex column">
                <MarkdownContainer
                    onJSONChange={handleJSONChange}
                    content={editorContent} // Pass editor content as prop
                    selectednote={selectedNote.title ? selectedNote.title: "none"}
                />
            </div>
        </div>
    );
}
