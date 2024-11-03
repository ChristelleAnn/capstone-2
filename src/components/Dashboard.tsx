import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Adjust the import according to your file structure
import ClassRoster from "./ClassRoster";

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<string[]>([]);

  // Fetch data from Firestore
  const fetchData = async () => {
    try {
      // Fetch recent transactions
      const transactionsSnapshot = await getDocs(collection(db, "transactions"));
      const recentTransactionsData = transactionsSnapshot.docs.map((doc) => doc.data() as any);
      const recentTransactionDates = recentTransactionsData.map((item) => item.date); // Assuming there's a date field
      setRecentTransactions(recentTransactionDates.slice(0, 5)); // Get the last 5 transactions

      // Fetch total students
      const studentsSnapshot = await getDocs(collection(db, "students"));
      setTotalStudents(studentsSnapshot.size);

      // Fetch total employees
      const employeesSnapshot = await getDocs(collection(db, "employees"));
      setTotalEmployees(employeesSnapshot.size);

      // Fetch total requests
      const requestsSnapshot = await getDocs(collection(db, "form_requests")); // Updated to fetch from 'form_requests'
      setTotalRequests(requestsSnapshot.size);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-1 p-8 bg-gray-100 text-gray-800">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-700">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back! Here is your overview.</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card for Total Students */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold">Total Students</h2>
          <p className="text-3xl font-bold mt-2">{totalStudents}</p>
        </div>

        {/* Card for Total Employees */}
        <div className="p-6 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold">Total Employees</h2>
          <p className="text-3xl font-bold mt-2">{totalEmployees}</p>
        </div>

        {/* Card for Total Requests */}
        <div className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold">Total Requests</h2>
          <p className="text-3xl font-bold mt-2">{totalRequests}</p>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="mt-8 p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Transactions</h2>
        <ul className="space-y-3">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((date, index) => (
              <li key={index} className="flex justify-between text-gray-600">
                <span>Transaction {index + 1}</span>
                <span>{date}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No recent transactions</li>
          )}
        </ul>
      </div>

      {/* Class Roster Section */}
      <div className="mt-8 p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Class Roster</h2>
        <ClassRoster />
      </div>
    </div>
  );
};

export default Dashboard;
