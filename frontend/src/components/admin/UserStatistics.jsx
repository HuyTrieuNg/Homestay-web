import React from "react";
import { useState, useEffect } from "react";
import axiosInstance from "@utils/axiosInstance";


const UserStatistics = () => {
    const [userCount, setUserCount] = useState(0);
    const [hostCount, setHostCount] = useState(0);
    const [adminCount, setAdminCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserStatistics = async () => {
            try {
                const response = await axiosInstance.get("/users/statistics/");
                const data = await response.data;
                setUserCount(data.total_users);
                setHostCount(data.total_hosts);
                setAdminCount(data.total_guests);
            } catch (error) {
                console.error("Error fetching user statistics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserStatistics();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">User Statistics</h1>
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <p className="text-lg">Total Users: {userCount}</p>
                <p className="text-lg">Total Hosts: {hostCount}</p>
                <p className="text-lg">Total Admins: {adminCount}</p>
            </div>
        </div>
    );
}

export default UserStatistics;

