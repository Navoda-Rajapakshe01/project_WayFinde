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
  const [blogImages, setBlogImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
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

  const insertImageAtCursor = (imageUrl) => {
    const editor = editorRef.current;
    if (!editor) return;

    // Create image element
    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.margin = "10px 0";
    img.alt = "Uploaded image";

    // Focus the editor first
    editor.focus();

    // Get current selection
    const selection = window.getSelection();

    if (selection.rangeCount > 0) {
      // Insert at cursor position
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(img);

      // Move cursor after the image
      range.setStartAfter(img);
      range.setEndAfter(img);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // If no selection, append to the end
      editor.appendChild(img);
    }

    // Update content state
    updateContent();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      // Upload the first image file
      uploadImageFile(imageFiles[0]);
    }
  };

  const uploadImageFile = async (file) => {
    // Validate file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("Image size should be less than 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Authentication token not found. Please log in again.");
        setIsUploading(false);
        return;
      }

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

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Handle non-JSON response (likely HTML error page)
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);

        // Parse specific error messages from the response
        if (textResponse.includes("entity changes")) {
          alert(
            "Database error: There's an issue saving the image to the database. Please contact support."
          );
        } else if (textResponse.includes("Cloudinary")) {
          alert(
            "Image hosting error: Unable to upload image to cloud storage. Please try again."
          );
        } else if (response.status === 500) {
          alert(
            "Server error occurred while uploading image. Please try again later."
          );
        } else if (response.status === 401) {
          alert("Authentication failed. Please log in again.");
        } else {
          alert(`Upload failed with status: ${response.status}`);
        }
        setIsUploading(false);
        return;
      }

      if (response.ok && data.imageUrl) {
        setBlogImages((prev) => [...prev, data.imageUrl]);
        insertImageAtCursor(data.imageUrl);
        // Don't show alert for drag & drop to avoid interrupting the flow
      } else {
        console.error("Upload failed:", data);
        alert(data.message || "Image upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);

      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        alert(
          "Network error: Unable to connect to server. Please check your connection."
        );
      } else if (err instanceof SyntaxError && err.message.includes("JSON")) {
        alert("Server returned an invalid response. Please try again.");
      } else {
        alert("An unexpected error occurred during upload. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const updateContent = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      await uploadImageFile(file);
      // Show success message for manual upload
      if (!isUploading) {
        alert("Image uploaded successfully!");
      }
    };
  };

  const handleInsertLink = () => {
    const url = prompt("Enter the URL:");
    if (url) {
      // Basic URL validation
      try {
        new URL(url);
        executeCommand("createLink", url);
      } catch {
        // If URL is invalid, try adding https://
        if (!url.includes("://")) {
          const fullUrl = `https://${url}`;
          try {
            new URL(fullUrl);
            executeCommand("createLink", fullUrl);
          } catch {
            alert("Please enter a valid URL");
          }
        } else {
          alert("Please enter a valid URL");
        }
      }
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
      title: title.trim(),
      blogUrl: content,
      imageUrls: blogImages,
      tags: [],
      author: "Author Name",
    };

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }

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
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }
      } else {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message || "Error submitting blog. Please try again.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert(
        "Network error occurred. Please check your connection and try again."
      );
    }
  };

  const handleClear = () => {
    if (content.trim() || title.trim()) {
      if (
        window.confirm(
          "Are you sure you want to clear all content? This action cannot be undone."
        )
      ) {
        setTitle("");
        setContent("");
        setBlogImages([]);
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }
      }
    }
  };

  const ToolbarButton = ({ onClick, children, title, disabled = false }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="toolbar-button"
      disabled={disabled}
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
        maxLength={200}
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
          <ToolbarButton
            onClick={handleImageUpload}
            title={isUploading ? "Uploading..." : "Insert Image"}
            disabled={isUploading}
          >
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
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="editor-content"
          data-placeholder="Write your blog content here..."
          suppressContentEditableWarning={true}
        />
      </div>

      {/* Upload Status */}
      {isUploading && (
        <div className="upload-status">
          <span>Uploading image...</span>
        </div>
      )}

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

        <button onClick={handleClear} className="btn btn-secondary">
          Clear
        </button>

        <button
          onClick={() => {
            console.log("Current content:", content);
            console.log("Title:", title);
            console.log("Images:", blogImages);
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
