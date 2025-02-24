// // function Home() {
// //     return <h2>Trang Chủ</h2>;
// //   }

import { useEffect } from "react"

const Home = ()=>{
  useEffect(()=>{
    fetch("http://127.0.0.1:8000/api/test")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Lỗi:", error));
  }, []);
  return <div>Kiểm tra console để xem dữ liệu!</div>;

};

export default Home;
