import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../hook/useWishlist";

const Wishlist = () => {
  const wishlist = useSelector((state) => state.wishlist.items);
  const navigate = useNavigate();

  const {
    handleGetWishlist,
    handleRemoveFromWishlist,
  } = useWishlist();

  useEffect(() => {
    handleGetWishlist();
  }, []);

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6">
        <div className="w-28 h-28 rounded-full bg-neutral-100 flex items-center justify-center">
          <i className="ri-heart-line text-5xl text-neutral-500"></i>
        </div>

        <h1 className="text-4xl font-semibold mt-8">
          Your Wishlist is Empty
        </h1>

        <p className="text-neutral-500 mt-3 max-w-md">
          Save products you love and they'll always be here waiting for you.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-8 bg-black text-white px-8 py-3 rounded-full hover:bg-neutral-800 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 py-12">

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-semibold">
            Wishlist
          </h1>

          <p className="text-neutral-500 mt-2">
            {wishlist.length} saved products
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="hidden md:block border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition"
        >
          Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">

        {wishlist.map((item) => {

          const product = item.product;

          const image =
            product.images?.length
              ? product.images[0].url
              : "/snitch_editorial_warm.png";

          return (

            <div
              key={item._id}
              className="group"
            >

              <div className="relative overflow-hidden rounded-xl bg-neutral-100">

                <img
                  src={image}
                  alt={product.title}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="w-full aspect-[4/5] object-cover cursor-pointer transition duration-500 group-hover:scale-105"
                />

                <button
                  onClick={() =>
                    handleRemoveFromWishlist(product._id)
                  }
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <i className="ri-heart-fill text-red-500"></i>
                </button>

              </div>

              <div className="mt-5">

                <p className="uppercase tracking-[3px] text-xs text-neutral-400">
                  {product.category || "Fashion"}
                </p>

                <h2 className="mt-2 text-lg font-medium line-clamp-1">
                  {product.title}
                </h2>

                <p className="mt-2 text-xl font-semibold">
                  ₹ {product.price?.amount?.toLocaleString()}
                </p>

                <div className="mt-6 flex gap-3">

                  <button
                    onClick={() =>
                      navigate(`/product/${product._id}`)
                    }
                    className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-neutral-800 transition"
                  >
                    View Product
                  </button>

                  <button
                    onClick={() =>
                      handleRemoveFromWishlist(product._id)
                    }
                    className="w-14 border rounded-lg hover:bg-neutral-100 transition"
                  >
                    <i className="ri-delete-bin-line text-lg"></i>
                  </button>

                </div>

              </div>

            </div>

          );
        })}

      </div>

    </section>
  );
};

export default Wishlist;