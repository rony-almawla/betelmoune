import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import WorkshopCard from '../components/WorkshopCard';
import { useTranslation } from 'react-i18next';

export default function MyWorkshops() {
    const { t } = useTranslation();
    const user = useSelector((state) => state.authSlice.user);
    const [finishedWorkshops, setFinishedWorkshops] = useState([]);
    const [registeredWorkshops, setRegisteredWorkshops] = useState([]);

    useEffect(() => {
        const fetchFinishedWorkshops = async () => {
            try {
                const { data } = await axios.get(`/api/users/myworkshops/${user._id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setFinishedWorkshops(data);
            } catch (error) {
                console.error(t('Failed to fetch workshops'), error);
            }
        };

        if (user) {
            fetchFinishedWorkshops();
        }
    }, [user, t]);

    useEffect(() => {
        const fetchRegisteredWorkshops = async () => {
            try {
                const { data } = await axios.get(`/api/workshops/myworkshops/${user._id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setRegisteredWorkshops(data);
            } catch (error) {
                console.error(t('Failed to fetch workshops'), error);
            }
        };

        if (user) {
            fetchRegisteredWorkshops();
        }
    }, [user, t]);

    return (
        <div>
            <div className="container mx-auto px-32 py-8">
                <h1 className="text-4xl font-bold mb-8">{t('My Finished Workshops')}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {finishedWorkshops.length > 0 ? (
                        finishedWorkshops.map((workshop) => (
                            <WorkshopCard key={workshop._id} workshop={workshop} />
                        ))
                    ) : (
                        <p>{t('No Finished workshops found.')}</p>
                    )}
                </div>
            </div>
            <div className="container mx-auto px-32 py-8">
                <h1 className="text-4xl font-bold mb-8">{t('My Registered Workshops')}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {registeredWorkshops.length > 0 ? (
                        registeredWorkshops.map((workshop) => (
                            <WorkshopCard key={workshop._id} workshop={workshop} />
                        ))
                    ) : (
                        <p>{t('No workshops found.')}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
