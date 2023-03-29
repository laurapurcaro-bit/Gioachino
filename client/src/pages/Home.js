import Jumbotron from "../components/cards/Jumbotron";
import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../components/cards/ProductCard";

export default function Home() {
  // const [auth] = useAuth();
  // hook
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
    // execute getTotal function
    getTotal();
  }, []);

  // exceute only when page changes and not on initial render
  useEffect(() => {
    // if page is 1, don't load more products
    if (page === 1) return;
    // if page is not 1, load more products
    loadMore();
  }, [page]);

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/products-count");
      setTotal(data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadProducts = async () => {
    try {
      const { data } = await axios.get(`/list-products/${page}`);
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadMore = async () => {
    // Load more products
    try {
      setLoading(true);
      const { data } = await axios.get(`/list-products/${page}`);
      // keep the old products and add the new products
      setProducts([...products, ...data]);
      console.log(products);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const arr = [...products];
  const sortedBySold = arr?.sort((a, b) => (a.sold < b.sold ? 1 : -1));

  return (
    <div>
      <Jumbotron title="Home" subTitle="Welcome to e-commerce" />
      {/* <pre>{JSON.stringify(auth, null, 4)}</pre> */}

      <div className="row">
        <div className="col-md-6">
          <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">
            New Arrivals
          </h2>
          <div className="row">
            {products?.map((product) => {
              return (
                <div className="col-md-6" key={product._id}>
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">
            Best Sellers
          </h2>
          <div className="row">
            {sortedBySold?.map((product) => {
              return (
                <div className="col-md-6" key={product._id}>
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="container text-center p-5">
        {products && products?.length < total && (
          <button
            className="btn btn-outline-primary btn-lg col-md-6"
            // disabled when loading is true
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              // Increment page
              setPage(page + 1);
            }}
          >
            {loading ? "Loading..." : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
}
