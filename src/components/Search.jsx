'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Virtuoso } from 'react-virtuoso';
import ProductDetails from './ProductDetail';
import Link from 'next/link';

const API_URL = 'https://fakestoreapi.com/products'; 

const fetchProducts = async ({ query, pageParam = 1 }) => {
  try {
    const response = await axios.get(`${API_URL}?limit=15&page=${pageParam}`);
    console.log('Fetched Products:', response.data);
    return response.data.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch products');
  }
};

export default function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['products', searchTerm],
    queryFn: ({ pageParam }) => fetchProducts({ query: searchTerm, pageParam }),
    enabled: searchTerm.length > 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.length ? allPages.length + 1 : undefined),
  });

  const debouncedSearch = useMemo(
    () =>
      debounce((term) => {
        setSearchTerm(term);
        setDropdownOpen(!!term);
      }, 300),
    []
  );

  const handleChange = useCallback(
    (event) => {
      debouncedSearch(event.target.value);
      setHighlightedIndex(-1);
    },
    [debouncedSearch]
  );

  const handleSelect = (product) => {
    setSelectedProduct(product);
    setSearchTerm(product.title);
    setDropdownOpen(false);
  };

  const handleKeyDown = (event) => {
    if (!data?.pages) return;

    const items = data.pages.flat();
    if (event.key === 'ArrowDown') {
      setHighlightedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
    } else if (event.key === 'ArrowUp') {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (event.key === 'Enter' && highlightedIndex >= 0) {
      handleSelect(items[highlightedIndex]);
    } else if (event.key === 'Escape') {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (!searchTerm) setDropdownOpen(false);
  }, [searchTerm]);

  return (
    <div className="relative md:w-96 mx-auto mt-10">
      <input
        type="text"
        className="w-full p-3 border rounded-lg mb-6"
        placeholder="Search for products..."
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={searchTerm}
      />

      {isDropdownOpen && (
        <div className="absolute w-full bg-white border border-gray-200 shadow-md mt-1 max-h-60 overflow-auto z-50">
          {isLoading ? (
            <p className="p-2 text-center">Loading...</p>
          ) : isError ? (
            <p className="p-2 text-center text-red-500">Error loading products</p>
          ) : data?.pages?.flat().length > 0 ? (
            <Virtuoso
              style={{ height: '200px' }}
              data={data.pages.flat()}
              itemContent={(index, product) => (
                <div
                  className={`p-2 cursor-pointer ${
                    index === highlightedIndex ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleSelect(product)}
                >
                    <Link href={`/${product.id}`}>
                    {product.title}

                    </Link>
                </div>
              )}
              endReached={() => hasNextPage && fetchNextPage()}
            />
          ) : (
            <p className="p-2 text-center">No results found</p>
          )}

          {isFetchingNextPage && <p className="p-2 text-center">Loading more...</p>}
        </div>
      )}

      {selectedProduct && (
        <ProductDetails selectedProduct={selectedProduct} />
       
      )}
    </div>
  );
}
