
import { Mountain, ArrowRight, Target, TrendingUp, Users } from 'lucide-react';

export default function Home() {
    const getImageUrl = (filename) => {
        if (import.meta.env.DEV) {
            return `/set-images/${filename}`;
        }
        return `${import.meta.env.VITE_S3_URL}/set-images/${filename}`;
    };
    return (<div className="min-h-screen bg-white">
        {/* Navigation */}


        {/* Hero Section */}
        <section className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white">
            <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                    Improve your
                    <span className="text-yellow-600 block">climbing today</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
                    Take your climbing to the next level with personalized training, expert guidance, and community-driven resources.
                </p>
                <a
                    href="/login"
                    className="inline-flex items-center bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                </a>
            </div>
        </section>

        {/* AI Assistant Section */}
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image Placeholder - Left */}
                    <div className="order-2 lg:order-1">
                        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl h-96 flex items-center justify-center">
                            <div className="text-center">
                                <img src={getImageUrl("gptassistant1.png")} />

                            </div>
                        </div>
                    </div>

                    {/* Content - Right */}
                    <div className="order-1 lg:order-2">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Develop your perfect routine here
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Create your ideal training program with our AI assistant or use our expertly crafted questionnaire with perfectly chosen exercises selected by our professional coaches.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="/chatbot"
                                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Try AI Coach
                            </a>
                            <a
                                href="/questionnaire"
                                className="border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                            >
                                Take Questionnaire
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Strength Assessment Section */}
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content - Left */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Figure out your strength levels
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Discover your true climbing potential by assessing your strength levels and comparing them to your actual grades. Identify gaps in your training and unlock new levels of performance.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="/calculator"
                                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Strength Calculator
                            </a>
                            <a
                                href="/profile"
                                className="border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                            >
                                View Profile
                            </a>
                        </div>
                    </div>

                    {/* Image Placeholder - Right */}
                    <div>
                        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl h-96 flex items-center justify-center">
                            <div className="text-center">

                                <img src={getImageUrl("gradebargraph.png")} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Exercise Catalogue Section */}
        <section className="py-20 relative overflow-hidden">
            {/* Background Image Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/60">
                <div className="absolute inset-0 bg-gray-200 opacity-20">
                    <div className="w-full h-full flex items-center justify-center">
                        <Users className="h-32 w-32 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                    An available exercise catalogue with credibility
                </h2>
                <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed">
                    Access a comprehensive library of exercises that can be grown by the community and crafted by experts. Every movement is verified, tested, and trusted by climbers worldwide.
                </p>
                <a
                    href="/exercises"
                    className="inline-flex items-center bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    Explore Exercises
                    <ArrowRight className="ml-2 h-5 w-5" />
                </a>
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Mountain className="h-8 w-8 text-yellow-600 mr-2" />
                        <span className="text-xl font-bold text-yellow-600">Alk</span>
                    </div>
                    <div className="text-gray-400">
                        <p> 2025 ALK Climbing App. Elevate your climbing journey.</p>
                    </div>
                </div>
            </div>
        </footer>
    </div>
    );
}