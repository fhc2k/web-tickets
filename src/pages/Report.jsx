import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import PrintTable from "../components/PrintTable";
import { useSearchParams } from "react-router-dom";

const Report = () => {
    const [searchParams] = useSearchParams();
    const allQueryParams = Object.fromEntries(searchParams.entries());
    
    const contentRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: `Reporte-${allQueryParams.id}`,
    });

    return (
        <div className="content-area">
            <h1 className="content-area__title">Detalles del reporte</h1>
            <div className="content-area__body">
                <div className="report-block">
                    <div ref={contentRef}>
                        <PrintTable
                            data={allQueryParams}
                        />
                    </div>
                    <button className="btn btn--primary" onClick={handlePrint}>
                        Imprimir reporte
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Report;
