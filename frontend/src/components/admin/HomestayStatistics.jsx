import React from "react";
import { useState, useEffect } from "react";
import axiosInstance from "@utils/axiosInstance";


const HomestayStatistics = () => {
    const [totalHomestays, setTotalHomestays] = useState(0);
    const [homestaysByType, setHomestaysByType] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomestayStatistics = async () => {
            try {
                const response = await axiosInstance.get("/homestays/statistics/");
                const data = await response.data;
                setTotalHomestays(data.total_homestays);
                setHomestaysByType(data.homestays_by_type);
            } catch (error) {
                console.error("Error fetching homestay statistics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomestayStatistics();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">homestay Statistics</h1>
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <p className="text-lg">Total Homestay: {totalHomestays}</p>
                {homestaysByType.map((item) => (
                    <p className="text-lg" key={item.type}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}: {item.count}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default HomestayStatistics;