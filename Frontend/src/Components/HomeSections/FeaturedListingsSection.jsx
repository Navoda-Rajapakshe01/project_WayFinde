import React from 'react';
import './FeaturedListingsSection.css';
import "../../App.css"; 


// Mock data - replace with actual data fetching
const featuredAccommodations = [
  { id: 1, name: 'Luxury Beach Villa', type: 'Villa', image: 'https://via.placeholder.com/300x200/ADD8E6/000000?text=Beach+Villa', price: '$250/night', link: '/accommodations/1' },
  { id: 2, name: 'City Center Boutique Hotel', type: 'Hotel', image: 'https://via.placeholder.com/300x200/90EE90/000000?text=City+Hotel', price: '$120/night', link: '/accommodations/2' },
];
const featuredVehicles = [
  { id: 1, name: 'Comfort SUV', type: 'SUV', image: 'https://via.placeholder.com/300x200/FFCCCB/000000?text=SUV', price: '$70/day', link: '/vehicles/1' },
  { id: 2, name: 'Eco-Friendly Scooter', type: 'Scooter', image: 'https://via.placeholder.com/300x200/E6E6FA/000000?text=Scooter', price: '$20/day', link: '/vehicles/2' },
];

const FeaturedCard = ({ item }) => ( 
    <a href={item.link} className="featured-item-card-link">
        <div className="featured-item-card">
            <img src={item.image} alt={item.name} className="featured-item-image" />
            <div className="featured-item-content">
            <h4 className="featured-item-name">{item.name}</h4>
            <p className="featured-item-details">{item.type} - {item.price}</p>
            </div>
        </div>
    </a>
);


const FeaturedListingsSection = () => {
  return (
    <section className="featured-listings-section homesection-padding">
      <div className="container">
        <h2 className="homesection-title text-center">Travel Essentials</h2>
        <p className="homesection-subtitle text-center">Find the perfect stay and ride for your adventure.</p>

        <div className="listings-container">
          {/* Accommodations */}
          <div className="listing-category">
            <h3 className="listing-category-title">Featured Accommodations</h3>
            <div className="featured-items-grid">
              {featuredAccommodations.map(item => <FeaturedCard item={item} key={item.id} />)}
            </div>
            <div className="view-all-container text-center">
                <a href="/accommodation" className="homebtn homebtn-outline">View All Stays</a>
            </div>
          </div>

          {/* Vehicles */}
          <div className="listing-category">
            <h3 className="listing-category-title">Popular Vehicles</h3>
            <div className="featured-items-grid">
              {featuredVehicles.map(item => <FeaturedCard item={item} key={item.id} />)}
            </div>
             <div className="view-all-container text-center">
                <a href="/vehicle" className="homebtn homebtn-outline">View All Rides</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FeaturedListingsSection;