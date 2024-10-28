import React, { useState } from 'react';
import { db } from '../../firebaseConfig'; // Ensure this imports your Firestore setup

const Transferee: React.FC = () => {
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [section, setSection] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save the transferee information to Firestore
      await db.collection('transferees').add({
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
    } catch (error) {
      console.error('Error adding transferee: ', error);
      setMessage('Error adding transferee.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-100 to-green-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Transferees</h1>

      <form onSubmit={handleSubmit} className="bg-white bg-opacity-50 max-w-lg mx-auto bg-white p-8 rounded shadow-md">
        <div className="mb-2">
          <label className="block mb-2">
            <span className="font-bold text-gray-700">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mb-4 p-2 border rounded"
              placeholder="Your full name"
            />
          </label>
        </div>

        <div className="mb-2">
          <label className="block mb-2">
            <span className="font-bold text-gray-700">Grade Level</span>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              required
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="">Select Grade Level</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
              {/* Add more grade levels as needed */}
            </select>
          </label>
        </div>

        <div className="mb-2">
          <label className="block mb-2">
            <span className="font-bold text-gray-700">Section</span>
            <input
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
              className="w-full mb-4 p-2 border rounded"
              placeholder="Your Previous Section Name"
            />
          </label>
        </div>

        <div className="mb-2">
          <label className="block mb-2">
            <span className="font-bold text-gray-700">Previous School</span>
            <input
              type="text"
              value={previousSchool}
              onChange={(e) => setPreviousSchool(e.target.value)}
              required
              className="w-full mb-4 p-2 border rounded"
              placeholder="Your Previous School Name"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white font-bold py-2 rounded shadow hover:bg-blue-600 transition duration-200"
        >
          {isLoading ? 'Adding...' : 'Add Transferee'}
        </button>

        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </form>
    </div>
  );
};

export default Transferee;
