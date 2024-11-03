import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from "../../firebaseConfig";

const DropoutForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    LRN: '',
    grade: '',
    reason: '',
    parentContact: '',
  });
  
  const [dropoutList, setDropoutList] = useState<any[]>([]);

  // Function to fetch dropout requests from Firestore and update dropoutList
  const fetchDropoutRequests = async () => {
    const querySnapshot = await getDocs(collection(db, "students"));
    const requests: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.isDroppedOut) {
        requests.push({ id: doc.id, ...data });
      }
    });
    setDropoutList(requests);
  };

  useEffect(() => {
    fetchDropoutRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, "dropoutRequests"), formData);
      console.log('Dropout request submitted', formData);
      
      const studentQuery = await getDocs(collection(db, "students"));
      studentQuery.forEach(async (studentDoc) => {
        const studentData = studentDoc.data();
        if (studentData.LRN === formData.LRN) {
          await updateDoc(doc(db, "students", studentDoc.id), { isDroppedOut: true });
        }
      });

      fetchDropoutRequests();
      setFormData({
        name: '',
        LRN: '',
        grade: '',
        reason: '',
        parentContact: '',
      });
    } catch (error) {
      console.error('Error adding dropout request:', error);
    }
  };

  return (
    <div className="min-h-full bg-gray-100 p-8 mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Dropout Request</h2>
        <form onSubmit={handleSubmit}>
          <label className="font-semibold block mb-2 text-gray-700">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mb-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter full name"
            required
          />
          
          <label className="font-semibold block mb-2 text-gray-700">Learner Reference Number (LRN)</label>
          <input
            type="text"
            value={formData.LRN}
            onChange={(e) => setFormData({ ...formData, LRN: e.target.value })}
            className="mb-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter LRN"
            required
          />

          <label className="font-semibold block mb-2 text-gray-700">Grade/Year Level</label>
          <select
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            className="mb-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Grade Level</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>

          <label className="font-semibold block mb-2 text-gray-700">Reason for Dropping Out</label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="mb-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Provide your reason"
            rows={4}
            required
          ></textarea>

          <label className="font-semibold block mb-2 text-gray-700">Parent/Guardian Contact Information</label>
          <input
            type="text"
            value={formData.parentContact}
            onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
            className="mb-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contact number of parent/guardian"
            required
          />

          <button type="submit" className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-500 transition duration-200">
            Submit Dropout Request
          </button>
        </form>
      </div>

      {/* Dropout List Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Dropout List</h2>
        {dropoutList.length > 0 ? (
          <ul className="space-y-4">
            {dropoutList.map((dropout) => (
              <li key={dropout.id} className="border-b pb-4 text-gray-700">
                <p><strong>Name:</strong> {dropout.name}</p>
                <p><strong>LRN:</strong> {dropout.LRN}</p>
                <p><strong>Grade:</strong> {dropout.grade}</p>
                <p><strong>Reason:</strong> {dropout.reason}</p>
                <p><strong>Contact:</strong> {dropout.parentContact}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No dropout requests submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default DropoutForm;
