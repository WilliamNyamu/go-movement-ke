import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { collection, getDocs } from "firebase/firestore";
import { database } from "../firebaseConfig";

const categories = [
  { label: "All", value: "all" },
  { label: "Community", value: "community" },
  { label: "Events", value: "events" },
  { label: "Missions", value: "missions" },
  { label: "Outreach", value: "outreach" },
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const querySnapshot = await getDocs(collection(database, "gallery"));
        const fetchedPhotos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPhotos(fetchedPhotos);
      } catch (error) {
        toast.error("Failed to fetch photos: " + error.message);
      }
    }

    fetchPhotos();
  }, []);

  const filteredPhotos =
    selectedCategory === "all"
      ? photos
      : photos.filter((photo) => photo.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl fontleading font-bold mb-4">Photo Gallery</h1>
        <p className="text-lg text-gray-600">
          Explore moments from our mission work, events, and community outreach through these images.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center flex-wrap gap-2 mb-10">
        {categories.map((category) => (
          <button
            key={category.value}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === category.value
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-gray-100 rounded-lg overflow-hidden shadow-md cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img src={photo.image} alt={photo.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-medium">{photo.title}</h3>
                <p className="text-sm text-gray-500">{photo.category}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No Photos Available</h3>
          <p className="text-gray-500">
            {selectedCategory === "all"
              ? "No photos have been uploaded yet."
              : `No photos in the ${selectedCategory} category yet.`}
          </p>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setSelectedPhoto(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedPhoto.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedPhoto.category.charAt(0).toUpperCase() + selectedPhoto.category.slice(1)}
            </p>
            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.title}
              className="w-full rounded-md mb-4"
            />
            <p className="text-gray-700">{selectedPhoto.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
