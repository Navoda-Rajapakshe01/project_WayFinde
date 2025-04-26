import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faCompass, faTheaterMasks, faLeaf, faHiking } from '@fortawesome/free-solid-svg-icons';
import "./Categories.css";

const Categories = () => {
  return (
    <div className='categories-container'>
      <div className="category-section">
        <div className="categories">
          <div className="category">
            <div className="icon-container">
              <FontAwesomeIcon icon={faPaw} size="2x" />
            </div>
            <p>Wildlife</p>
          </div>
          <div className="category">
            <div className="icon-container">
              <FontAwesomeIcon icon={faCompass} size="2x" />
            </div>
            <p>Adventure</p>
          </div>
          <div className="category">
            <div className="icon-container">
              <FontAwesomeIcon icon={faTheaterMasks} size="2x" />
            </div>
            <p>Historical</p>
          </div>
          <div className="category">
            <div className="icon-container">
              <FontAwesomeIcon icon={faLeaf} size="2x" />
            </div>
            <p>Nature & <br />Scenic</p>
          </div>
          <div className="category">
            <div className="icon-container">
              <FontAwesomeIcon icon={faHiking} size="2x" />
            </div>
            <p>Activities & <br />Experiences</p>
          </div>
        </div>
      </div>
      </div>
  );
}

export default Categories;
