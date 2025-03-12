"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function ProductDetail() {
    
  const { id } = useParams()
     const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartMessage, setCartMessage] = useState(""); 
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    setCartMessage("✅ Added to cart!"); 
    setTimeout(() => setCartMessage(""), 2000); 
  };

  if (loading) return <p className="text-center text-xl">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black flex justify-center items-center">
      <div className="max-w-4xl w-full bg-white p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
      <div className="flex-1 relative w-full h-96">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain rounded-lg"
            priority
          />
        </div>


        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 text-lg mb-4 font-semibold">${product.price}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full"
          >
            🛒 Add to Cart
          </button>

          {cartMessage && <p className="text-green-600 mt-3 font-semibold">{cartMessage}</p>}

          <button onClick={() => router.back()} className="mt-4 text-blue-600 hover:underline">
            ← Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}
