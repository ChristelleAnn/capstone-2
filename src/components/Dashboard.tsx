import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Adjust the import according to your file structure
import ClassRoster from "./ClassRoster";

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [studentPerformance, setStudentPerformance] = useState<number[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<string[]>([]);

  // Fetch data from Firestore
  const fetchData = async () => {
    try {
      // Fetch recent transactions
      const transactionsSnapshot = await getDocs(collection(db, "transactions"));
      const recentTransactionsData = transactionsSnapshot.docs.map((doc) => doc.data() as any);
      const recentTransactionDates = recentTransactionsData.map(item => item.date); // Assuming there's a date field
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

      // Fetch student performance data
      const performanceSnapshot = await getDocs(collection(db, "performance"));
      const performanceData = performanceSnapshot.docs.map((doc) => doc.data() as any);
      setStudentPerformance(performanceData.map(item => item.score)); // Assuming there's a score field
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-1 p-5 bg-gradient-to-br from-blue-50 to-green-50 text-gray-700">
      {/* Title Section */}
      <h1 className="text-3xl font-semibold mb-5">Overview</h1>

      {/* Main Grid Section */}
      <div className="grid grid-cols-3 gap-4 mb-6"> {/* Adjusted grid columns for one less card */}
        {/* Card for Total Students */}
        <div className="bg-white p-5 rounded-2xl shadow-lg text-center">
          <h2 className="text-lg font-medium text-gray-600">Total Students</h2>
          <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
        </div>

        {/* Card for Total Employees */}
        <div className="bg-white p-5 rounded-2xl shadow-lg text-center">
          <h2 className="text-lg font-medium text-gray-600">Total Employees</h2>
          <p className="text-2xl font-bold text-gray-800">{totalEmployees}</p>
        </div>

        {/* Card for Total Requests */}
        <div className="bg-white p-5 rounded-2xl shadow-lg text-center">
          <h2 className="text-lg font-medium text-gray-600">Total Requests</h2>
          <p className="text-2xl font-bold text-gray-800">{totalRequests}</p>
        </div>
      </div>

      {/* Student Performance Section */}
      <div className="bg-white p-5 rounded-2xl shadow-lg mb-6">
        <h2 className="text-lg font-medium text-gray-600 mb-2">Student's Performance</h2>
        <div className="h-60 bg-gray-100 rounded-xl mt-2 flex items-center justify-center text-gray-400">
          {/* Placeholder for chart */}
          {/* Implement your chart here, for example using Chart.js or any other library */}
          <span>Chart Component Here</span>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white p-5 rounded-2xl shadow-lg mb-6">
        <h2 className="text-lg font-medium text-gray-600 mb-2">Recent Transactions</h2>
        <ul className="space-y-2 text-gray-800">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((date, index) => (
              <li key={index} className="flex justify-between">
                <span>Transaction {index + 1}</span>
                <span>{date}</span>
              </li>
            ))
          ) : (
            <li className="flex justify-between">
              <span>No recent transactions</span>
            </li>
          )}
        </ul>
      </div>

      {/* Class Roster Section */}
      <div className="bg-white p-5 rounded-2xl shadow-lg">
        <h2 className="text-lg font-medium text-gray-600 mb-2">Class Roster</h2>
        <ClassRoster />
      </div>
    </div>
  );
};

export default Dashboard;
