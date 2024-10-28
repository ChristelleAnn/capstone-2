import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig'; // Import Firestore configuration

interface Student {
  id: string;
  name: string;
  section: string;
  gradeLevel: string;
}

const Grades: React.FC = () => {
  const [gradeLevel, setGradeLevel] = useState('');
  const [section, setSection] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch students based on gradeLevel and section selection
  useEffect(() => {
    if (gradeLevel && section) {
      setIsLoading(true);
      const fetchStudents = async () => {
        try {
          const snapshot = await db
            .collection('students') // Assume you have a 'students' collection in Firestore
            .where('gradeLevel', '==', gradeLevel)
            .where('section', '==', section)
            .get();
          const studentsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Student[];
          setStudents(studentsData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching students:', error);
          setError('Failed to fetch student data.');
          setIsLoading(false);
        }
      };
      fetchStudents();
    }
  }, [gradeLevel, section]);

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-100 to-green-100 p-8 ">
      <h1 className="text-4xl font-bold text-center mb-8">Grades</h1>

      <div className="max-w-md mx-auto mb-8mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block mb-2">
          <span className="font-bold text-gray-700">Grade Level</span>
          <select
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">Select Grade Level</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 10">Grade 11</option>
            <option value="Grade 10">Grade 12</option>
          </select>
        </label>

        <label className="block mb-2">
          <span className="font-bold text-gray-700">Section</span>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">Select Section</option>
            <option value="Section A">Section A</option>
            <option value="Section B">Section B</option>
            <option value="Section C">Section C</option>
            {/* Add sections as needed */}
          </select>
        </label>
      </div>

      {isLoading && <p>Loading students...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {students.length > 0 && (
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Student ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Section</th>
              <th className="py-2 px-4 border-b">Grade Level</th>
              {/* Additional columns like grades can be added here */}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
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
        <p>No students found for this grade level and section.</p>
      )}
    </div>
  );
};

export default Grades;
