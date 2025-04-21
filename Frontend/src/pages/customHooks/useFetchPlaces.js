// useFetchPlaces.js
import { useState, useEffect } from "react";
import axios from "axios";

const useFetchPlaces = (districtId) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!districtId) return;

    setLoading(true);
    axios
      .get(`http://localhost:5000/api/places/by-district/${districtId}`)
      .then((response) => {
        setPlaces(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [districtId]);

  return { places, loading, error };
};

export default useFetchPlaces;
