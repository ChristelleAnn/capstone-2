import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from "../../firebaseConfig";

type EducationLevel = 'junior' | 'senior';
type Semester = '1st semester' | '2nd semester';

interface StudentData {
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  lrn: string;
}

interface EnrollmentData extends StudentData {
  educationLevel: EducationLevel;
  grade?: string;
  section: string;
  strand?: string;
  semester?: Semester;
}

export default function EnrollmentReportForm() {
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('junior');
  const [grade, setGrade] = useState<string>('');
  const [section, setSection] = useState<string>('');
  const [strand, setStrand] = useState<string>('');
  const [semester, setSemester] = useState<Semester>('1st semester');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [lrn, setLrn] = useState<string>('');
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    fetchEnrollmentData();
  }, []);

  const fetchEnrollmentData = async () => {
    const querySnapshot = await getDocs(collection(db, "enrollments"));
    const data: EnrollmentData[] = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data() as EnrollmentData);
    });
    setEnrollmentData(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEnrollment: EnrollmentData = {
      educationLevel,
      section,
      firstName,
      lastName,
      middleName,
      birthDate,
      lrn,
      ...(educationLevel === 'junior' && { grade }),
      ...(educationLevel === 'senior' && { strand, semester }),
    };

    try {
      await addDoc(collection(db, "enrollments"), newEnrollment);
      alert("Student enrolled successfully!");
      fetchEnrollmentData();
      resetForm();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error enrolling student.");
    }
  };

  const resetForm = () => {
    setEducationLevel('junior');
    setGrade('');
    setSection('');
    setStrand('');
    setSemester('1st semester');
    setFirstName('');
    setLastName('');
    setMiddleName('');
    setBirthDate('');
    setLrn('');
    setShowForm(false);
  };

  return (
    <div className=" max-w-2xl mx-auto mt-10 p-8 bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">DepEd Student Enrollment</h1>
      
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Enroll Student
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <label htmlFor="firstName" className="block mb-2 font-bold text-white">First Name</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter First Name"
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block mb-2 font-bold text-white">Last Name</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter Last Name"
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="middleName" className="block mb-2 font-bold text-white">Middle Name</label>
            <input
              id="middleName"
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Enter Middle Name"
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
            />
          </div>
          <div>
            <label htmlFor="birthDate" className="block mb-2 font-bold text-white">Birth Date</label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="lrn" className="block mb-2 font-bold text-white">LRN</label>
            <input
              id="lrn"
              type="text"
              value={lrn}
              onChange={(e) => setLrn(e.target.value)}
              placeholder="Enter LRN"
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="educationLevel" className="block mb-2 font-bold text-white">Education Level</label>
            <select
              id="educationLevel"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
              required
            >
              <option value="junior">Junior High School</option>
              <option value="senior">Senior High School</option>
            </select>
          </div>

          {educationLevel === 'junior' && (
            <div>
              <label htmlFor="juniorGrade" className="block mb-2 font-bold text-white">Grade</label>
              <select
                id="juniorGrade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                required
              >
                <option value="">Select Grade</option>
                {['7', '8', '9', '10'].map((g) => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>
          )}

          {educationLevel === 'senior' && (
            <>
              <div>
                <label htmlFor="strand" className="block mb-2 font-bold text-white">Strand</label>
                <input
                  id="strand"
                  type="text"
                  value={strand}
                  onChange={(e) => setStrand(e.target.value)}
                  placeholder="Enter Strand"
                  className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="semester" className="block mb-2 font-bold text-white">Semester</label>
                <select
                  id="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as Semester)}
                  className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                  required
                >
                  <option value="1st semester">1st Semester</option>
                  <option value="2nd semester">2nd Semester</option>
                </select>
              </div>
            </>
          )}
          
          <div>
            <label htmlFor="section" className="block mb-2 font-bold text-white">Section</label>
            <input
              id="section"
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="Enter Section"
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
              required
            />
          </div>

          <div className="col-span-2">
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Submit Enrollment
            </button>
          </div>
        </form>
      )}

      <h2 className="text-xl font-bold mt-8 mb-4 text-center text-white">Enrolled Students</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-700 bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Education Level</th>
              <th className="px-4 py-2 border-b">Grade/Strand</th>
              <th className="px-4 py-2 border-b">Section</th>
            </tr>
          </thead>
          <tbody>
            {enrollmentData.map((student, index) => (
              <tr key={index} className="hover:bg-gray-700">
                <td className="border-t px-4 py-2">{`${student.firstName} ${student.middleName} ${student.lastName}`}</td>
                <td className="border-t px-4 py-2 capitalize">{student.educationLevel}</td>
                <td className="border-t px-4 py-2">
                  {student.educationLevel === 'junior' ? `Grade ${student.grade}` : `${student.strand} (${student.semester})`}
                </td>
                <td className="border-t px-4 py-2">{student.section}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
