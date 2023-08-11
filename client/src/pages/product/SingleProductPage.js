import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";
import styling from "./SingleProductPage.module.css";
import { Trans } from "react-i18next";
import { Carousel } from "react-responsive-carousel";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import RelatedProductCard from "../../components/cards/RelatedProductCard";
import { decryptData, encryptData } from "../../constants";
import TabWrapper from "./Tabwrapper";

// Single product page
export default function SingleProductPage() {
  // context
  const [cart, setCart] = useCart();
  // state
  const [product, setProduct] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [activeColor, setActiveColor] = useState("blue");
  const [selectedSize, setSelectedSize] = useState("");
  // hook
  const params = useParams();
  //   const
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
      // load related products when product is loaded
      loadRelatedProducts(data._id, data.category._id);
      console.log("PRODUCT!", data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadRelatedProducts = async (productId, categoryId) => {
    try {
      const { data } = await axios.get(`/products/related/${productId}/${categoryId}`);
      setRelatedProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
    product.quantity = product.quantity + 1;
    // USE CART CONTEXT
    setProduct((prev) => ({ ...prev, product }));
    console.log("PRODUCT +", product);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      product.quantity = product.quantity - 1;
      setProduct((prev) => ({ ...prev, product }));
      console.log("PRODUCT -", product);
    }
  };

  const addToCart = (product) => {
    // Check if the product already exists in the cart
    // const cartLs = JSON.parse(localStorage.getItem("cart")) || [];
    const cartLs = decryptData("cart");
    const existingProductIndex = cartLs.findIndex((item) => item._id === product._id);
    // If no element is found, it returns -1
    if (existingProductIndex !== -1) {
      console.log("PROD EX");
      console.log("EXISTING PRODUCT", cartLs);
      // If the product exists, update the quantity
      const updatedCart = [...cartLs];
      updatedCart[existingProductIndex].quantity += product.quantity;

      console.log("UPDATED CART", updatedCart);
      // localStorage.setItem("cart", JSON.stringify(updatedCart));
      encryptData(updatedCart, "cart");
      setCart(updatedCart);
    } else {
      console.log("PROD NEW");
      // If the product does not exist, add it to the cart
      const updatedCart = [...cart, product];
      setCart(updatedCart);
      // localStorage.setItem("cart", JSON.stringify(updatedCart));
      encryptData(updatedCart, "cart");
    }
  };

  const renderCustomPrevArrow = (onClickHandler, hasPrev) => {
    return (
      hasPrev && (
        <div className={`${styling.customArrowContainer}`} onClick={onClickHandler}>
          <button className={`${styling.customPrevArr}`}>
            <LeftOutlined />
          </button>
        </div>
      )
    );
  };

  const renderCustomNextArrow = (onClickHandler, hasNext) => {
    return (
      hasNext && (
        <div className={`${styling.customArrowContainer}`} onClick={onClickHandler}>
          <button className={`${styling.customNextArr}`}>
            <RightOutlined />
          </button>
        </div>
      )
    );
  };

  const handleColorClick = (color) => {
    setActiveColor(color);
  };

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  return (
    <div className={styling.wrap}>
      <div className={styling.productPage}>
        <div className="row">
          <div className="col-md-6">
            <div className={styling.imageSection}>
              <div className={styling.imgRepo}>
                {/* Additional Images */}
                {product?.additionalPhotos?.name?.map((photo, index) => (
                  <img
                    key={index}
                    src={`${process.env.REACT_APP_S3_HTTP_BUCKET_DEV}/products/${product?.category?.name.toLowerCase()}/${product._id}-${
                      index + 1
                    }.png`}
                    alt={product?.name}
                    onClick={() => setSelectedImageIndex(index + 1)}
                  />
                ))}
              </div>
              {/* Main Image */}
              <div className={styling.mainImageContainer}>
                <Carousel
                  className={styling.carouselContainer}
                  showArrows={true}
                  showThumbs={false}
                  infiniteLoop={true}
                  selectedItem={selectedImageIndex}
                  onChange={(index) => setSelectedImageIndex(index)}
                  renderArrowPrev={renderCustomPrevArrow}
                  renderArrowNext={renderCustomNextArrow}
                >
                  {product?.additionalPhotos?.name?.map((photo, index) => (
                    <img
                      key={index}
                      src={`${process.env.REACT_APP_S3_HTTP_BUCKET_DEV}/products/${product?.category?.name.toLowerCase()}/${
                        product._id
                      }-${index}.png`}
                      alt={product?.name}
                      onClick={() => setSelectedImageIndex(index + 1)}
                    />
                  ))}
                </Carousel>
              </div>
            </div>
          </div>
          {/* Product description */}
          <div className="col-md-6">
            <div className={styling.productDetails}>
              {product?.stock < 1 && (
                <div>
                  <span className={styling.esaurito}>
                    <Trans>OUT OF STOCK</Trans>
                  </span>
                </div>
              )}
              <div className={styling.header}>
                <h1>
                  <Trans>{product.name}</Trans>
                </h1>
                <h4>
                  <Trans>Description</Trans>
                </h4>
                <p>
                  <Trans>{product.description}</Trans>
                </p>
              </div>
              <div className={styling.colorContainer}>
                <p>Color:</p>
                <div class={styling.colors}>
                  <div className={styling.eachColor}>
                    <span
                      class={`${styling.blue} ${activeColor === "blue" ? `${styling.active}` : ""}`}
                      onClick={() => handleColorClick("blue")}
                      data-color="#7ed6df"
                      data-pic="url(https://i.imgur.com/oRpXTOq.png)"
                    ></span>
                    {activeColor === "blue" && <p className={styling.down}>{activeColor}</p>}
                  </div>
                  <div className={styling.eachColor}>
                    <span
                      class={`${styling.green} ${activeColor === "green" ? `${styling.active}` : ""}`}
                      onClick={() => handleColorClick("green")}
                      data-color="#badc58"
                      data-pic="url(https://i.imgur.com/iyx4e9c.png)"
                    ></span>
                    {activeColor === "green" && <p className={styling.down}>{activeColor}</p>}
                  </div>
                  <div className={styling.eachColor}>
                    <span
                      class={`${styling.yellow} ${activeColor === "yellow" ? `${styling.active}` : ""}`}
                      onClick={() => handleColorClick("yellow")}
                      data-color="#f9ca24"
                      data-pic="url(https://i.imgur.com/kzsklN4.png)"
                    ></span>
                    {activeColor === "yellow" && <p className={styling.down}>{activeColor}</p>}
                  </div>
                  <div className={styling.eachColor}>
                    <span
                      class={`${styling.rose} ${activeColor === "rose" ? `${styling.active}` : ""}`}
                      onClick={() => handleColorClick("rose")}
                      data-color="#ff7979"
                      data-pic="url(https://i.imgur.com/iVJjW92.png)"
                    ></span>
                    {activeColor === "rose" && <p className={styling.down}>{activeColor}</p>}
                  </div>
                </div>
              </div>
              <div className={styling.sizeContainer}>
                <p>Size:</p>
                <div>
                  <select id="size" className={styling.size} value={selectedSize} onChange={handleSizeChange}>
                    <option value="">-</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>
              </div>
              <div className={styling.quantitySection}>
                <span className={styling.quantitySpan}>
                  <p>
                    <Trans>Quantity</Trans>
                  </p>
                  <span>
                    <button onClick={handleDecreaseQuantity}>-</button>
                    <p>{quantity + 1}</p>
                    <button onClick={handleIncreaseQuantity}>+</button>
                  </span>
                </span>
                <button
                  className={styling.quantityBtn}
                  onClick={() => {
                    addToCart(product);
                    toast.success(`${product.name} added to cart`);
                  }}
                >
                  <Trans>ADD TO CART</Trans>
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <TabWrapper />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-5">
              <div className="">
                <h2>{relatedProducts.length < 1 ? <h2>See also</h2> : <h2>Related Products</h2>}</h2>
                {/* Show only if no related products */}
                {relatedProducts.length < 1 && <p>No related products</p>}
                {relatedProducts.map((product, index) => (
                  <div key={index} className="row mt-5">
                    <RelatedProductCard product={product} key={product._id} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
