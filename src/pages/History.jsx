import CityRow from "../components/CityRow";
import Navbar from "../components/Navbar";
import { useWeather } from "../context/WeatherContext";

function formatTimeAgo(timestamp) {
    const diffMs = Date.now() - timestamp;
    const mins = Math.floor(diffMs / (60 * 1000));
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function History() {
    const { cities, visits } = useWeather();

    const recentVisits = visits
        .filter(v => Date.now() - v.timestamp < THIRTY_DAYS_MS)
        .sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div>
            <Navbar className="min-h-screen" />
            <div className="h-screen flex flex-col items-center py-10">
                <h2 className="text-3xl mb-5 font-bold">History</h2>

                {recentVisits.length > 0 && (
                    <ul className="w-[45%] border-sky-600/70 border-6 p-3 rounded-2xl flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
                        {recentVisits.map((visit, i) => {
                            const city = cities.find(c => c.id === visit.cityId);
                            if (!city) return null;
                            return (
                                <CityRow key={i} city={city} className="flex justify-between">
                                    <span>{formatTimeAgo(visit.timestamp)}</span>
                                </CityRow>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default History;
