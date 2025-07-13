import React, { useState } from "react";
import "../../../pages/CSS/UploadNewBlog.css";
import { useNavigate } from "react-router-dom";


const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    content: "",
    image: null,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("author", formData.author);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("document", formData.document); // Document file
    formDataToSend.append("image", formData.image);       // Image file
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch("http://localhost:5030/api/blog/upload-blogs", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("Uploaded successfully:", result);
        alert("Blog uploaded!");
        navigate("/profile");
      } else {
        const errorData = await response.json();
      alert("Error uploading blog: " + errorData.message);
      }
    } catch (error) {
      console.error("Error uploading blog:", error);
      alert("Failed to upload. Check console for details.");
    }
  };
  

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const navigate = useNavigate();

  

  return (
    <div className="blog-form-container">
      <h2>Add New Blog</h2>
      <form className="blog-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" name="title" onChange={handleChange} required />

        <label>Author</label>
        <input type="text" name="author" onChange={handleChange} required />

        <label>Location</label>
        <input type="text" name="category" onChange={handleChange} />

        <label>Upload Document</label>
        <input
          type="file"
          name="document"
          accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleChange}
        />

        <label>Upload Cover Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <div className="btn-wrapper">
          <button type="submit">Submit Blog</button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
