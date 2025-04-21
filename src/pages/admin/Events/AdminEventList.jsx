import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Edit, PlusCircle, Trash2 } from 'lucide-react';
import { database } from '../../../firebaseConfig';
import { getDocs, doc, collection, deleteDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';


export default function AdminEventList(){
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() =>{
        function fetchEvents(){
            setIsLoading(true)
            const eventsRef = collection(database, "events")
            getDocs(eventsRef)
                .then((snapshot) => {
                    const events = snapshot.docs.map((doc) => {
                        const event = doc.data()
                        const eventDate = new Date(`${event.date} ${event.time}`)
                        const currentDate = new Date()
                        return {
                            ...event,
                            id: doc.id, // Ensure the id is correctly set from Firestore document
                            status: eventDate < currentDate ? "Past" : "Upcoming",
                        }
                    })
                    setEvents(events)
                })
                .catch((error) => {
                    toast.error("Error fetching events. Please busy yourself as we resolve this issue", error, {style: {color: 'red'}})
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
        fetchEvents()
    }, [])

    async function handleDelete(eventId) {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await deleteDoc(doc(database, "events", eventId));
                setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
                toast.success("Event deleted successfully.");
            } catch (error) {
                toast.error("Failed to delete event: " + error.message);
            }
        }
    }

    return (
        <>
            <div className='space-y-6'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl fontleading font-bold'>Events</h1>
                    <Link to='/go-admin/events/new'>
                        <button className='px-4 py-2 rounded flex items-center gap-1 bg-[#7e69ab] hover:bg-[#6e59a5] text-white'>
                            <PlusCircle className='mr-2 h-4 w-4'/>
                            New Event
                        </button>
                    </Link>
                </div>

                {/* Events List */}
                {isLoading ? (
                    <div className='space-y-4'>
                        {[1,2,3].map((i) => (
                            <div key={i}
                                className="bg-white p-6 rounded-lg shadow-sm animate-pulse"
                            >
                                <div className='h-6 bg-gray-200 rounded w-1/3 mb-4'></div>
                                <div className='h-6 bg-gray-200 rounded w-1/4 mb-6'></div>
                                <div className='flex justify-end space-x-2'>
                                    <div className='h-10 bg-gray-200 rounded w-20'></div>
                                    <div className='h-10 bg-gray-200 rounded w-20'></div>
                                </div>

                            </div>
                        ))}
                    </div>
                    
                ): events.length > 0 ?(
                    <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='bg-gray-50 text-gray-700'>
                                    <tr>
                                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Title</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Date & Time</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Venue</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Status</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Action</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200'>
                                    {events.map((item) => {
                                        return (
                                            <tr key={item.id} className='hover:bg-gray-50'>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='font-medium'>{item.title}</div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='font-medium'>{item.date} • {item.time}</div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    {item.venue}
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    {item.status === "Upcoming" ? (
                                                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fec6a1] text-gray-800'>
                                                            <Calendar className='h-3 w-3 mr-1' />
                                                            {item.status}
                                                        </span>
                                                    ): (
                                                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700'>
                                                            Past
                                                        </span>
                                                    )}
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                                    <div className='flex justify-end space-x-2'>
                                                        <Link to={`/go-admin/events/edit/${item.id}`} className='h-8'>
                                                            <button className='px-4 py-2 rounded shadow flex items-center gap-1 hover:bg-blue-100 cursor-pointer'>
                                                                <Edit className='h-4 w-4' />
                                                                <span className='sr-only md:not-sr-only md:ml-2'>Edit</span>
                                                            </button>
                                                        </Link>
                                                        <button
                                                            className='px-4 py-2 rounded shadow flex items-center gap-1 text-red-600 hover:bg-red-100 cursor-pointer'
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <Trash2 className='h-4 w-4' />
                                                            <span className='sr-only md:not-sr-only md:ml-2'>Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ): (
                    <div className='text-center py-12 bg-white rounded-lg shadow-sm'>
                        <h3 className='text-lg font-medium mb-2'>No Events Yet</h3>
                        <p className='text-gray-500 mb-6'>
                            Get started by creating your first event.
                        </p>
                        <Link to='/go-admin/events/new'>
                            <button className='px-4 py-2 rounded shadow bg-[#7e69ab] hover:bg-[#6e59a5] '>
                                <PlusCircle className='mr-2 h-4 w-4' />
                                Create Event
                            </button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Implement Delete alert here */}
        </>
    )
}