import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from "../../firebaseConfig";

interface StudentData {
  firstName: string;
  lastName: string;
  lrn: string;
  grade: string;
  educationLevel: string;
  section: string;
  strand?: string;
}

const DropoutForm = () => {
  const [enrolledStudents, setEnrolledStudents] = useState<StudentData[]>([]);
  const [selectedStudentLRN, setSelectedStudentLRN] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    LRN: '',
    grade: '',
    reason: '',
    parentContact: '',
  });
  
  const [dropoutList, setDropoutList] = useState<any[]>([]);

  useEffect(() => {
    fetchEnrollmentData();
    fetchDropoutRequests();
  }, []);

  // Fetches enrollment data from Firestore
  const fetchEnrollmentData = async () => {
    const data: StudentData[] = [];

    // Fetch junior high enrollments
    const juniorGradesSnapshot = await getDocs(collection(db, "enrollments/juniorHigh/grades"));
    for (const gradeDoc of juniorGradesSnapshot.docs) {
      const sectionsSnapshot = await getDocs(collection(gradeDoc.ref, 'sections'));
      for (const sectionDoc of sectionsSnapshot.docs) {
        const studentsSnapshot = await getDocs(collection(sectionDoc.ref, 'students'));
        studentsSnapshot.forEach((studentDoc: QueryDocumentSnapshot) => {
          data.push({
            ...studentDoc.data(),
            educationLevel: 'junior',
            grade: gradeDoc.id,
            section: sectionDoc.id,
          } as StudentData);
        });
      }
    }

    // Fetch senior high enrollments
    const seniorStrandsSnapshot = await getDocs(collection(db, "enrollments/seniorHigh/strands"));
    for (const strandDoc of seniorStrandsSnapshot.docs) {
      const sectionsSnapshot = await getDocs(collection(strandDoc.ref, 'sections'));
      for (const sectionDoc of sectionsSnapshot.docs) {
        const studentsSnapshot = await getDocs(collection(sectionDoc.ref, 'students'));
        studentsSnapshot.forEach((studentDoc: QueryDocumentSnapshot) => {
          const [strand, semester] = strandDoc.id.split('_');
          data.push({
            ...studentDoc.data(),
            educationLevel: 'senior',
            strand,
            section: sectionDoc.id,
          } as StudentData);
        });
      }
    }

    setEnrolledStudents(data);
  };

  // Function to fetch dropout requests from Firestore
  const fetchDropoutRequests = async () => {
    const querySnapshot = await getDocs(collection(db, "dropoutRequests"));
    const requests: any[] = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    setDropoutList(requests);
  };

  const handleStudentSelection = (lrn: string) => {
    const selectedStudent = enrolledStudents.find(student => student.lrn === lrn);
    if (selectedStudent) {
      setFormData({
        name: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
        LRN: selectedStudent.lrn,
        grade: selectedStudent.grade,
        reason: '',
        parentContact: '',
      });
    }
    setSelectedStudentLRN(lrn);
  };

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
        LRN: '',
        grade: '',
        reason: '',
        parentContact: '',
      });
      setSelectedStudentLRN('');
    } catch (error) {
      console.error('Error adding dropout request:', error);
    }
  };

  return (
    <div className="flex-1 p-5 bg-gradient-to-br from-blue-50 to-green-50 text-gray-700 min-h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Dropout Form</h2>
          <form onSubmit={handleSubmit}>
            <label className="font-bold block mb-2 text-gray-600">Select Student (LRN)</label>
            <select
              value={selectedStudentLRN}
              onChange={(e) => handleStudentSelection(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="">Select a student by LRN</option>
              {enrolledStudents.map((student) => (
                <option key={student.lrn} value={student.lrn}>
                  {student.lrn} - {student.firstName} {student.lastName}
                </option>
              ))}
            </select>

            <label className="font-bold block mb-2 text-gray-600">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
              placeholder="Enter student name"
              required
              readOnly
            />

            <label className="font-bold block mb-2 text-gray-600">LRN</label>
            <input
              type="text"
              value={formData.LRN}
              onChange={(e) => setFormData({ ...formData, LRN: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
              required
              readOnly
            />

            <label className="font-bold block mb-2 text-gray-600">Grade</label>
            <input
              type="text"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
              required
              readOnly
            />

            <label className="font-bold block mb-2 text-gray-600">Reason for Dropout</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
              placeholder="Reason for dropout"
              required
            />

            <label className="font-bold block mb-2 text-gray-600">Parent Contact</label>
            <input
              type="text"
              value={formData.parentContact}
              onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
              placeholder="Parent's contact information"
              required
            />

            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Submit Dropout Request
            </button>
          </form>
        </div>

        {/* Dropout List */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Dropout Requests</h2>
          <ul>
            {dropoutList.map((request) => (
              <li key={request.id} className="mb-4 p-4 border-b">
                <strong>{request.name}</strong> - LRN: {request.LRN} - Grade: {request.grade}
                <p>Reason: {request.reason}</p>
                <p>Parent Contact: {request.parentContact}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DropoutForm;
