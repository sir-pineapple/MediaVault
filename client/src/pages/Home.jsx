import { useEffect, useState } from "react";
import API from "../api/api";
import MediaCard from "../components/MediaCard";
import Navbar from "../components/Navbar";

export default function Home() {
    const [data, setData] = useState({ movies: [], shows: [] });
    const [loading, setLoading] = useState(false);

    const fetchMedia = async () => {
        const res = await API.get("/media");
        setData(res.data);
    };

    const refresh = async () => {
        try {
            setLoading(true);

            await API.post("/scan");
            await API.post("/metadata");
            await fetchMedia();
        }
        catch (err) {
            console.error("Refreshing failed:", err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);
    
    return (
        <div className="bg-[#0b0b0f] min-h-screen text-white">
            <Navbar onRefresh={refresh} loading={loading}/>

            <div className="px-6 py-4">
                <h2 className="text-xl font-semibold mb-4">Movies</h2>
                <div className="flex flex-wrap gap-4">
                    {data.movies.map(m => (
                        <MediaCard key={m.file.id} media={m} />
                    ))}
                </div>

                <h2 className="text-xl font-semibold mt-10 mb-4">Shows</h2>
                <div className="flex flex-wrap gap-4">
                    {data.shows.map(s => (
                        <MediaCard key={s.id} media={s} />
                    ))}
                </div>
            </div>
        </div>
    );
}