import { UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { toast } from 'sonner';
import { database } from "../../firebaseConfig";

export default function NewConvert(){
    const collectionRef = collection(database, "converts")

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: ''
    })

    function handleChange(e){
        const { name, value } = e.currentTarget;
        setFormData((prev) => {
            return {
                ...prev,
                [name] : value
            }
        })
    }
    const [count, setCount] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false);

    //Get the count of data from the server using onSnapshot
    function getDataCount(){
        onSnapshot(collectionRef, (snapshot) => {
            const items = snapshot.docs.map((doc) => {
                return {
                    ...doc.data()
                }
            })
            setCount(items.length)
        })
    }
    function handleSubmit(e){
        e.preventDefault();
        setIsSubmitting(true); // Indicate submission in progress
        addDoc(collectionRef, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber
        })
            .then(() => {
                toast.success('Your form has been submitted successfully!', {style: {color: 'green'}});
                // Reset the form data after successful submission;
                setFormData({
                    firstName: '',
                    lastName: '',
                    phoneNumber: ''
                });
            })
            .catch((error) => {
                toast.error(error.message);
            })
            .finally(() => {
                setIsSubmitting(false); // Reset submission state
            });
    }
    useEffect(() => {
        getDataCount()
    }, [])

    return (
        <div className='bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20'>
            <div className='text-center mb-6'>
                <div className='inline-flex items-center justify-center bg-whie/20 rounded-full px-4 py-2 mb-4'>
                    <UserPlus className='w-5 h-5 text-white mr-2'/>
                    <span className='text-white font-medium'>New Convert Form</span>
                </div>
                <div className='text-white text-lg'>
                    Join <span className='font-semibold'>{count} +</span> others who have started their faith journey
                </div>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols gap-4'>
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-white text-left" htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            name='firstName'
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            className="bg-white/10 border border-white/20 text-white placeholder:text-white/60 px-3 py-2 rounded-md"
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-white text-left" htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            name='lastName'
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                            className="bg-white/10 border border-white/20 text-white placeholder:text-white/60 px-3 py-2 rounded-md"
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-white text-left" htmlFor="phoneNumber">Phone Number</label>
                        <input
                            id="phoneNumber"
                            type="tel"
                            name='phoneNumber'
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="e.g 0712 345 678"
                            className="bg-white/10 border border-white/20 text-white placeholder:text-white/60 px-3 py-2 rounded-md"
                        />
                    </div>
                    <button
                        type='submit' 
                        className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-white text-[#7e69ab] hover:bg-gray-100'} font-semibold py-2 px-4 rounded-md`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Begin Your Journey'}
                    </button>
                </div>
            </form>
        </div>
    )
}