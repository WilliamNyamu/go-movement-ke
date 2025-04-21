import { useState, useEffect } from "react"
import { database } from "../../../firebaseConfig"
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "../../../firebaseConfig"
import { toast } from "sonner"
import { ArrowLeft, Upload } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"

export default function AdminGalleryPost(){
    const collectionRef = collection(database, "gallery")
    const { id } = useParams(); // Get the gallery photo ID from the URL
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false) // Initialize loading state

    const [image, setImage] = useState(null)

    function handleImageUpload(e){
        setImage(e.target.files[0])
    }

    const [imageDownloadURL, setImageDownloadURL] = useState(null)

    useEffect(() => {
        if (id) {
            // Fetch the gallery photo data for editing
            const fetchPhoto = async () => {
                try {
                    const docRef = doc(database, "gallery", id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setGallery(data);
                        setImageDownloadURL(data.image || null); // Ensure image URL is set for preview
                    } else {
                        toast.error("Photo not found.");
                        navigate("/go-admin/gallery");
                    }
                } catch (error) {
                    toast.error("Failed to fetch photo: " + error.message);
                }
            };
            fetchPhoto();
        }
    }, [id, navigate]);

    function handleImageSubmit(){
        return new Promise((resolve, reject) => {
            if(!image){
                resolve(imageDownloadURL); // Resolve with existing image URL if no new image is selected
                return;
            }
            const imageRef = ref(storage, `gallery/images/${image.name}`)
            const uploadTask = uploadBytesResumable(imageRef, image)

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    toast.success(`Upload is ${progress} % done`)
                },
                (error) => {
                    toast.error(error.message)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((url) => {
                            toast.success("Image uploaded successfully", url)
                            setImageDownloadURL(url) // Update state with the download URL
                            resolve(url)
                        })
                        .catch((error) => {
                            toast.error("Failed to upload: ", error)
                            reject(error)
                        })
                }
            )
        })
    }

    function handleSubmit(e){
        e.preventDefault()
        setIsSubmitting(true)
        handleImageSubmit()
            .then((url) => {
                const photoData = {
                    title: gallery.title,
                    category: gallery.category,
                    image: url || imageDownloadURL, // Use existing or new image URL
                    description: gallery.description,
                };

                if (id) {
                    // Update existing photo
                    const docRef = doc(database, "gallery", id);
                    return updateDoc(docRef, photoData);
                } else {
                    // Create new photo
                    return addDoc(collectionRef, photoData);
                }
            })
            .then(() => {
                toast.success(id ? "Photo updated successfully" : "Photo added successfully");
                navigate("/go-admin/gallery");
            })
            .catch((error) => {
                toast.error("Failed to submit the photo: " + error.message);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }

    const [gallery, setGallery] = useState({
        title: '',
        category: '',
        description: '',
    })

    function handleChange(e){
        const { name, value } = e.currentTarget;
        setGallery((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl fontleading font-bold">
                    {id ? "Edit Photo" : "Upload Photos"}
                </h1>
                <Link to='/go-admin/gallery'>
                    <button className="border-gray-300 px-4 py-2 rounded shadow flex items-center gap-1 cursor-pointer hover:bg-[#FEC6A1]">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Gallery
                    </button>
                </Link>
                
            </div>
            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block mb-2 text-lg font-medium text-gray-900">Title <span className="text-red-600">*</span></label>
                        <input 
                            type="text" 
                            id="title"
                            name="title"
                            value={gallery.title}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#7e69ab] focus:border-[#7e69ab] block w-full p-2.5" 
                            placeholder="Title of the photo" 
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="category" className="block mb-2 text-lg font-medium text-gray-900">Category <span className='text-red-600'>*</span></label>
                        <select 
                            id="category" 
                            name="category"
                            value={gallery.category}
                            onChange={handleChange} 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#7e69ab] focus:border-[#7e69ab] block w-full p-2.5" 
                            required
                        >
                            <option value="" disabled selected>Select a category</option>
                            <option value="events">Events</option>
                            <option value="missions">Missions</option>
                            <option value="outreach">Outreach</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block mb-2 text-lg font-medium text-gray-900">Description <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        id="description" 
                        name="description"
                        value={gallery.description}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#7e69ab] focus:border-[#7e69ab] block w-full p-2.5" 
                        placeholder="Description of the photo" 
                        required
                    />
                </div>
                <div className="space-y-2">
                    <h1 className="text-lg">Photo<span className="text-red-500">*</span></h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="border-2 border-dashed rounded-md border-gray-300 py-10 px-6">
                                <div className="flex justify-center">
                                    <label htmlFor="image" className="cursor-pointer bg-[#f1f0fb] hover:bg-gray-100 text-[#7e69ab] px-4 py-2 rounded-md flex items-center justify-center">
                                        <Upload className="mr-2 h-5 w-5" />
                                        Select Image
                                    </label>
                                    <input 
                                        id="image"
                                        type="file"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        required={!id} // Make image upload required only for new photos
                                    />
                                </div>
                                <p className="mt-3 text-sm text-gray-500 text-center">
                                    Click to upload or drag and drop <br />
                                    SVG, PNG, JPG or GIF (max. 2MB)
                                </p>
                            </div>
                        </div>
                        {/* Image Preview */}
                        {imageDownloadURL && !image && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                                <div className="w-full h-48 rounded-md overflow-hidden border border-gray-300">
                                    <img 
                                        src={imageDownloadURL} 
                                        alt="Current Photo" 
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
                <button 
                    type="submit" 
                    className="w-full text-white bg-[#7e69ab] hover:bg-[#6b5896] focus:ring-4 focus:outline-none focus:ring-[#7e69ab] font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#7e69ab] dark:hover:bg-[#6b5896] dark:focus:ring-[#7e69ab]"
                    disabled={isSubmitting} // Disable button while submitting
                >
                    {isSubmitting ? (id ? "Updating..." : "Submitting...") : (id ? "Update Photo" : "Submit")}
                </button>
                
                
            </form>
        </div>
    )
}