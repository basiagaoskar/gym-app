import React, { useState, useEffect, useRef } from 'react';

const EditUser = ({ user, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        username: '',
        role: 'user',
    });
    const dialogRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                role: user.role || 'user',
            });
        }
        if (isOpen) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current.close();
        }
    }, [user, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <dialog ref={dialogRef} className="modal" onClose={handleClose}>
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-5">Edit User: {user?.username}</h3>
                <form onSubmit={handleSubmit} method="dialog">
                    <div className="w-full mb-3">
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="input w-full"
                            required
                        />
                    </div>

                    <div className="w-full mb-6">
                        <label className="label">
                            <span className="label-text">Role</span>
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="select w-full"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="modal-action">
                        <button type="button" className="btn btn-error" onClick={handleClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default EditUser;