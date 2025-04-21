import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { StarOff, Edit } from "lucide-react";
import { Trash2 } from "lucide-react";
import { database } from "../../../firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";

export default function AdminArticleList() {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        async function fetchArticles() {
            try {
                const articleRef = collection(database, "articles");
                const snapshot = await getDocs(articleRef);
                const articleData = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setArticles(articleData);
            } catch (error) {
                toast.error(error.message, { style: { color: "red" } });
            } finally {
                setIsLoading(false);
            }
        }
        fetchArticles();
    }, []);

    async function handleDelete(articleId) {
        if (window.confirm("Are you sure you want to delete this article?")) {
            try {
                await deleteDoc(doc(database, "articles", articleId));
                setArticles((prevArticles) => prevArticles.filter((article) => article.id !== articleId));
                toast.success("Article deleted successfully.");
            } catch (error) {
                toast.error("Failed to delete article: " + error.message);
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl fontleading font-bold">Articles</h1>
                <Link to="/go-admin/articles/new">
                    <button className="flex items-center gap-2 px-3 py-2 rounded shadow bg-[#7e69ab] text-white hover:bg-[#6b5896] focus:ring-4 focus:outline-none focus:ring-[#7e69ab] font-medium text-sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Article
                    </button>
                </Link>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                            <div className="flex justify-end space-x-2">
                                <div className="h-10 bg-gray-200 rounded w-20"></div>
                                <div className="h-10 bg-gray-200 rounded w-20"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : articles.length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Author</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Published</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Featured</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium">{article.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{article.author}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{article.publishedDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {article.isFeatured ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#7e69ab] text-white">
                                                    <StarOff className="mr-1 h-4 w-4" />
                                                    Featured
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                                    Not Featured
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link to={`/go-admin/articles/edit/${article.id}`}>
                                                    <button className="flex items-center gap-1 px-4 py-2 rounded shadow cursor-pointer hover:bg-blue-200">
                                                        <Edit className="h-4 w-4" />
                                                        Edit
                                                    </button>
                                                </Link>
                                                <button
                                                    className="cursor-pointer flex items-center gap-1 px-4 py-2 rounded shadow text-red-600 hover:bg-red-200 hover:text-red-700"
                                                    onClick={() => handleDelete(article.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <p>No articles found.</p>
            )}
        </div>
    );
}