import { Link } from "react-router-dom";

//CityRow component is a reusable clickable li shows name and accepting children

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
