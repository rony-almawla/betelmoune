import React from 'react';
import { Link } from 'react-router-dom';

export default function WorkshopCard({ workshop }) {
    return (
        <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-12 max-h-92 pt-4 pb-4"> {/* Adjusted max-height here */}
            <img 
                className="w-full h-32 object-cover" /* Adjusted image height */
                src={workshop.images[0]} 
                alt={workshop.name} 
            />
            <div className="p-4"> {/* Adjusted padding */}
                <h2 className="text-xl font-semibold text-gray-800 truncate">{workshop.name}</h2> {/* Adjusted font size */}
                <p className="text-gray-600 mt-2 truncate">{workshop.description}</p> {/* Added truncate for description */}
                <div className="flex items-center mt-2 text-sm"> {/* Adjusted margin and text size */}
                    <span className="text-gray-700 font-semibold">Instructor: </span>
                    <span className="text-gray-800 ml-2 truncate">{workshop.instructor}</span>
                </div>
                <div className="flex items-center mt-2 text-sm"> {/* Adjusted margin and text size */}
                    <span className="text-gray-700 font-semibold">Date: </span>
                    <span className="text-gray-800 ml-2">{new Date(workshop.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center mt-2 text-sm"> {/* Adjusted margin and text size */}
                    <span className="text-gray-700 font-semibold">Duration: </span>
                    <span className="text-gray-800 ml-2">{workshop.duration} hours</span>
                </div>
                <div className="flex items-center mt-2 text-sm"> {/* Adjusted margin and text size */}
                    <span className="text-gray-700 font-semibold">Price: </span>
                    <span className="text-gray-800 ml-2">${workshop.price}</span>
                </div>
                <div className="flex items-center mt-2 text-sm"> {/* Adjusted margin and text size */}
                    <span className="text-gray-700 font-semibold">Capacity: </span>
                    <span className="text-gray-800 ml-2">{workshop.capacity} participants</span>
                </div>
                <div className="mt-4"> {/* Added container for button */}
                    <Link to={`/workshopContent/${workshop.slug}`}>
                        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 text-sm"> {/* Adjusted margin and text size */}
                            View Details
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
