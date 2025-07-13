// src/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://localhost:5030/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch all vehicles
export const getVehicles = async () => {
  try {
    const response = await api.get("/vehicle");
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }
};

// Fetch all accommodation
export const getAccommodations = async () => {
  try {
    const response = await api.get("/accommodation");
    return response.data;
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    throw error;
  }
};

// Fetch a single vehicle by ID
export const getVehicle = async (id) => {
  try {
    const response = await api.get(`/vehicle/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching vehicle ${id}:`, error);
    throw error;
  }
};

// Fetch a single accommodation by ID
export const getAccommodation = async (id) => {
  try {
    const response = await api.get(`/accommodation/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching accommodation ${id}:`, error);
    throw error;
  }
};

// Add a review for a vehicle
export const addReview = async (id, review) => {
  try {
    const response = await api.post(`/vehicle/${id}/reviews`, review);
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

// Add a review for a accommodation
export const addReviewAccommodation = async (id, review) => {
  try {
    const response = await api.post(`/accommodation/${id}/reviews`, review);
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

// Reserve a vehicle
export const reserveVehicle = async (id, reservation) => {
  try {
    const response = await api.post(`/vehicle/${id}/reserve`, reservation);
    return response.data;
  } catch (error) {
    console.error("Error reserving vehicle:", error);
    throw error;
  }
};

// Reserve a accommodation
export const reserveAccommodation = async (id, reservation) => {
  try {
    const response = await api.post(
      `/accommodation/${id}/reserve`,
      reservation
    );
    return response.data;
  } catch (error) {
    console.error("Error reserving accommodation:", error);
    throw error;
  }
};
