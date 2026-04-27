import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function Player() {
    const { id } = useParams();
    const videoRef = useRef();
    const [playing, setPlaying] = useState(false);

    const togglePlay = () => {
        if (playing) videoRef.current.pause();
        else videoRef.current.play();
        setPlaying(!playing);
    };

    return (
        <div className="bg-black h-screen flex flex-col justify-center items-center text-white">
            <video
                ref={videoRed}
                src={`${import.meta.env.VITE_API_URL}/stream/${id}`}
                className="w-[80%] rounded-xl"
            />

            <div className="mt-4 flex gap-4">
                <button
                    onClick={togglePlay}
                    className="bg-purple-600 px-4 py-2 rounded-lg"
                >
                    {playing ? "Pause" : "Play"}
                </button>
            </div>
        </div>
    );
}