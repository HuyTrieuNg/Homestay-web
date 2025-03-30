import PropTypes from "prop-types";
import HomestayCard from "@components/HomestayCard";

const HomestayList = ({ homestays, loading, error }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5 px-10">
      {loading ? (
        <p>Đang tải danh sách homestay...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : homestays.length > 0 ? (
        homestays.map((homestay) => (
          <HomestayCard key={homestay.id} homestay={homestay} />
        ))
      ) : (
        <p>Không tìm thấy kết quả</p>
      )}
    </div>
  );
};

HomestayList.propTypes = {
  homestays: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default HomestayList;
