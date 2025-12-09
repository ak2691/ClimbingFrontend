import { Mountain } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-white border-b-2 border-yellow-400 shadow-md w-full">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/">
                        <div className="flex items-center">

                            <Mountain className="h-8 w-8 text-yellow-600 mr-2" />
                            <span className="text-xl font-bold text-yellow-600">Alk</span>
                        </div>
                    </Link>
                    {/* Navigation Links */}
                    <div className="flex space-x-8">
                        <Link
                            to="/exercises"
                            className="text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >Exercises</Link>
                        <Link
                            to="/questionnaire"
                            className="text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Questionnaire
                        </Link>
                        <Link
                            to="/calculator"
                            className="text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Calculator
                        </Link>
                        <Link
                            to="/profile"
                            className="text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Profile
                        </Link>
                        <Link
                            to="/chatbot"
                            className="text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Ask AI Coach!
                        </Link>

                    </div>
                </div>
            </div>
        </nav>
    );
}