import UserStatistics from "@components/Admin/UserStatistics";
import HomestayStatistics from "@components/Admin/HomestayStatistics";
import BookingStatistics from "@components/Admin/BookingStatistics";
const AdminDashboard = () => {
  return (
    <div>
        <UserStatistics />
    
        <HomestayStatistics />

        <BookingStatistics />
    </div>
    
  );
};
export default AdminDashboard;