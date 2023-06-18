import styling from "./RelatedProductCard.module.css";
import { useNavigate } from "react-router-dom";

export default function RelatedProductCard({ product }) {
  const currency = "EUR";
  const localString = "en-US";
  const navigate = useNavigate();

  function productDesc(description) {
    if (description?.length < 60) {
      return description;
    } else {
      return description?.substring(0, 60) + "...";
    }
  }

  const navigateToRelatedProduct = (product) => {
    navigate(`/product/${product.slug}`);
  };

  return (
    <>
      <div className={`col-md-1 ${styling.relatedProd}`} onClick={() => navigateToRelatedProduct(product)}>
        <img
          className={`${styling.cardImage}`}
          src={`${
            process.env.REACT_APP_S3_HTTP_BUCKET_DEV
          }/products/${product?.category?.name.toLowerCase()}/${
            product._id
          }-0.png`}
          alt={product?.name}
        />
      </div>
      <div className="col-md-1" onClick={() => navigateToRelatedProduct(product)}>
        <div className="">
          <h3>{product?.name}</h3>
          <h4 className="fw-bold">
            {product?.price?.toLocaleString(localString, {
              style: "currency",
              currency: currency,
            })}
          </h4>
          <p className="">{productDesc(product?.description)}</p>
        </div>
      </div>
    </>
  );
}
