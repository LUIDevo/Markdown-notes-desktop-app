import Link from 'next/link';
import '../../styles/dark.css';
import SideBar from '../components/sidebar';
import MarkdownContainer from '../components/markdown-container';
import { useState, useEffect } from 'react';
import TopBar from '../components/topbar';
import Cookies from 'js-cookie';

export default function HomePage() {
  const [folderList, setFolderList] = useState([]); // List of folders fetched from server
  const [visibleFolders, setVisibleFolders] = useState({}); // Track which folders are visible
  const [folderContents, setFolderContents] = useState({}); // Store contents of each folder
  const [editorContent, setEditorContent] = useState(''); // Content of the currently selected note
  const [selectedNote, setSelectedNote] = useState(null); // Currently selected note

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

  const handleJSONChange = (newContent) => {
    console.log("Content changed:", newContent);
    setEditorContent(newContent);
  };

  const getContentsOfFolder = async (folderTitle) => {
    try {
      // Toggle visibility of folder contents
      setVisibleFolders(prevState => ({
        ...prevState,
        [folderTitle]: !prevState[folderTitle],
      }));

      // Only fetch contents if the folder is not already visible
      if (!visibleFolders[folderTitle]) {
        const response = await fetch(`http://localhost:3001/getNotesInSubject/${folderTitle}`);
        const data = await response.json();
        console.log("Response data:", data);
        setFolderContents(prevState => ({
          ...prevState,
          [folderTitle]: data,
        }));
      }
    } catch (error) {
      console.error("Error fetching folder contents:", error);
    }
  };

  return (
    <>
      {folderList &&
        folderList.map((folder, index) => (
          <div className="folderContainer" key={index}>
            <div
              onClick={() => getContentsOfFolder(folder.title)}
              style={{ color: "white", cursor: "pointer" }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1.5 15V3H7.5L9 4.5H16.5V15H1.5Z" fill="#01BE58" />
              </svg>
              {folder.title}
            </div>

            {/* Conditionally render folder contents if visible */}
            {visibleFolders[folder.title] && (
              <div className="folderContents">
                {folderContents[folder.title]?.map((file, fileIndex) => (
                  <div
                    key={fileIndex}
                    onClick={() => {
                      setSelectedNote(file);
                      setEditorContent(file.content);
                    }}
                    style={{ color: "white", marginLeft: "20px", cursor: "pointer" }}
                  >
                    {file.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      }
      <div className='flex'>
        <SideBar folderList={folderList} />
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
