import { useAuth } from "../../context/auth";
import AdminMenu from "../../components/nav/AdminMenu";
import { useState, useEffect } from "react";
import axios from "axios";
import { Select } from "antd";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { colors, sizes } from "../../constants";

const { Option } = Select;

export default function AdminCreateProduct() {
  // context
  const [auth] = useAuth();
  const navigate = useNavigate();
  // state
  // Categories in the database
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [additionalPhotos, setAdditionalPhotos] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(null);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  // Product
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState(false);
  const [stock, setStock] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("shortDesc", shortDesc);
      formData.append("price", price);
      for (const element of categories) {
        if (element._id === category) {
          formData.append("categoryName", element.name);
        }
      }
      formData.append("category", category);
      formData.append("shipping", shipping);
      formData.append("color", color);
      formData.append("size", size);
      formData.append("stock", stock);
      if (photo) {
        formData.append("photo", photo);
      }

      if (additionalPhotos) {
        for (const element of additionalPhotos) {
          formData.append("additionalPhotos", element);
        }
      }

      console.log([...formData]);

      const { data } = await axios.post("/product/create", formData, config);

      if (data?.error) {
        toast.error(data.error);
      } else {
        // Show the newly created category
        toast.success(`Product ${name} created`);
        // navigate("/dashboard/admin/products");
      }
    } catch (err) {
      console.log(err);
      toast.error("Create product failed. Try again.");
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
              <div className="p-3 mt-2 mb-2 h4 bg-light">Create Products</div>
              {/* Additional photos */}
              <input
                type="file"
                name="additionalPhotos"
                accept="image/*"
                multiple
                onChange={(e) => setAdditionalPhotos(e.target.files)}
                hidden
              />
              {/* Create additional photos */}
              {/* Show new photos */}
              {additionalPhotos?.length > 0 && (
                <div className="text-center">
                  {Array.from(additionalPhotos).map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt="product"
                      className="img img-responsive"
                      height="200px"
                    />
                  ))}
                </div>
              )}
              <div className="pt-2">
                <label className="btn btn-outline-secondary p-2 col-12 mb-3">
                  {additionalPhotos?.length > 0
                    ? `${additionalPhotos?.length} Additional Photos Selected`
                    : "Upload Additional Photos"}
                  <input
                    type="file"
                    name="additionalPhotos"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      setAdditionalPhotos(e.target.files);

                      console.log("ADDITIONAL PHOTOS", additionalPhotos);
                    }}
                    hidden
                  />
                </label>
              </div>
              {/* Photo */}
              {/* Read From S3 */}
              {photo?.size && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(photo)}
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
                    onChange={(e) => {
                      setPhoto(e.target.files[0]);
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
              {/* Short desc */}
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
              {/* Stock */}
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
                onChange={(shipping) => setShipping(shipping)}
              >
                <Option value="0">No</Option>
                <Option value="1">Yes</Option>
              </Select>
              <button
                onClick={handleSubmit}
                className="btn btn-outline-primary mb-5"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
