export default function Navbar({ onRefresh, loading }) {
    return (
        <div className="flex justify-between items-center px-6 py-4 bg-black/80 backdrop-blur-md sticky top-0 z-50">
            <h1 className="text-2xl font-bold text-purple-400">MediaVault</h1>

            <button
                onClick={onRefresh}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
            >
                {loading ? "Refreshing..." : "Refresh"}
            </button>
        </div>
    );
}