import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axiosInstance from "@utils/axiosInstance";

const HostInfo = ({ host, homestayId }) => {
  const [hostData, setHostData] = useState(host);

  useEffect(() => {
    if (!host && homestayId) {
      axiosInstance
        .get(`/homestays/${homestayId}/host/`)
        .then((res) => setHostData(res.data))
        .catch(() => setHostData(null));
    }
  }, [host, homestayId]);

  if (!hostData) return null;
  return (
    <div className="flex items-center gap-4 mb-8 border-t pt-6">
      <img
        src={hostData.avatar_url || "/default-avatar.png"}
        alt={hostData.name}
        className="w-12 h-12 rounded-full border object-cover"
      />
      <div>
        <div className="text-lg font-semibold">Chủ nhà: {hostData.name}</div>
        {/* Thêm thông tin khác nếu muốn */}
      </div>
    </div>
  );
};

HostInfo.propTypes = {
  host: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar_url: PropTypes.string,
  }),
  homestayId: PropTypes.number,
};

export default HostInfo;
