import { createContext, useReducer, useContext, useEffect, useState } from "react";

const WeatherContext = createContext();

const weatherCodeMap = {
    0: { text: "Clear Sky", icon: "☀️" },
    1: { text: "Mainly Clear", icon: "🌤️" },
    2: { text: "Partly Cloudy", icon: "⛅" },
    3: { text: "Overcast", icon: "☁️" },
    45: { text: "Foggy", icon: "🌫️" },
    48: { text: "Depositing Rime Fog", icon: "🌫️" },
    51: { text: "Light Drizzle", icon: "🌦️" },
    53: { text: "Moderate Drizzle", icon: "🌦️" },
    55: { text: "Dense Drizzle", icon: "🌧️" },
    61: { text: "Slight Rain", icon: "🌧️" },
    63: { text: "Moderate Rain", icon: "🌧️" },
    65: { text: "Heavy Rain", icon: "🌧️" },
    71: { text: "Slight Snow", icon: "🌨️" },
    73: { text: "Moderate Snow", icon: "🌨️" },
    75: { text: "Heavy Snow", icon: "❄️" },
    80: { text: "Slight Rain Showers", icon: "🌦️" },
    81: { text: "Moderate Rain Showers", icon: "🌧️" },
    82: { text: "Violent Rain Showers", icon: "⛈️" },
    95: { text: "Thunderstorm", icon: "🌩️" },
    96: { text: "Thunderstorm with Hail", icon: "⛈️" },
};

const initialState = {
    cities: [],
    visits: [],
    status: "idle",
    error: null,
};

function reducer(state, action) {
    switch (action.type) {
        case "fetch/start":
            return { ...state, status: "loading", error: null };

        case "fetch/success": {
            const newCity = action.payload;
            const existingIndex = state.cities.findIndex(c => c.id === newCity.id);

            const updatedCities =
                existingIndex === -1
                    ? [...state.cities, newCity]
                    : state.cities.map((c, i) => (i === existingIndex ? newCity : c));

            return { ...state, cities: updatedCities, status: "success" };
        }

        case "fetch/error":
            return { ...state, status: "error", error: action.payload };

        case "favorite/toggled":
            return {
                ...state,
                cities: state.cities.map(c => (c.id === action.payload ? { ...c, isFav: !c.isFav } : c)),
            };

        case "city/visited":
            return {
                ...state,
                cities: state.cities.map(c =>
                    c.id === action.payload ? { ...c, visitCount: c.visitCount + 1, lastVisited: Date.now() } : c,
                ),
                visits: [...state.visits, { cityId: action.payload, timestamp: Date.now() }],
            };

        case "cities/loaded":
            return { ...state, cities: action.payload };

        case "visits/loaded":
            return { ...state, visits: action.payload };

        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}

function WeatherProvider({ children }) {
    const [{ cities, visits, error, status }, dispatch] = useReducer(reducer, initialState);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const storedCities = localStorage.getItem("weatherApp-cities");
        const storedVisits = localStorage.getItem("weatherApp-visits");
        if (storedCities) dispatch({ type: "cities/loaded", payload: JSON.parse(storedCities) });
        if (storedVisits) dispatch({ type: "visits/loaded", payload: JSON.parse(storedVisits) });
        setHasLoaded(true);
    }, []);

    useEffect(() => {
        if (hasLoaded) localStorage.setItem("weatherApp-cities", JSON.stringify(cities));
    }, [cities, hasLoaded]);

    useEffect(() => {
        if (hasLoaded) localStorage.setItem("weatherApp-visits", JSON.stringify(visits));
    }, [visits, hasLoaded]);

    useEffect(() => {
        localStorage.setItem("weatherApp-visits", JSON.stringify(visits));
    }, [visits]);

    const BASE_URL = "https://api.open-meteo.com/v1/forecast";

    async function getCoordinates(townName) {
        const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(townName)}&count=1&language=en&format=json`;

        try {
            const res = await fetch(geoURL);
            if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

            const data = await res.json();
            if (!data.results || data.results.length === 0) {
                dispatch({ type: "fetch/error", payload: "Town not found. Try another search." });
                return null;
            }

            return {
                lat: data.results[0].latitude,
                lng: data.results[0].longitude,
                cityName: data.results[0].name,
                country: data.results[0].country,
            };
        } catch (error) {
            console.error("Geocoding error: ", error);
            dispatch({ type: "fetch/error", payload: "Error finding town." });
            return null;
        }
    }

    async function getTownWeather(lat, lng, units = "celsius") {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lng,
            current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day",
            hourly: "temperature_2m,precipitation_probability,weather_code",
            daily: "temperature_2m_max,temperature_2m_min,weather_code",
            temperature_unit: units,
            wind_speed_unit: "kmh",
            forecast_days: 7,
            timezone: "auto",
        });

        const fullURL = `${BASE_URL}?${params}`;

        try {
            const res = await fetch(fullURL);
            if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
            const data = await res.json();
            return data;
        } catch (error) {
            dispatch({ type: "fetch/error", payload: error.message });
            return null;
        }
    }

    function transformWeatherData(rawData, geoData) {
        const daily = rawData.daily.time.map((date, i) => ({
            date,
            tempMax: rawData.daily.temperature_2m_max[i],
            tempMin: rawData.daily.temperature_2m_min[i],
            weatherCode: rawData.daily.weather_code[i],
        }));

        const nowIndex = rawData.hourly.time.findIndex(t => new Date(t) >= new Date());
        const next24 = rawData.hourly.time.slice(nowIndex, nowIndex + 24);

        const hourly = next24.map((time, i) => ({
            time,
            temp: rawData.hourly.temperature_2m[nowIndex + i],
            precipitationChance: rawData.hourly.precipitation_probability[nowIndex + i],
            weatherCode: rawData.hourly.weather_code[nowIndex + i],
        }));

        return {
            id: `${geoData.lat.toFixed(2)}-${geoData.lng.toFixed(2)}`,
            cityName: geoData.cityName,
            country: geoData.country,
            isFav: false,
            visitCount: 1,
            lastVisited: Date.now(),
            current: {
                temp: rawData.current.temperature_2m,
                humidity: rawData.current.relative_humidity_2m,
                windSpeed: rawData.current.wind_speed_10m,
                weatherCode: rawData.current.weather_code,
            },
            daily,
            hourly,
        };
    }

    async function searchCity(townName) {
        dispatch({ type: "fetch/start" });

        const geoData = await getCoordinates(townName);
        if (!geoData) return null;

        const rawWeather = await getTownWeather(geoData.lat, geoData.lng);
        if (!rawWeather) return null;

        const cityData = transformWeatherData(rawWeather, geoData);
        dispatch({ type: "fetch/success", payload: cityData });

        return cityData.id;
    }

    function decodeWeatherCode(code) {
        return weatherCodeMap[code] || { text: "Unknown", icon: "❓" };
    }

    return (
        <WeatherContext.Provider value={{ cities, visits, status, error, searchCity, dispatch, decodeWeatherCode }}>
            {children}
        </WeatherContext.Provider>
    );
}

function useWeather() {
    const context = useContext(WeatherContext);
    if (context === undefined) throw new Error("You are using useWeather outside its provider");
    return context;
}

export { useWeather, WeatherProvider };
