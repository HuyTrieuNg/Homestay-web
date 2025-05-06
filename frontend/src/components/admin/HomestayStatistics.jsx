import React from "react";
import { useState, useEffect } from "react";
import axiosInstance from "@utils/axiosInstance";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const HomestayStatistics = () => {
    const [totalHomestays, setTotalHomestays] = useState(0);
    const [homestaysByType, setHomestaysByType] = useState([]);
    const [loading, setLoading] = useState(true);

    const PRIMARY_COLOR = "#ff5a5f";

    useEffect(() => {
        const fetchHomestayStatistics = async () => {
            try {
                const response = await axiosInstance.get("/homestays/statistics/");
                const data = await response.data;
                setTotalHomestays(data.total_homestays);
                setHomestaysByType(data.homestays_by_type);
            } catch (error) {
                console.error("Lỗi khi tải thống kê homestay:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomestayStatistics();
    }, []);

    if (loading) {
        return (
            <div className="w-full flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Chuẩn bị dữ liệu cho biểu đồ thanh ngang
    const chartData = homestaysByType.map(item => ({
        type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
        count: item.count
    }));

    return (
        <div className="p-6 w-full md:w-[49%] mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Thống Kê Homestay</h2>
            
            <div className="mb-6">
                <div className="p-4 rounded-lg shadow border w-full transition-all duration-300 hover:shadow-md" 
                    style={{ backgroundColor: `${PRIMARY_COLOR}10`, borderColor: `${PRIMARY_COLOR}30` }}>
                    <p className="text-sm font-medium text-center" style={{ color: PRIMARY_COLOR }}>Tổng Homestay</p>
                    <p className="text-3xl font-bold text-center" style={{ color: PRIMARY_COLOR }}>{totalHomestays}</p>
                </div>
            </div>

            <div className="h-96 w-full mt-6">
                <p className="text-lg font-semibold text-gray-700 mb-2 text-center">Homestay Theo Loại</p>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                        layout="vertical"
                        animationBegin={0}
                        animationDuration={1500}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="type" width={100} />
                        <Tooltip formatter={(value) => [`${value} homestay`, 'Số lượng']} />
                        <Legend />
                        <Bar dataKey="count" name="Số lượng Homestay" fill={PRIMARY_COLOR} radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default HomestayStatistics;