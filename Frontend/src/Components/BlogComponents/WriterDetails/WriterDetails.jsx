import './WriterDetails.css';

const WriterDetails = () => {
  return (
    <div className="page-container">
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
          <div className="publishDay">Published on dec 27, 2024 </div>
        </div>
        <Link>
          <div className="follow_button">Follow</div>
        </Link>
      </div>
      <hr style={{ border: "1px solid #ccc" }} />
      <p className="comLikeIcons">
        <span className="flex items-center gap-1">
          <FaComment className="text-lg" />
          <span className="numComLikes">265</span>
        </span>

        <span className="flex items-center gap-1">
          <FaThumbsUp className="text-lg" />
          <span className="numComLikes">26k</span>
        </span>
      </p>
      <hr style={{ border: "1px solid #ccc" }} />
    </div>
  );
};

export default WriterDetails;