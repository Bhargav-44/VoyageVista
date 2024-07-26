// pages/index.js
'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; 
import 'react-quill/dist/quill.bubble.css'; 
import JournalDetails from "../../components/JournalDetails"
import { useGlobalContext } from "../../context"
import Navbar from '../../components/Navbar';

const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

const Index = () => {
  const [content, setContent] = useState('');
  const [showJournalDetails, setShowJournalDetails] = useState(false);
  const { currJournalContent, edit } = useGlobalContext();

  useEffect(() => {
    if (edit) {
      setContent(currJournalContent.content);
    }
  }, [edit, currJournalContent]);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      [{ align: [] }],
      [{ color: [] }],
      ['code-block'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'align',
    'color',
    'code-block',
  ];

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  const handleSubmit = () => {
    setShowJournalDetails(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <style jsx global>{`
          .ql-editor img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .ql-editor {
            font-family: 'Arial', sans-serif;
            font-size: 16px;
            line-height: 1.6;
          }
          .ql-editor h1, .ql-editor h2, .ql-editor h3 {
            font-weight: bold;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
          }
          .ql-editor blockquote {
            border-left: 4px solid #ccc;
            padding-left: 16px;
            color: #666;
            font-style: italic;
          }
          .ql-container.ql-snow {
            border: none;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
          .ql-toolbar.ql-snow {
            border: none;
            border-bottom: 1px solid #e2e8f0;
            border-radius: 8px 8px 0 0;
            background-color: #f7fafc;
          }
        `}</style>
        <div className="bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Start Your Journey!
          </h1>
          <div className="mb-8">
            <QuillEditor
              value={content}
              onChange={handleEditorChange}
              modules={quillModules}
              formats={quillFormats}
              className="w-full h-[60vh] bg-white rounded-lg overflow-hidden"
            />
          </div>
          <div className="flex justify-center">
            <button 
              onClick={handleSubmit} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-md text-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Publish Your Story
            </button>
          </div>
        </div>
        {showJournalDetails && (
          <JournalDetails renderedContent={content} />
        )}
      </main>
    </div>
  );
}

export default Index;