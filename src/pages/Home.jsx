import { useState } from "react";
import CityRow from "../components/CityRow";
import Navbar from "../components/Navbar";
import { useWeather } from "../context/WeatherContext";
import { useNavigate } from "react-router-dom";

function Home() {
    const { cities, searchCity, status, error } = useWeather();
    const [query, setQuery] = useState("");

    const navigate = useNavigate();

    const favorites = cities.filter(c => c.isFav);
    const mostVisited = [...cities].sort((a, b) => b.visitCount - a.visitCount).slice(0, 5);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!query.trim()) return;

        const cityId = await searchCity(query);

        if (cityId) {
            setQuery("");
            navigate(`/city/${cityId}`);
        }
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="flex flex-col justify-center items-center gap-10 mt-40">
                <h1 className="text-5xl font-bold">What is the weather today?</h1>
                <form onSubmit={handleSubmit} className="flex justify-center w-[80%] gap-5 m-5">
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search town..."
                        className="border-4 border-sky-200 focus:border-sky-500 outline-none bg-white/70 rounded-4xl px-5 py-3 w-[40%]"
                    />
                    <button
                        type="submit"
                        className="w-[15%] rounded-4xl bg-sky-600 hover:bg-sky-700 text-white px-5 py-3 transition-colors"
                    >
                        {status === "loading" ? "Searching..." : "Search"}
                    </button>
                </form>

                {status === "error" && <p className="text-sky-700 mt-6 font-bold">{error}</p>}

                {favorites.length > 0 && (
                    <>
                        <h3 className="text-3xl font-bold">Favourite cities</h3>
                        <ul className="flex gap-2">
                            {favorites.map(city => (
                                <CityRow
                                    key={city.id}
                                    city={city}
                                    className={"rounded-full bg-sky-600 text-lg text-white font-bold px-3 py-1"}
                                />
                            ))}
                        </ul>
                    </>
                )}

                {mostVisited.length > 0 && (
                    <>
                        <h3 className="text-3xl font-bold ">Most visited</h3>
                        <ul className="w-[45%] border-sky-600/70 border-6 p-3 rounded-2xl flex flex-col gap-5 most-visited-list">
                            {mostVisited.map(city => (
                                <CityRow key={city.id} city={city} className={"flex justify-between"}>
                                    <span>{city.visitCount} visits</span>
                                </CityRow>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;
