import axios from "axios";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FaComment, FaThumbsUp } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import BlogContent from "../../Components/BlogComponents/BlogContent/BlogContent";
import "../CSS/PersonalBlog.css"; // Import your CSS file for styling

//const beachImage2 = "/Blogimages/beach2.jpg"; // Correct path from public folder
//const beachImage3 = "/Blogimages/beach3.jpg"; // Correct path from public folder
//const beachImage4 = "/Blogimages/beach4.jpg"; // Correct path from public folder
const PersonalBlog = ({ UserId, BlogId }) => {
  console.log("PersonalBlog component mounted");
  const { id } = useParams(); // Get ID from URL parameters
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");

  PersonalBlog.propTypes = {
    UserId: PropTypes.string.isRequired,
    BlogId: PropTypes.string.isRequired,
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:5030/api/blog/display/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Blog not found");
          } else if (response.status === 400) {
            throw new Error("Invalid blog ID");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const blogData = await response.json();
        setBlog(blogData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (loading) {
    return <div className="loading">Loading blog...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!blog) {
    return <div className="not-found">Blog not found</div>;
  }

  const submitComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5030/api/blog/newComment",
        {
          UserId,
          BlogId,
          Content: commentText,
        }
      );

      console.log("Comment saved:", response.data);
      setCommentText("");
    } catch (error) {
      console.error("Failed to save comment:", error);
    }
  };

  return (
    <div className="page-container-personalBlog">
      <div className="blogTopic">
        <h1>{blog.title}</h1>
      </div>
      {/* <WriterDetails/> */}

      <BlogContent />
      <div className="blogImages">
        <img src={blog.coverImageUrl} alt="beachImage2" />
      </div>

      <BlogContent />
      <div className="blogImages columns-2 gap-x-20 ">
        <div>
          <img src={blog.coverImageUrl} alt="beachImage3" />
        </div>
        <div>
          <BlogContent />
        </div>
      </div>
      <div className="blogImages columns-2 gap-x-20 ">
        <div>
          <img src={blog.coverImageUrl} alt="beachImage3" />
        </div>
        <div>
          <BlogContent />
        </div>
      </div>
      <div className="writerDetails space-x-4">
        <div>
          <img
            src={blog.user.profilePictureUrl}
            alt="User Profile"
            className="profile-img"
          />
        </div>
        <div className="name-container">
          <div className="writerName">
            Written by <h1>{blog.author}</h1>
          </div>

          <div className="numOfFollowersFollowing">
            <div className="numOfFollowers">449 Followers</div>
            <div className="numOfFollowers">469 Followings</div>
          </div>
        </div>
        <Link>
          <div className="follow_button">Follow</div>
        </Link>
      </div>
      <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
      <div>
        <div className="commentsArea">
          <div className="numberOfComments">Comments(265)</div>
          <div className="commentsAreaProfileDetails">
            <img
              src={blog.user.profilePictureUrl}
              alt="User Profile"
              className="profile-img"
            />
            <h1>{blog.user.username}</h1>
          </div>
          <div className="commentAreaAddComments">
            <textarea
              className="commentInput"
              placeholder="Write your comment here..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            ></textarea>
            <button onClick={submitComment}>Submit</button>
          </div>
          {/* <div className="functionButtons">
            <button className="cancelButton">Cancel</button>
            <button className="submitButton">Submit</button>
          </div> */}
          <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
        </div>
        <div>
          <div className="writerDetails space-x-4">
            <div>
              <img
                src="https://static.flashintel.ai/image/9/4/5/945db06270b111fab0848c6d2a3f8f74.jpeg"
                alt="User Profile"
                className="profile-img"
              />
            </div>
            <div className="name-container">
              <div className="writerName">Anne Frank</div>
              <div className="numOfFollowersFollowing">
                <div className="publishDay text-sm">Dec 27, 2024 </div>
              </div>
              <div></div>
            </div>
          </div>
          <div>
            This is a handy trick to keep up your sleeve for future use.
            However, for now, it’s still experimental. The lack of support from
            Firefox and Safari (on both desktop and iOS) means it’s not yet
            ready for broader adoption.
          </div>
          <p className="comLikeIcons">
            <span className="flex items-center gap-1">
              <FaComment className="text-lg" />
              <span className="numComLikes">2 Replies</span>
            </span>

            <span className="flex items-center gap-1">
              <FaThumbsUp className="text-lg" />
              <span className="numComLikes">26</span>
            </span>
          </p>
          <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
        </div>
        <div>
          <div className="writerDetails space-x-4">
            <div>
              <img
                src="https://static.flashintel.ai/image/9/4/5/945db06270b111fab0848c6d2a3f8f74.jpeg"
                alt="User Profile"
                className="profile-img"
              />
            </div>
            <div className="name-container">
              <div className="writerName">Anne Frank</div>
              <div className="numOfFollowersFollowing">
                <div className="publishDay text-sm">Dec 27, 2024 </div>
              </div>
              <div></div>
            </div>
          </div>
          <div>
            This is a handy trick to keep up your sleeve for future use.
            However, for now, it’s still experimental. The lack of support from
            Firefox and Safari (on both desktop and iOS) means it’s not yet
            ready for broader adoption.
          </div>
          <p className="comLikeIcons">
            <span className="flex items-center gap-1">
              <FaComment className="text-lg" />
              <span className="numComLikes">2 Replies</span>
            </span>

            <span className="flex items-center gap-1">
              <FaThumbsUp className="text-lg" />
              <span className="numComLikes">26</span>
            </span>
          </p>
          <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
        </div>
        <div>
          <div className="writerDetails space-x-4">
            <div>
              <img
                src="https://static.flashintel.ai/image/9/4/5/945db06270b111fab0848c6d2a3f8f74.jpeg"
                alt="User Profile"
                className="profile-img"
              />
            </div>
            <div className="name-container">
              <div className="writerName">Anne Frank</div>
              <div className="numOfFollowersFollowing">
                <div className="publishDay text-sm">Dec 27, 2024 </div>
              </div>
              <div></div>
            </div>
          </div>
          <div>
            This is a handy trick to keep up your sleeve for future use.
            However, for now, it’s still experimental. The lack of support from
            Firefox and Safari (on both desktop and iOS) means it’s not yet
            ready for broader adoption.
          </div>
          <p className="comLikeIcons">
            <span className="flex items-center gap-1">
              <FaComment className="text-lg" />
              <span className="numComLikes">2 Replies</span>
            </span>

            <span className="flex items-center gap-1">
              <FaThumbsUp className="text-lg" />
              <span className="numComLikes">26</span>
            </span>
          </p>
          <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
        </div>
        <div>
          <div className="writerDetails space-x-4">
            <div>
              <img
                src="https://static.flashintel.ai/image/9/4/5/945db06270b111fab0848c6d2a3f8f74.jpeg"
                alt="User Profile"
                className="profile-img"
              />
            </div>
            <div className="name-container">
              <div className="writerName">Anne Frank</div>
              <div className="numOfFollowersFollowing">
                <div className="publishDay text-sm">Dec 27, 2024 </div>
              </div>
              <div></div>
            </div>
          </div>
          <div>
            This is a handy trick to keep up your sleeve for future use.
            However, for now, it’s still experimental. The lack of support from
            Firefox and Safari (on both desktop and iOS) means it’s not yet
            ready for broader adoption.
          </div>
          <p className="comLikeIcons">
            <span className="flex items-center gap-1">
              <FaComment className="text-lg" />
              <span className="numComLikes">2 Replies</span>
            </span>

            <span className="flex items-center gap-1">
              <FaThumbsUp className="text-lg" />
              <span className="numComLikes">26</span>
            </span>
          </p>
          <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
        </div>
      </div>
      <div className="allResponses">
        <button>See all responses </button>
      </div>
    </div>
  );
};

export default PersonalBlog;
