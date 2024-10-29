import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from "../../firebaseConfig";

const DropoutForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    studentID: '',
    grade: '',
    reason: '',
    parentContact: '',
  });
  
  const [dropoutList, setDropoutList] = useState<any[]>([]);

  // Function to fetch dropout requests from Firestore
  const fetchDropoutRequests = async () => {
    const querySnapshot = await getDocs(collection(db, "dropoutRequests"));
    const requests: any[] = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    setDropoutList(requests);
  };

  useEffect(() => {
    // Fetch existing dropout requests on component mount
    fetchDropoutRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Add the form data to Firestore
      await addDoc(collection(db, "dropoutRequests"), formData);
      console.log('Dropout request submitted', formData);
      
      // Fetch updated dropout list
      fetchDropoutRequests();

      // Reset form data
      setFormData({
        name: '',
        studentID: '',
        grade: '',
        reason: '',
        parentContact: '',
      });
    } catch (error) {
      console.error('Error adding dropout request:', error);
    }
  };

  return (
    <div className="min-h-full bg-white p-8 mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-gray-900 shadow-md rounded p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Dropout Request</h2>
        <form onSubmit={handleSubmit}>
          <label className="font-bold block mb-2 text-white">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mb-4 w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
            placeholder="Your full name"
            required
          />
          
          <label className="font-bold block mb-2 text-white">Student ID</label>
          <input
            type="text"
            value={formData.studentID}
            onChange={(e) => setFormData({ ...formData, studentID: e.target.value })}
            className="mb-4 w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
            placeholder="Your student ID"
            required
          />

          <label className="font-bold block mb-2 text-white">Grade/Year Level</label>
          <select
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            className="mb-4 w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
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

          <label className="font-bold block mb-2 text-white">Reason for Dropping Out</label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="mb-4 w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
            placeholder="Provide your reason"
            rows={4}
            required
          ></textarea>

          <label className="font-bold block mb-2 text-white">Parent/Guardian Contact Information</label>
          <input
            type="text"
            value={formData.parentContact}
            onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
            className="mb-4 w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
            placeholder="Contact number of parent/guardian"
            required
          />

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Submit Dropout Request
          </button>
        </form>
      </div>

      {/* Dropout List Section */}
      <div className="bg-gray-900 shadow-md rounded p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Dropout List</h2>
        {dropoutList.length > 0 ? (
          <ul className="space-y-2 ">
            {dropoutList.map((dropout) => (
              <li key={dropout.id} className="border-b pb-2 text-white">
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
