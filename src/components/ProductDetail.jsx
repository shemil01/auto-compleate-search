import Image from "next/image";
import Link from "next/link";

const ProductDetails = ({ selectedProduct }) => {
  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-md shadow">
      <h2 className="text-lg font-bold">{selectedProduct.title}</h2>
      <p className="text-gray-600">Category: {selectedProduct.category}</p>
      <Link href={`/${selectedProduct.id}`}>
        <Image
          src={selectedProduct.image}
          alt={selectedProduct.title}
          width={80}
          height={80}
          className="object-cover mt-2 rounded-lg"
        />
      </Link>
    </div>
  );
};

export default ProductDetails;
