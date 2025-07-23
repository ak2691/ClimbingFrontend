import { useState } from "react";
export default function RegisterForm() {
    const [form, setForm] = useState({ email: "", username: "", password: "" })
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            email: form.email,
            username: form.username,
            password: form.password



        };
        try {
            const res = await fetch("http://localhost:8080/api/register", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'

            });

            if (res.ok) {
                window.location.href = "/login";
            }
            else if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }
        } catch (e) {
            setMessage("Register failed: " + e.message);
        }


    }
    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
    return (
        <div>


            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        onChange={handleChange}
                        value={form.email}
                    />
                </div>
                <div>
                    <label htmlFor="username">Username: </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        onChange={handleChange}
                        value={form.username}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        onChange={handleChange}
                        value={form.password}
                    />
                </div>
                <button type="submit">Register</button>



            </form>
            {message && (<p>Error: {message}</p>)}
        </div>







    )
}