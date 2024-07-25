import React, { useState, useEffect } from 'react';
import '../../styles/dark.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image'; // Import the Image extension
import TopBar from './topbar';

const extensions = [StarterKit, Image]; // Add the Image extension to the list

export default function MarkdownContainer({ onJSONChange, content, setEditorContent, selectednote }) {
    const [imageURL, setImageURL] = useState('');
    const [showImageInput, setShowImageInput] = useState(false);

    const editor = useEditor({
        extensions,
        content: content, // Initialize with prop content
        onUpdate: ({ editor }) => {
            const json = editor.getHTML();
            if (onJSONChange) {
                onJSONChange(json);
            }
        },
    });

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    const addImage = () => {
        if (imageURL) {
            editor.chain().focus().setImage({ src: imageURL }).run();
            setImageURL(''); // Clear the input field
            setShowImageInput(false); // Hide the input field
        }
    };

    return (
        <>
            {/* <button onClick={() => setShowImageInput(!showImageInput)}>Add Image</button>
            {showImageInput && (
                <div style={{ marginTop: '10px' }}>
                    <input
                        type="text"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                        placeholder="Enter image URL"
                        style={{ marginRight: '10px', padding: '5px' }}
                    />
                    <button onClick={addImage}>Insert Image</button>
                </div>
            )} */}
            <EditorContent editor={editor} />
        </>
    );
}
