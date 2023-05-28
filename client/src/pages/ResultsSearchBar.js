import ProductCard from "../components/cards/ProductCard";
import { useSearch } from "../context/search";

export default function ResultsSearchBar() {
  const [values] = useSearch();
  return (
    <>
      {/* <pre>{JSON.stringify(values.results)}</pre> */}
      <div className="container mt-3">
        <div className="row">
          {values?.results?.map((product) => (
            <div key={product._id} className="col-md-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
