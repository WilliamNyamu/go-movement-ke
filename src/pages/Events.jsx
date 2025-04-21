import { Link } from "react-router-dom"
import { Calendar } from "lucide-react"
import imageUrl from "../assets/images/articledefault.jpg";
import { useState, useEffect } from 'react';
import { doc, getDocs, collection } from "firebase/firestore";
import { database, storage } from "../firebaseConfig";
import { MapPin } from "lucide-react";
import { CalendarOff } from "lucide-react";

export default function Events(){
    const [events, setEvents] = useState([]);
    const [activeTab, setActiveTab] = useState('Upcoming');

    useEffect(() => {
        function fetchEvents() {
            const eventRef = collection(database, "events");
            getDocs(eventRef)
                .then((snapshot) => {
                    const eventsData = snapshot.docs.map((doc) => {
                        const event = doc.data();
                        const eventDateTime = new Date(`${event.date} ${event.time}`);
                        const currentDateTime = new Date();

                        return {
                            ...event,
                            id: doc.id,
                            status: eventDateTime < currentDateTime ? "Past" : "Upcoming",
                        };
                    });
                    setEvents(eventsData);
                })
                .catch((error) => {
                    console.error("Error fetching events. Please busy yourself as we resolve this issue", error);
                });
        }
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event => event.status === activeTab);

    return (
        <>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4 text-gray-800">Events</h1>
                    <p className="text-lg text-gray-600">
                        Join us for upcoming events or see what we've been doing in the past.
                    </p>
                </div>
                <div className="flex items-center gap-3 justify-center mb-6 bg-[#7e69ab] w-1/2 mx-auto rounded-lg shadow-lg p-2">
                    <button 
                        className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'Upcoming' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`} 
                        onClick={() => setActiveTab('Upcoming')}
                    >
                        Upcoming Events
                    </button>
                    <button 
                        className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'Past' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`} 
                        onClick={() => setActiveTab('Past')}
                    >
                        Past Events
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mx-auto ml-3 mr-3 ">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <Link to={`/events/${event.id}`} className="block w-full max-w-sm mx-auto mb-6">
                            <div key={event.id} className="overflow-hidden border rounded-lg shadow-lg bg-white transition-transform duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
                                <div className="h-56 overflow-hidden">
                                    <img 
                                        src={event.image || imageUrl} // Fallback image
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="p-6 pb-2 flex-grow">
                                    <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
                                        {event.status || 'Upcoming'}
                                    </span>
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-3 truncate">{event.title}</h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                                        {event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}
                                    </p>
                                    <div className="flex items-center text-purple-600 mb-0">
                                        <Calendar className="h-5 w-5 mr-2" />
                                        <span className="text-sm">{event.date} • {event.time}</span>
                                    </div>
                                </div>
                                <div className="flex items-center text-[#7e69ab] px-6 pb-6 pt-0">
                                    <MapPin className="mr-2 h-5 w-5" />
                                    <span className="truncate">{event.venue}</span>
                                </div>
                            </div>
                        </Link>
                     ))
                ): (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center">
                        <CalendarOff className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg fontleading font-medium">No {activeTab.toLowerCase()} events found</p>
                    </div>
                )}
            </div>
        </>
    );
}