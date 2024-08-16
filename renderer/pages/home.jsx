import { useState, useEffect } from 'react';
import '../../styles/dark.css';
import SideBar from '../components/sidebar';
import MarkdownContainer from '../components/markdown-container';
import TopBar from '../components/topbar';
import Cookies from 'js-cookie';

export default function HomePage() {
  const [folderList, setFolderList] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch('http://localhost:3001/getFolders');
        const data = await response.json();
        console.log("Fetched data:", data);
        setFolderList(data); 
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

  return (
    <div className='flex home-container '>
      <SideBar
        folderList={folderList}
        setSelectedFolder={setSelectedFolder}
        setSelectedNote={setSelectedNote}
        setEditorContent={setEditorContent}
      />
      <div className="activity-container flex column">
        <MarkdownContainer
          onJSONChange={handleJSONChange}
          content={editorContent}
        />
      </div>
    </div>
  );
}
