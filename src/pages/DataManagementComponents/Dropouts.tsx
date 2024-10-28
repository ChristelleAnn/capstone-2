import React, { useState } from 'react';

const DropoutForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    studentID: '',
    grade: '',
    reason: '',
    parentContact: '',
  });
  
  const [dropoutList, setDropoutList] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to send dropout request to the backend
    console.log('Dropout request submitted', formData);
    
    // Add form data to the dropout list
    setDropoutList([...dropoutList, formData]);
    
    // Reset form data
    setFormData({
      name: '',
      studentID: '',
      grade: '',
      reason: '',
      parentContact: '',
    });
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-100 to-green-100 p-8 mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className=" bg-white bg-opacity-50 shadow-md rounded p-6">
        <h2 className="text-2xl font-bold mb-4">Dropout Request</h2>
        <form onSubmit={handleSubmit}>
          <label className="font-bold block mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            placeholder="Your full name"
            required
          />
          
          <label className="font-bold block mb-2">Student ID</label>
          <input
            type="text"
            value={formData.studentID}
            onChange={(e) => setFormData({ ...formData, studentID: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            placeholder="Your student ID"
            required
          />

          <label className="font-bold block mb-2">Grade/Year Level</label>
          <select
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            required
          >
            <option value="">Select your grade</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>

          <label className="font-bold block mb-2">Reason for Dropping Out</label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            placeholder="Provide your reason"
            rows={4}
            required
          ></textarea>

          <label className="font-bold block mb-2">Parent/Guardian Contact Information</label>
          <input
            type="text"
            value={formData.parentContact}
            onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            placeholder="Contact number of parent/guardian"
            required
          />

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Submit Dropout Request
          </button>
        </form>
      </div>

      {/* Dropout List Section */}
      <div className="bg-white bg-opacity-50 shadow-md rounded p-6">
        <h2 className="text-2xl font-bold mb-4">Dropout List</h2>
        {dropoutList.length > 0 ? (
          <ul className="space-y-2">
            {dropoutList.map((dropout, index) => (
              <li key={index} className="border-b pb-2">
                <p><strong>Name:</strong> {dropout.name}</p>
                <p><strong>Student ID:</strong> {dropout.studentID}</p>
                <p><strong>Grade:</strong> {dropout.grade}</p>
                <p><strong>Reason:</strong> {dropout.reason}</p>
                <p><strong>Contact:</strong> {dropout.parentContact}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No dropout requests submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default DropoutForm;
