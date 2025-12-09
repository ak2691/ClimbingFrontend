

export default function ContinueButton({ onClick }) {
    return (

        <button onClick={onClick} className="group relative px-8 py-4 bg-white border-2 border-yellow-400 rounded-lg font-inter font-semibold text-lg text-gray-800 transition-all duration-300 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-yellow-300 hover:text-white hover:shadow-lg hover:shadow-yellow-400/25 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-400/50">
            <span className="relative z-10 flex items-center gap-2">
                Continue
                <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                </svg>
            </span>

            {/* Subtle shine effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
        </button>

    );
};

