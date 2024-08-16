import { useState, useEffect } from 'react';
import '../../styles/dark.css';

export default function SideBar({
  folderList,
  setSelectedFolder,
  setSelectedNote,
  setEditorContent,
}) {
  const [visibleFolders, setVisibleFolders] = useState({});
  const [folderContents, setFolderContents] = useState({});

  const getContentsOfFolder = async (folderTitle) => {
    try {
      // Toggle visibility of folder contents
      setVisibleFolders((prevState) => ({
        ...prevState,
        [folderTitle]: !prevState[folderTitle],
      }));

      // Only fetch contents if the folder is not already visible
      if (!visibleFolders[folderTitle]) {
        const response = await fetch(`http://localhost:3001/getNotesInSubject/${folderTitle}`);
        const data = await response.json();
        console.log("Response data:", data);
        setFolderContents((prevState) => ({
          ...prevState,
          [folderTitle]: data,
        }));
      }
    } catch (error) {
      console.error("Error fetching folder contents:", error);
    }
  };

  const handleNoteClick = (file, folderTitle) => {
    setSelectedNote(file);
    setSelectedFolder(folderTitle);

    // Fetch and set the content of the selected note
    const getContentsOfFile = async () => {
      try {
        const response = await fetch('http://localhost:3001/getContentsOfFile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: file.title, subject: folderTitle }),
        });
        const data = await response.json();
        console.log("Fetched file content:", data);
        setEditorContent(data.content);
      } catch (error) {
        console.error("Error fetching file contents:", error);
      }
    };

    getContentsOfFile();
  };

  return (
    <>
      <div className="sidebar">
      {folderList &&
        folderList.map((folder, index) => (
          <div className=" flex col" key={index}>
            <div
              onClick={() => getContentsOfFolder(folder.title)}
              style={{ cursor: 'pointer', display: 'flex', gap: '12px' }}
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
                    onClick={() => handleNoteClick(file, folder.title)}
                    style={{ fontSize: '15px', letterSpacing: '-0.2px', marginLeft: '20px', cursor: 'pointer' }}
                  >
                    {file.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        </div>
    </>
  );
}
