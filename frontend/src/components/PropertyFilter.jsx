import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Adjust the import path as necessary

const PropertyFilter = () => {
    const [propertyTypes, setPropertyTypes] = useState([]);

    useEffect(() => {
        axiosInstance
            .get("homestays/property-types")
            .then((response) => {
                console.log("Response data:", response.data);
                if (Array.isArray(response.data)) {
                    setPropertyTypes(response.data);
                } else {
                    console.error("Invalid data format:", response.data);
                    setPropertyTypes([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching property types:", error);
                setPropertyTypes([]);
            });
    }, []);

    return (
        <div className="">
            {propertyTypes.length > 0 ? (
                propertyTypes.map((property) => (
                    <button key={property.id} className="category-button">
                        {property.name}
                    </button>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default PropertyFilter;
