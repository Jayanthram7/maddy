import React, { useState, useEffect } from 'react';
import { FaRedo, FaRandom, FaMusic, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getCalls, createCall, updateCall, deleteCall } from './api';


const getStatusIcon = (status) => {
    switch (status) {
        case 'Repeat':
            return <FaRedo />;
        case 'Shuffle':
            return <FaRandom />;
        case 'Mixed Album':
            return <FaMusic />;
        default:
            return <FaMusic />;
    }
};

export default function CallManagement() {
    const [calls, setCalls] = useState([]);
    const [form, setForm] = useState({
        agentName: "",
        customerName: "",
        phoneNumber: "",
        issue: "",
        status: "Pending",
        callDuration: ""
    });
    const [editingCall, setEditingCall] = useState(null); // New state for editing a call

    useEffect(() => {
        fetchCalls();
    }, []);

    const fetchCalls = async () => {
        try {
            const data = await getCalls();
            console.log("Fetched Data:", data);
            setCalls(data);
        } catch (error) {
            console.error("Error fetching calls:", error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCall) {
                // Update the existing call record
                await updateCall(editingCall.id, form);
            } else {
                // Create a new call record
                await createCall(form);
            }
            setForm({ agentName: "", customerName: "", phoneNumber: "", issue: "", status: "Pending", callDuration: "" });
            setEditingCall(null); // Reset editing state
            fetchCalls(); // Refresh the call list
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };


    const handleDelete = async (id) => {
        await deleteCall(id);
        fetchCalls(); // Refresh the call list after deletion
    };

    const handleEdit = (call) => {
        // Populate the form with the call's current details for editing
        setForm({
            agentName: call.agentName,
            customerName: call.customerName,
            phoneNumber: call.phoneNumber,
            issue: call.issue,
            status: call.status,
            callDuration: call.callDuration
        });
        setEditingCall(call); // Set the editing state to the current call
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-pink-100 shadow-lg rounded-xl relative bg-cover bg-no-repeat" style={{ backgroundImage: 'url(https://path-to-your-music-notes-image.png)' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center">
                🎶 My Music Playlist
            </h2>

            {/* Call Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="agentName"
                        value={form.agentName}
                        onChange={handleChange}
                        placeholder="Music Name"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                    />
                    <input
                        type="text"
                        name="customerName"
                        value={form.customerName}
                        onChange={handleChange}
                        placeholder="Artist"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                    />
                    <input
                        type="text"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        placeholder="Album Name"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                    />
                    <input
                        type="text"
                        name="issue"
                        value={form.issue}
                        onChange={handleChange}
                        placeholder="Genre"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                    />
                </div>
                <input
                    type="number"
                    name="callDuration"
                    value={form.callDuration}
                    onChange={handleChange}
                    placeholder="Music Duration (mins)"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                />
                <button type="submit" className="w-full p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-300 flex items-center justify-center">
                    <FaPlus className="mr-2" />
                    {editingCall ? "Update Playlist" : "Add to Playlist"}
                </button>
            </form>

            {/* Call List */}
            <h3 className="text-lg font-bold mt-6">Playlist</h3>
            <div className="mt-4 space-y-3">
                {calls.map(call => (
                    <div key={call.id} className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-md">
                        <div>
                            <p><strong>Music:</strong> {call.agentName}</p>
                            <p><strong>Artist:</strong> {call.customerName}</p>
                            <p><strong>Album:</strong> {call.phoneNumber}</p>
                            <p><strong>Genre:</strong> {call.issue}</p>
                            <p><strong>Duration:</strong> {call.callDuration} mins</p>
                            <p><strong>Mode:</strong> {call.status}</p>
                        </div>
                        <div className="space-x-2 flex items-center">
                            {/* Update Button with Icon */}
                            <button
                                onClick={() => handleEdit(call)} // On click, load the form with call data
                                className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-300 flex items-center">
                                <FaEdit className="mr-2" />
                                Update
                            </button>

                            {/* Delete Button with Icon */}
                            <button onClick={() => handleDelete(call.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 flex items-center">
                                <FaTrash className="mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
