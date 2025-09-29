import { Link } from 'react-router-dom';

export function LandingPageTest() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-4">CODEVENGERS Landing Page Test</h1>
                <p className="text-lg mb-8">This is a simple test to see if the landing page renders.</p>
                <Link 
                    to="/login" 
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-medium"
                >
                    Go to Login
                </Link>
            </div>
        </div>
    );
}
