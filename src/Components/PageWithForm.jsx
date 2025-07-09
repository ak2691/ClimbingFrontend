// Reusable StyledButton Component
function StyledButton({
    children,
    onClick,
    type = "button",
    variant = "primary",
    className = "",
    ...props
}) {
    const baseClasses = "font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseClasses} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

// Example usage in a page component with form
export default function PageWithForm() {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Form submitted!');
    };

    const handleClick = () => {
        alert('Button clicked!');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-8">

            {/* Regular button usage */}
            <StyledButton onClick={handleClick}>
                Click Me
            </StyledButton>

            {/* Form with styled button */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Name:
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                    />
                </div>

                <StyledButton type="submit" variant="success">
                    Submit Form
                </StyledButton>
            </form>
        </div>
    );
}