import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

type GradeLevel = {
  id: string;
  name: string;
  sections: string[];
};

type Student = {
  id: string;
  name: string;
  section: string;
  gradeLevel: string;
  grades: {
    subject: string;
    periodGrades: number[];
    finalGrade: number;
  }[];
};

const AdminGrades: React.FC = () => {
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingGrades, setEditingGrades] = useState<
    { subject: string; periodGrades: number[]; finalGrade: number }[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch grade levels and sections
        const gradeLevelsRef = collection(db, "gradeLevels");
        const gradeLevelsSnapshot = await getDocs(gradeLevelsRef);
        const fetchedGradeLevels = gradeLevelsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as GradeLevel[];

        // Fetch students
        const studentsRef = collection(db, "students");
        const studentsSnapshot = await getDocs(studentsRef);
        const fetchedStudents = studentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Student[];

        setGradeLevels(fetchedGradeLevels);
        setStudents(fetchedStudents);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGradeLevelSelect = (gradeLevel: string) => {
    setSelectedGradeLevel(gradeLevel);
    setSelectedSection(null);
    setFilteredStudents([]);
    setSelectedStudent(null);
  };

  const handleSectionSelect = (section: string) => {
    setSelectedSection(section);
    const filtered = students.filter(
      (student) =>
        student.gradeLevel === selectedGradeLevel && student.section === section
    );
    setFilteredStudents(filtered);
    setSelectedStudent(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = filteredStudents.filter((student) =>
      student.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setEditingGrades(student.grades);
  };

  const handleGradeChange = (
    subjectIndex: number,
    periodIndex: number,
    value: number
  ) => {
    if (editingGrades) {
      const updatedGrades = [...editingGrades];
      updatedGrades[subjectIndex].periodGrades[periodIndex] = value;
      updatedGrades[subjectIndex].finalGrade =
        updatedGrades[subjectIndex].periodGrades.reduce((sum, g) => sum + g, 0) /
        updatedGrades[subjectIndex].periodGrades.length;
      setEditingGrades(updatedGrades);
    }
  };

  const handleSave = async () => {
    if (selectedStudent && editingGrades) {
      try {
        const studentDoc = doc(db, "students", selectedStudent.id);
        await updateDoc(studentDoc, { grades: editingGrades });
        setSelectedStudent({ ...selectedStudent, grades: editingGrades });
        setEditingGrades(null);
        alert("Grades updated successfully!");
      } catch (err) {
        console.error("Error updating grades:", err);
        alert("Failed to update grades.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Grade Management</h1>
      {/* Grade Level and Section Selection */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Select Grade Level</h2>
        <div className="flex flex-wrap gap-2">
          {gradeLevels.map((level) => (
            <button
              key={level.id}
              className={`px-4 py-2 border rounded ${
                selectedGradeLevel === level.name ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => handleGradeLevelSelect(level.name)}
            >
              {level.name}
            </button>
          ))}
        </div>
      </div>
      {selectedGradeLevel && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Select Section</h2>
          <div className="flex flex-wrap gap-2">
            {gradeLevels
              .find((level) => level.name === selectedGradeLevel)
              ?.sections.map((section) => (
                <button
                  key={section}
                  className={`px-4 py-2 border rounded ${
                    selectedSection === section ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => handleSectionSelect(section)}
                >
                  {section}
                </button>
              ))}
          </div>
        </div>
      )}
      {/* Student Search */}
      {selectedSection && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Search Student</h2>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            className="border px-4 py-2 w-full"
            placeholder="Enter student name"
          />
        </div>
      )}
      {/* Student List */}
      {filteredStudents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold">Students</h2>
          <ul>
            {filteredStudents.map((student) => (
              <li
                key={student.id}
                className="p-2 border-b flex justify-between items-center"
              >
                <span>{student.name}</span>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleEdit(student)}
                >
                  View Grades
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* View/Edit Grades */}
      {selectedStudent && editingGrades && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Grades for {selectedStudent.name}</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Learning Areas</th>
                <th className="border px-4 py-2">1st Quarter</th>
                <th className="border px-4 py-2">2nd Quarter</th>
                <th className="border px-4 py-2">3rd Quarter</th>
                <th className="border px-4 py-2">4th Quarter</th>
                <th className="border px-4 py-2">Final Grade</th>
              </tr>
            </thead>
            <tbody>
              {editingGrades.map((grade, subjectIndex) => (
                <tr key={subjectIndex}>
                  <td className="border px-4 py-2">{grade.subject}</td>
                  {grade.periodGrades.map((periodGrade, periodIndex) => (
                    <td key={periodIndex} className="border px-4 py-2">
                      <input
                        type="number"
                        value={periodGrade}
                        onChange={(e) =>
                          handleGradeChange(subjectIndex, periodIndex, Number(e.target.value))
                        }
                        className="w-full text-center"
                      />
                    </td>
                  ))}
                  <td className="border px-4 py-2 text-center">
                    {grade.finalGrade.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleSave}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminGrades;
