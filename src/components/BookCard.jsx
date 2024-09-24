import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const BookCard = ({ book, onBookDeleted }) => {
  const { userRole } = useContext(AuthContext);
  const isAdmin = userRole === "admin";
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleEditBook = () => {
    navigate(`/edit-book/${book._id}`);
  };

  const handleDeleteBook = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`${BASE_URL}/books/${book._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Book deleted successfully");
        if (onBookDeleted) {
          onBookDeleted(book._id);
        }
      } catch (error) {
        console.error("Error deleting book:", error);
        toast.error("Failed to delete book");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="h-80 bg-gray-100 flex items-center justify-center">
        <img 
          src={book?.image} 
          alt={book?.title} 
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 truncate">{book?.title}</h2>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">by {book?.author}</p>
          <p className="text-xs text-gray-500">{book?.genre}</p>
        </div>
        <div className="flex justify-between items-center">
          <Link
            to={`/books/${book?._id}`}
            className="inline-block bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600 transition duration-300"
          >
            View Details
          </Link>
          {isAdmin && (
            <div className="flex space-x-2">
              <button
                onClick={handleEditBook}
                className="text-yellow-500 hover:text-yellow-600 transition duration-300"
                title="Edit book"
              >
                <FaEdit size={16} />
              </button>
              <button
                onClick={handleDeleteBook}
                className="text-red-500 hover:text-red-600 transition duration-300"
                title="Delete book"
              >
                <FaTrash size={16} />
              </button>
            </div>
          )}
        </div>
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
  }).isRequired,
  onBookDeleted: PropTypes.func,
};

export default BookCard;
