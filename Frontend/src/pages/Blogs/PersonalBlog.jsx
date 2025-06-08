import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { FaComment, FaThumbsUp } from "react-icons/fa";
import { Link } from "react-router-dom";
//import BlogContent from "../../Components/BlogComponents/BlogContent/BlogContent";
import "../CSS/PersonalBlog.css";

const beachImage2 = "/Blogimages/beach2.jpg";
const beachImage3 = "/Blogimages/beach3.jpg";

const PersonalBlog = () => {
  console.log("PersonalBlog component mounted");
  const { id } = useParams(); // Get ID from URL parameters
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [blogContent, setBlogContent] = useState("");

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
        console.log("Fetched blog data:", blogData);
        setBlog(blogData);

        // Fetch HTML content from contentUrl (if available)
        if (blogData && blogData.blogUrl) {
          try {
            console.log("Fetching blog content from:", blogData.blogUrl);

            const contentResponse = await fetch(
              `http://localhost:5030/api/blog/proxy-blog-content?url=${encodeURIComponent(
                blogData.blogUrl
              )}`
            );
            if (!contentResponse.ok) {
              console.error(
                `Error fetching blog content: ${contentResponse.status}`
              );
              throw new Error(
                `Failed to fetch blog content: ${contentResponse.status}`
              );
            }

            const htmlContent = await contentResponse.text();
            console.log("Successfully fetched HTML content");
            setBlogContent(htmlContent);
          } catch (contentError) {
            console.error("Error loading blog content:", contentError);
            // We don't set the main error state here to allow the blog to still display
            // even if content loading fails
          }
        } else {
          console.log("No contentUrl found in blog data:", blogData);
        }
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

  // const submitComment = async () => {
  //   if (!commentText.trim()) return;

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5030/api/blog/newComment",
  //       {
  //         UserId,
  //         BlogId,
  //         Content: commentText,
  //       }
  //     );

  //     console.log("Comment saved:", response.data);
  //     setCommentText("");
  //   } catch (error) {
  //     console.error("Failed to save comment:", error);
  //   }
  // };

  return (
    <div className="page-container-personalBlog">
      <div className="blogTopic">
        <h1>{blog.title}</h1>
      </div>
      {/* <WriterDetails/> */}

      <div dangerouslySetInnerHTML={{ __html: blogContent }} />

      <div className="blogImages">
        <img src={blog.coverImageUrl} alt="beachImage2" />
      </div>

      {/* <BlogContent /> */}
      <div className="blogImages columns-2 gap-x-20 ">
        <div>
          <img src={beachImage3} alt="beachImage3" />
        </div>
        <div>{/* <BlogContent /> */}</div>
      </div>
      <div className="blogImages columns-2 gap-x-20 ">
        <div>
          <img src={beachImage3} alt="beachImage3" />
        </div>
        <div>{/* <BlogContent /> */}</div>
      </div>

      <div className="writerDetails space-x-4">
        <div>
          <img
            src="https://static.flashintel.ai/image/9/4/5/945db06270b111fab0848c6d2a3f8f74.jpeg"
            alt="User Profile"
            className="profile-img"
          />
        </div>
        <div className="name-container">
          <div className="writerName">Written by Anne Frank</div>
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
              src="https://static.flashintel.ai/image/9/4/5/945db06270b111fab0848c6d2a3f8f74.jpeg"
              alt="User Profile"
              className="profile-img"
            />
            Aaron-Jay
          </div>
          <div className="commentAreaAddComments">
            <textarea
              className="commentInput"
              placeholder="Write your comment here..."
            ></textarea>
          </div>
          <div className="functionButtons">
            <button className="cancelButton">Cancel</button>
            <button className="submitButton">Submit</button>
          </div>
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
