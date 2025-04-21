import React from 'react';
import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
 } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminLogin(){
    const [isLogging, setIsLogging] = useState(false)
    const navigate = useNavigate()
    let auth = getAuth()
    const [formData, setFormData] =  useState({
        email: '',
        password: '',
    })

    function handleChange(e){
        const { name, value} = e.currentTarget;
        setFormData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    // Function to handle SignIn/ Create Usser with Email and Password
    async function handleSubmit(e){
        e.preventDefault();
        setIsLogging(true); // Set loading state
        try {
            // Sign in with email and password using form data
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // Store the admin email in localStorage for later use
            localStorage.setItem("authToken", user.accessToken);
            localStorage.setItem("adminEmail", user.email);

            // If the user exists, proceed to the dashboard
            setFormData({
                email: '',
                password: '',
            });
            toast.success("Login successful. Taking you to the dashboard", { style: { color: 'green' } });
            navigate('/go-admin/dashboard'); // Redirect to the dashboard
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                // Redirect to the home page if the user is not found
                toast.error("You are not an admin. Redirecting to the home page.", { style: { color: 'red' } });
                navigate('/');
            } else {
                // Handle other errors
                toast.error(error.message, { style: { color: 'red' } });
            }
        } finally {
            setIsLogging(false); // Reset loading state
        }
    }

    return (
        <section className='flex flex-col items-center justify-center h-screen bg-gray-100 '>
            <div className='mb-4 '>
                <h1>Admin Login</h1>
            </div>
            
            <form onSubmit={handleSubmit} className='mx-auto p-4'>
                <label htmlFor='email'>Email</label>
                <input 
                    id='email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='john@example.com'
                    aria-label='Email'
                    className='block mb-4 border p-1 rounded-sm text-black'
                />
                <label htmlFor='password'>Password</label>
                <input 
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    type='password'
                    placeholder='*********'
                    aria-label='Password'
                    className='block mb-4 border p-1 rounded-sm text-black' 
                />
                <button 
                    type='submit' 
                    className='bg-blue-500 text-white px-4 py-2 rounded'>
                        {isLogging ? "Checking Credentials...": "Login"}
                </button>
            </form>
        </section>
    )
}