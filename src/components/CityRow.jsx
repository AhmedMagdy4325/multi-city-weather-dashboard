import { Link } from "react-router-dom";

function CityRow({ city, children, className }) {
    return (
        <li className={className}>
            <Link to={`/city/${city.id}`}>
                <span>{city.cityName}</span>
            </Link>{" "}
            <span>{children}</span>
        </li>
    );
}

export default CityRow;
