import React, { useState, useEffect } from "react";
import { CirclePlus, Eye } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import AdminLayout from "../../components/layout/AdminLayout";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalEvents: 0,
    totalPhotos: 0,
  });

  const [recentActions, setRecentActions] = useState([]);

  useEffect(() => {
    async function fetchStatsAndActions() {
      try {
        // Fetch total articles
        const articlesSnapshot = await getDocs(collection(database, "articles"));
        const totalArticles = articlesSnapshot.size;

        // Fetch total events
        const eventsSnapshot = await getDocs(collection(database, "events"));
        const totalEvents = eventsSnapshot.size;

        // Fetch total photos
        const gallerySnapshot = await getDocs(collection(database, "gallery"));
        const totalPhotos = gallerySnapshot.size;

        // Update stats
        setStats({ totalArticles, totalEvents, totalPhotos });

        // Fetch recent actions (example: last 5 actions from articles collection)
        const recentActions = articlesSnapshot.docs.slice(0, 5).map((doc) => ({
          action: "Added new article",
          item: doc.data().title,
          time: "Recently",
        }));

        setRecentActions(recentActions);
      } catch (error) {
        console.error("Error fetching stats or actions: ", error);
      }
    }

    fetchStatsAndActions();
  }, []);

  return (
    <>
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex space-x-2">
                <Link to="/go-admin/articles/new">
                    <button className=" flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                        <CirclePlus className="mr-2" size={16} /> {/* Icon from lucide-react */}
                        New Article
                    </button>
                </Link>
                <Link to='/go-admin/articles/new'>
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                        <CirclePlus className="mr-2" size={16} /> {/* Icon from lucide-react */}
                        New Event
                    </button>
                </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-4 bg-white shadow rounded">
                <h3 className="text-lg font-medium">Total Articles</h3>
                <p className="text-3xl font-bold">{stats.totalArticles}</p>
                <a href="/go-admin/articles" className="text-purple-600 text-sm hover:underline">
                    View all articles
                </a>
                </div>
                <div className="p-4 bg-white shadow rounded">
                <h3 className="text-lg font-medium">Total Events</h3>
                <p className="text-3xl font-bold">{stats.totalEvents}</p>
                <a href="/go-admin/events" className="text-purple-600 text-sm hover:underline">
                    View all events
                </a>
                </div>
                <div className="p-4 bg-white shadow rounded">
                <h3 className="text-lg font-medium">Photo Gallery</h3>
                <p className="text-3xl font-bold">{stats.totalPhotos}</p>
                <a href="/go-admin/gallery" className="text-purple-600 text-sm hover:underline">
                    Manage gallery
                </a>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="p-4 bg-white shadow rounded">
                <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                <ul className="space-y-3">
                {recentActions.map((action, index) => (
                    <li key={index} className="flex justify-between items-center">
                    <div>
                        <p className="font-medium">{action.action}</p>
                        <p className="text-sm text-gray-500">{action.item}</p>
                    </div>
                    <span className="text-xs text-gray-500">{action.time}</span>
                    </li>
                ))}
                </ul>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white shadow rounded">
                <h3 className="text-lg font-medium mb-4">Getting Started</h3>
                <ul className="space-y-3">
                    <li className="flex items-start">
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        <span className="text-purple-600 font-medium">1</span>
                    </div>
                    <div>
                        <h4 className="font-medium">Create new content</h4>
                        <p className="text-sm text-gray-500">Add articles, events, or upload photos to the gallery.</p>
                    </div>
                    </li>
                    <li className="flex items-start">
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        <span className="text-purple-600 font-medium">2</span>
                    </div>
                    <div>
                        <h4 className="font-medium">Manage existing content</h4>
                        <p className="text-sm text-gray-500">Edit or delete articles, events, and photos.</p>
                    </div>
                    </li>
                    <li className="flex items-start">
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        <span className="text-purple-600 font-medium">3</span>
                    </div>
                    <div>
                        <h4 className="font-medium">Preview your website</h4>
                        <p className="text-sm text-gray-500">Check how everything looks on the public site.</p>
                    </div>
                    </li>
                </ul>
                </div>
                <div className="p-4 bg-white shadow rounded">
                <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Link to='/go-admin/articles/new'>
                        <button className="p-4 bg-gray-100 rounded hover:bg-gray-200">
                        <div className="flex flex-col items-center">
                            <CirclePlus className="text-purple-600" size={24} />
                            <span>Create Article</span>
                        </div>
                        </button>
                    </Link>
                    <Link to='/go-admin/events/new'>
                        <button className="p-4 bg-gray-100 rounded hover:bg-gray-200">
                        <div className="flex flex-col items-center">
                            <CirclePlus className="text-purple-600" size={24} />
                            <span>Schedule Event</span>
                        </div>
                        </button>`
                    </Link>
                    <Link to='/go-admin/gallery/new'>
                        <button className="p-4 bg-gray-100 rounded hover:bg-gray-200">
                        <div className="flex flex-col items-center">
                            <CirclePlus className="text-purple-600" size={24} />
                            <span>Upload Photos</span>
                        </div>
                        </button>
                    </Link>
                    <Link to='/'>
                        <button className="p-4 bg-gray-100 rounded hover:bg-gray-200">
                        <div className="flex flex-col items-center">
                            <Eye className="text-purple-600" size={24} />
                            <span>View Website</span>
                        </div>
                        </button>
                    </Link>
                    
                </div>
                </div>
            </div>
        </div>
    </>
  );
};
