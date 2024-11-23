/**
 * Splits data into paginated chunks
 * @param {Array} data - The array of items to paginate
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Array} - An array of pages, each containing a chunk of data
 */
export const paginate = (data, itemsPerPage) => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const pages = Array.from({ length: totalPages }, (_, index) => {
      const start = index * itemsPerPage;
      return data.slice(start, start + itemsPerPage);
    });
    return pages;
  };
  