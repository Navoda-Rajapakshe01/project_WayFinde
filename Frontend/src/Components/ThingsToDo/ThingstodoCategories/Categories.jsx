import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faCompass, faTheaterMasks, faLeaf, faShoppingBag, faHeart } from '@fortawesome/free-solid-svg-icons';
import "./Categories.css";

const Categories = () => {
  return (
    <div className='categories-container'>
      <h1>Things to do in Colombo</h1>
      <br />
      <div className="category-section">
        <div className="categories">
          <div className="category">
            <div className="icon-container">
              <FontAwesomeIcon icon={faUtensils} size="2x" />
            </div>
            <p>Food</p>
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
            <p>Nature & Scenic</p>
          </div>
          <div className="category">
            <div className="icon-container">
              <FontAwesomeIcon icon={faShoppingBag} size="2x" />
            </div>
            <p>Shopping</p>
          </div>
        </div>
      </div>
      <div className="card-container">
        <div className="card">
          <img src="image1.jpg" alt="Arugam Bay" />
          <div className="card-content">
            <h3>Arugam Bay</h3>
            <p className="description">Visit the temples and the Chiang Mai Night Bazaar. Chiang Mai's historic based on Chiang Saen styles.</p>
            <button className="details-btn">Details</button>
          </div>
          <div className="favorite"><FontAwesomeIcon icon={faHeart} /></div>
        </div>

        <div className="card">
          <img src="image2.jpg" alt="Adam's Peak" />
          <div className="card-content">
            <h3>Adam's Peak</h3>
            <p className="description">Boast lore in the capital of Thailand. Bangkok, Wat Arun is both a popular and magnificent temple in the world.</p>
            <button className="details-btn">Details</button>
          </div>
          <div className="favorite"><FontAwesomeIcon icon={faHeart} /></div>
        </div>

        <div className="card">
          <img src="image3.jpg" alt="Ella" />
          <div className="card-content">
            <h3>Ella</h3>
            <p className="description">Memorable culinary and cultural trip to the rich town with its beautiful environment and Buddhist traditions.</p>
            <button className="details-btn">Details</button>
          </div>
          <div className="favorite"><FontAwesomeIcon icon={faHeart} /></div>
        </div>

        <div className="card">
          <img src="image3.jpg" alt="Ella" />
          <div className="card-content">
            <h3>Ella</h3>
            <p className="description">Memorable culinary and cultural trip to the rich town with its beautiful environment and Buddhist traditions.</p>
            <button className="details-btn">Details</button>
          </div>
          <div className="favorite"><FontAwesomeIcon icon={faHeart} /></div>
        </div>

        <div className="card">
          <img src="image1.jpg" alt="Arugam Bay" />
          <div className="card-content">
            <h3>Arugam Bay</h3>
            <p className="description">Visit the temples and the Chiang Mai Night Bazaar. Chiang Mai's historic based on Chiang Saen styles.</p>
            <button className="details-btn">Details</button>
          </div>
          <div className="favorite"><FontAwesomeIcon icon={faHeart} /></div>
        </div>

        <div className="card">
          <img src="image2.jpg" alt="Adam's Peak" />
          <div className="card-content">
            <h3>Adam's Peak</h3>
            <p className="description">Boast lore in the capital of Thailand. Bangkok, Wat Arun is both a popular and magnificent temple in the world.</p>
            <button className="details-btn">Details</button>
          </div>
          <div className="favorite"><FontAwesomeIcon icon={faHeart} /></div>
        </div>

        <div className="card">
          <img src="image3.jpg" alt="Ella" />
          <div className="card-content">
            <h3>Ella</h3>
            <p className="description">Memorable culinary and cultural trip to the rich town with its beautiful environment and Buddhist traditions.</p>
            <button className="details-btn">Details</button>
          </div>
          <div className="favorite"><FontAwesomeIcon icon={faHeart} /></div>
        </div>
      </div>
    </div>
  );
}

export default Categories;
