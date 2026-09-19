import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WeatherProvider } from "./context/WeatherContext";
import Home from "./pages/Home";
import City from "./pages/City";
import History from "./pages/History";

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-sky-100 to-sky-400">
            <WeatherProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/city/:cityId" element={<City />} />
                        <Route path="/history" element={<History />} />
                    </Routes>
                </BrowserRouter>
            </WeatherProvider>
        </div>
    );
}

export default App;
