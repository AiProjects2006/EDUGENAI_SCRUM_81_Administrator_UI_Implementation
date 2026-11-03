import { FaBell, FaSearch } from "react-icons/fa";
import "./Navbar.css";

function Navbar(){

    return(

        <div className="navbar">

            <div>

                <h2>Admin Dashboard</h2>

                <p>Manage students and content creators.</p>

            </div>

            <div className="navbar-right">

                <FaSearch/>

                <FaBell/>

                <img
                    src="https://i.pravatar.cc/40"
                    alt="profile"
                />

            </div>

        </div>

    );

}

export default Navbar;