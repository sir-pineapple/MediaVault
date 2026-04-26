import { useNavigate } from "react-router-dom";

export default function MediaCard({ media }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => 
                navigate(`/details/${media.file.id}`, { state: media })
            }
            className="relative w-48 cursor-pointer group"
        >
            <img
                src={media.poster || "https://via.placeholder.com/300x450"}
                className="rounded-xl transition duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-end p-3">
                <div>
                    <p className="font-semibold">{media.title}</p>
                    <p className="text-sm text-gray-300">{media.year}</p>
                </div>
            </div>
        </div>
    );
}