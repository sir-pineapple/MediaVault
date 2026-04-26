import { useLocation, useNavigate } from "react-router-dom";

export default function Details() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) return <p className="text-white">No data</p>;

    return(
        <div
            className="h-screen flex flex-col justify-center items-center text-white relative"
            style={{
                backgroundImage: `url(${state.poster})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>

            <div className="relative z-10 text-center">
                <h1 className="text-4xl font-bold">{state.title}</h1>
                <p className="text-gray-300 mb-6">{state.year}</p>

                <button
                    onClick={() => navigate(`/player/${state.file.id}`)}
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl text-lg"
                >
                    ▶ Play
                </button>
            </div>
        </div>
    );
}