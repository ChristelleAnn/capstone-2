import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ensure this imports your Firestore setup

const Transferee: React.FC = () => {
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [section, setSection] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transferees, setTransferees] = useState<any[]>([]); // State to hold transferee data

  // Function to fetch transferees from Firestore
  const fetchTransferees = async () => {
    try {
      const transfereeCollection = collection(db, 'transferees');
      const transfereeSnapshot = await getDocs(transfereeCollection);
      const transfereeList = transfereeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransferees(transfereeList);
    } catch (error) {
      console.error('Error fetching transferees: ', error);
    }
  };

  // Fetch transferees on component mount
  useEffect(() => {
    fetchTransferees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save the transferee information to Firestore
      await addDoc(collection(db, 'transferees'), {
        name,
        gradeLevel,
        section,
        previousSchool,
      });
      setMessage('Transferee added successfully!');
      // Clear the form fields
      setName('');
      setGradeLevel('');
      setSection('');
      setPreviousSchool('');
      // Re-fetch transferees after adding a new one
      fetchTransferees();
    } catch (error) {
      console.error('Error adding transferee: ', error);
      setMessage('Error adding transferee.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Transferees</h1>
      <div className="grid grid-cols-2 gap-8">
        {/*Add Transferee */}
        <form onSubmit={handleSubmit} className="w-full bg-gray-900 max-w-lg mx-auto p-8 rounded shadow-md">
          <div className="mb-2">
            <label className="block mb-2">
              <span className="font-bold text-white">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mb-4 w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
                placeholder="Your full name"
              />
            </label>
          </div>

          <div className="mb-2">
            <label className="block mb-2">
              <span className="font-bold text-white">Grade Level</span>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                required
                className="mb-4 w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
              >
                <option value="">Select Grade Level</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </label>
          </div>

          <div className="mb-2">
            <label className="block mb-2">
              <span className="font-bold text-white">Section</span>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                required
                className="mb-4 w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
                placeholder="Your Previous Section Name"
              />
            </label>
          </div>

          <div className="mb-2">
            <label className="block mb-2">
              <span className="font-bold text-white">Previous School</span>
              <input
                type="text"
                value={previousSchool}
                onChange={(e) => setPreviousSchool(e.target.value)}
                required
                className="mb-2 w-full p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
                placeholder="Your Previous School Name"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mx-auto block w-full bg-blue-500 text-white font-bold py-2 rounded shadow hover:bg-blue-600 transition duration-200"
          >
            {isLoading ? 'Adding...' : 'Add Transferee'}
          </button>

          {message && <p className="mt-4 text-center text-green-500">{message}</p>}
        </form>

        {/* Transferee List */}
        <div className="bg-gray-900 p-8 rounded shadow-md">
          <h2 className="text-2xl font-bold text-white mb-4">Transferee List</h2>
          <ul className="space-y-2">
            {transferees.length > 0 ? (
              transferees.map((transferee) => (
                <li key={transferee.id} className="bg-gray-700 p-4 rounded">
                  <p className="font-bold text-white">{transferee.name}</p>
                  <p className="text-gray-400">Grade Level: {transferee.gradeLevel}</p>
                  <p className="text-gray-400">Section: {transferee.section}</p>
                  <p className="text-gray-400">Previous School: {transferee.previousSchool}</p>
                </li>
              ))
            ) : (
              <p className="text-gray-400">No transferees found.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Transferee;
