import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getError } from '../utils';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Workshops() {
  const { t } = useTranslation();
  const [workshops, setWorkshops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const { data } = await axios.get('/api/workshops');
        console.log('dataaaa', data);
        setWorkshops(data);
      } catch (error) {
        console.log(getError(error));
      }
    };
    fetchWorkshops();
  }, []);

  const filteredWorkshops = workshops.filter((workshop) => {
    return (
      (filter === 'All' || workshop.type === filter) &&
      workshop.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 font-sans mb-24">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-left text-4xl font-bold mb-6">{t('All Workshops')}</h1>
        <div className="flex space-x-4 mb-6 rtl:space-x-reverse">
          {['All', 'Upcoming', 'Trending', 'Free', 'Premium'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded ${
                filter === cat ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {t(cat)}
            </button>
          ))}
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder={t('Search workshops')}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <h2 className="text-left text-2xl font-bold mb-6">{t('Featured')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredWorkshops.map((workshop) => (
            <div
              className="px-4 rounded-lg shadow-lg hover:opacity-60 pt-4 pb-4"
              key={workshop.slug}
            >
              <Link to={`/workshop/${workshop.slug}`}>
                <img
                  src={workshop.images[0]}
                  alt={workshop.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </Link>
              <p className="text-left mt-4 font-semibold">{workshop.name}</p>
              <p className="text-left mt-2 text-gray-600">
                {workshop.price}$ . {workshop.duration}hr
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Workshops;
