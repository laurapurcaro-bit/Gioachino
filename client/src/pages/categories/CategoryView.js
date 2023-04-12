import Jumbotron from "../../components/cards/Jumbotron";
import { useState, useEffect } from "react";
import axios from "axios";
// you can read the Route params
import { useParams } from "react-router-dom";
import ProductCard from "../../components/cards/ProductCard";

export default function CategoryView() {
  // state
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  // hooks
  const params = useParams();

  useEffect(() => {
    if (params.slug) loadProductsByCategory();
    // eslint-disable-next-line
  }, [params?.slug]);

  const loadProductsByCategory = async () => {
    try {
      const { data } = await axios.get(`/products-by-category/${params.slug}`);
      setCategory(data.category);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Jumbotron
        title={category?.name}
        subTitle={`${products?.length} products found in "${category?.name}"`}
      />
      <div className="container-fluid">
        <div className="row mt-3">
          {products?.map((product) => {
            return (
              <div key={product._id} className="col-md-4">
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
