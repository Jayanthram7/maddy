import { useState, useEffect } from "react";
import { getCalls, createCall, updateCallStatus, deleteCall } from "./api";

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
        fetchCalls();
    };

    const handleDelete = async (id) => {
        await deleteCall(id);
        fetchCalls();
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Call Management</h2>

            {/* Call Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="agentName" value={form.agentName} onChange={handleChange} placeholder="Agent Name" className="w-full p-2 border rounded" required />
                <input type="text" name="customerName" value={form.customerName} onChange={handleChange} placeholder="Customer Name" className="w-full p-2 border rounded" required />
                <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="w-full p-2 border rounded" required />
                <input type="text" name="issue" value={form.issue} onChange={handleChange} placeholder="Issue" className="w-full p-2 border rounded" required />
                <input type="number" name="callDuration" value={form.callDuration} onChange={handleChange} placeholder="Call Duration (mins)" className="w-full p-2 border rounded" required />
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Add Call</button>
            </form>

            {/* Call List */}
            <h3 className="text-lg font-bold mt-6">Call Records</h3>
            <div className="mt-4 space-y-3">
                {calls.map(call => (
                    <div key={call.id} className="p-4 border rounded flex justify-between items-center">
                        <div>
                            <p><strong>Agent:</strong> {call.agentName}</p>
                            <p><strong>Customer:</strong> {call.customerName} ({call.phoneNumber})</p>
                            <p><strong>Issue:</strong> {call.issue}</p>
                            <p><strong>Duration:</strong> {call.callDuration} mins</p>
                            <p><strong>Status:</strong> {call.status}</p>
                        </div>
                        <div className="space-x-2">
                            <select value={call.status} onChange={(e) => handleStatusChange(call.id, e.target.value)} className="p-2 border rounded">
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                            <button onClick={() => handleDelete(call.id)} className="p-2 bg-red-500 text-white rounded">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
