import { useState } from "react";

export default function LoginForm() {
    const [form, setForm] = useState({ username: "", password: "" })
    const [message, setMessage] = useState("");




    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            username: form.username,
            password: form.password


        }
        try {
            const res = await fetch("http://localhost:8080/login", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'

            });

            if (res.ok) {
                const jwtResponse = await res.json();


                localStorage.setItem('jwtToken', jwtResponse.token);

                window.location.href = "/calculator";
                setMessage("Login successful!");
            }
            else if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }
        } catch (e) {
            setMessage("Login failed: " + e.message);
        }


    }
    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
    return (
        <div>


            <form onSubmit={handleSubmit}>
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
                <button type="submit">Log in</button>




            </form>
            {message && (<p>Error: {message}</p>)}
        </div>







    )
}