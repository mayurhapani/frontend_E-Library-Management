import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BookDetails = () => {
  const [book, setBook] = useState(null);
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/books/${id}`);
        setBook(response.data.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [id, BASE_URL]);

  if (!book) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
      <p className="text-xl mb-2">By {book.author}</p>
      <p className="mb-4">Genre: {book.genre}</p>
      <p className="mb-4">
        Publication Date: {new Date(book.publicationDate).toLocaleDateString()}
      </p>
      <img src={book.image} alt={book.title} className="mb-4 max-w-md" />
      <p>{book.description}</p>
    </div>
  );
};

export default BookDetails;
