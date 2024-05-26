import Link from 'next/link';
import '../../styles/global.css';
import SideBar from '../components/sidebar';
import MarkdownContainer from '../components/markdown-container';
import { useState, useEffect } from 'react';

export default function HomePage() {
    const [folderData, setFolderData] = useState(null);
    const [currentFolder, setCurrentFolder] = useState(null)
    const [notes, setNotes] = useState(null);
    const [createState, setCreateState] = useState("note"); // State to store the create state
    const [selectedNote, setSelectedNote] = useState(null)
    const [newFileChange, setNewFileChange] = useState(null)
    const [count, setCount] = useState(0);
    const [json, setJson] = useState(null); // Define json as state

    useEffect(() => {
        async function fetchFolderData() {
            try {
                const response = await fetch('http://localhost:3001/getFolders');
                if (!response.ok) {
                    throw new Error('Failed to fetch folder data');
                }
                const data = await response.json();
                console.log(data)
                setFolderData(data);
            } catch (error) {
                console.error('Error fetching folder data:', error);
            }
        }
        fetchFolderData();
    }, []);



    


    const createNewSubject = async (inputValue) => {
        console.log(inputValue)
        const response = await fetch('http://localhost:3001/createSubject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ message: inputValue})
        })
        console.log(response)
    }

    const handleFolderSelect = async (folder) => {
        console.log("Selected folder:", folder);
        // Perform actions or updates based on the selected folder
        setCurrentFolder(folder)
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
            console.log(newFileChange, inputValue)
            const response = await fetch('http://localhost:3001/createNote', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject: newFileChange, title: inputValue })
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(data => {
                console.log('Response:', data);
              })
              .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
              });
        } catch (err){
            console.log(err)
        }
    }

    const handleNoteSelect = (note) => {
        console.log("Selected Note:", note);
        setSelectedNote(note);

        // Perform any additional actions with the selected note here
        // For example, you might want to update another child component
        // by setting its state or calling a method on it
    };
    const createNewSomething = async(inputValue) => {
        console.log("Input value:", inputValue);
        if (createState=="subject"){
            createNewSubject(inputValue)
        }  
        else{
            createNewNote(inputValue, newFileChange)
        }
    }


    useEffect(() => {
        //Implementing the setInterval method
        if (selectedNote && currentFolder && json) {
            const interval = setInterval(() => {
                uploadContent(selectedNote.title, currentFolder.title, json);
            }, 10000);
    
            //Clearing the interval on component unmount or when dependencies change
            return () => clearInterval(interval);
        }
    }, [selectedNote, currentFolder, json]); // Add dependencies
    
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
    
    const handleJSONChange = async(json) => {
        console.log(json)
        setJson(json)
    }

    return (
        <div className='flex'>
            {folderData ? <SideBar onFolderSelect={handleFolderSelect} createNewSomething={createNewSomething} folderData={folderData} noteData={notes} createState={createState} setCreateState={setCreateState} setSelectedNote={setSelectedNote} setNewFileChange={setNewFileChange} newFileChange={newFileChange} onNoteSelect={onNoteSelect}/> : <p>Loading...</p>}
            <div className="activity-container flex column">
                <MarkdownContainer onJSONChange={handleJSONChange} setContents={setContents}/>
            </div>
        </div>
    );
}
