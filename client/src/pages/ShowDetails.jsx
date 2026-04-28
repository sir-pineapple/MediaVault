import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ShowDetails() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);

    if (!state) {
        return <div className="text-white p-10">No show data</div>;
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

    return (
        <div
            className="min-h-screen text-white relative"
            style={{
                backgroundImage: `url(${state.poster})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>

            <div className="relative z-10 px-16 py-10 max-w-4xl">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 bg-black/60 px-4 py-2 rounded-lg"
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
                    {details?.Year && <span>{details.Year}</span>}

                    {state.imdbID && (
                        <a
                            href={`https://www.imdb.com/title/${state.imdbID}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-yellow-400 hover:underline"
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
                    <p className="text-gray-400 mb-8">
                        {details.Genre}
                    </p>
                )}

                <div className="space-y-8">
                    {state.seasons.map(season => (
                        <div key={season.season}>
                            <h2 className="text-2xl font-semibold mb-3">
                                Season {season.season}
                            </h2>
                            <div className="flex flex-col gap-2">
                                {season.episodes.map(ep => (
                                    <div
                                        key={ep.id}
                                        onClick={() => navigate(`/watch/${ep.file.id}`)}
                                        className="bg-white/10 hover:bg-white/20 transition p-3 rounded-lg cursor-pointer flex justify-between"
                                    >
                                        <span>
                                            Episode {ep.episode}
                                        </span>
                                        <span className="text-gray-300">
                                            ▶ Play
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}