import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useWeather } from "../context/WeatherContext";
import { useEffect, useState } from "react";

//weather states coded
const weatherCodeMap = {
    0: { text: "Clear Sky", icon: "sun" },
    1: { text: "Mainly Clear", icon: "sun" },
    2: { text: "Partly Cloudy", icon: "cloud-sun" },
    3: { text: "Overcast", icon: "cloud" },
    45: { text: "Foggy", icon: "cloud-fog" },
    48: { text: "Rime Fog", icon: "cloud-fog" },
    51: { text: "Light Drizzle", icon: "cloud-rain" },
    53: { text: "Moderate Drizzle", icon: "cloud-rain" },
    55: { text: "Dense Drizzle", icon: "cloud-rain" },
    61: { text: "Slight Rain", icon: "cloud-rain" },
    63: { text: "Moderate Rain", icon: "cloud-rain" },
    65: { text: "Heavy Rain", icon: "cloud-rain" },
    71: { text: "Slight Snow", icon: "snowflake" },
    73: { text: "Moderate Snow", icon: "snowflake" },
    75: { text: "Heavy Snow", icon: "snowflake" },
    80: { text: "Rain Showers", icon: "cloud-rain" },
    81: { text: "Rain Showers", icon: "cloud-rain" },
    82: { text: "Violent Showers", icon: "cloud-rain" },
    95: { text: "Thunderstorm", icon: "cloud-lightning" },
    96: { text: "Thunderstorm + Hail", icon: "cloud-lightning" },
};

//decoding function
function decodeWeatherCode(code) {
    return weatherCodeMap[code] || { text: "Unknown", icon: "cloud" };
}

//weather showing icon
function WeatherIcon({ code, size = 24, className }) {
    const { icon } = decodeWeatherCode(code);

    const paths = {
        "cloud-rain": (
            <>
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7" />
                <path d="M11 13v2m0 3v2m4 -5v2m0 3v2" />
            </>
            //supposed to add other icons in future
        ),
    };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {paths[icon] || paths["cloud-rain"]}
        </svg>
    );
}

function City() {
    const { cityId } = useParams();
    const { cities, dispatch } = useWeather();
    const [view, setView] = useState("hourly");

    // returning whole city object that matching id of the town
    const city = cities.find(c => c.id === cityId);

    //loging a visit every time someone lands on a city's page
    useEffect(() => {
        if (city) {
            dispatch({ type: "city/visited", payload: city.id });
        }
    }, [cityId]);

    const navigate = useNavigate();

    //if user navigate to /city/cityId directly
    if (!city)
        return (
            <div className="min-h-screen flex flex-col gap-5 justify-center items-center">
                <p className="text-3xl text-sky-700 font-bold">City not found.</p>
                <button
                    onClick={() => navigate("/")}
                    className="rounded-full text-white bg-sky-600 hover:bg-sky-700 px-5 py-2 font-bold"
                >
                    Home
                </button>
            </div>
        );

    //data needed from city
    const { current, daily, hourly, cityName, country, isFav } = city;

    //dispatching toggle favorite
    function handleToggleFavorite() {
        dispatch({ type: "favorite/toggled", payload: city.id });
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="flex flex-col items-center justify-center mt-44 gap-16">
                <div className="flex flex-col items-center">
                    <div className="flex gap-8">
                        <WeatherIcon code={current.weatherCode} size={128} className="text-slate-600" />

                        <div className="flex flex-col gap-3 items-start mt-2">
                            <div>
                                <h2 className="text-2xl font-semibold">{country}</h2>
                                <h3 className="text-lg text-gray-500">{cityName}</h3>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleToggleFavorite}
                                    className="p-2 bg-sky-700 rounded-full border-2 border-white"
                                >
                                    {/* conditionally rendering icon shape in city based on isFav state */}
                                    {isFav ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="white"
                                            className="icon icon-tabler icons-tabler-filled icon-tabler-heart"
                                        >
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="icon icon-tabler icons-tabler-outline icon-tabler-heart"
                                        >
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                                        </svg>
                                    )}
                                </button>

                                <select
                                    value={view}
                                    onChange={e => setView(e.target.value)}
                                    className="border-2 border-sky-500 focus:border-sky-700 outline-none rounded-full px-4 py-2 bg-white/70 text-sky-700 font-medium cursor-pointer"
                                >
                                    <option value="hourly">Hourly</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-[70%] h-[50vh] overflow-x-auto pb-4 px-4 max-md:flex-col max-md:overflow-y-auto">
                    {/* rendering showen data based on hourly or daily */}
                    {view === "hourly"
                        ? hourly.map((h, i) => (
                              <div
                                  key={i}
                                  className="flex items-center gap-2  p-3 rounded-xl bg-gray-200 max-md:w-[50%] max-md:justify-center"
                              >
                                  <div className="m-0">
                                      <WeatherIcon code={h.weatherCode} size={64} className="text-slate-600" />
                                  </div>
                                  <div className="flex flex-col">
                                      <span className="text-md text-gray-500">{new Date(h.time).getHours()}:00</span>
                                      <span className="text-md font-medium">{h.temp}°</span>
                                  </div>
                              </div>
                          ))
                        : daily.map(d => (
                              <div
                                  key={d.date}
                                  className="flex flex-col items-center w-[50%] gap-1 p-3 rounded-xl bg-gray-200 max-md:w-[50%]"
                              >
                                  <div className="flex gap-4">
                                      <WeatherIcon code={d.weatherCode} size={64} className="text-slate-600" />
                                      <div className="flex flex-col gap-1">
                                          <span className="text-md font-medium">{d.tempMax}°</span>
                                          <span className="text-md text-gray-400">{d.tempMin}°</span>
                                      </div>
                                  </div>
                                  <div className="flex gap-5">
                                      <span className="text-md text-gray-500">
                                          {new Date(d.date).toLocaleDateString(undefined, { weekday: "short" })}
                                      </span>
                                      <span className="text-md text-gray-500">
                                          {new Date(d.date).toLocaleDateString(undefined, {
                                              day: "numeric",
                                              month: "short",
                                          })}
                                      </span>
                                  </div>
                              </div>
                          ))}
                </div>
            </div>
        </div>
    );
}

export default City;
