import { useState, useEffect } from "react";
import api,{publicApi} from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";


function Form({route, method}) {
    const [formData, setFormData] = useState({});

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";
    
    
    
    const handleChange = e => {
        const value =
            e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData(prev => ({ ...prev, [e.target.name]: value }));
    };
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const response = await publicApi.post(route, formData);
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate("/dashboard");
            }
            else {
                alert("Registration successful");
                navigate("/login");
            }
        }
        catch (error) {
            let message = "An error occurred. Please try again.";
            if (error.response && error.response.data) {
                if (typeof error.response.data === "string") {
                    message = error.response.data;
                } else if (typeof error.response.data === "object") {
                    // Collect all error messages from the API response
                    message = Object.values(error.response.data)
                        .flat()
                        .join("\n");
                }
            }
            alert(message);
        } finally {
            setLoading(false);
        };
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="flex justify-center">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-10 w-10 text-emerald-500"
                        >
                        <path d="M12 6v12" />
                        <path d="M6 12h12" />
                        <circle cx="12" cy="12" r="10" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight">{method === "login" ? "Welcome back" : "Create an account"}</h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{method === "login" ? "Sign in to your SprintBudget Pro account" : "Sign up for a new account"}</p>
                </div>
                <form onSubmit={handleSubmit} className="form">
                    
                    {method === "register" ? (
                        <div className="max-w-md mx-auto p-6 space-y-6
                            bg-white text-gray-900
                            dark:bg-gray-900 dark:text-gray-100
                            rounded-lg shadow-lg">
                            <div className="space-y-1">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-100">
                                    Username
                                </label>
    
                                <input name="username" placeholder="Username"  onChange={handleChange} required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Email Address</label>
                                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="first_name">First Name</label>
                                <input name="first_name" placeholder="First Name" onChange={handleChange} required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="last_name">Last Name</label>
                                <input name="last_name" placeholder="Last Name" onChange={handleChange} required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
                                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password2">Confirm Password</label>
                                <input name="password2" type="password" placeholder="Confirm Password" onChange={handleChange} required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="weekly_budget">Weekly Budget</label>
                                <input name="weekly_budget" placeholder="Weekly Budget" onChange={handleChange} type="number" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="currency">Currency</label>
                                <input name="currency" placeholder="Currency" onChange={handleChange} />
                            </div>

                            <fieldset className="space-y-3">
                                <legend className="text-sm font-medium text-gray-700 dark:text-gray-100">
                                Preferences
                                </legend>

                                <label className="flex items-center gap-2">
                                <input
                                    name="rollover_budget"
                                    type="checkbox"
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500
                                            dark:focus:ring-indigo-400"
                                />
                                <span className="text-sm">Rollover Budget</span>
                                </label>

                                <label className="flex items-center gap-2">
                                <input
                                    name="email_notifications"
                                    type="checkbox"
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500
                                            dark:focus:ring-indigo-400"
                                />
                                <span className="text-sm">Email Notifications</span>
                                </label>

                                <label className="flex items-center gap-2">
                                <input
                                    name="ai_features_enabled"
                                    type="checkbox"
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500
                                            dark:focus:ring-indigo-400"
                                />
                                <span className="text-sm">AI Features Enabled</span>
                                </label>
                            </fieldset>
                        </div>
                    ):(
                        <div className="space-y-4 rounded-md ">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Email Address</label>
                                <input name="email" type="email" autoComplete="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" placeholder="Email" onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
                                <input name="password" type="password" autoComplete="current-password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" placeholder="Password" onChange={handleChange} required />
                            </div>
                        </div>
                    )}
                    <button type="submit" className="w-full rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50" disabled={loading}>{loading ? "Loading..." : name}</button>

                </form>
            </div>

        </div>
         
    )
            

};
export default Form;