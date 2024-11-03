import React from 'react';

const AboutUs: React.FC = () => {
    return (
        <div className="min-h-screen bg-[url('https://www.panaynews.net/wp-content/uploads/2019/10/DEPED-Salong-National-High-School-in-Kabankalan-City-Negros-Occidental.jpg')] bg-cover bg-center flex items-center justify-center p-8">
            <div className="w-full mx-auto bg-gray-100 bg-opacity-90 p-8 rounded-lg ">
                <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">About Us</h1>
                <p className="text-lg mb-6 text-gray-700">
                    Welcome to the <strong>Web-Based Student Record System</strong> for <strong>Valentina B. Boncan National High School</strong>. Our system is designed to modernize and streamline the student record management process, ensuring that the school administration, teachers, and students have easy access to vital academic data.
                </p>

                <div className=" bg-gray-300 bg-opacity-90 shadow-md rounded p-6 text-gray-700 mb-6">
                    <h2 className="text-2xl font-bold text-center mb-4">DepEd Mission</h2>
                    <p className="text-lg text-center mb-4">
                        To protect and promote the right of every Filipino to quality, equitable, culture-based, and complete basic education where:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-center">
                        <li className="text-lg mb-2">Students learn in a child-friendly, gender-sensitive, safe, and motivating environment.</li>
                        <li className="text-lg mb-2">Teachers facilitate learning and constantly nurture every learner.</li>
                        <li className="text-lg mb-2">Administrators and staff, as stewards of the institution, ensure an enabling and supportive environment for effective learning to happen.</li>
                        <li className="text-lg mb-2">Family, community, and other stakeholders are actively engaged and share responsibility for developing life-long learners.</li>
                    </ul>
                </div>

                <div className="bg-gray-300 bg-opacity-90 shadow-md rounded p-6 mb-6">
                    <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">DepEd Vision</h2>
                    <p className="text-lg text-center mb-4">
                        We dream of Filipinos who passionately love their country and whose values and competencies enable them to realize their full potential and contribute meaningfully to building the nation.
                    </p>
                    <p className="text-lg text-center mb-4">
                        As a learner-centered public institution, the Department of Education continuously improves itself to better serve its stakeholders.
                    </p>
                </div>

                <div className="bg-gray-300 bg-opacity-90 shadow-md rounded p-6 text-gray-700">
                    <h2 className="text-2xl font-bold text-center mb-4">Our Core Values</h2>
                    <ul className="list-disc list-inside mb-4 text-center">
                        <li className="text-lg mb-2">Maka-Diyos</li>
                        <li className="text-lg mb-2">Maka-tao</li>
                        <li className="text-lg mb-2">Makakalikasan</li>
                        <li className="text-lg mb-2">Makabansa</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
