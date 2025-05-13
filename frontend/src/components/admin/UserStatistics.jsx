import React from "react";
import { useState, useEffect } from "react";
import axiosInstance from "@utils/axiosInstance";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const UserStatistics = () => {
    const [userCount, setUserCount] = useState(0);
    const [hostCount, setHostCount] = useState(0);
    const [guestCount, setGuestCount] = useState(0); 
    const [loading, setLoading] = useState(true);

    const PRIMARY_COLOR = "#ff5a5f";

    useEffect(() => {
        const fetchUserStatistics = async () => {
            try {
                const response = await axiosInstance.get("/users/statistics/");
                const data = await response.data;
                setUserCount(data.total_users);
                setHostCount(data.total_hosts);
                setGuestCount(data.total_guests);
            } catch (error) {
                console.error("Lỗi khi tải thống kê người dùng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserStatistics();
    }, []);

    if (loading) {
        return (
            <div className="w-full flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Chuẩn bị dữ liệu cho biểu đồ
    const data = [
        { name: "Chủ nhà", value: hostCount, color: PRIMARY_COLOR },
        { name: "Khách", value: guestCount, color: "#3B82F6" },
        { name: "Quản trị viên", value: userCount - hostCount - guestCount, color: "#6366F1" }
    ];

    const COLORS = [PRIMARY_COLOR, "#3B82F6", "#6366F1"];

    return (
        <div className="p-6 w-full md:w-[49%] mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Thống Kê Người Dùng</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg shadow border border-red-100 transition-all duration-300 hover:bg-red-100 hover:shadow-md" style={{ backgroundColor: `${PRIMARY_COLOR}10`, borderColor: `${PRIMARY_COLOR}30` }}>
                    <p className="text-sm font-medium text-center" style={{ color: PRIMARY_COLOR }}>Tổng Người Dùng</p>
                    <p className="text-3xl font-bold text-center" style={{ color: PRIMARY_COLOR }}>{userCount}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow border border-green-100 transition-all duration-300 hover:bg-green-100 hover:shadow-md">
                    <p className="text-sm text-green-500 font-medium text-center">Tổng Chủ Nhà</p>
                    <p className="text-3xl font-bold text-green-700 text-center">{hostCount}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg shadow border border-indigo-100 transition-all duration-300 hover:bg-indigo-100 hover:shadow-md">
                    <p className="text-sm text-indigo-500 font-medium text-center">Tổng Khách</p>
                    <p className="text-3xl font-bold text-indigo-700 text-center">{guestCount}</p>
                </div>
            </div>
            
            <div className="h-80 w-full mt-6">
                <p className="text-lg font-semibold text-gray-700 mb-2 text-center">Phân Bố Người Dùng</p>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            animationBegin={0}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} người dùng`, 'Số lượng']} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default UserStatistics;

