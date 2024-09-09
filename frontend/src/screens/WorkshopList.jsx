import React, { useEffect, useState } from 'react';
import {
  getWorkshops,
  deleteWorkshop,
  updateWorkshop,
} from '../store/workshopsSlice';
import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
import { t } from 'i18next';

const WorkshopList = () => {
  const workshops = useSelector((state) => state.workshopsSlice.workshops);
  const loading = useSelector((state) => state.workshopsSlice.loading);
  const error = useSelector((state) => state.workshopsSlice.error);

  const dispatch = useDispatch();
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '',
    slug: '',
    description: '',
    date: '',
    duration: '',
    capacity: '',
    price: '',
  });

  useEffect(() => {
    dispatch(getWorkshops());
  }, [dispatch]);

  const handleDeleteClick = (workshopId) => {
    const confirmDelete = window.confirm(
      t('Are you sure you want to delete this workshop?')
    );
    if (confirmDelete) {
      dispatch(deleteWorkshop(workshopId))
        .then(() => {
          dispatch(getWorkshops());
        })
        .catch((err) => {
          console.error('Failed to delete workshop:', err);
        });
    }
  };

  const handleEditClick = (workshop) => {
    setEditingWorkshop(workshop._id);
    setFormValues({
      name: workshop.name,
      slug: workshop.slug,
      description: workshop.description,
      date: workshop.date,
      duration: workshop.duration,
      capacity: workshop.capacity,
      price: workshop.price,
    });
  };

  const handleSaveClick = () => {
    dispatch(updateWorkshop({ id: editingWorkshop, ...formValues }));
    setEditingWorkshop(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // Ensure that number inputs cannot be set to values less than 0
    const newValue = type === 'number' && value < 0 ? 0 : value;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? e.target.checked : newValue,
    });
  };

  if (loading) {
    return <div className="text-center">{t('Loading...')}</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        {t('Failed to load workshops:')} {error}
      </div>
    );
  }

  if (workshops.length === 0) {
    return <div className="text-center">{t('No Workshops Found')}</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-left text-4xl font-bold mb-6">{t('Workshops')}</h1>
      </header>

      <main className="p-6">
        {/* <div className="mb-4">
          <Link to={'/AddWorkshop'}>
            <button className="flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              {t('Create Workshop')}
            </button>
          </Link>
        </div> */}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="py-2 px-4 text-start">{t('ID')}</th>
                <th className="py-2 px-4 text-start">{t('Name')}</th>
                <th className="py-2 px-4 text-start">{t('Slug')}</th>
                <th className="py-2 px-4 text-start">{t('Description')}</th>
                <th className="py-2 px-4 text-start">{t('Date')}</th>
                <th className="py-2 px-4 text-start">{t('Duration')}</th>
                <th className="py-2 px-4 text-start">{t('Capacity')}</th>
                <th className="py-2 px-4 text-start">{t('Price')}</th>
                <th className="py-2 px-4 text-start">{t('Action')}</th>
              </tr>
            </thead>
            <tbody>
              {workshops.map((workshop) => (
                <tr key={workshop._id} className="border-t">
                  <td className="py-2 px-4 text-start">{workshop._id}</td>
                  <td className="py-2 px-4 text-start">
                    {editingWorkshop === workshop._id ? (
                      <input
                        type="text"
                        name="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    ) : (
                      workshop.name
                    )}
                  </td>
                  <td className="py-2 px-4 text-start">
                    {editingWorkshop === workshop._id ? (
                      <input
                        type="text"
                        name="slug"
                        value={formValues.slug}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    ) : (
                      workshop.slug
                    )}
                  </td>
                  <td className="py-2 px-4 text-start">
                    {editingWorkshop === workshop._id ? (
                      <input
                        type="text"
                        name="description"
                        value={formValues.description}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    ) : (
                      workshop.description
                    )}
                  </td>
                  <td className="py-2 px-4 text-start">
                    {editingWorkshop === workshop._id ? (
                      <input
                        type="datetime-local"
                        name="date"
                        value={formValues.date}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    ) : (
                      workshop.date
                    )}
                  </td>
                  <td className="py-2 px-4 text-start">
                    {editingWorkshop === workshop._id ? (
                      <input
                        type="number"
                        name="duration"
                        value={formValues.duration}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    ) : (
                      `${workshop.duration}h`
                    )}
                  </td>
                  <td className="py-2 px-4 text-start">
                    {editingWorkshop === workshop._id ? (
                      <input
                        type="number"
                        name="capacity"
                        value={formValues.capacity}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    ) : (
                      workshop.capacity
                    )}
                  </td>
                  <td className="py-2 px-4 text-start">
                    {editingWorkshop === workshop._id ? (
                      <input
                        type="number"
                        name="price"
                        value={formValues.price}
                        onChange={handleInputChange}
                        className="border rounded p-1"
                      />
                    ) : (
                      `${workshop.price}$`
                    )}
                  </td>
                  <td className="py-2 px-4 text-start">
                    {editingWorkshop === workshop._id ? (
                      <button
                        onClick={handleSaveClick}
                        className="text-green-500 hover:underline"
                      >
                        {t('Save')}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(workshop)}
                          className="text-blue-500 hover:underline"
                        >
                          {t('Edit')}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(workshop._id)}
                          className="text-red-500 hover:underline"
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
      </main>
    </div>
  );
};

export default WorkshopList;
