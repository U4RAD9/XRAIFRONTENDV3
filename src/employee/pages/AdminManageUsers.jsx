import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';

function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: null, username: '', password: '', mobile: '', userType: 'Patient' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.USERS);
      // Map backend fields to frontend fields for the table
      const mappedUsers = res.data.map(u => ({
        id: u.id,
        username: u.user_name,
        password: u.password || '',
        mobile: u.mobile_number || '',
        userType: u.user_type_name || 'Patient'
      }));
      setUsers(mappedUsers);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.mobile && user.mobile.includes(searchQuery)) ||
    (user.userType && user.userType.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openNewModal = () => {
    setCurrentUser({ id: null, username: '', password: '', mobile: '', userType: 'Patient' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosInstance.delete(`${ENDPOINTS.USERS}${id}/`);
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user', err);
        alert('Failed to delete user.');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser.username) {
      alert("Please enter a username.");
      return;
    }
    
    try {
      if (isEditing) {
        await axiosInstance.put(`${ENDPOINTS.USERS}${currentUser.id}/`, currentUser);
        alert('User updated successfully');
      } else {
        await axiosInstance.post(ENDPOINTS.USERS, currentUser);
        alert('User added successfully');
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error('Error saving user', err);
      alert('Failed to save user.');
    }
  };

  return (
    <div>
      {/* Top Row */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#00acc1]"
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        <button onClick={openNewModal} className="bg-[#00acc1] hover:bg-[#008ba3] text-white px-4 py-2 rounded shadow transition-colors duration-200 flex items-center">
          <i className="fas fa-plus mr-2"></i> Add User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
              <tr>
                <th className="py-4 px-5 text-start font-bold">Username</th>
                <th className="py-4 px-5 text-start font-bold">Password</th>
                <th className="py-4 px-5 text-start font-bold">Mobile Number</th>
                <th className="py-4 px-5 text-start font-bold">User Type</th>
                <th className="py-4 px-5 text-start font-bold w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500 font-semibold">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Loading...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500 font-semibold">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/50 transition duration-150">
                    <td className="py-4 px-6 text-start font-bold text-gray-800">{user.username}</td>
                    <td className="py-4 px-6 text-start">{user.password}</td>
                    <td className="py-4 px-6 text-start">{user.mobile}</td>
                    <td className="py-4 px-6 text-start">{user.userType}</td>
                    <td className="py-4 px-6 text-start">
                      <button onClick={() => handleEdit(user)} className="cursor-pointer text-[#00acc1] hover:text-[#008ba3] transition-colors mx-2" title="Edit">
                        <i className="fas fa-edit text-lg"></i>
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="cursor-pointer text-red-500 hover:text-red-700 transition-colors mx-2" title="Delete">
                        <i className="fas fa-trash text-lg"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={isEditing ? 'Update User' : 'Add User'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                <input 
                  type="text" 
                  required
                  value={currentUser.username}
                  onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#00acc1]"
                  placeholder="Enter Username"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input 
                  type="text" 
                  required
                  value={currentUser.password}
                  onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#00acc1]"
                  placeholder="Enter Password"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  required
                  value={currentUser.mobile}
                  onChange={(e) => setCurrentUser({...currentUser, mobile: e.target.value})}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#00acc1]"
                  placeholder="Enter Mobile Number"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">User Type</label>
                <select 
                  value={currentUser.userType}
                  onChange={(e) => setCurrentUser({...currentUser, userType: e.target.value})}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#00acc1]"
                >
                  <option value="Admin">Admin</option>
                  <option value="Technician">Technician</option>
                  <option value="Patient">Patient</option>
                  <option value="Partner">Partner</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>
          </div>
          <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-4 flex-shrink-0 bg-gray-50">
            <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              Close
            </button>
            <button type="submit" className="px-6 py-2 bg-[#00acc1] hover:bg-[#0097a7] text-white font-semibold rounded-lg shadow transition-colors cursor-pointer">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AdminManageUsers;
