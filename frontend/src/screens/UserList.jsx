import React, { useEffect, useState } from 'react';
import { deleteUser, getUsers, updateUser } from '../store/usersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const UserList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [editingUser, setEditingUser] = useState(null);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    isAdmin: false,
  });

  const users = useSelector((state) => state.usersSlice.users || []);
  const loading = useSelector((state) => state.usersSlice.loading);
  const error = useSelector((state) => state.usersSlice.error);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleDeleteClick = (userId) => {
    const confirmDelete = window.confirm(
      t('Are you sure you want to delete this user?')
    );
    if (confirmDelete) {
      dispatch(deleteUser(userId))
        .then(() => {
          dispatch(getUsers());
        })
        .catch((err) => {
          console.error('Failed to delete user:', err);
        });
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setFormValues({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  };

  const handleSaveClick = () => {
    dispatch(updateUser({ id: editingUser, ...formValues }));
    setEditingUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  if (loading) {
    return <div className="text-center">{t('Loading...')}</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        {t('Failed to load users:')} {error}
      </div>
    );
  }

  if (users.length === 0) {
    return <div className="text-center">{t('No Users Found')}</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-left text-4xl font-bold mb-6">{t('Users')}</h1>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="py-2 px-4 text-start">{t('ID')}</th>
              <th className="py-2 px-4 text-start">{t('First Name')}</th>
              <th className="py-2 px-4 text-start">{t('Last Name')}</th>
              <th className="py-2 px-4 text-start">{t('Email')}</th>
              <th className="py-2 px-4 text-start">{t('Is Admin')}</th>
              <th className="py-2 px-4 text-start">{t('Action')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="py-2 px-4 text-start">{user._id}</td>
                <td className="py-2 px-4 text-start">
                  {editingUser === user._id ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formValues.firstName}
                      onChange={handleInputChange}
                      className="border rounded p-1"
                    />
                  ) : (
                    user.firstName
                  )}
                </td>
                <td className="py-2 px-4 text-start">
                  {editingUser === user._id ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formValues.lastName}
                      onChange={handleInputChange}
                      className="border rounded p-1"
                    />
                  ) : (
                    user.lastName
                  )}
                </td>
                <td className="py-2 px-4 text-start">
                  {editingUser === user._id ? (
                    <input
                      type="email"
                      name="email"
                      value={formValues.email}
                      onChange={handleInputChange}
                      className="border rounded p-1"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="py-2 px-4 text-start">
                  {editingUser === user._id ? (
                    <input
                      type="checkbox"
                      name="isAdmin"
                      checked={formValues.isAdmin}
                      onChange={handleInputChange}
                      className="border rounded"
                    />
                  ) : user.isAdmin ? (
                    'Yes'
                  ) : (
                    'No'
                  )}
                </td>
                <td className="py-2 px-4 text-start">
                  {editingUser === user._id ? (
                    <button
                      onClick={handleSaveClick}
                      className="text-green-500 hover:underline"
                    >
                      {t('Save')}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-500 hover:underline text-start"
                      >
                        {t('Edit')}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user._id)}
                        className="text-red-500 hover:underline ml-2 text-start"
                      >
                        {t('Delete')}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
