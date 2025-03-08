import { Eye, EyeOff } from 'lucide-react'
import React from 'react'

function PasswordVisibilityButton({ passwordVisible, toggleVisibility }) {
    return (
        <button
            type="button"
            onClick={toggleVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral opacity-50"
        >
            {passwordVisible ? <EyeOff /> : <Eye />}
        </button>
    )
}

export default PasswordVisibilityButton