import React, { useState, useEffect } from "react";
import axiosInstance from "@utils/axiosInstance";

const BookingStatistics = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBookingStatistics = async () => {
        setLoading(true);
        setError("");

        try {
            let url = "/homestays/booking/statistics/";
            if (startDate && endDate) {
                url += `?start_date=${startDate}&end_date=${endDate}`;
            }

            const response = await axiosInstance.get(url);
            setData(response.data);
        } catch (err) {
            console.error("Error fetching booking statistics:", err);
            setError("Failed to load data.");
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookingStatistics();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (startDate && endDate && startDate > endDate) {
            setError("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.");
            return;
        }

        fetchBookingStatistics();
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-6">Booking Statistics</h2>

            <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4 mb-4">
                <div>
                    <label className="block mb-1">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border p-2 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded h-[42px]"
                >
                    Filter
                </button>
            </form>

            {error && (
                <div className="text-red-600 mb-4">{error}</div>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : data ? (
                <div className="bg-white shadow-md p-6 rounded w-full max-w-2xl">
                    <p><strong>Total Revenue:</strong> ${data.total_revenue}</p>

                    {/* Top Homestays by Total Revenue */}
                    <h3 className="mt-4 font-semibold">Top Homestays by Revenue</h3>
                    <ul className="list-disc pl-6">
                        {data.top_homestays.map((h) => (
                            <li key={h.homestay_id}>
                                {h.name}: ${h.total_revenue}
                            </li>
                        ))}
                    </ul>

                    {/* Top Homestays by Booking Count */}
                    <h3 className="mt-4 font-semibold">Top Homestays by Bookings</h3>
                    <ul className="list-disc pl-6">
                        {data.top_booked_homestays.map((h) => (
                            <li key={h.homestay_id}>
                                {h.name}: {h.count} bookings
                            </li>
                        ))}
                    </ul>

                    {/* Revenue by Type */}
                    <h3 className="mt-4 font-semibold">Revenue by Type</h3>
                    <ul className="list-disc pl-6">
                        {data.by_type.map((item) => (
                            <li key={item.type}>
                                {item.type}: ${item.total_revenue}
                            </li>
                        ))}
                    </ul>

                    {/* Revenue by Date */}
                    <h3 className="mt-4 font-semibold">Revenue by Date</h3>
                    <ul className="list-disc pl-6">
                        {data.by_date.map((d) => (
                            <li key={d.checkout_date}>
                                {d.checkout_date}: ${d.total_revenue}
                            </li>
                        ))}
                    </ul>

                    {/* Booking Status Ratio */}
                    <h3 className="mt-4 font-semibold">Booking Status Ratio</h3>
                    <ul className="list-disc pl-6">
                        {data.status_ratio.map((s) => (
                            <li key={s.status}>
                                {s.status}: {s.count}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No data found for the selected range.</p>
            )}
        </div>
    );
};

export default BookingStatistics;
