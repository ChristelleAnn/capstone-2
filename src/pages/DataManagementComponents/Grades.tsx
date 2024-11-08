import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

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
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Fetch students based on gradeLevel and section selection
  useEffect(() => {
    const fetchStudents = async () => {
      if (gradeLevel && section) {
        setIsLoading(true);
        setError(''); // Reset error message before new fetch
        try {
          const studentsRef = collection(db, 'students');
          const q = query(
            studentsRef,
            where('gradeLevel', '==', gradeLevel),
            where('section', '==', section)
          );
          const snapshot = await getDocs(q);
          const studentsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Student[];
          setStudents(studentsData);
        } catch (error) {
          console.error('Error fetching students:', error);
          setError('Failed to fetch student data.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchStudents();
  }, [gradeLevel, section]);

  // Handle edit button click
  const handleEdit = (student: Student) => {
    setEditingStudent(student);
  };

  // Handle update action
  const handleUpdate = async () => {
    if (editingStudent) {
      const studentDocRef = doc(db, 'students', editingStudent.id);
      setIsLoading(true);
      setError(''); // Clear any previous errors
      try {
        await updateDoc(studentDocRef, {
          name: editingStudent.name,
          section: editingStudent.section,
          gradeLevel: editingStudent.gradeLevel,
        });
        // Update the students list with the new data
        setStudents(students.map((student) =>
          student.id === editingStudent.id ? editingStudent : student
        ));
        setEditingStudent(null); // Close the edit form
      } catch (error) {
        console.error('Error updating student:', error);
        setError('Failed to update student data.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle input change for edit form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingStudent((prev) => prev ? { ...prev, [name]: value } : null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Grades</h1>

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

      {isLoading && <p className="text-gray-900">Loading students...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {students.length > 0 && (
        <table className="min-w-full bg-white text-gray-900 rounded shadow-md overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b text-left font-bold">Student ID</th>
              <th className="py-2 px-4 border-b text-left font-bold">Name</th>
              <th className="py-2 px-4 border-b text-left font-bold">Section</th>
              <th className="py-2 px-4 border-b text-left font-bold">Grade Level</th>
              <th className="py-2 px-4 border-b text-left font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-100 transition duration-150">
                <td className="py-2 px-4 border-b">{student.id}</td>
                <td className="py-2 px-4 border-b">{student.name}</td>
                <td className="py-2 px-4 border-b">{student.section}</td>
                <td className="py-2 px-4 border-b">{student.gradeLevel}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEdit(student)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingStudent && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Edit Student</h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="name"
              value={editingStudent.name}
              onChange={handleInputChange}
              className="p-2 border rounded bg-white text-gray-900"
              placeholder="Name"
            />
            <input
              type="text"
              name="section"
              value={editingStudent.section}
              onChange={handleInputChange}
              className="p-2 border rounded bg-white text-gray-900"
              placeholder="Section"
            />
            <input
              type="text"
              name="gradeLevel"
              value={editingStudent.gradeLevel}
              onChange={handleInputChange}
              className="p-2 border rounded bg-white text-gray-900"
              placeholder="Grade Level"
            />
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditingStudent(null)}
              className="bg-gray-300 text-gray-900 py-2 px-4 rounded mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {students.length === 0 && !isLoading && gradeLevel && section && (
        <p className="text-gray-900 text-center mt-4">No students found for this grade level and section.</p>
      )}
    </div>
  );
};

export default Grades;
