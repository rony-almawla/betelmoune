import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getError } from '../utils';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PopupMessage from '../components/PopupMessage';
import { addUserToGroup } from '../store/chatsSlice';

export default function WorkshopContent() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.authSlice.user);
  const params = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState();
  const [currentStep, setCurrentStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const selectedWorkshop = useSelector(
    (state) => state.workshopsSlice.selectedWorkshop
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/workshops/slug/${params.slug}`);
        setWorkshop(data);
      } catch (error) {
        console.log(getError(error));
      }
    };

    fetchData();
  }, [params.slug]);

  const handleNextStep = () => {
    if (currentStep < workshop?.content.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      const userId = user._id;
      await axios.put(`/api/users/${userId}/workshops`, {
        workshopId: workshop._id,
        workshopData: workshop,
      });
      setFinished(true);
      setShowPopup(true);
    } catch (error) {
      console.log(getError(error));
    }

    // Join to Workshop Group
    const userData = {
      groupSlug: selectedWorkshop.slug,
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImg: user.profileImage,
      isAdmin: user.isAdmin,
    };
    dispatch(addUserToGroup(userData));
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate('/myWorkshops'); // Navigate to MyWorkshops page after closing the popup
  };

  return (
    <div className="bg-gray-100 py-16 px-8 lg:px-32">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          {workshop?.name}
        </h1>
        <div className="flex flex-col md:flex-row md:space-x-8 mb-8">
          <div className="flex-1 mt-32 space-y-2">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">
              {t('Overview')}
            </h3>
            <p className="text-gray-600">{workshop?.description}</p>
            <p className="mt-4 text-gray-600">
              <strong>{t('Date')}:</strong>{' '}
              {new Date(workshop?.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <strong>{t('Duration')}:</strong> {workshop?.duration}{' '}
              {t('hours')}
            </p>
            <p className="text-gray-600">
              <strong>{t('Capacity')}:</strong> {workshop?.capacity}{' '}
              {t('participants')}
            </p>
            <p className="text-gray-600">
              <strong>{t('Price')}:</strong> ${workshop?.price}
            </p>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {workshop?.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${t('Workshop image')} ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>

        <h3 className="text-3xl font-semibold mb-6 text-blue-600">
          {t('Workshop Steps')}
        </h3>
        <div className="space-y-8">
          {workshop?.content[currentStep] && (
            <div className="bg-blue-50 p-6 rounded-lg shadow-lg transition transform hover:scale-105">
              <h4 className="text-xl font-bold text-gray-800 mb-4">
                {t('Step')} {currentStep + 1}
              </h4>
              <p className="text-gray-700">{workshop.content[currentStep]}</p>
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePreviousStep}
                  disabled={currentStep === 0}
                  className={`py-2 px-4 rounded text-white font-semibold ${
                    currentStep === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {t('Previous')}
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={currentStep === workshop.content.length - 1}
                  className={`py-2 px-4 rounded text-white font-semibold ${
                    currentStep === workshop.content.length - 1
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {t('Continue')}
                </button>
                {currentStep === workshop.content.length - 1 && (
                  <button
                    onClick={handleFinish}
                    className="py-2 px-4 rounded text-white font-semibold bg-green-500 hover:bg-green-600"
                  >
                    {t('Finish')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showPopup && (
        <PopupMessage
          message={{
            title: t('Workshop Finished'),
            body: t('You have successfully completed the workshop!'),
            buttonText: t('OK'),
          }}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
}
