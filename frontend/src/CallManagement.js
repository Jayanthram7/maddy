import React, { useState, useEffect } from 'react';
import { FaRedo, FaRandom, FaMusic, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getCalls, createCall, updateCallStatus, deleteCall } from './api';

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

    // State to manage the visibility of the update options
    const [showUpdateOptions, setShowUpdateOptions] = useState(null);

    useEffect(() => {
        fetchCalls();
    }, []);

    const fetchCalls = async () => {
        try {
            const data = await getCalls();
            console.log("API Response Data:", data);  // Debugging
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
        await createCall(form);
        setForm({ agentName: "", customerName: "", phoneNumber: "", issue: "", status: "Pending", callDuration: "" });
        fetchCalls();
    };

    const handleStatusChange = async (id, status) => {
        await updateCallStatus(id, status);
        setShowUpdateOptions(null); // Hide the options after status change
        fetchCalls();
    };

    const handleDelete = async (id) => {
        await deleteCall(id);
        fetchCalls();
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-pink-100 shadow-lg rounded-xl relative bg-cover bg-no-repeat" style={{ backgroundImage: 'url(https://path-to-your-music-notes-image.png)' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center">
                🎶 My Music Playlist
            </h2>

            {/* Call Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="agentName" value={form.agentName} onChange={handleChange} placeholder="Music Name" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" required />
                    <input type="text" name="customerName" value={form.customerName} onChange={handleChange} placeholder="Artist" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" required />
                    <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Album Name" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" required />
                    <input type="text" name="issue" value={form.issue} onChange={handleChange} placeholder="Genre" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" required />
                </div>
                <input type="number" name="callDuration" value={form.callDuration} onChange={handleChange} placeholder="Music Duration (mins)" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" required />
                <button type="submit" className="w-full p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-300 flex items-center justify-center">
                    <FaPlus className="mr-2" />
                    Add to Playlist
                </button>
            </form>

            {/* Call List */}
            <h3 className="text-lg font-bold mt-6">Playlist</h3>
            <div className="mt-4 space-y-3">
                {calls.map(call => (
                    <div key={call.id} className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-md">
                        <div>
                            <p><strong>Music:</strong> {call.agentName}</p>
                            <p><strong>Artist:</strong> {call.customerName} ({call.phoneNumber})</p>
                            <p><strong>Genre:</strong> {call.issue}</p>
                            <p><strong>Duration:</strong> {call.callDuration} mins</p>
                            <p><strong>Mode:</strong> {call.status}</p>
                        </div>
                        <div className="space-x-2 flex items-center">
                            {/* Update Button with Icon */}
                            <button 
                                onClick={() => setShowUpdateOptions(showUpdateOptions === call.id ? null : call.id)}
                                className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-300 flex items-center">
                                <FaEdit className="mr-2" />
                                Update
                            </button>
                            
                            {/* Show the update options if 'showUpdateOptions' matches the current call id */}
                            {showUpdateOptions === call.id && (
                                <div className="space-x-2 mt-2 flex items-center">
                                    <button 
                                        onClick={() => handleStatusChange(call.id, 'Repeat')} 
                                        className={`p-2 gap-2 flex items-center justify-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${call.status === 'Repeat' ? 'bg-pink-500 text-white' : 'bg-white'}`}>
                                        {getStatusIcon('Repeat')}
                                        Repeat
                                    </button>
                                    <button 
                                        onClick={() => handleStatusChange(call.id, 'Shuffle')} 
                                        className={`p-2 gap-2 flex items-center justify-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${call.status === 'Shuffle' ? 'bg-pink-500 text-white' : 'bg-white'}`}>
                                        {getStatusIcon('Shuffle')}
                                        Shuffle
                                    </button>
                                    <button 
                                        onClick={() => handleStatusChange(call.id, 'Mixed Album')} 
                                        className={`p-2 gap-2 flex items-center justify-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${call.status === 'Mixed Album' ? 'bg-pink-500 text-white' : 'bg-white'}`}>
                                        {getStatusIcon('Mixed Album')}
                                        Mixed Album
                                    </button>
                                </div>
                            )}
                            
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
