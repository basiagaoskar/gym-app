import React from 'react'

function LoginForm() {
    return (
        <>
            <div className='bg-primary h-screen flex justify-center items-center'>
                <div className='bg-neutral w-108 max-w-9/10 p-8 rounded-lg'>
                    <h2 className='text-2xl sm:text-3xl font-bold mb-15 text-center'>Sign in to your account</h2>
                    <form>
                        <div className='mb-5'>
                            <h3 className='text-2xl font-semibold mb-2'>Email</h3>
                            <label className="input validator text-1xl text-neutral bg-primary-content w-full p-2 mb-5 rounded-xl">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g></svg>
                                <input type="email" className='text-neutral ' placeholder="mail@site.com" required />
                            </label>

                            <div className="validator-hint hidden">Enter valid email address</div>
                            <h3 className='text-2xl font-semibold mb-2'>Password</h3>
                            <label className="input validator text-neutral bg-primary-content w-full p-2 mb-1 rounded-xl">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></g></svg>
                                <input type="password" className='text-neutral' required placeholder="Password" minlength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" />
                            </label>
                            <p className="validator-hint hidden">
                                Must be more than 8 characters, including
                                <br />At least one number
                                <br />At least one lowercase letter
                                <br />At least one uppercase letter
                            </p>
                            <a href="#" className='text-xs font-semibold text-primary-content float-right'>
                                Forgot password?
                            </a>

                            <button className='btn w-full bg-primary text-primary-content text-3xl p-7 mt-15 rounded-xl'>
                                Continue
                            </button>
                        </div>
                    </form>

                    <p className='text-center text-sm mb-2'>
                        New to <span className='font-bold'>ZiutkiGym</span>?{" "}
                        <a href="#" className='text-blue-400 underline'>
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}

export default LoginForm