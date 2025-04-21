import Hero from "../assets/images/hero-image.jpeg";
import { database } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import Default from "../assets/images/articledefault.jpg";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export default function Articles(){

    const collectionRef = collection(database, "articles");
    const [articles, setArticles] = useState([])
    const navigate = useNavigate(); // Initialize useNavigate

    // Sort articles by timestamp in descending order to display the newest articles first
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const articlesCollection = collection(database, "articles");
                const articlesSnapshot = await getDocs(articlesCollection);
                const articlesList = articlesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Sort articles by timestamp in descending order
                articlesList.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
                setArticles(articlesList);
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        };

        fetchArticles();
    }, []);

    
    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 fontleading">Articles & Stories</h1>
                <p className="text-lg text-gray-600">Explore our collection of articles, stories, and updates about mission work around the world</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.length > 0 ? (
                    articles.map((article) => {
                        return (
                            <div key={article.id} className="flex flex-col bg-white shadow-lg rounded-lg">
                                <img 
                                    src={article.image || Default} // Use Default image if article.image is not available
                                    alt={article.title}
                                    className="w-full h-48 object-cover rounded-t-lg"
                                />
                                <div className="p-4 flex flex-col justify-between h-full">
                                    <div className="mb-4">
                                        <h2 className="mb-2 text-xl fontleading font-medium">{article.title}</h2>
                                        <p className="text-gray-600 text-sm">{article.content.substring(0, 100)}... <span className="text-blue-500 cursor-pointer" onClick={() => navigate(`/articles/${article.slug}`)}>Read more</span></p>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between gap-3"> {/* Added mt-auto to push this section to the bottom */}
                                        <h1 className="text-gray-500 text-xs">{article.author}</h1>
                                        <p className="text-xs text-gray-500">{article.timestamp ? new Date(article.timestamp.seconds * 1000).toLocaleString() : "No timestamp available"}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })

                ): (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center">
                        <p className="text-gray-500">No articles available at the moment.</p>
                    </div>
                )}
                {/* <div className="flex flex-col bg-white shadow-lg rounded-lg">
                    <img
                        src={Hero}
                        alt="Article Image"
                        className="w-full h-48 object-cover rounded-t-lg"
                    
                    />
                    <div className="p-4">
                        <h2 className="mb-2 text-xl fontleading font-medium">Community Outreach Success Story</h2>
                        <p className="text-gray-600 text-sm">Our recent community outreach program has made a significant impact. Through the dedication of our volunteers and the ge...</p>
                    </div>
                    <div className="p-4 flex items-center justify-between gap-3 ">
                        <h1 className="text-gray-500 text-xs">Sarah Johnson</h1>
                        <p className="text-xs text-gray-500">about 6 hours ago</p>
                    </div>

                </div> */}

            </div>

        </section>
    )
}
