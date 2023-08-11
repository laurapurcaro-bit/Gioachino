import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../../components/cards/ProductCard";
import MainPartHome from "./MainPartHome";
import SecondPartHome from "./SecondPartHome";
import ThirdPartHome from "./ThirdPartHome";

import styling from "./Home.module.css";

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
    // remove order when in homepage
    localStorage.removeItem("order");
    // eslint-disable-next-line
  }, []);

  // exceute only when page changes and not on initial render
  useEffect(() => {
    // if page is 1, don't load more products
    if (page === 1) return;
    // if page is not 1, load more products
    loadMore();
    // eslint-disable-next-line
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
    <div className={styling.wrap}>
      {/* First part homepage */}
      <MainPartHome />
      {/* Second part homepage */}
      <SecondPartHome />
      {/* Third part homepage */}
      <ThirdPartHome />
    </div>
  );
}
