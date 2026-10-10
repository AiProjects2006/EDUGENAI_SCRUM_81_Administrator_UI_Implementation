import "./Pagination.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination() {

    return (

        <div className="pagination">

            <button className="page-btn">

                <ChevronLeft size={18} />

                Previous

            </button>

            <div className="page-numbers">

                <button className="page-number active">1</button>

                <button className="page-number">2</button>

                <button className="page-number">3</button>

            </div>

            <button className="page-btn">

                Next

                <ChevronRight size={18} />

            </button>

        </div>

    );

}

export default Pagination;