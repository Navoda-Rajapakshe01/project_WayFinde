import React from 'react';
import './ProfileBookingContent.css';

const BookedVehicle = () => {
  return (
    <div>
    <div className="booked-vehicle-container">
      <div className="booked-vehicles-header">
        <button className="booked-vehicles-btn">Booked vehicles</button>
      </div>
      
      <div className="vehicle-card">
        <div className="vehicle-content">
          <div className="vehicle-image-section">
            <img 
              src="/api/placeholder/300/200" 
              alt="Nissan March" 
              className="vehicle-image"
            />
            
          </div>
          
          <div className="vehicle-details">
            <h2 className="vehicle-title">Nissan March</h2>
            <div className="booked-date">
              <span className="booked-date-label">Booked Date : </span>
              <span className="booked-date-value">2025/01/15</span>
            </div>
            <div className="booked-date">
              <span className="booked-date-label">Vehicle Number : </span>
              <span className="booked-date-value">KU 2354</span>
            </div>
            <div className="booked-date">
              <span className="booked-date-label">Service Provider : </span>
              <span className="booked-date-value">Anne</span>
            </div>
            <div className="booked-date">
              <span className="booked-date-label">Start Date : </span>
              <span className="booked-date-value">2025/01/15</span>
            </div>
            <div className="booked-date">
              <span className="booked-date-label">End Date : </span>
              <span className="booked-date-value">2025/01/15</span>
            </div>
            <div className="booked-date">
              <span className="booked-date-label">Pickup Location : </span>
              <span className="booked-date-value">Colombo</span>
            </div>
            <div className="booked-date">
              <span className="booked-date-label">Return Location : </span>
              <span className="booked-date-value">Kandy</span>
            </div>
            <div className="booked-date">
              <span className="booked-date-label">Total Amount : </span>
              <span className="booked-date-value">Rs 50000</span>
            </div>
            <div className="booked-date">
             <span className="booked-date-label">Trip : </span>
             <span className="booked-date-value">Summer</span>
           </div>
            
            
          </div>
        </div>
      </div>
    </div>
     <div className="booked-vehicle-container">
     <div className="booked-vehicles-header">
       <button className="booked-vehicles-btn">Booked Accommodation</button>
     </div>
     
     <div className="vehicle-card">
       <div className="vehicle-content">
         <div className="vehicle-image-section">
           <img 
             src="/api/placeholder/300/200" 
             alt="Nissan March" 
             className="vehicle-image"
           />
           
         </div>
         
         <div className="vehicle-details">
           <h2 className="vehicle-title">Ahas Pokuna Holiday Resort</h2>
           <div className="booked-date">
             <span className="booked-date-label">Booked Date : </span>
             <span className="booked-date-value">2025/01/15</span>
           </div>
          
           <div className="booked-date">
             <span className="booked-date-label">Service Provider : </span>
             <span className="booked-date-value">Anne</span>
           </div>
           <div className="booked-date">
             <span className="booked-date-label">Start Date : </span>
             <span className="booked-date-value">2025/01/15</span>
           </div>
           <div className="booked-date">
             <span className="booked-date-label">End Date : </span>
             <span className="booked-date-value">2025/01/15</span>
           </div>
           
           <div className="booked-date">
             <span className="booked-date-label">Total Amount : </span>
             <span className="booked-date-value">Rs 50000</span>
           </div>
           <div className="booked-date">
             <span className="booked-date-label">Trip : </span>
             <span className="booked-date-value">Summer</span>
           </div>
           
         </div>
       </div>
     </div>
   </div>
   </div>
  );
};

export default BookedVehicle;