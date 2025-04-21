import { useState, useEffect } from "react"
import { database } from "../firebaseConfig"
import { getDocs, collection, doc, where, query } from "firebase/firestore"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function ArticleDetail(){
    const { slug } = useParams(); // Correctly extract 'slug' from useParams
    const [article, setArticle] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        function fetchArticle(){
            const articleCollectionRef = collection(database, "articles")
            const q = query(articleCollectionRef, where("slug", "==", slug)); // Use 'slug' instead of undefined variable
            getDocs(q) // Use getDocs instead of getDoc for queries
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        setArticle(querySnapshot.docs[0].data());
                    } else {
                        console.error("No such document!");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching article:", error)
                })
                .finally(() => {
                    setLoading(false)
                })
        }

        fetchArticle();
    }, [slug]); // Update dependency array to 'slug'
   
    if (loading) {
        return <div>Loading...</div>
    }
    
    if(!article) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-2xl font-bold mb-4">Error</h1>
                    <p className="text-gray-600 mb-6">"Article not found"</p>
                    <Link to="/articles" className="inline-block bg-[#7e69ab] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#7e69ab] hover:text-white transition duration-300 cursor-pointer">
                        <button className="">Back to Articles</button>
                    </Link>
                </div>
            </div>
        )
    }
    const formattedTimeStamp = new Date(article.timestamp.seconds * 1000).toLocaleString()

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <Link to='/articles' className="inline-flex items-center text-[#7e69ab] hover:text-[#6e59a5] mb-8">
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Back to Articles
                </Link>

                <h1 className="text-3xl md:text-4xl fontleading font-bold mb-4">{article.title}</h1>

                <div className="flex items-center text-gray-600 mb-8">
                    <span className="mr-4">By {article.author}</span>
                    <span>{article.timestamp ? formattedTimeStamp: "No timestamp"}</span>
                </div>

                {article.image && (
                    <div className="mb-8 relative">
                        <img 
                            src={article.image}
                            alt={article.title}
                            className="w-full h-98 object-cover rounded-lg  shadow-md"
                        />
                    </div>
                )}
                <div className="prose prose-lg max-w-none">
                    <p>{article.content}</p>

                </div>

            </div>
        </div>
    )
}