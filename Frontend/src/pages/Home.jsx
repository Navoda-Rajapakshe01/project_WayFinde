import React from "react";
import HeroSection from "../Components/HeroSection/HeroSection";
import ServicesOverviewSection from "../Components/HomeSections/ServiceOverviewSection";
import LocationSection from "../Components/LocationSection/LocationSection";
import FeaturedListingsSection from "../Components/HomeSections/FeaturedListingsSection";
import BlogPostSection from "../Components/BlogComponents/BlogPostSection/BlogPostSection";

function Home() {
  return (
    <>
      <HeroSection
        backgroundImage="https://www.colombocourthotel.com/colombocourthotelblog/wp-content/uploads/sites/4/2019/06/9dc45e8efc7ef0ff8051c244e808bb1a.jpg"
        placeHolder="Search destinations, blogs, or experiences..."
        showSearchBar={false}
      />

      {/* 1. Services Overview Section */}
      <ServicesOverviewSection
        title="Discover Our Services"
        subtitle="Explore a wide range of travel services tailored for you"
        showViewAllButton={true}
      />

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
      />
    </>
  );
}

export default Home;
