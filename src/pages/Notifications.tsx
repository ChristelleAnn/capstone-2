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

const getCurrentSchoolYear = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  return currentMonth >= 6 ? `${currentYear}-${currentYear + 1}` : `${currentYear - 1}-${currentYear}`;
};

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
    <div className="flex items-center justify-center min-h-screen bg-white text-white">
      <div className="w-full max-w-7xl px-4 py-4">
        <div className="bg-gray-800 shadow-lg rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Certificate Request List</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 border border-gray-700 rounded-md shadow-md">
              <thead>
                <tr className="bg-gray-700">
                  {['Full Name', 'Form/Certificate', 'LRN', 'Contact', 'Email', 'Strand/Track', 'Year Graduated', 'Grade Level', 'Status', 'Timestamp', 'Action', 'Generate Data'].map((heading) => (
                    <th key={heading} className="px-2 py-3 text-left text-gray-300 font-semibold text-sm">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="text-center py-4 text-gray-400">No requests found.</td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                      <td className="px-2 py-2 text-sm">{`${request.firstName} ${request.middleInitial} ${request.lastName} ${request.suffix}`}</td>
                      <td className="px-2 py-2 text-sm">{request.depedForm}</td>
                      <td className="px-2 py-2 text-sm">{request.lrn}</td>
                      <td className="px-2 py-2 text-sm">{request.contactNumber}</td>
                      <td className="px-2 py-2 text-sm">
                        <a href={`mailto:${request.email}`} className="text-blue-400 hover:underline">
                          {request.email}
                        </a>
                      </td>
                      <td className="px-2 py-2 text-sm">
                        {request.strand}
                        {request.strand === 'TVL' && request.tvlSubOption && (
                          <span className="block text-gray-400 text-xs">({request.tvlSubOption})</span>
                        )}
                      </td>
                      <td className="px-2 py-2 text-sm">{request.yearGraduated}</td>
                      <td className="px-2 py-2 text-sm">{request.gradeLevel}</td>
                      <td className={`px-2 py-2 text-sm font-semibold text-center rounded-md ${
                        request.status === 'pending' ? 'bg-yellow-500 text-yellow-100' :
                        request.status === 'accepted' ? 'bg-green-500 text-green-100' :
                        'bg-blue-500 text-blue-100'
                      }`}>
                        {request.status}
                      </td>
                      <td className="px-2 py-2 text-sm">{request.timestamp}</td>
                      <td className="px-2 py-2 text-sm">
                        {request.status === 'accepted' && (
                          <button
                            onClick={() => markAsDone(request.id)}
                            className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition"
                          >
                            Mark as Done
                          </button>
                        )}
                      </td>
                      <td className="px-2 py-2 text-sm">
                        {request.depedForm === 'Certificate of Enrollment' && (
                          <div className="text-xs text-gray-400">
                            <strong>Full Name:</strong> {`${request.firstName} ${request.middleInitial} ${request.lastName} ${request.suffix}`}<br />
                            <strong>Date:</strong> {getFormattedDate()}<br />
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
    </div>
  );
};

export default Notifications;
