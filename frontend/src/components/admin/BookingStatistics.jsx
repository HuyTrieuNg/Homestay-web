import React, { useState, useEffect } from "react";
import axiosInstance from "@utils/axiosInstance";
import { 
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

const BookingStatistics = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const PRIMARY_COLOR = "#ff5a5f";

    const fetchBookingStatistics = async () => {
        setLoading(true);
        setError("");

        try {
            let url = "/homestays/booking/statistics/";
            if (startDate && endDate) {
                url += `?start_date=${startDate}&end_date=${endDate}`;
            }

            const response = await axiosInstance.get(url);
            const responseData = response.data;
            
            if (responseData.start_date && responseData.end_date) {
                setStartDate(responseData.start_date);
                setEndDate(responseData.end_date);
            }
            
            setData(responseData);
        } catch (err) {
            console.error("Lỗi khi tải thống kê đặt phòng:", err);
            setError("Không thể tải dữ liệu.");
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

    const prepareRevenueData = () => {
        if (!data) return [];
        
        let dateRange = [];
        let revenueByDate = {};
        
        data.by_date.forEach(item => {
            revenueByDate[item.checkout_date] = parseFloat(item.total_revenue);
        });

        if (startDate && endDate) {
            const currentDate = new Date(startDate);
            const lastDate = new Date(endDate);
            
            while (currentDate <= lastDate) {
                dateRange.push(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        } else if (data.by_date.length > 0) {
            const dates = data.by_date.map(d => d.checkout_date);
            let minDate = dates.reduce((a, b) => a < b ? a : b);
            let maxDate = dates.reduce((a, b) => a > b ? a : b);
            
            const currentDate = new Date(minDate);
            const lastDate = new Date(maxDate);
            
            while (currentDate <= lastDate) {
                dateRange.push(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        
        return dateRange.map(date => ({
            date,
            revenue: revenueByDate[date] || 0
        }));
    };

    const calculateAverageDailyRevenue = () => {
        if (!data || !data.by_date || data.by_date.length === 0) return 0;
        
        const totalRevenue = parseFloat(data.total_revenue);
        
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return diffDays > 0 ? (totalRevenue / diffDays).toFixed(2) : totalRevenue.toFixed(2);
        } else {
            const dates = data.by_date.map(d => d.checkout_date);
            if (dates.length === 0) return totalRevenue.toFixed(2);
            
            let minDate = new Date(dates.reduce((a, b) => a < b ? a : b));
            let maxDate = new Date(dates.reduce((a, b) => a > b ? a : b));
            const diffTime = Math.abs(maxDate - minDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return diffDays > 0 ? (totalRevenue / diffDays).toFixed(2) : totalRevenue.toFixed(2);
        }
    };

    const truncateName = (name, maxLength = 20) => {
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    };

    const prepareTopHomestaysData = () => {
        if (!data || !data.top_homestays) return [];
        
        return data.top_homestays.slice(0, 20).map(h => ({
            name: truncateName(h.name),
            fullName: h.name,
            revenue: parseFloat(h.total_revenue),
            homestay_id: h.homestay_id
        }));
    };
    
    const prepareTopBookedHomestaysData = () => {
        if (!data || !data.top_booked_homestays) return [];
        
        return data.top_booked_homestays.slice(0, 20).map(h => ({
            name: truncateName(h.name),
            fullName: h.name,
            count: h.count,
            homestay_id: h.homestay_id
        }));
    };

    const CustomTooltip = ({ active, payload, label, valuePrefix = "", valueSuffix = "" }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
                    <p className="font-medium text-gray-800">{data.fullName || label}</p>
                    <p className="text-sm text-gray-600">
                        {`${payload[0].name}: ${valuePrefix}${payload[0].value}${valueSuffix}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    const COLORS = [PRIMARY_COLOR, "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#6366F1"];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Thống Kê Đặt Phòng</h2>

            <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700 text-center">Từ ngày</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full border border-gray-300 p-2 rounded focus:ring focus:ring-pink-200 focus:border-pink-500 outline-none text-center transition-all duration-200 hover:border-pink-400"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700 text-center">Đến ngày</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full border border-gray-300 p-2 rounded focus:ring focus:ring-pink-200 focus:border-pink-500 outline-none text-center transition-all duration-200 hover:border-pink-400"
                            />
                        </div>
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded h-[42px] transition-all duration-300 font-medium hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                            style={{ backgroundColor: PRIMARY_COLOR }}
                        >
                            Áp Dụng
                        </button>
                    </div>
                </div>
            </form>

            {error && (
                <div className="text-red-600 mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-center">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center p-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500" style={{ borderColor: PRIMARY_COLOR }}></div>
                </div>
            ) : data ? (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-pink-50 p-4 rounded-lg shadow border border-pink-100 transition-all duration-300 hover:bg-pink-100 hover:shadow-md" style={{ backgroundColor: `${PRIMARY_COLOR}10` }}>
                            <p className="text-sm text-pink-500 font-medium text-center" style={{ color: PRIMARY_COLOR }}>Tổng Doanh Thu</p>
                            <p className="text-3xl font-bold text-pink-700 text-center" style={{ color: PRIMARY_COLOR }}>${data.total_revenue}</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-100 transition-all duration-300 hover:bg-yellow-100 hover:shadow-md">
                            <p className="text-sm text-yellow-600 font-medium text-center">Doanh Thu TB / Ngày</p>
                            <p className="text-3xl font-bold text-yellow-700 text-center">${calculateAverageDailyRevenue()}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-100 transition-all duration-300 hover:bg-blue-100 hover:shadow-md">
                            <p className="text-sm text-blue-500 font-medium text-center">Tổng Số Đặt Phòng</p>
                            <p className="text-3xl font-bold text-blue-700 text-center">
                                {data.status_ratio.reduce((acc, item) => acc + item.count, 0)}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg shadow border border-purple-100 transition-all duration-300 hover:bg-purple-100 hover:shadow-md">
                            <p className="text-sm text-purple-500 font-medium text-center">Doanh Thu TB / Đơn</p>
                            <p className="text-3xl font-bold text-purple-700 text-center">
                                ${(data.total_revenue / data.status_ratio.reduce((acc, item) => acc + item.count, 0) || 0).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="mb-8 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Xu Hướng Doanh Thu</h3>
                        <div className="h-80 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={prepareRevenueData()}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    animationBegin={0}
                                    animationDuration={1500}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`$${value}`, 'Doanh thu']} />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke={PRIMARY_COLOR} 
                                        strokeWidth={2}
                                        name="Doanh Thu" 
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Doanh Thu Theo Loại Homestay</h3>
                            <div className="h-80 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={data.by_type.map(item => ({
                                            type: item.type,
                                            revenue: parseFloat(item.total_revenue)
                                        }))}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        layout="vertical"
                                        animationBegin={0}
                                        animationDuration={1500}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis type="category" dataKey="type" width={100} />
                                        <Tooltip formatter={(value) => [`$${value}`, 'Doanh thu']} />
                                        <Legend />
                                        <Bar dataKey="revenue" name="Doanh Thu" fill={PRIMARY_COLOR} radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Phân Bố Trạng Thái Đặt Phòng</h3>
                            <div className="h-80 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart animationBegin={0} animationDuration={1500}>
                                        <Pie
                                            data={data.status_ratio}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill={PRIMARY_COLOR}
                                            paddingAngle={5}
                                            dataKey="count"
                                            nameKey="status"
                                        >
                                            {data.status_ratio.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [value, name]} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Homestay Doanh Thu Cao Nhất</h3>
                            <div className="h-96 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        layout="vertical"
                                        data={prepareTopHomestaysData()}
                                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                                        animationBegin={0}
                                        animationDuration={1500}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis 
                                            type="category" 
                                            dataKey="name"
                                            tick={{ fontSize: 12 }} 
                                            width={80}
                                            tickFormatter={value => value}
                                        />
                                        <Legend />
                                        <Bar 
                                            dataKey="revenue" 
                                            name="Doanh Thu" 
                                            fill={PRIMARY_COLOR} 
                                            radius={[0, 4, 4, 0]}
                                        />
                                        <Tooltip 
                                            wrapperStyle={{ zIndex: 10 }} 
                                            cursor={{ fill: 'rgba(0, 0, 0, 0.2)' }} 
                                            formatter={(value, name) => [`$${value}`, name]} 
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Homestay Được Đặt Nhiều Nhất</h3>
                            <div className="h-96 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        layout="vertical"
                                        data={prepareTopBookedHomestaysData()}
                                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                                        animationBegin={0}
                                        animationDuration={1500}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis 
                                            type="category" 
                                            dataKey="name" 
                                            tick={{ fontSize: 12 }}
                                            width={80}
                                            tickFormatter={value => value}
                                        />
                                        <Legend />
                                        <Bar 
                                            dataKey="count" 
                                            name="Số Đặt Phòng" 
                                            fill="#00C49F" 
                                            radius={[0, 4, 4, 0]}
                                        />
                                        <Tooltip 
                                            wrapperStyle={{ zIndex: 10 }} 
                                            cursor={{ fill: 'rgba(0, 0, 0, 0.2)' }} 
                                            formatter={(value, name) => [`${value} đặt phòng`, name]} 
                                        />

                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div> */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Doanh thu cao nhất */}
                        <div className="rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">
                                Homestay Doanh Thu Cao Nhất
                            </h3>
                            <div className="h-[700px] bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-auto">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        layout="vertical"
                                        data={prepareTopHomestaysData()}
                                        margin={{ top: 10, right: 20, left: 50, bottom: 10 }}  
                                        animationBegin={0}
                                        animationDuration={1500}
                                        barCategoryGap={100}   // Tăng khoảng cách giữa các nhóm
                                        barGap={100}           // Tăng khoảng cách giữa các bar
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            tick={{ fontSize: 13 }}
                                            width={150} // Giảm nếu nhãn ngắn
                                            tickFormatter={value =>
                                                value.length > 25 ? value.slice(0, 25) + '...' : value
                                            }
                                        />
                                        <Tooltip
                                            wrapperStyle={{ zIndex: 10 }}
                                            formatter={(value, name) => [`$${value}`, name]}
                                            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="revenue"
                                            name="Doanh Thu"
                                            fill={PRIMARY_COLOR}
                                            radius={[0, 6, 6, 0]}
                                            barSize={32}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Được đặt nhiều nhất */}
                        <div className="rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">
                                Homestay Được Đặt Nhiều Nhất
                            </h3>
                            <div className="h-[700px] bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-auto">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        layout="vertical"
                                        data={prepareTopBookedHomestaysData()}
                                        margin={{ top: 10, right: 20, left: 50, bottom: 10 }}
                                        animationBegin={0}
                                        animationDuration={1500}
                                        barCategoryGap={80}
                                        barGap={20}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            tick={{ fontSize: 13 }}
                                            width={100}
                                            tickFormatter={value =>
                                                value.length > 25 ? value.slice(0, 25) + '...' : value
                                            }
                                        />
                                        <Tooltip
                                            wrapperStyle={{ zIndex: 10 }}
                                            formatter={(value, name) => [`${value} lượt`, name]}
                                            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="count"
                                            name="Số Đặt Phòng"
                                            fill="#00C49F"
                                            radius={[0, 6, 6, 0]}
                                            barSize={32}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    

   

                </div>
            ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-center">
                    Không tìm thấy dữ liệu cho khoảng thời gian đã chọn.
                </div>
            )}
        </div>
    );
};

export default BookingStatistics;
