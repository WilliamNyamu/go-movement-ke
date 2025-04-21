import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Calendar } from 'lucide-react';
import { MapPin } from 'lucide-react';
import Placeholder from "../assets/images/articledefault.jpg";


export default function EventDetail(){
    //Extracting the event ID from the URL parameters
    const {id} = useParams();

    //Initializing the state for the event data
    const [event, setEvent] = useState(null);

    useEffect(() => {
        async function fetchEvent() {
            try {
                const eventRef = doc(database, 'events', id);
                const eventSnap = await getDoc(eventRef);
                if (eventSnap.exists()) {
                    const eventData = eventSnap.data();

                    // Parse the event date and time
                    const eventDateTime = new Date(`${eventData.date}T${eventData.time}`);
                    const currentDateTime = new Date(); // Use the provided current date

                    // Determine the status of the event
                    const status = eventDateTime < currentDateTime ? 'Past Event' : 'Upcoming Event';

                    setEvent({ ...eventData, status });
                } else {
                    console.error('No such event!');
                }
            } catch (error) {
                console.error('Error fetching event:', error);
            }
        }

        fetchEvent();
    }, [id]);

    return (
        <>
            <div className='container mx-auto px-4 py-12'>  
                <div className='max-3xl mx-auto'>
                    <Link to="/events" className='inline-flex items-center text-[#7e69ab] hover:text-[#6e59a5] mb-8'>
                        <ArrowLeft className='mr-2 h-4 w-4'/>
                        Back to Events
                    </Link>
                    <div className='mb-6'>
                        <span className="inline-block bg-[#fec6a1] text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                            {event?.status}
                        </span>
                    </div>
                    <h1 className='text-3xl md:text-4xl fontleading font-bold mb-6'>{event?.title}</h1>

                    <div className='flex flex-col md:flex-row md:space-x-12 mb-8'>
                        <div className='flex items-center mb-4 md:mb-0 text-[#7e69ab]'>
                            <Calendar className='mr-2 h-5 w-5' />
                            <span>{event?.date} • {event?.time}</span>
                        </div>
                        <div className='flex items-center text-[#7e69ab]'>
                            <MapPin className='mr-2 h-5 w-5' />
                            <span>{event?.venue}</span>
                        </div>
                    </div>

                    <div className='mb-8'>
                        <img 
                            src={event?.image || Placeholder} // Use Placeholder image if article.image is not available
                            alt={event?.title}
                            className='w-full object-cover rounded-lg shadow-md'
                        />
                    </div>
                    <div>
                        <p className='text-gray-600 mb-4 leading-relaxed'>
                            {event?.description}
                        </p>
                    </div>
                    <div className='bg-[#f1f0fb] p-6 rounded-lg'>
                        <h3 className='fontleading font-semibold text-xl mb-4'>Interested in the event?</h3>
                        <p className='mb-6'>
                            We'd love to have you join us
                        </p>
                        <button className='bg-[#7e69ab] hover:bg-[#6e59a5] px-3 py-2 rounded-sm text-white'>Register Interest</button>
                    </div>       
                </div>
            </div>
        </>
    )
}