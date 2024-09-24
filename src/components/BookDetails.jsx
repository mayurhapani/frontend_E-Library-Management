import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BorrowBook from "./BorrowBook";

const BookDetails = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(`/api/v1/books/${id}`);
      if (!response.ok) throw new Error("Failed to fetch book details");
      const data = await response.json();
      setBook(data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading book details...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!book) return <div className="text-center py-10">Book not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src={book?.image} alt={book?.title} />
          </div>
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{book?.title}</h1>
            <p className="text-gray-600 mb-4">by {book?.author}</p>
            <p className="text-gray-700 mb-4">{book?.genre}</p>
            <p className="text-sm text-gray-500 mb-4">
              Published on: {new Date(book.publicationDate).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-6">{book?.description}</p>
            <BorrowBook bookId={book?._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
