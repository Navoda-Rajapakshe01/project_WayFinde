// TripContext.js
import { createContext, useContext, useState } from "react";

// Create the context
const TripContext = createContext();

// Create the provider
export const TripProvider = ({ children }) => {
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [startingLocation, setStartingLocation] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <TripContext.Provider
      value={{
        selectedPlaces,
        setSelectedPlaces,
        startingLocation,
        setStartingLocation,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

// Custom hook to access trip context
export const useTrip = () => useContext(TripContext);
