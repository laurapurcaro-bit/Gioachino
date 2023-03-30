import { useState, useEffect } from "react";
import Jumbotron from "../components/cards/Jumbotron";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Badge } from "antd";
import {
  FaDollarSign,
  FaProjectDiagram,
  FaRegClock,
  FaCheck,
  FaTimes,
  FaTruckMoving,
  FaWarehouse,
  FaRocket,
} from "react-icons/fa";

export default function ViewProduct() {
  // state
  const [product, setProduct] = useState({});
  // hook
  const params = useParams();
  console.log("PARAMS", params);
  //   const
  const inStock = product?.quantity - product?.sold;
  const currency = "EUR";
  const localString = "en-US";
  useEffect(() => {
    // const slug = window.location.pathname.split("/")[2];
    if (params?.slug) {
      loadProduct();
    }
    // make request only when slug changes
    // eslint-disable-next-line
  }, [params?.slug]);

  const loadProduct = async (req, res) => {
    try {
      const { data } = await axios.get(`/product/${params.slug}`);
      setProduct(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-9">
          <div className="card mb-3">
            <Badge.Ribbon text={`${product?.sold} sold`} color="red">
              <Badge.Ribbon
                text={`${
                  product?.quantity >= 1
                    ? `${inStock} in stock`
                    : "Out of Stock"
                }`}
                placement="start"
                color={`${product?.quantity >= 1 ? "green" : "red"}`}
              >
                <img
                  className="card-img-top"
                  src={`${process.env.REACT_APP_API}/product/photo/${product._id}`}
                  alt={product?.name}
                  // className="img img-responsive"
                  height="300px"
                  width="230px"
                  style={{ height: "600px", width: "100%" }}
                />
              </Badge.Ribbon>
            </Badge.Ribbon>
            <div className="card-body">
              <h1 className="fw-bold">{product?.name}</h1>
              {/* <h4 className="fw-bold">Price</h4> */}
              <p className="card-text lead">{product?.description}</p>
            </div>

            <div className="d-flex justify-content-between lead p-5 bg-light fw-bold">
              <div>
                <p className="fw-bold">
                  <FaDollarSign /> Price:{" "}
                  {product?.price?.toLocaleString(localString, {
                    style: "currency",
                    currency: currency,
                  })}
                </p>
                <p>
                  <FaProjectDiagram />
                  Category: {product?.category?.name}
                </p>
              </div>
            </div>

            <button
              className="btn btn-outline-primary col card-button-footer"
              style={{ borderBottomRightRadius: "5px" }}
            >
              Add to Cart
            </button>
          </div>
        </div>
        <div className="col-md-3">
          <h2>Related products</h2>
        </div>
      </div>
    </div>
  );
}
