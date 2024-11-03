import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const Transferee: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    LRN: '',
    gradeLevel: '',
    section: '',
    previousSchool: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transferees, setTransferees] = useState<any[]>([]);

  // Function to fetch transferees from Firestore
  const fetchTransferees = async () => {
    try {
      const transfereeCollection = collection(db, 'transferees');
      const transfereeSnapshot = await getDocs(transfereeCollection);
      const transfereeList = transfereeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransferees(transfereeList);
    } catch (error) {
      console.error('Error fetching transferees:', error);
    }
  };

  useEffect(() => {
    fetchTransferees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save the transferee information to Firestore
      await addDoc(collection(db, 'transferees'), formData);
      setMessage('Transferee added successfully!');
      // Clear the form fields
      setFormData({
        name: '',
        LRN: '',
        gradeLevel: '',
        section: '',
        previousSchool: '',
      });
      fetchTransferees();
    } catch (error) {
      console.error('Error adding transferee:', error);
      setMessage('Error adding transferee.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 to-green-50 p-8 mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Add Transferee */}
      <div className="bg-white shadow-lg rounded p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Transferee</h2>
        <form onSubmit={handleSubmit}>
          <label className="font-bold block mb-2 text-gray-800">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mb-4 w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
            placeholder="Enter Full name"
            required
          />

          <label className="font-bold block mb-2 text-gray-800">LRN</label>
          <input
            type="text"
            value={formData.LRN}
            onChange={(e) => setFormData({ ...formData, LRN: e.target.value })}
            className="mb-4 w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
            placeholder="Enter LRN no."
            required
          />

          <label className="font-bold block mb-2 text-gray-800">Grade Level</label>
          <select
            value={formData.gradeLevel}
            onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
            className="mb-4 w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
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

          <label className="font-bold block mb-2 text-gray-800">Section</label>
          <input
            type="text"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            className="mb-4 w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
            placeholder="Enter Previous Section Name"
            required
          />

          <label className="font-bold block mb-2 text-gray-800">Previous School</label>
          <input
            type="text"
            value={formData.previousSchool}
            onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
            className="mb-4 w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
            placeholder="Enter Previous School Name"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {isLoading ? 'Adding...' : 'Add Transferee'}
          </button>

          {message && <p className="mt-4 text-center text-green-500">{message}</p>}
        </form>
      </div>

      {/* Transferee List */}
      <div className="bg-white shadow-lg rounded p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Transferee List</h2>
        <ul className="space-y-2">
          {transferees.length > 0 ? (
            transferees.map((transferee) => (
              <li key={transferee.id} className="border-b pb-2 text-gray-800">
                <p><strong>Name:</strong> {transferee.name}</p>
                <p><strong>LRN:</strong> {transferee.LRN}</p>
                <p><strong>Grade Level:</strong> {transferee.gradeLevel}</p>
                <p><strong>Section:</strong> {transferee.section}</p>
                <p><strong>Previous School:</strong> {transferee.previousSchool}</p>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No transferees found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Transferee;
