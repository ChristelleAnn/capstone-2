import { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Firebase setup
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

// Define the Student type
type Student = {
  id: string;
  name: string;
  section: string;
  subject: string;
  grade: number;
};

const AdminGrades = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    // Fetch student data from Firestore
    const fetchGrades = async () => {
      const studentCollection = collection(db, "students");
      const snapshot = await getDocs(studentCollection);
      const studentData: Student[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Student[];
      setStudents(studentData);
    };
    fetchGrades();
  }, []);

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
  };
  
  const handleSave = async () => {
    if (editingStudent) {
      const studentDoc = doc(db, "students", editingStudent.id);
      await updateDoc(studentDoc, { grade: editingStudent.grade });
      setEditingStudent(null);
      alert("Grade updated successfully!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Grade Management</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Student Name</th>
              <th className="border border-gray-300 px-4 py-2">Section</th>
              <th className="border border-gray-300 px-4 py-2">Subject</th>
              <th className="border border-gray-300 px-4 py-2">Grade</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                <td className="border border-gray-300 px-4 py-2">{student.section}</td>
                <td className="border border-gray-300 px-4 py-2">{student.subject}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingStudent && editingStudent.id === student.id ? (
                    <input
                      type="number"
                      className="border border-gray-300 p-1"
                      value={editingStudent.grade}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          grade: Number(e.target.value),
                        })
                      }
                    />
                  ) : (
                    student.grade
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingStudent && editingStudent.id === student.id ? (
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(student)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGrades;
