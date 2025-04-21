import { useState, useEffect } from "react";
import { database } from "../../../firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { storage } from "../../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

export default function AdminArticleForm() {
    const { id } = useParams(); // Get the article ID from the URL
    const navigate = useNavigate();

    // Set up the collection reference for articles in the database
    const collectionRef = collection(database, "articles");

    // State for article data
    const [articleData, setArticleData] = useState({
        title: '',
        content: '',
        author: ''
    });

    // State for the selected image file
    const [image, setImage] = useState(null);

    // State for the image download URL
    const [imageDownloadURL, setImageDownloadURL] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission status

    useEffect(() => {
        if (id) {
            // Fetch the article data for editing
            const fetchArticle = async () => {
                try {
                    const docRef = doc(database, "articles", id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setArticleData(data);
                        setImageDownloadURL(data.image || null); // Ensure image URL is set for preview
                    } else {
                        toast.error("Article not found.");
                        navigate("/go-admin/articles");
                    }
                } catch (error) {
                    toast.error("Failed to fetch article: " + error.message);
                }
            };
            fetchArticle();
        }
    }, [id, navigate]);

    // Function to handle image file selection
    function handleImageUpload(e) {
        setImage(e.target.files[0]);
    }

    // Function to upload the image and get the download URL
    function handleImageSubmit() {
        return new Promise((resolve, reject) => {
            if (!image) {
                reject(new Error("No image selected"));
                return;
            }

            const imageRef = ref(storage, `article/images/${image.name}`);
            const uploadTask = uploadBytesResumable(imageRef, image);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    toast(`Upload is ${progress}% done`);
                },
                (error) => {
                    console.error("Upload failed", error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            console.log("Image uploaded successfully", downloadURL);
                            setImageDownloadURL(downloadURL); // Update state with the download URL
                            resolve(downloadURL);
                        })
                        .catch((error) => {
                            console.error("Failed to get download URL", error);
                            reject(error);
                        });
                }
            );
        });
    }

    // Function to handle form input changes
    function handleChange(e) {
        const { name, value } = e.currentTarget;
        setArticleData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    // function to generate a slug so that the article can be accessed using it instead of the id
    function generateSlug(title){
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric charaters with hyphens
            .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
    }

    // Function to handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const downloadURL = image ? await handleImageSubmit() : imageDownloadURL;
            const slug = generateSlug(articleData.title);

            if (id) {
                // Update existing article
                const docRef = doc(database, "articles", id);
                await updateDoc(docRef, {
                    ...articleData,
                    image: downloadURL,
                    slug,
                });
                toast.success("Article updated successfully!");
            } else {
                // Create new article
                await addDoc(collectionRef, {
                    ...articleData,
                    image: downloadURL,
                    timestamp: serverTimestamp(),
                    slug,
                });
                toast.success("Article created successfully!");
            }

            navigate("/go-admin/articles");
        } catch (error) {
            toast.error("Failed to submit the article: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <> 
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl fontleading font-bold">
                        {id ? "Edit Article" : "Create Article"}
                    </h1>
                    <Link to='/go-admin/articles'>
                        <button className="flex items-center gap-1 px-4 py-2 border-gray-300 rounded shadow hover:bg-gray-400">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Articles
                        </button>
                    </Link>                   
                </div>
                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block mb-2 text-lg font-medium text-gray-900 ">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="title"
                            name="title"
                            value={articleData.title} 
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#7e69ab] focus:border-[#7e69ab] block w-full p-2.5" 
                            placeholder="Title of the article" 
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="content" className="block mb-2 text-lg font-medium text-gray-900">Content <span className="text-red-500">*</span> </label>
                        <textarea 
                            id="content" 
                            name="content" 
                            value={articleData.content}
                            onChange={handleChange}
                            rows="4" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#7e69ab] focus:border-[#7e69ab] block w-full p-2.5" 
                            placeholder="Write your article content here..." 
                            required
                        ></textarea>
                    </div> 
                    <div className="space-y-2">
                        <label htmlFor="author" className="block mb-2 text-lg font-medium text-gray-900">Author <span className="text-red-600">*</span></label>
                        <input 
                            type="text" 
                            id="author" 
                            name="author"
                            value={articleData.author} 
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#7e69ab] focus:border-[#7e69ab] block w-full p-2.5" 
                            placeholder="Author of the article" 
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <h1 className="block mb-2 text-lg font-medium text-gray-900">Featured Image</h1>
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
                                            name="image"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </div>
                                    <p className="mt-3 text-sm text-gray-500 text-center">
                                        Click to upload or drag and drop <br />
                                        SVG, PNG, JPG or GIF (max. 2MB)
                                    </p>
                                </div>
                            </div>
                            <div>
                                {imageDownloadURL && !image && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                                        <div className="w-full h-48 rounded-md overflow-hidden border border-gray-300">
                                            <img 
                                                src={imageDownloadURL} 
                                                alt="Current Article" 
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
                        className="w-full text-white bg-[#7e69ab] hover:bg-[#6b5896] focus:ring-4 focus:outline-none focus:ring-[#7e69ab] font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#7e69ab] dark:hover:bg-[#6b5896] dark:focus:ring-[#7e69ab]"
                        disabled={isSubmitting} // Disable button while submitting
                    >
                        {isSubmitting ? (id ? "Updating..." : "Submitting...") : (id ? "Update Article" : "Create Article")}
                    </button>
                </form>
            </div>
            
        </>
    );
}