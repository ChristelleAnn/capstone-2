import React, { useState } from 'react';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([
    // Sample data, this should be fetched from backend
    { id: 1, name: 'John Doe', studentID: '12345', grade: 'Grade 10', status: 'Pending' },
    { id: 2, name: 'Jane Smith', studentID: '67890', grade: 'Grade 12', status: 'Pending' }
  ]);

  const handleAction = (id: number, action: 'approve' | 'reject') => {
    // Logic to approve or reject the request
    const updatedRequests = requests.map(req => 
      req.id === id ? { ...req, status: action === 'approve' ? 'Approved' : 'Rejected' } : req
    );
    setRequests(updatedRequests);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dropout Requests</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Student Name</th>
            <th className="border p-2">Student ID</th>
            <th className="border p-2">Grade</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="border p-2">{request.name}</td>
              <td className="border p-2">{request.studentID}</td>
              <td className="border p-2">{request.grade}</td>
              <td className="border p-2">{request.status}</td>
              <td className="border p-2">
                <button 
                  className="bg-green-500 text-white p-2 mr-2 rounded"
                  onClick={() => handleAction(request.id, 'approve')}
                >
                  Approve
                </button>
                <button 
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={() => handleAction(request.id, 'reject')}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
