import React, { useState } from 'react'
import PasswordVisibilityButton from '../components/PasswordVisibilityButton'
import Logo from '../components/Logo';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2 } from 'lucide-react';

function SignUpPage() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })

    const { signup, isSigningUp } = useAuthStore()

    const toggleVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    function handleSubmit(e) {
        e.preventDefault()
        signup(formData)
    }

    return (
        <>
            <Logo />
            <div className='bg-primary min-h-screen flex justify-center items-center px-4 sm:px-6'>

                <div className='bg-neutral text-primary-content w-108 max-w-9/10 sm:max-w-md md:max-w-lg lg:max-w-xl p-8 rounded-lg'>
                    <h2 className='text-2xl sm:text-3xl font-bold mb-15 text-center'>Create your account</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-5'>
                            <h3 className='text-2xl font-semibold mb-2'>Username</h3>

                            <label className="input validator text-1xl text-neutral bg-primary-content w-full p-2 mb-0 rounded-xl">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></g></svg>
                                <input
                                    type="text"
                                    className='text-neutral'
                                    value={formData.username}
                                    required
                                    placeholder="Username"
                                    pattern="[A-Za-z][A-Za-z0-9\-]*"
                                    minLength="3"
                                    maxLength="30"
                                    title="Only letters, numbers or dash"
                                    onChange={(e) => { setFormData({ ...formData, username: e.target.value }) }}
                                />
                            </label>
                            <p className="validator-hint hidden">
                                Must be 3 to 30 characters containing only letters, numbers or dash
                            </p>

                            <h3 className='text-2xl font-semibold mb-2 mt-5'>Email</h3>
                            <label className="input validator text-1xl text-neutral bg-primary-content w-full p-2 mb-0 rounded-xl">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g></svg>
                                <input type="email" className='text-neutral' value={formData.email} placeholder="mail@site.com" required onChange={(e) => { setFormData({ ...formData, email: e.target.value }) }} />
                            </label>
                            <div className="validator-hint hidden">Enter valid email address</div>

                            <h3 className='text-2xl font-semibold mb-2 mt-5'>Password</h3>
                            <label className="input validator text-neutral bg-primary-content w-full p-2 mb-1 rounded-xl">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></g></svg>
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    className='text-neutral'
                                    value={formData.password}
                                    required
                                    autoComplete="on"
                                    placeholder="Password"
                                    minLength="8"
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                                    onChange={(e) => { setFormData({ ...formData, password: e.target.value }) }} />
                                <PasswordVisibilityButton passwordVisible={passwordVisible} toggleVisibility={toggleVisibility} />
                            </label>
                            <p className="validator-hint hidden">
                                Must be more than 8 characters, including
                                <br />At least one number
                                <br />At least one lowercase letter
                                <br />At least one uppercase letter
                            </p>

                            <button className='btn w-full bg-primary text-primary-content text-xl sm:text-2xl p-4 sm:p-6 mt-20 rounded-xl'>
                                {isSigningUp ? (
                                    <>
                                        <Loader2 className="size-5 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </div>
                    </form>

                    <p className='text-center text-sm mb-2'>
                        Already have an account?{" "}
                        <a href="/login" className='text-secondary underline'>
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}

export default SignUpPage