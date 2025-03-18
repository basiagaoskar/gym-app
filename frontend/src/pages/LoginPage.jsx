import React, { useState } from 'react'
import Logo from '../components/Logo'
import PasswordVisibilityButton from '../components/PasswordVisibilityButton';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2 } from 'lucide-react';

function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { isLoggingIn, login } = useAuthStore()

  const toggleVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  function handleSubmit(e) {
    e.preventDefault()
    login(formData)
  }

  return (
    <>
      <Logo />
      <div className='bg-primary h-screen flex justify-center items-center'>
        <div className='bg-neutral w-108 max-w-9/10 p-8 rounded-lg text-neutral-content'>
          <h2 className='text-2xl sm:text-3xl font-bold mb-15 text-center'>Sign in to your account</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-5'>
              <h3 className='text-2xl font-semibold mb-2'>Email</h3>
              <label className="input validator text-1xl text-neutral bg-primary-content w-full p-2 mb-0 rounded-xl">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g></svg>
                <input
                  type="email"
                  className='text-neutral'
                  value={formData.email}
                  placeholder="mail@site.com"
                  required
                  onChange={(e) => { setFormData({ ...formData, email: e.target.value }) }}
                />
              </label>

              <div className="validator-hint hidden">Enter valid email address</div>
              <h3 className='text-2xl font-semibold mb-2 mt-5'>Password</h3>
              <label className="input validator text-neutral bg-primary-content w-full p-2 mb-1 rounded-xl">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></g></svg>
                <input
                  type={passwordVisible ? 'text' : 'password'} className='text-neutral'
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
              <a href="#" className='text-xs font-semibold text-secondary float-right'>
                Forgot password?
              </a>

              <button className='btn w-full bg-primary text-primary-content text-3xl p-7 mt-15 rounded-xl' disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <p className='text-center text-sm mb-2'>
            New to <span className='font-bold'>ZiutkiGym</span>?{" "}
            <a href="/signup" className='text-secondary underline'>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </>
  )
}

export default LoginPage