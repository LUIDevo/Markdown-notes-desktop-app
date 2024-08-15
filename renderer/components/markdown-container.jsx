import React, { useEffect } from 'react';
import '../../styles/dark.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

const extensions = [StarterKit, Image];

export default function MarkdownContainer({ onJSONChange, content }) {
  const editor = useEditor({
    extensions,
    content: '', // Initialize with an empty string or your initial content
    onUpdate: ({ editor }) => {
      const json = editor.getHTML(); // Get the content as HTML
      if (onJSONChange) {
        onJSONChange(json);
      }
    },
  });

  useEffect(() => {
    if (editor) {
      // Directly set the HTML content
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
}
