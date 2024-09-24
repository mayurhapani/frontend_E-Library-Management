import { useState } from "react";
import PropTypes from 'prop-types';

const BorrowBook = ({ bookId }) => {
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleBorrow = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/v1/books/${bookId}/borrow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ returnDate }),
      });

      if (!response.ok) throw new Error("Failed to borrow book");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Borrow this Book</h2>
      {success ? (
        <p className="text-green-500">Book borrowed successfully!</p>
      ) : (
        <form onSubmit={handleBorrow} className="space-y-4">
          <div>
            <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">
              Return Date
            </label>
            <input
              type="date"
              id="returnDate"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Borrowing..." : "Borrow Book"}
          </button>
        </form>
      )}
    </div>
  );
};

BorrowBook.propTypes = {
  bookId: PropTypes.string.isRequired,
};

export default BorrowBook;
