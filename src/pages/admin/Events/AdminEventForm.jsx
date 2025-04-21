import { useState, useEffect } from "react";
import { database } from "../../../firebaseConfig";
import { storage } from "../../../firebaseConfig";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { ArrowLeft, Upload } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function AdminEventPost() {
    const collectionRef = collection(database, "events");
    const { id } = useParams(); // Get the event ID from the URL
    const navigate = useNavigate();

    // Initialize loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [image, setImage] = useState(null);

    // function for handling Image File Selection
    function handleImageUpload(e) {
        setImage(e.target.files[0]);
    }

    // Initialize the state for the downloadImageURL
    const [downloadImageURL, setImageDownloadURL] = useState(null);

    // function for submitting the data to firebase storage
    function handleImageSubmit() {
        return new Promise((resolve, reject) => {
            if (!image) {
                resolve(downloadImageURL); // Resolve with existing URL if no new image is selected
                return;
            }

            const imageRef = ref(storage, `events/images/${image.name}`);
            const uploadTask = uploadBytesResumable(imageRef, image);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    toast.success(`Upload is ${progress} % done`);
                },
                (error) => {
                    toast.error(error.message);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((url) => {
                            toast.success("Image uploaded successfully", url);
                            setImageDownloadURL(url); // Update state with the download URL
                            resolve(url);
                        })
                        .catch((error) => {
                            toast.error(error.message);
                            reject(error);
                        });
                }
            );
        });
    }

    const [event, setEvent] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
    });

    useEffect(() => {
        if (id) {
            // Fetch the event data for editing
            const fetchEvent = async () => {
                try {
                    const docRef = doc(database, "events", id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setEvent(data);
                        setImageDownloadURL(data.image || null); // Ensure image URL is set for preview
                    } else {
                        toast.error("Event not found.");
                        navigate("/go-admin/events");
                    }
                } catch (error) {
                    toast.error("Failed to fetch event: " + error.message);
                }
            };
            fetchEvent();
        }
    }, [id, navigate]);

    function handleChange(e) {
        const { name, value } = e.currentTarget;
        setEvent((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true); // Indicate submission in progress

        handleImageSubmit()
            .then((url) => {
                const eventData = {
                    title: event.title,
                    description: event.description,
                    date: event.date,
                    time: event.time,
                    image: url || downloadImageURL,
                    venue: event.venue,
                };

                if (id) {
                    // Update existing event
                    const docRef = doc(database, "events", id);
                    return updateDoc(docRef, eventData);
                } else {
                    // Create new event
                    return addDoc(collectionRef, eventData);
                }
            })
            .then(() => {
                toast.success(id ? "Event updated successfully" : "Event created successfully");
                navigate("/go-admin/events");
            })
            .catch((error) => {
                toast.error("Failed to submit the event: " + error.message);
            })
            .finally(() => {
                setIsSubmitting(false); // Reset submission state
            });
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl fontleading font-bold">
                    {id ? "Edit Event" : "Create Event"}
                </h1>
                <Link to='/go-admin/events'>
                    <button className="flex items-center gap-1 px-4 py-2 rounded shadow border cursor-pointer">
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to Events
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
                <div>
                    <label htmlFor="title" className="block mb-2 text-lg font-medium text-gray-900">Title <span className="text-red-600">*</span> </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={event.title}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#7e69ab] focus:border-[#7e69ab] block w-full p-2.5"
                        placeholder="Title of the event"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block mb-2 text-lg font-medium text-gray-900">Description <span className="text-red-600">*</span></label>
                    <textarea
                        id="description"
                        name="description"
                        value={event.description}
                        onChange={handleChange}
                        rows="4"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#7e69ab] focus:border-[#7e69ab] block w-full p-2.5"
                        placeholder="Include a brief description of the event"
                        required
                    ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="date" className="block mb-2 text-lg font-medium text-gray-900">Date <span className="text-red-600">*</span></label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={event.date}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#7e69ab] focus:border-[#7e69ab] block w-full p-2.5"
                            placeholder="Date of the event"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="time" className="block mb-2 text-lg font-medium text-gray-900">Time <span className="text-red-600">*</span></label>
                        <input
                            type="time"
                            id="time"
                            name="time"
                            value={event.time}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#7e69ab] focus:border-[#7e69ab] block w-full p-2.5"
                            placeholder="Commencing time of the event"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="venue" className="block mb-2 text-lg font-medium text-gray-900">Venue <span className="text-red-600">*</span></label>
                    <input
                        type="text"
                        id="venue"
                        name="venue"
                        value={event.venue}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#7e69ab] focus:border-[#7e69ab] block w-full p-2.5"
                        placeholder="Venue of the event"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <h1 className="text-lg">Event Image/Poster <span className="text-red-600">*</span></h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="border-2 border-dashed rounded-md border-gray-300 py-10 px-6">
                                <div className="flex justify-center">
                                    <label
                                        htmlFor="image"
                                        className="cursor-pointer bg-[#f1f0fb] hover:bg-[#f3f4f6] text-[#7e69ab] px-4 py-2 roundedn-md flex items-center justify-center">
                                        <Upload className="mr-2 h-5 w-5" />
                                        Select Image
                                    </label>
                                    <input
                                        id="image"
                                        name="image"
                                        type="file"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                                <p className="mt-3 text-sm text-gray-500 text-center">
                                    Click to upload or drag and drop <br />
                                    SVG, PNG, JPG, or GIF (max. 2MB)
                                </p>
                            </div>
                        </div>

                        {/* Handle Image Preview */}
                        <div>
                            {downloadImageURL && !image && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                                    <div className="w-full h-48 rounded-md overflow-hidden border border-gray-300">
                                        <img
                                            src={downloadImageURL}
                                            alt="Current Event"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                            {image && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
                                    <div className="w-full h-48 rounded-md overflow-hidden border border-gray-300">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full text-white bg-[#7e69ab] hover:bg-[#6b5896] focus:ring-4 focus:outline-none focus:ring-[#7e69ab] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    disabled={isSubmitting} // Disable button while submitting
                >
                    {isSubmitting ? (id ? "Updating..." : "Submitting...") : (id ? "Update Event" : "Create Event")}
                </button>
            </form>
        </div>
    );
}