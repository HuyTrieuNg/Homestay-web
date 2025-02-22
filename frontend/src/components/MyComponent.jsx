import { useEffect } from "react";
import axiosInstance from "../axiosConfig";

const MyComponent = () => {
    useEffect(() => {
        axiosInstance
            .get("data/")
            .then((response) => {
                console.log("Message từ API:", response.data.message);
            })
            .catch((error) => {
                console.error("Lỗi khi gọi API:", error);
            });
    }, []);

    return <div>Check console để xem message!</div>;
};

export default MyComponent;
