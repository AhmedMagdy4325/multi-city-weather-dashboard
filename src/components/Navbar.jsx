import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <div className="flex justify-center mt-6">
            <nav className="flex justify-center gap-10 border-b border-sky-200 pb-3 pt-6">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `pb-2 font-medium ${isActive ? "text-sky-700 border-b-2 border-sky-700" : "text-gray-400"}`
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/history"
                    className={({ isActive }) =>
                        `pb-2 font-medium ${isActive ? "text-sky-700 border-b-2 border-sky-700" : "text-gray-400"}`
                    }
                >
                    History
                </NavLink>
            </nav>
        </div>
    );
}

export default Navbar;
