import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <img src={book?.image} alt={book?.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">{book?.title}</h2>
        <p className="text-gray-600 mb-2">by {book?.author}</p>
        <p className="text-sm text-gray-500 mb-4">{book?.genre}</p>
        <Link
          to={`/books/${book?._id}`}
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    image: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    genre: PropTypes.string,
  }),
};

export default BookCard;
