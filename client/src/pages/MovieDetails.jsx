import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Details() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);

    if (!state || !state.file) {
        return (
            <div className="text-white p-10">
                Invalid movie data
            </div>
        );
    }

    useEffect(() => {
        if (!state?.imdbID) return;

        const fetchDetails = async () => {
            try {
                const res = await fetch(
                    `https://www.omdbapi.com/?i=${state.imdbID}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`
                );
                const data = await res.json();

                if (data.Response !== "False") {
                    setDetails(data);
                }
            }
            catch (err) {
                console.error(err);
            }
        };

        fetchDetails();
    }, [state]);

    return(
        <div
            className="min-h-screen text-white relative flex items-center"
            style={{
                backgroundImage: `url(${state.poster})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>

            <div className="relative z-10 px-16 max-w-2xl">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 bg-purple-600 px-4 py-2 rounded-lg cursor-pointer"
                >
                    ← Back
                </button>
                <img
                    src={state.poster}
                    className="w-40 rounded-lg mb-6 shadow-lg"
                />
                <h1 className="text-5xl font-bold mb-4">
                    {state.title}
                </h1>
                <div className="flex items-center gap-4 text-gray-300 mb-6">
                    <span>{state.year}</span>

                    {details?.Runtime && (
                        <span>• {details.Runtime}</span>
                    )}

                    {state.imdbID && (
                        <a
                            href={`https://www.imdb.com/title/${state.imdbID}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-yellow-400 hover-underline"
                        >
                            IMDb
                        </a>
                    )}
                </div>
                {details?.Plot && (
                    <p className="text-gray-300 mb-4 leading-relaxed">
                        {details.Plot}
                    </p>
                )}
                {details?.Genre && (
                    <p className="text-gray-400 mb-6">
                        {details.Genre}
                    </p>
                )}
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate(`/watch/${state.file.id}`)}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-500 cursor-pointer"
                    >
                        ▶ Play
                    </button>
                </div>
            </div>
        </div>
    );
}