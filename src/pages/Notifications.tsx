import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 

interface Request {
  id: string;
  firstName: string;
  middleInitial?: string; 
  lastName: string;
  suffix?: string; 
  depedForm: string;
  lrn: string;
  contactNumber: string;
  email: string;
  strand: string;
  tvlSubOption?: string;
  yearGraduated?: string;
  gradeLevel?: string;
  status: string;
  timestamp: any;
}

// Format the timestamp
const formatTimestamp = (timestamp: any) => {
  if (!timestamp) return 'No timestamp available';
  
  try {
    const date = timestamp.toDate(); 
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  } catch (error) {
    console.error('Error formatting timestamp: ', error);
    return 'Invalid date';
  }
};

// Get the current school year
const getCurrentSchoolYear = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are zero-indexed
  if (currentMonth >= 6) {
    return `${currentYear}-${currentYear + 1}`;
  } else {
    return `${currentYear - 1}-${currentYear}`;
  }
};

// Get today's date in a readable format
const getFormattedDate = () => {
  const today = new Date();
  return today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const Notifications: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  // Fetch the requests from Firestore when the component is mounted
  useEffect(() => {
    const fetchRequests = async () => {
      const requestQuery = query(collection(db, 'form_requests'));

      onSnapshot(requestQuery, (querySnapshot) => {
        const requestsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          firstName: doc.data().firstName,
          middleInitial: doc.data().middleInitial || '', 
          lastName: doc.data().lastName,
          suffix: doc.data().suffix || '', 
          depedForm: doc.data().depedForm,
          lrn: doc.data().lrn !== 'N/A' ? doc.data().lrn : '',
          contactNumber: doc.data().contactNumber !== 'N/A' ? doc.data().contactNumber : '',
          email: doc.data().email !== 'N/A' ? doc.data().email : '',
          strand: doc.data().strand !== 'N/A' ? doc.data().strand : '',
          tvlSubOption: doc.data().tvlSubOption || null, 
          yearGraduated: doc.data().yearGraduated !== 'N/A' ? doc.data().yearGraduated : '',
          gradeLevel: doc.data().gradeLevel !== 'N/A' ? doc.data().gradeLevel : '',
          status: doc.data().status || 'pending',
          timestamp: doc.data().timestamp ? formatTimestamp(doc.data().timestamp) : 'N/A',
        }));
        setRequests(requestsData);
      });
    };

    fetchRequests();
  }, []);

  const markAsDone = async (id: string) => {
    try {
      const requestDoc = doc(db, 'form_requests', id);
      await updateDoc(requestDoc, {
        status: 'done',
      });
      console.log('Status updated to done');
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-4xl font-extrabold mb-6 text-gray-900 text-center">
          Certificate Request List
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-sm w-64 mx-auto bg-white border-collapse border border-gray-200 rounded-sm shadow-sm">
            <thead>
              <tr className=" bg-gray-200">
                <th className="text-left px-4 py-2 text-gray-700 font-bold">Full Name</th>
                <th className="text-left px-4 py-2 text-gray-700 font-bold">Form/Certificate</th>
                <th className="text-left px-4 py-2 text-gray-700 font-bold">LRN</th>
                <th className="text-left px-4 py-2 text-gray-700 font-bold">Contact</th>
                <th className="text-left px-4 py-2 text-gray-700 font-bold">Email</th>
                <th className="text-left px-4 py-2 text-gray-700 font-bold">Strand/Track</th>
                <th className="text-left px-4 py-2 text-gray-700 font-bold">Year Graduated</th>
                <th className="text-left px-4 py-2 text-gray-700 font-bold">Grade Level</th>
                <th className="text-left px-4 py-2 text-gray-700 font-bold">Status</th>
                <th className="text-left px-4 py-2 text-gray-700 font-bold">Timestamp</th>
                <th className="text-left px-4 py-2 text-gray-700 font-bold">Action</th>
                <th className="text-left px-4 py-2 text-gray-700 font-bold">Generate Data</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center px-2 py-1 text-gray-500">
                    No requests found.
                  </td>
                </tr>
              ) : (
                requests.map((request, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-2 py-1">
                      {request.firstName !== 'N/A' && request.firstName}{' '}
                      {request.middleInitial !== 'N/A' && request.middleInitial}{' '}
                      {request.lastName !== 'N/A' && request.lastName}{' '}
                      {request.suffix && request.suffix !== 'N/A' && `${request.suffix}`}
                    </td>

                    <td className="px-2 py-1">
                      {request.depedForm}
                    </td>
                    <td className="px-2 py-1">{request.lrn}</td>
                    <td className="px-2 py-1">{request.contactNumber}</td>
                    <td className="px-2 py-1">
                      <a href={`mailto:${request.email}`} className="text-blue-500 hover:underline">
                        {request.email}
                      </a>
                    </td>
                    <td className="px-2 py-1">
                      {request.strand}
                      {request.strand === 'TVL' && request.tvlSubOption ? (
                        <span className="block text-gray-500 text-sm">
                          ({request.tvlSubOption})
                        </span>
                      ) : null}
                    </td>
                    <td className="px-2 py-1">{request.yearGraduated}</td>
                    <td className="px-2 py-1">{request.gradeLevel}</td>
                    <td
                      className={`px-2 py-1 font-semibold text-center rounded-md ${
                        request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-600'
                          : request.status === 'accepted'
                          ? 'bg-green-100 text-green-600'
                          : request.status === 'done'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {request.status}
                    </td>
                    <td className="px-2 py-1">{request.timestamp}</td>
                    <td className="px-2 py-1">
                      {request.status === 'accepted' && (
                        <button
                          onClick={() => markAsDone(request.id)}
                          className="bg-blue-500 text-white px-2 py-1 rounded-md shadow-md hover:bg-blue-600 transition-colors"
                        >
                          Mark as Done
                        </button>
                      )}
                    </td>
                    <td className="px-2 py-1">
                      {request.depedForm === 'Certificate of Enrollment' && (
                        <div>
                          <strong>Full Name:</strong> {request.firstName} {request.middleInitial}{' '}
                          {request.lastName} {request.suffix && request.suffix !== 'N/A' && request.suffix}
                          <br />
                          <strong>Date:</strong> {getFormattedDate()}
                          <br />
                          <strong>School Year:</strong> {getCurrentSchoolYear()}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Notifications;