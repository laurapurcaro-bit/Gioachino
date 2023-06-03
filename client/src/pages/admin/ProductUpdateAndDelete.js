import { Buffer } from "buffer";
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
  const [photo, setPhoto] = useState(null);
  const [photoUpdate, setPhotoUpdate] = useState(null);
  const [additionalPhotos, setAdditionalPhotos] = useState(null);
  const [additionalPhotosUpdate, setAdditionalPhotosUpdate] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  // Product
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState(false);
  const [stock, setStock] = useState(0);
  // Id
  const [id, setId] = useState("");

  useEffect(() => {
    loadProduct();
    loadCategories();
    loadAdditionalPhotos();
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
      setPrice(data.price);
      setId(data._id);
      setCategory(data.category._id);
      setShipping(data.shipping);
      setStock(data.stock);
    } catch (err) {
      console.log(err);
    }
  };

  const loadAdditionalPhotos = async () => {
    try {
      const { data } = await axios.get(`/product/additionalPhotos/${slug}`);
      setAdditionalPhotos(data);
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
      formData.append("price", price);
      formData.append("category", category);
      formData.append("shipping", shipping);
      formData.append("stock", stock);
      if (photoUpdate) {
        formData.append("photo", photo);
      }
      if (additionalPhotosUpdate) {
        for (const element of additionalPhotosUpdate) {
          console.log("additionalPhotosUpdate", element);
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

  const convertFiletoBuffer = (uploadedPhotos) => {
    const reader = new FileReader();
    const convertedPhotos = []; // Array to store the converted photos
    
    const convertPhoto = (file) => {
      
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const photoData = new Uint8Array(reader.result); // Get the photo data as Uint8Array
          const photoBuffer = {
            type: "Buffer",
            data: Array.from(photoData),
            name: file.name,
            photosInfo: [
              {
                name: file.name,
                type: file.type,
                path: "uploads/" + file.name,
                size: file.size,
              },
            ],
          };

          resolve(photoBuffer);
        };
        reader.onerror = reject;

        reader.readAsArrayBuffer(file);
      });
    };

    const convertPhotos = async () => {
      for (const element of uploadedPhotos) {
        const convertedPhoto = await convertPhoto(element);
        convertedPhotos.push(convertedPhoto);
      }
      // Use the convertedPhotos array as needed
      console.log("converted", convertedPhotos);

      setAdditionalPhotos(convertedPhotos); // Set the converted photos in state
    };
    convertPhotos();
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
              {/* Additional photos */}
              <input
                type="file"
                name="additionalPhotos"
                accept="image/*"
                multiple
                onChange={(e) => {
                  setAdditionalPhotos(e.target.files)
                  setAdditionalPhotosUpdate(e.target.files);
                  }}
                hidden
              />
              {additionalPhotos?.length > 0 ? (
                <div className="text-center">
                  {Array.from(additionalPhotos)?.map((file, index) => (
                    <img
                      key={index}
                      src={`data:image/png;base64,${Buffer.from(
                        file.data
                      ).toString("base64")}`}
                      alt="product"
                      className="img img-responsive"
                      height="200px"
                    />
                  ))}
                </div>
              ) : (
                <div>New image</div>
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
                      // Show the photos
                      convertFiletoBuffer(e.target.files);
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
