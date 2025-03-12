"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchComponent from "./Search";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://fakestoreapi.com/products?limit=15"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          E-Commerce Store
        </h1>

        <SearchComponent />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((data) => (
            <div key={data.id} className="bg-white p-4 shadow-lg rounded-lg">
              <Image
                src={data.image}
                alt={data.title}
                width={300}
                height={160}
                className="object-cover rounded-md mb-4 w-full h-40"
              />
              <Link href={`${data.id}`}>
                <h2 className="text-xl font-semibold">{data.title}</h2>
              </Link>
              <p className="text-gray-600">${data.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
