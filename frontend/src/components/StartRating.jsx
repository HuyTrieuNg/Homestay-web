// import { FaStar } from 'react-icons/fa';

// const StarRating = ({ name, value, onChange }) => {
//   const handleClick = (rating) => {
//     onChange({ target: { name, value: rating } });
//   };

//   return (
//     <div className="flex space-x-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <FaStar
//           key={star}
//           size={24}
//           className={`cursor-pointer ${star <= value ? 'text-yellow-400' : 'text-gray-300'}`}
//           onClick={() => handleClick(star)}
//         />
//       ))}
//     </div>
//   );
// };

// export default StarRating;


import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ name, value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating) => {
    onChange({ target: { name, value: rating } });
  };

  const handleMouseEnter = (rating) => {
    setHoverValue(rating);
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={15}
          className={`cursor-pointer transition-colors ${
            (hoverValue || value) >= star ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
};

export default StarRating;