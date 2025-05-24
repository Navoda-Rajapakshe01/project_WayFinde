<<<<<<< Updated upstream

import BlogPostSection from "../Components/BlogComponents/BlogPostSection/BlogPostSection";
import HeroSection from "../Components/HeroSection/HeroSection";
import LocationSection from "../Components/LocationSection/LocationSection";
import VehicleSection from "../Components/VehicleSection/VehicleSection";

=======
import React from "react";
import HeroSection from "../Components/HeroSection/HeroSection";
import ServicesOverviewSection from "../Components/HomeSections/ServiceOverviewSection";
import LocationSection from "../Components/LocationSection/LocationSection";
import FeaturedListingsSection from "../Components/HomeSections/FeaturedListingsSection";
import BlogPostSection from "../Components/BlogComponents/BlogPostSection/BlogPostSection";

>>>>>>> Stashed changes
function Home() {
  return (
    <>
      <HeroSection
<<<<<<< Updated upstream
        title={
          <>
            Discover. Explore. Experience. <br />
            Your Perfect Journey Starts Here!
          </>
        }
        subtitle="Plan your trips easily"
        backgroundImage="https://res.cloudinary.com/enchanting/q_70,f_auto,c_lfill,g_auto/exodus-web/2022/05/sri-lanka.jpg"
        placeHolder="Search Here..."
=======
        backgroundImage="https://www.colombocourthotel.com/colombocourthotelblog/wp-content/uploads/sites/4/2019/06/9dc45e8efc7ef0ff8051c244e808bb1a.jpg"
        placeHolder="Search destinations, blogs, or experiences..."
        showSearchBar={false}
      />

      {/* 1. Services Overview Section */}
      <ServicesOverviewSection />

      {/* 2. Popular Destinations */}
      <LocationSection
        title="Explore Popular Destinations"
        subtitle="Get inspired for your next adventure"
      />

      {/* 3. Featured Stays & Rides (Accommodation & Vehicles) */}
      <FeaturedListingsSection />

      {/* 4. Latest from Our Travelers (Blogs) */}
      <BlogPostSection
        title="Latest Stories from Our Travelers"
        subtitle="Insights, tips, and adventures shared by our community"
        showViewAllButton={true}
>>>>>>> Stashed changes
      />
      <LocationSection />
      <BlogPostSection />
      <VehicleSection />
    </>
  );
}

export default Home;
