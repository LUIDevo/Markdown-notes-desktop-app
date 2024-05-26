import React, { useState } from 'react';
import '../../styles/global.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const extensions = [StarterKit];
const initialContent = '<p>Hello World!</p>';

export default function MarkdownContainer({ onJSONChange, setContents }) {
    const [editorContent, setEditorContent] = useState(initialContent);
    const [content, setContents] = useState("")

    const editor = useEditor({
        extensions,
        content: editorContent,
        onUpdate: ({ editor }) => {
            const json = editor.getJSON();
            setContent(json);
            if (onJSONChange) {
                onJSONChange(json);
            }
        },
    });


    return (
        <>
            <EditorContent editor={editor} />
        </>
    );
}
