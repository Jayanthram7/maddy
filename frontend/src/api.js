import axios from "axios";

const API_URL = "http://localhost:5000/api/calls";

export const getCalls = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching calls:", error);
        return [];
    }
};

export const createCall = async (callData) => {
    await axios.post(API_URL, callData);
};

export const updateCallStatus = async (id, status) => {
    await axios.put(`${API_URL}/${id}`, { status });
};

export const deleteCall = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};
