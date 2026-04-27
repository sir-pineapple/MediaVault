import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails"
import ShowDetails from "./pages/ShowDetails"
import Player from "./pages/Player"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies/:id" element={<MovieDetails />} />
                <Route path="/shows/:id" element={<ShowDetails />} />
                <Route path="/watch/:id" element={<Player />} />
            </Routes>
        </BrowserRouter>
    );
}