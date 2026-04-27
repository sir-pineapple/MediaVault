import { useLocation, useNavigate } from "react-router-dom";

export default function ShowDetails() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return <div className="text-white p-10">No show data</div>;
    }

    return (
        <div
            className="min-h-screen text-white relative"
            style={{
                backgroundImage: `url(${state.poster})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-black/80 blackdrop-blur-md"></div>

            <div className="relative z-10 px-6 py-8">
                <h1 className="text-4xl font-bold mb-6">
                    {state.title}
                </h1>

                {state.seasons.map(season => (
                    <div key={season.season} className="mb-8">
                        <h2 className="text-2xl font-semibold mb-3">
                            Season {season.season}
                        </h2>

                        <div className="flex flex-col gap-2">
                            {season.episodes.map(ep => (
                                <div
                                    key={ep.id}
                                    onClick={() => navigate(`/watch/${ep.file.id}`)}
                                    className="bg-white/10 hover:big-white/20 transition p-3 rounded-lg cursor-pointer flex justify-between"
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
    );
}