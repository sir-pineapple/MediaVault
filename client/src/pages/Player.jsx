import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Player() {
    const { id } = useParams();
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [overlay, setOverlay] = useState(null);
    const [progress, setProgress] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        const handleKey = (e) => {
            if (!videoRef.current) return;

            switch(e.code) {
                case "Space":
                    e.preventDefault();
                    togglePlay();
                    break;
                case "ArrowRight":
                    skip(10);
                    break;
                case "ArrowLeft":
                    skip(-10);
                    break;
                case "KeyF":
                    toggleFullscreen();
                    break;
                case "KeyM":
                    toggleMute();
                    break;
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    useEffect(() => {
        let timeout;

        const handleMouseMove = () => {
            setShowControls(true);

            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setShowControls(false);
            }, 2000);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = !video.muted;
        setMuted(video.muted);

        showOverlay(video.muted ? "🔇" : "🔊", "center");
    };

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
            setPlaying(true);
            showOverlay("▶", "center");
        }
        else {
            video.pause();
            setPlaying(false);
            showOverlay("⏸", "center");
        }
    };

    const skip = (seconds) => {
        const video = videoRef.current;
        if (!video) return;

        video.currentTime += seconds;

        if (seconds > 0) {
            showOverlay("+10s", "right");
        }
        else {
            showOverlay("-10s", "left");
        }
    };

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video || !video.duration) return;

        const time = video.currentTime;
        setCurrentTime(video.currentTime);

        const percent = (time / video.duration) * 100;
        setProgress(percent);

        localStorage.setItem(`progress-${id}`, time);
    };

    const handleLoadedMetadata = () => {
        const video = videoRef.current;
        if (!video) return;

        setDuration(video.duration);

        const saved = localStorage.getItem(`progress-${id}`);
        if (saved) {
            video.currentTime = parseFloat(saved);
        }
    };

    const handleSeek = (e) => {
        const video = videoRef.current;
        if (!video || !video.duration) return;

        const newTime = (e.target.value / 100) * video.duration;
        video.currentTime = newTime;
    };

    const handleEnded = () => {
        localStorage.removeItem(`progress-${id}`);
    }

    const showOverlay = (text, position="center") => {
        setOverlay({ text, position });

        setTimeout(() => {
            setOverlay(null);
        }, 600);
    };

    const toggleFullscreen = () => {
        const container = videoRef.current?.parentElement;
        if (!container) return;

        if (!document.fullscreenElement) {
            container.requestFullscreen();
        }
        else {
            document.exitFullscreen();
        }
    };

    const formatTime = (time) => {
        if (!time) return "0:00";

        const hours = Math.floor(time/3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        }

        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="bg-black h-screen flex justify-center items-center">
            <div className="relative w-[80%]">
                <video
                    ref={videoRef}
                    onClick={togglePlay}
                    onEnded={handleEnded}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    className="w-full rounded-xl cursor-pointer"
                >
                    <source src={`${import.meta.env.VITE_API_URL}/stream/${id}`} />
                </video>

                <div className={`absolute bottom-0 left-0 w-full transition-opacity duration-300 ${
                    showControls ? "opacity-100" : "opacity-0"
                }`}>
                    <div className="bg-black/60 backdrop-blur-md px-4 py-3 rounded-b-xl flex items-center gap-4">
                        <button
                            onClick={togglePlay}
                            className="text-white text-lg px-2 cursor-pointer"
                        >
                            {playing ? "⏸" : "▶"}
                        </button>
                        
                        <button
                            onClick={toggleMute}
                            className="text-white text-lg px-2 cursor-pointer"
                        >
                            {muted ? "🔇" : "🔊"}
                        </button>

                        <span className="text-white text-sm w-12">
                            {formatTime(currentTime)}
                        </span>

                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={handleSeek}
                            className="flex-1 cursor-pointer"
                        />

                        <span className="text-white text-sm w-12 text-right">
                            {formatTime(duration)}
                        </span>

                        <button
                            onClick={toggleFullscreen}
                            className="text-white text-lg px-2 cursor-pointer"
                        >
                            ⛶
                        </button>
                    </div>
                </div>

                {overlay && (
                    <div
                        className={`absolute inset-0 flex items-center
                        ${overlay.position === "center" ? "justify-center" : ""}
                        ${overlay.position === "left" ? "justify-start pl-10" : ""}
                        ${overlay.position === "right" ? "justify-end pr-10" : ""}
                        text-white text-5xl font-bold bg-black/30 rounded-xl`}
                    >
                        {overlay.text}
                    </div>
                )}
            </div>
        </div>
    );
}