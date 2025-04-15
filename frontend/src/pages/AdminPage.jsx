import React, { useEffect, useRef } from 'react';
import { Loader2, ShieldCheck, Users } from 'lucide-react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import { useAdminStore } from '../store/useAdminStore';

const AdminPage = () => {
  const { getUsers, users, isLoadingUsers } = useAdminStore();
  const modalRef = useRef(null);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="min-h-screen bg-base-200 text-base-content pt-20">
      <LoggedInNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-base-100 p-6 rounded-lg shadow-lg mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Admin Panel
          </h1>
          <p className="text-base-content/70 mt-1">Manage users, content, and app settings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-base-100">
            <div className="card-body items-center text-center">
              <Users className="w-12 h-12 text-secondary mb-2" />
              <h2 className="card-title">User Management</h2>
              <p>View, edit, and manage user accounts.</p>
              <div className="card-actions justify-center mt-4">
                <button className="btn btn-sm btn-secondary" onClick={() => modalRef.current.showModal()}>Manage Users</button>
              </div>
              <dialog ref={modalRef} id="user-modal" className="modal" >
                <form method="dialog" className="modal-box max-w-4xl">
                  <h3 className="font-bold text-lg">User List</h3>
                  {isLoadingUsers ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className='size-10 animate-spin mt-10' />
                    </div>
                  ) : (
                    <table className="table mt-4">
                      <thead>
                        <tr>
                          <th>User ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td className='flex gap-2'>
                              <button className="btn btn-sm btn-primary">Edit</button>
                              <button className="btn btn-sm btn-error">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <div className="modal-action">
                    <button className="btn">Close</button>
                  </div>
                </form>
              </dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;