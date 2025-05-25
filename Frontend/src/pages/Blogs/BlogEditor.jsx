// BlogEditor.js
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function BlogEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    const blog = {
      title,
      content,
    };

    const response = await fetch('https://yourapi.com/api/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Add auth token if needed
      },
      body: JSON.stringify(blog),
    });

    if (response.ok) {
      alert('Blog submitted successfully!');
    } else {
      alert('Error submitting blog');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Blog title"
        className="w-full p-2 border mb-4"
      />
      <ReactQuill
        value={content}
        onChange={setContent}
        className="mb-4"
        placeholder="Write your blog here..."
      />
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </div>
  );
}

export default BlogEditor;
