"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../../context";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";

export default function Home() {
  const [preferences, setPreferences] = useState([]);
  const { user } = useGlobalContext();
  const router = useRouter();
  const [places, setPlaces] = useState([]);
  const [similarUsers, setSimilarUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log(similarUsers)

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usersResult, placesResult] = await Promise.all([
          fetch("http://127.0.0.1:5000/recommendations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: user.name }),
          }),
          Promise.all(
            user.destination.map(destination =>
              fetch(`http://127.0.0.1:5000/search_places?query=${destination}`)
            )
          )
        ]);

        const usersData = await usersResult.json();
        if (usersData.status) setSimilarUsers(usersData.users);

        const placesData = await Promise.all(placesResult.map(res => res.json()));
        setPlaces(placesData.flat());
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 text-indigo-800">Welcome to VoyageVista</h1>
          <p className="text-xl text-gray-600">Explore, Share, and Connect with Fellow Travelers</p>
        </motion.section>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <h2 className="text-3xl font-semibold mb-6 text-indigo-700">Travel Chronicles</h2>
              <div className="space-y-8">
                {similarUsers.flatMap((user) =>
                  user.journals.slice(0, 2).map((journal) => (
                    <motion.div
                      key={journal.id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden flex h-48 p-4"
                    >
                      <div className="p-6 flex-grow">
                        <div className="flex gap-2 items-center justify-items-center">
                      <img src={`./${user.picture}`} alt="" className="w-6 h-6 rounded-full object-cover"/>
                      <p className="text-indigo-600 ">{user.name}</p>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">{journal.title}</h3>
                        
                        <p className="text-gray-500 mb-2">
                      {formatDate(journal.createdAt)}
                    </p>
                        <button
                          className="text-indigo-500 hover:text-indigo-700 font-medium transition-colors duration-300"
                          onClick={() => router.push(`/journal/${journal.id}`)}
                        >
                          Read more →
                        </button>
                      </div>
                      <div className="w-1/3 min-w-[200px]">
                        <img
                          src={`./journal/${journal.picture}`}
                          alt={journal.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-3xl font-semibold mb-6 text-indigo-700">Fellow Travelers</h2>
              <div className="space-y-6">
                {similarUsers.slice(0, 3).map((user, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4"
                    onClick={()=>router.push(`profile/${user.name}`)}
                  >
                    <img
                      src={`./${user?.picture}`}
                      alt=""
                      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-300"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                      <p className="text-gray-600 text-sm">{user.bio}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-semibold mb-6 text-indigo-700">Discover Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.slice(0, 6).map((place, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <a href={place.osm} target="_blank" rel="noopener noreferrer">
                  <img
                    src={place.image !== "No image available" ? place.image : "./MUNNAR.jpg"}
                    alt={place.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{place.name}</h3>
                    <div className="flex flex-wrap">
                      {place.kinds.slice(0, 3).map((el, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">
                          {el}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}