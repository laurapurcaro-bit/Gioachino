import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
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
  const [photo, setPhoto] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  // Product
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState("");
  const [quantity, setQuantity] = useState("");
  // Id
  const [id, setId] = useState("");

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadCategories();
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
      setPrice(data.price);
      setId(data._id);
      setCategory(data.category._id);
      setShipping(data.shipping);
      setQuantity(data.quantity);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      // Check if photo in the state
      photo && formData.append("photo", photo);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("shipping", shipping);
      formData.append("quantity", quantity);

      const { data } = await axios.put(`/product/${id}`, formData);

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
      <Jumbotron
        title={`Hello ${auth?.user?.firstName}`}
        subTitle="Admin Dashboard"
      />
      {/* <pre>{JSON.stringify(auth, null, 4)}</pre> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>

          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Update Product</div>

            {photo?.size ? (
              <div className="text-center">
                <img
                  src={URL.createObjectURL(photo)}
                  alt="product"
                  className="img img-responsive"
                  height="200px"
                />
              </div>
            ) : (
              <div className="text-center">
                {/* Fetch the latest image */}
                <img
                  src={`${
                    process.env.REACT_APP_API
                  }/product/photo/${id}?${new Date().getTime()}`}
                  alt="product"
                  className="img img-responsive"
                  height="200px"
                />
              </div>
            )}
            <div className="pt-2">
              <label className="btn btn-outline-secondary p-2 col-12 mb-3">
                {photo?.length ? photo.name : "Upload Photo"}
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
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
            {/* Quantity */}
            <input
              type="number"
              min="1"
              className="form-control mb-3 p-2"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
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
        </div>
      </div>
    </>
  );
}
