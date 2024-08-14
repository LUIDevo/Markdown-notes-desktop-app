import Link from 'next/link';
import '../../styles/dark.css';
import SideBar from '../components/sidebar';
import MarkdownContainer from '../components/markdown-container';
import { useState, useEffect } from 'react';
import TopBar from '../components/topbar';
import Cookies from 'js-cookie';

export default function HomePage() {
  const [folderList, setFolderList] = useState([]); // State variable
  const editorContent = "hi";
  const selectedNote = "hi";

useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch('http://localhost:3001/getFolders');
        const data = await response.json();
        console.log("Fetched data:", data);
        setFolderList(data); // Assuming data is an array of folders
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };
    fetchFolders();
  }, []); 

  const handleJSONChange = () => {
    console.log("hi");
  };

  const getContentsOfNote = async (folder) => {
      try {
        const response = await fetch(`http://localhost:3001/getNotesInSubject/${folder}`)
        const data = await response.json();
        console.log("response", data)
    } catch {
      console.log("error")
    }
  }

    return (
        <>
        {folderList &&
            folderList.map((folder,index) => {
              return (
              <div className="folderContainer">
                  <div key={index} onClick={() =>getContentsOfNote(folder.title)} style={{color: "white"}}><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 15V3H7.5L9 4.5H16.5V15H1.5Z" fill="#01BE58"/></svg>
                  {folder.title}</div>
              </div>
              )
        })
      }
            <div className='flex'>
                <SideBar
                    folderList={folderList}
                />
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
