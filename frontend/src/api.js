import axios from "axios";

const API_URL = "http://localhost:5000/api/calls";

// Get all calls
export const getCalls = async () => {
    try {
        const response = await axios.get(API_URL);
        
        // Log the response data for debugging
        console.log("API Response Data:", response.data);
        
        // Check if 'phoneNumber' exists in the response, and format it if necessary
        const calls = response.data.map(call => ({
            ...call,
            // Ensure phoneNumber is included, if it exists in the original data
            phoneNumber: call.phoneNumber || "Unknown Album",  // Provide fallback text if missing
        }));
        
        return calls;
    } catch (error) {
        console.error("Error fetching calls:", error);
        return [];
    }
};

// Create a new call record
export const createCall = async (callData) => {
    await axios.post(API_URL, callData);
};

// Update all fields of a call record (not just status)
export const updateCall = async (id, updatedValues) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updatedValues);
        return response.data;
    } catch (error) {
        console.error("Error updating call:", error);
        throw new Error("Failed to update call record");
    }
};

// Delete a call record
export const deleteCall = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};
