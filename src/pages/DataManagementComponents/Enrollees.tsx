import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, QueryDocumentSnapshot } from 'firebase/firestore';
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
  
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedStrand, setSelectedStrand] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [availableSections, setAvailableSections] = useState<string[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<EnrollmentData[]>([]);

  useEffect(() => {
    fetchEnrollmentData();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [selectedGrade, selectedStrand, selectedSection, enrollmentData]);

  useEffect(() => {
    if (selectedGrade === '7') {
      fetchGrade7Sections();
    } else {
      fetchSections();
    }
  }, [selectedGrade, selectedStrand]);

  const fetchEnrollmentData = async () => {
    const data: EnrollmentData[] = [];

    // Fetch junior high enrollments
    const juniorGradesSnapshot = await getDocs(collection(db, "enrollments/juniorHigh/grades"));
    for (const gradeDoc of juniorGradesSnapshot.docs) {
      const sectionsSnapshot = await getDocs(collection(gradeDoc.ref, 'sections'));
      for (const sectionDoc of sectionsSnapshot.docs) {
        const studentsSnapshot = await getDocs(collection(sectionDoc.ref, 'students'));
        studentsSnapshot.forEach((studentDoc: QueryDocumentSnapshot) => {
          data.push({ ...studentDoc.data(), educationLevel: 'junior', grade: gradeDoc.id, section: sectionDoc.id } as EnrollmentData);
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
          data.push({ ...studentDoc.data(), educationLevel: 'senior', strand, semester, section: sectionDoc.id } as EnrollmentData);
        });
      }
    }

    setEnrollmentData(data);
  };

  const fetchGrade7Sections = async () => {
    const sectionsPath = `enrollments/juniorHigh/grades/7/sections`;
    const sectionsSnapshot = await getDocs(collection(db, sectionsPath));
    const sections = sectionsSnapshot.docs.map(doc => doc.id);
    setAvailableSections(sections);
  };

  const fetchSections = async () => {
    if (selectedGrade || selectedStrand) {
      let sectionsPath: string;
      if (selectedGrade) {
        sectionsPath = `enrollments/juniorHigh/grades/${selectedGrade}/sections`;
      } else {
        sectionsPath = `enrollments/seniorHigh/strands/${selectedStrand}_${semester}/sections`;
      }

      const sectionsSnapshot = await getDocs(collection(db, sectionsPath));
      const sections = sectionsSnapshot.docs.map(doc => doc.id);
      setAvailableSections(sections);
    } else {
      setAvailableSections([]);
    }
  };

  const filterStudents = () => {
    let filtered = enrollmentData;

    if (selectedGrade) {
      filtered = filtered.filter(student => student.grade === selectedGrade && student.educationLevel === 'junior');
    } else if (selectedStrand) {
      filtered = filtered.filter(student => student.strand === selectedStrand && student.educationLevel === 'senior');
    }

    if (selectedSection) {
      filtered = filtered.filter(student => student.section === selectedSection);
    }

    setFilteredStudents(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !birthDate || !lrn || !section) {
      alert("Please fill in all required fields.");
      return;
    }

    if (educationLevel === 'junior' && !grade) {
      alert("Please select a grade for Junior High School.");
      return;
    }

    if (educationLevel === 'senior' && (!strand || !semester)) {
      alert("Please select a strand and semester for Senior High School.");
      return;
    }

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
      let collectionPath: string;
      if (educationLevel === 'junior') {
        collectionPath = `enrollments/juniorHigh/grades/${grade}/sections`;
      } else {
        collectionPath = `enrollments/seniorHigh/strands/${strand}_${semester}/sections`;
      }

      const sectionsCollectionRef = collection(db, collectionPath);
      const sectionDocRef = doc(sectionsCollectionRef, section);
      const studentsCollectionRef = collection(sectionDocRef, 'students');
      
      const newStudentDocRef = doc(studentsCollectionRef);
      await setDoc(newStudentDocRef, newEnrollment);
      
      alert("Student enrolled successfully!");
      fetchEnrollmentData();
      resetForm();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error enrolling student: " + (error instanceof Error ? error.message : String(error)));
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
  };

  return (
    <div className="flex max-w-5xl mx-auto mt-10 p-6 space-x-8">
      <div className="w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Enroll Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block mb-2">First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter First Name"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block mb-2">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter Last Name"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="middleName" className="block mb-2">Middle Name</label>
            <input
              id="middleName"
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Enter Middle Name"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="birthDate" className="block mb-2">Birth Date</label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="lrn" className="block mb-2">LRN</label>
              <input
                id="lrn"
                type="text"
                value={lrn}
                onChange={(e) => setLrn(e.target.value)}
                placeholder="Enter LRN"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="educationLevel" className="block mb-2">Education Level</label>
            <select
              id="educationLevel"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="junior">Junior High School</option>
              <option value="senior">Senior High School</option>
            </select>
          </div>
          {educationLevel === 'junior' && (
            <div>
              <label htmlFor="juniorGrade" className="block mb-2">Grade</label>
              <select
                id="juniorGrade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full p-2 border rounded"
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
                <label htmlFor="strand" className="block mb-2">Strand</label>
                <select
                  id="strand"
                  value={strand}
                  onChange={(e) => setStrand(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Strand</option>
                  {['STEM', 'GAS', 'TVL', 'ABM'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="semester" className="block mb-2">Semester</label>
                <select
                  id="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as Semester)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="1st semester">1st Semester</option>
                  <option value="2nd semester">2nd Semester</option>
                </select>
              </div>
            </>
          )}
          <div>
            <label htmlFor="section" className="block mb-2">Section</label>
            <input
              id="section"
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="Enter Section"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Submit Enrollment
          </button>
        </form>
      </div>

      <div className="w-1/2">
        <h2 className="text-xl font-semibold mb-4">Enrolled Student List</h2>
        
        <h3 className="text-lg font-semibold mb-2">Junior High</h3>
        <div className="mb-4">
          <label htmlFor="juniorGradeDropdown" className="block bg-gray-500 text-white p-2 rounded-t">
            Grade Level
          </label>
          <select
            id="juniorGradeDropdown"
            className="w-full bg-gray-200 text-gray-700 p-2 rounded-b appearance-none"
            value={selectedGrade}
            onChange={(e) => {
              setSelectedGrade(e.target.value);
              setSelectedStrand('');
              setSelectedSection('');
            }}
          >
            <option value="">-- Select Grade --</option>
            {['7', '8', '9', '10'].map((grade) => (
              <option key={grade} value={grade}>{`Grade ${grade}`}</option>
            ))}
          </select>
        </div>

        <h3 className="text-lg font-semibold mb-2">Senior High</h3>
        <div className="mb-4">
          <label htmlFor="seniorStrandDropdown" className="block bg-gray-500 text-white p-2 rounded-t">
            Strand/Track
          </label>
          <select
            id="seniorStrandDropdown"
            className="w-full bg-gray-200 text-gray-700 p-2 rounded-b appearance-none"
            value={selectedStrand}
            onChange={(e) => {
              setSelectedStrand(e.target.value);
              setSelectedGrade('');
              setSelectedSection('');
            }}
          >
            <option value="">-- Select  Strand/Track --</option>
            {['STEM', 'GAS', 'TVL', 'ABM'].map((strand) => (
              <option key={strand} value={strand}>{strand}</option>
            ))}
          </select>
        </div>

        {(selectedGrade || selectedStrand) && (
          <div className="mb-4">
            <label htmlFor="sectionDropdown" className="block bg-gray-500 text-white p-2 rounded-t">
              Section
            </label>
            <select
              id="sectionDropdown"
              className="w-full bg-gray-200 text-gray-700 p-2 rounded-b appearance-none"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="">-- Select Section --</option>
              {availableSections.map((section) => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>
        )}

        {filteredStudents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">LRN</th>
                  <th className="py-2 px-4 border-b">Section</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{student.firstName} {student.middleName} {student.lastName}</td>
                    <td className="py-2 px-4 border-b">{student.lrn}</td>
                    <td className="py-2 px-4 border-b">{student.section}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}