import React from "react";
import { FaCommentAlt, FaThumbsUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import ProfileHeadSection from "../../Components/UserProfileComponents/ProfileHeadsection/ProfileHeadsection";
import "../CSS/ProfileBlogs.css";

const blogs = [
  {
    name: "Name1",
    topic: "Topic 1",
    description: "Description",
    image: "/beach1.jpg",
  },
  {
    name: "Name2",
    topic: "Topic 2",
    description: "Another description",
    image: "Frontend/public/beach1.jpg",
  },
  {
    name: "Name3",
    topic: "Topic 3",
    description: "Yet another description",
    image: "Frontend/public/beach1.jpg",
  },
  {
    name: "Name4",
    topic: "Topic 4",
    description: "Final description",
    image: "Frontend/public/beach1.jpg",
  },
  {
    name: "Name1",
    topic: "Topic 1",
    description: "Description",
    image: "/beach1.jpg",
  },
  {
    name: "Name2",
    topic: "Topic 2",
    description: "Another description",
    image: "Frontend/public/beach1.jpg",
  },
  {
    name: "Name3",
    topic: "Topic 3",
    description: "Yet another description",
    image: "Frontend/public/beach1.jpg",
  },
  {
    name: "Name4",
    topic: "Topic 4",
    description: "Final description",
    image: "Frontend/public/beach1.jpg",
  },
];

const ProfileSettings = () => {
  const navigate = useNavigate();

  const handleFileClick = () => {
    navigate("/uploadNewBlog"); // Navigate to your blog upload page
  };

  return (
    <div>
      <ProfileHeadSection />
      <div className="carousel-container">
        {blogs.map((blog, index) => (
          <div className="blog-card" key={index}>
            <img src={blog.image} alt="Blog" className="blog-image" />
            <div className="blog-content">
              <p className="blog-name">{blog.name}</p>
              <p className="blog-topic">
                <strong>{blog.topic}</strong>
              </p>
              <p className="blog-description">{blog.description}</p>
              <div className="blog-actions">
                <span>
                  <FaCommentAlt className="icon" /> Comments
                </span>
                <span>
                  <FaThumbsUp className="icon" /> Likes
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="profile-settings">
        <div className="button-wrapper">
          <button onClick={handleFileClick} className="UploadBlogButton">
            Upload Blog Document (.doc/.docx)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
