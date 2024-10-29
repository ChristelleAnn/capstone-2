
const Dashboard = () => {
  return (
    <div className="flex-1 p-5 bg-white text-gray">
      <h1 className="text-3xl font-bold">Overview</h1>
      <div className="grid grid-cols-3 gap-4 mt-2">
        {/* Card for Total Students */}
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
          <h2 className="text-lg text-white">Total Students</h2>
        </div>
        {/* Card for Total Employees */}
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
          <h2 className="text-lg text-white">Total Employees</h2>
        </div>
        {/* Card for Total Requests */}
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
          <h2 className="text-lg text-white">Total Requests</h2>
        </div>
      </div>

      {/* Graph Section */}
      <div className="mt-4">
        <h2 className="text-lg">Student's  Performance </h2>
        {/* Here you can use a chart library like Chart.js or Recharts */}
        <div className="h-60 bg-gray-800 rounded-lg mt-2"></div> {/* Placeholder for chart */}
      </div>

      {/* Last Transactions Section */}
      <div className="mt-4">
        <h2 className="text-lg">Transactions</h2>
        <ul className="bg-gray-800 p-5 rounded-lg mt-2 text-white">
          {/* Replace these with actual transaction data */}
          <li>Last Transaction:  on 13 Jan 2024</li>
          <li>Pending Transaction: on 13 Jan 2024</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

