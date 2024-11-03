import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface Student {
  id: string;
  name: string;
  section: string;
  gradeLevel: string;
}

const ClassRoster: React.FC = () => {
  const [gradeLevel, setGradeLevel] = useState('');
  const [section, setSection] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch students based on selected grade level and section
  useEffect(() => {
    const fetchStudents = async () => {
      if (gradeLevel && section) {
        setIsLoading(true);
        setError('');
        try {
          const studentsRef = collection(db, 'students');
          const q = query(
            studentsRef,
            where('gradeLevel', '==', gradeLevel),
            where('section', '==', section)
          );
          const snapshot = await getDocs(q);
          const studentsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })) as Student[];
          setStudents(studentsData);
        } catch (error) {
          console.error('Error fetching students:', error);
          setError('Failed to fetch roster data.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchStudents();
  }, [gradeLevel, section]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Class Foster</h1>

      <div className="max-w-md w-full mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block mb-2">
          <span className="font-bold text-gray-900">Grade Level</span>
          <select
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className="w-full p-2 border rounded bg-white text-gray-900"
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

        <label className="block mb-2">
          <span className="font-bold text-gray-900">Section</span>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full p-2 border rounded bg-white text-gray-900"
          >
            <option value="">Select Section</option>
            <option value="Section A">Section A</option>
            <option value="Section B">Section B</option>
            <option value="Section C">Section C</option>
          </select>
        </label>
      </div>

      {isLoading && <p className="text-gray-900">Loading roster...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {students.length > 0 && (
        <table className="min-w-full bg-white text-gray-900 rounded shadow-md overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b text-left font-bold">Student ID</th>
              <th className="py-2 px-4 border-b text-left font-bold">Name</th>
              <th className="py-2 px-4 border-b text-left font-bold">Section</th>
              <th className="py-2 px-4 border-b text-left font-bold">Grade Level</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-100 transition duration-150">
                <td className="py-2 px-4 border-b">{student.id}</td>
                <td className="py-2 px-4 border-b">{student.name}</td>
                <td className="py-2 px-4 border-b">{student.section}</td>
                <td className="py-2 px-4 border-b">{student.gradeLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {students.length === 0 && !isLoading && gradeLevel && section && (
        <p className="text-gray-900 text-center mt-4">No students found for this grade level and section.</p>
      )}
    </div>
  );
};

export default ClassRoster;
