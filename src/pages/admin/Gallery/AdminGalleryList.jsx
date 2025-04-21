import React from 'react';
import { useState, useEffect } from 'react';
import { database } from '../../../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function AdminGalleryList(){

    const [gallery, setGallery] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    useEffect(()=>{
        setIsLoading(true)
        function fetchGallery(){
            const galleryRef = collection(database, "gallery")
            getDocs(galleryRef)
                .then((snapshot) => {
                    const galleryData = snapshot.docs.map((doc) => {
                        return {
                            ...doc.data(),
                            id: doc.id,
                        }
                    })
                    setGallery(galleryData)
                })
                .catch((error) => {
                    toast.error("Error fetching gallery posts: ", error, {style: {color: 'red'}})
                })
                .finally(()=> {
                    setIsLoading(false)
                })
        }
        fetchGallery()
    }, [])

    async function handleDelete(photoId) {
        if (window.confirm("Are you sure you want to delete this photo?")) {
            try {
                await deleteDoc(doc(database, "gallery", photoId));
                setGallery((prevGallery) => prevGallery.filter((photo) => photo.id !== photoId));
                toast.success("Photo deleted successfully.");
            } catch (error) {
                toast.error("Failed to delete photo: " + error.message);
            }
        }
    }

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl fontleading font-bold'>Photos</h1>
                <Link to='/go-admin/gallery/new'>
                    <button className='bg-[#7e69ab] hover:bg-[#6e59a5] px-4 py-2 rounded shadow flex items-center gap-1 text-white'>
                        <PlusCircle className='mr-2 h-4 w-4'/>
                        Add Photos
                    </button>
                </Link>
            </div>

            {/* Gallery Grid */}
            { isLoading ? (
                <div className='grid grid-cols-1 sm:grid-cols md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {[1,2,3,4,5,6,7,8].map((i) => (
                        <div key={i} className='bg-gray-100 rounded-lg h-64 animate-pulse'></div>
                    ))}
                </div>
            ) : gallery.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {gallery.map((photo) => {
                        return (
                            <div key={photo.id} className='relative overflow-hidden rounded-lg shadow-lg group'>
                                <img 
                                    src={photo.image}
                                    alt={photo.title}
                                    className='w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105'
                                />
                                <div className='absolute inset-0 bg-black bg-opacity-100 opacity-0 group-hover:opacity-50 transition-opacity flex flex-col justify-between p-4'>
                                    <div>
                                        <h3 className='text-white font-semibold text-lg truncate'>{photo.title}</h3>
                                        <p className='text-gray-300 text-sm'>{photo.category}</p>
                                    </div>
                                    <div className='flex justify-end'>
                                        <button 
                                            className='flex items-center gap-1 px-3 py-2 rounded bg-red-600 hover:bg-red-900 text-white text-sm shadow-md transition-colors cursor-pointer'
                                            onClick={() => handleDelete(photo.id)}
                                        >
                                            <Trash2 className='h-4 w-4' />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ): (
                <div className='text-center py-12 bg-white rounded-lg shadow-sm'>
                    <h3 className='text-lg font-medium mb-2'>No Photos yet</h3>
                    <p className='text-gray-500 mb-6'>
                        Start building your gallery by uploading photos
                    </p>
                    <Link className='/go-admin/gallery/new'>
                        <button className=' flex items-center gap-2 px-4 py-2 rounded shadow bg-[#7e69ab] hover:bg-[#6e59a5]'>
                            <PlusCircle className='mr-2 h-4 w-4' />
                            Upload Photos
                        </button>
                    </Link>
                </div>
            )}
        </div>

    )
}