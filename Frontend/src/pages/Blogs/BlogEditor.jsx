import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Droplet,
  Eraser,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  Undo,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import "../CSS/BlogEditor.css";

function BlogEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const [blogImages, setBlogImages] = useState([]);

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5030/api/blog/upload-image",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await response.json();
        if (response.ok && data.imageUrl) {
          setBlogImages((prev) => [...prev, data.imageUrl]);
          executeCommand("insertImage", data.imageUrl);
        } else {
          alert("Image upload failed");
        }
      } catch (err) {
        console.error(err);
      }
    };
  };

  const handleInsertLink = () => {
    const url = prompt("Enter the URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const handleTextColorChange = () => {
    const color = prompt("Enter a color name or hex (e.g., red or #ff0000):");
    if (color) {
      executeCommand("foreColor", color);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    const blog = {
      title,
      blogUrl: content,
      imageUrls: blogImages, // ✅ new field
      tags: [], // fill if needed
      author: "Author Name", // dynamic if you have auth
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5030/api/blog/save-blogs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(blog),
        }
      );

      if (response.ok) {
        alert("Blog submitted successfully!");
        setTitle("");
        setContent("");
        setBlogImages([]);
        editorRef.current.innerHTML = "";
      } else {
        alert("Error submitting blog");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Network error occurred");
    }
  };

  const ToolbarButton = ({ onClick, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="toolbar-button"
    >
      {children}
    </button>
  );

  return (
    <div className="blog-editor-container">
      <h1 className="blog-editor-title">Blog Editor</h1>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter your blog title..."
        className="blog-title-input"
      />

      <div className="editor-container">
        {/* Toolbar */}
        <div className="editor-toolbar">
          <select
            onChange={(e) => executeCommand("formatBlock", e.target.value)}
            className="toolbar-select"
            defaultValue=""
          >
            <option value="">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          {/* Formatting */}
          <ToolbarButton onClick={() => executeCommand("bold")} title="Bold">
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeCommand("italic")}
            title="Italic"
          >
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeCommand("underline")}
            title="Underline"
          >
            <Underline size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeCommand("strikeThrough")}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeCommand("subscript")}
            title="Subscript"
          >
            <Subscript size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeCommand("superscript")}
            title="Superscript"
          >
            <Superscript size={16} />
          </ToolbarButton>

          <div className="toolbar-divider"></div>

          {/* Alignment */}
          <ToolbarButton
            onClick={() => executeCommand("justifyLeft")}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeCommand("justifyCenter")}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeCommand("justifyRight")}
            title="Align Right"
          >
            <AlignRight size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeCommand("justifyFull")}
            title="Justify"
          >
            <AlignJustify size={16} />
          </ToolbarButton>

          <div className="toolbar-divider"></div>

          {/* Lists */}
          <ToolbarButton
            onClick={() => executeCommand("insertUnorderedList")}
            title="Bullet List"
          >
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeCommand("insertOrderedList")}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </ToolbarButton>

          <div className="toolbar-divider"></div>

          {/* Utilities */}
          <ToolbarButton onClick={handleImageUpload} title="Insert Image">
            <Image size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeCommand("formatBlock", "pre")}
            title="Code Block"
          >
            <Code size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={handleInsertLink} title="Insert Link">
            <Link size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={handleTextColorChange} title="Text Color">
            <Droplet size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeCommand("removeFormat")}
            title="Clear Formatting"
          >
            <Eraser size={16} />
          </ToolbarButton>

          <div className="toolbar-divider"></div>

          {/* Undo / Redo */}
          <ToolbarButton onClick={() => executeCommand("undo")} title="Undo">
            <Undo size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => executeCommand("redo")} title="Redo">
            <Redo size={16} />
          </ToolbarButton>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={updateContent}
          onPaste={updateContent}
          className="editor-content"
          data-placeholder="Write your blog content here..."
          suppressContentEditableWarning={true}
        />
      </div>

      {/* Character Counter */}
      <div className="character-counter">
        Characters: {content.replace(/<[^>]*>/g, "").length}
      </div>

      <div className="button-container">
        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim()}
          className="btn btn-primary"
        >
          Submit Blog
        </button>

        <button
          onClick={() => {
            setTitle("");
            setContent("");
            if (editorRef.current) {
              editorRef.current.innerHTML = "";
            }
          }}
          className="btn btn-secondary"
        >
          Clear
        </button>

        <button
          onClick={() => {
            console.log("Current content:", content);
            console.log("Title:", title);
          }}
          className="btn btn-success"
        >
          Preview Content
        </button>
      </div>

      {/* Preview */}
      {content && (
        <div className="preview-section">
          <h3 className="preview-title">Preview:</h3>
          <div className="preview-content">
            <h2 className="preview-blog-title">{title}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="preview-blog-content"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogEditor;
