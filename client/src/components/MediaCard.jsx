import { useNavigate } from "react-router-dom";

export default function MediaCard({ media }) {
    const navigate = useNavigate();

    const isMovie = !!media.file;

    const handleClick = () => {
        if (isMovie) {
            navigate(`/movies/${media.id}`, { state: media });
        }
        else {
            navigate(`/shows/${media.id}`, { state: media });
        }
    };

    return (
        <div
            onClick={handleClick}
            className="relative w-48 cursor-pointer group"
        >
            <img
                src={media.poster || "https://via.placeholder.com/300x450"}
                className="rounded-xl transition duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 transition rounded-xl flex items-end p3">
                <div>
                    <p className="font-semibold">{media.title}</p>

                    {isMovie ? (
                        <p className="text-sm text-gray-300">
                            {media.year}
                        </p>
                    ) : (
                        <p className="text-sm text-gray-300">
                            {media.seasons.length} Seasons
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}