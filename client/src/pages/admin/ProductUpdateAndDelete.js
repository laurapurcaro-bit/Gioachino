import { Buffer } from "buffer";
import { colors, sizes } from "../../constants";
import { useAuth } from "../../context/auth";
import AdminMenu from "../../components/nav/AdminMenu";
import { useState, useEffect } from "react";
import axios from "axios";
import { Select } from "antd";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

export default function AdminUpdateProduct() {
  // context
  const [auth] = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();
  // state
  // Categories in the database
  const [categories, setCategories] = useState([]);
  const [photoUpdate, setPhotoUpdate] = useState(null);
  const [additionalPhotosUpdate, setAdditionalPhotosUpdate] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [price, setPrice] = useState(0);
  // Product
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState(false);
  const [categorySlug, setCategorySlug] = useState("");
  const [product, setProduct] = useState({});
  const [stock, setStock] = useState(0);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  // Id
  const [id, setId] = useState("");

  useEffect(() => {
    loadProduct();
    loadCategories();
    // eslint-disable-next-line
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await axios.get("/categories");
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadProduct = async () => {
    try {
      const { data } = await axios.get(`/product/${slug}`);
      setName(data.name);
      setDescription(data.description);
      setShortDesc(data.shortDesc);
      setPrice(data.price);
      setId(data._id);
      setCategory(data.category._id);
      setShipping(data.shipping);
      setStock(data.stock);
      setColor(data.color);
      setSize(data.size);
      setCategorySlug(data.categorySlug.toLowerCase());
      setProduct(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      // Check if photo in the state
      formData.append("name", name);
      formData.append("description", description);
      formData.append("shortDesc", shortDesc);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("shipping", shipping);
      formData.append("stock", stock);
      formData.append("color", color);
      formData.append("size", size);

      for (const element of categories) {
        if (element._id === category) {
          formData.append("categoryName", element.name);
        }
      }

      if (photoUpdate) {
        formData.append("photo", photoUpdate);
      }
      if (additionalPhotosUpdate) {
        for (const element of additionalPhotosUpdate) {
          formData.append("additionalPhotos", element);
        }
      }

      const { data } = await axios.put(
        `/product/update/${id}`,
        formData,
        config
      );

      if (data?.error) {
        toast.error(data.error);
      } else {
        // Show the newly created category
        toast.success(`Product ${data.name} is updated`);
        navigate("/dashboard/admin/products");
        // Reload the page and show the new category
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
      toast.error("Update product failed. Try again.");
    }
  };

  const handleDelete = async (req, res) => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      // If no, block the function with return
      if (!answer) return;
      // Otherwise, delete the product
      const { data } = await axios.delete(`/product/${id}`);
      toast.success(`"${data.name}" is deleted.`);
      navigate("/dashboard/admin/products");
    } catch (err) {
      console.log(err);
      toast.error("Delete product failed. Try again.");
    }
  };

  return (
    <>
      {/* <pre>{JSON.stringify(auth, null, 4)}</pre> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <form encType="multipart/form-data">
            <div className="col-md-9">
              <div className="p-3 mt-2 mb-2 h4 bg-light">Update Product</div>
              {/* Photo */}
              {photoUpdate?.size ? (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(photoUpdate)}
                    alt="product"
                    className="img img-responsive"
                    height="200px"
                  />
                </div>
              ) : (
                <div className="text-center">
                  {/* Fetch the latest image */}
                  <img
                    src={`${process.env.REACT_APP_S3_HTTP_BUCKET_DEV}/products/${categorySlug}/${id}-0.png`}
                    alt="product"
                    className="img img-responsive"
                    height="200px"
                  />
                </div>
              )}
              <div className="pt-2">
                <label className="btn btn-outline-secondary p-2 col-12 mb-3">
                  {photoUpdate?.length ? photoUpdate.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhotoUpdate(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>
              {/* Additional photos */}
              {/* If uploaded new photo */}
              {additionalPhotosUpdate.length > 0 ? (
                <div className="text-center">
                  {Array.from(additionalPhotosUpdate)?.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt="product"
                      className="img img-responsive"
                      height="200px"
                    />
                  ))}
                </div>
              ) : (
                // Otherwise, fetch from S3
                <div className="text-center">
                  {product?.additionalPhotos?.name.map((file, index) => (
                    <img
                      key={index}
                      src={`${process.env.REACT_APP_S3_HTTP_BUCKET_DEV}/products/${categorySlug}/${id}-${index}.png`}
                      alt="product"
                      className="img img-responsive"
                      height="200px"
                    />
                  ))}
                </div>
              )}
              <div className="pt-2">
                <label className="btn btn-outline-secondary p-2 col-12 mb-3">
                  {additionalPhotosUpdate?.length > 0
                    ? `${additionalPhotosUpdate?.length} Additional Photos Selected`
                    : "Upload Additional Photos"}
                  <input
                    type="file"
                    name="additionalPhotos"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      // Send the photos to FileList type
                      setAdditionalPhotosUpdate(e.target.files);
                    }}
                    hidden
                  />
                </label>
              </div>
              {/* Category name */}
              <input
                type="text"
                className="form-control mb-3 p-2"
                placeholder="Write a name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {/* Description */}
              <textarea
                type="text"
                className="form-control mb-3 p-2"
                placeholder="Write a description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {/* Short description */}
              <textarea
                type="text"
                className="form-control mb-3 p-2"
                placeholder="Write a short description"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
              />
              {/* PRICE */}
              <input
                type="number"
                className="form-control mb-3 p-2"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {/* Categories */}
              <Select
                // showSearch
                bordered={false}
                size="large"
                className="form-select mb-3"
                placeholder="Choose a category"
                value={category}
                onChange={(category) => setCategory(category)}
              >
                {categories?.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
              {/* Color */}
              <Select
                // showSearch
                bordered={false}
                size="large"
                className="form-select mb-3"
                placeholder="Choose a color"
                value={color}
                onChange={(color) => setColor(color)}
              >
                {colors?.map((color) => (
                  <Option key={color._id} value={color.name}>
                    {color.name}
                  </Option>
                ))}
              </Select>
              {/* Sizes */}
              <Select
                // showSearch
                bordered={false}
                size="large"
                value={size}
                className="form-select mb-3"
                placeholder="Choose a size"
                onChange={(size) => setSize(size)}
              >
                {sizes?.map((size) => (
                  <Option key={size._id} value={size.name}>
                    {size.name}
                  </Option>
                ))}
              </Select>
              {/* Quantity */}
              <input
                type="number"
                min="1"
                className="form-control mb-3 p-2"
                placeholder="Enter stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
              {/* Shipping */}
              <Select
                bordered={false}
                size="large"
                className="form-select mb-3"
                placeholder="Choose shipping"
                value={shipping ? "1" : "0"}
                onChange={(shipping) => setShipping(shipping)}
              >
                <Option value="0">No</Option>
                <Option value="1">Yes</Option>
              </Select>
              <div className="d-flex justify-content-end">
                <button
                  onClick={handleUpdate}
                  className="btn btn-outline-primary mb-5 m-2"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-outline-danger mb-5 m-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
