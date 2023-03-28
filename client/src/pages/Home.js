import Jumbotron from "../components/cards/Jumbotron";
import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../components/cards/ProductCard";

export default function Home() {
  // const [auth] = useAuth();
  // hook
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await axios.get("/products");
      setProducts(data);
    } catch (err) {
      console.log(err);
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
    </div>
  );
}
