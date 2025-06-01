import React from "react";
import { FaComment, FaThumbsUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import BlogContent from "../../Components/BlogComponents/BlogContent/BlogContent";
import "../CSS/PersonalBlog.css"; // Import your CSS file for styling
const beachImage2 = "/Blogimages/beach2.jpg"; // Correct path from public folder
const beachImage3 = "/Blogimages/beach3.jpg"; // Correct path from public folder
//const beachImage4 = "/Blogimages/beach4.jpg"; // Correct path from public folder
const PersonalBlog = () => {
  console.log("PersonalBlog component mounted");
  return (
    <div className="page-container-personalBlog">
      <div className="blogTopic">
        <h1>Beaches of Sri Lanka</h1>
      </div>
      {/* <WriterDetails/> */}
      <BlogContent />
      <div className="blogImages">
        <img src={beachImage2} alt="beachImage2" />
      </div>

      <BlogContent />
      <div className="blogImages columns-2 gap-x-20 ">
        <div>
          <img src={beachImage3} alt="beachImage3" />
        </div>
        <div>
          <BlogContent />
        </div>
      </div>
      <div className="blogImages columns-2 gap-x-20 ">
        <div>
          <img src={beachImage3} alt="beachImage3" />
        </div>
        <div>
          <BlogContent />
        </div>
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
