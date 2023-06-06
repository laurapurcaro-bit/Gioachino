import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import AdminMenu from "../../components/nav/AdminMenu";
import {
  CategoryForm,
  CategoryFormUpdate,
} from "../../components/forms/CategoryForms";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal } from "antd";

export default function AdminCategory() {
  // context
  const [auth] = useAuth();
  // state
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState([]);
  // Create category
  const [categories, setCategories] = useState([]);
  // Flag to show modal
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  // Update category
  const [updatingName, setUpdatingName] = useState("");
  const [updatingPhoto, setUpdatingPhoto] = useState([]);

  useEffect(() => {
    loadCategory();
  }, []);

  const loadCategory = async () => {
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
      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("name", name);
      const { data } = await axios.post("/category", formData);
      // const { data } = await axios.post("/category", { name: name });
      if (data?.error) {
        toast.error(data.error);
      } else {
        // Show the newly created category
        loadCategory();
        toast.success(`Category ${data.name} created`);
        setName("");
        setPhoto([]);
      }
    } catch (err) {
      console.log(err);
      toast.error("Create category failed. Try again.");
    }
  };

  const handleUpdate = async (e) => {
    // On click by default the browser will refresh the page
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("photo", updatingPhoto);
      formData.append("name", updatingName);
      // Update the category
      const { data } = await axios.put(`/category/${selected._id}`, formData);
      if (data?.error) {
        toast.error(data.error);
      } else {
        // Show the newly created category
        toast.success(`Category "${data.name}" updated`);
        setSelected(null);
        setUpdatingName("");
        setUpdatingPhoto([]);
        loadCategory();
        setVisible(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Update category failed. Try again.");
    }
  };

  const handleDelete = async (e) => {
    // On click by default the browser will refresh the page
    e.preventDefault();
    try {
      // Delete the category
      const { data } = await axios.delete(`/category/${selected._id}`);
      if (data?.error) {
        toast.error(data.error);
      } else {
        // Show the categories without the deleted one
        toast.success(`Category "${data.name}" deleted`);
        setSelected(null);
        loadCategory();
        setVisible(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Update category failed. Try again.");
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>

          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Manage Categories</div>
            {/* Manage category form */}
            <CategoryForm
              value={name}
              setValue={setName}
              handleSubmit={handleSubmit}
              photo={photo}
              setPhoto={setPhoto}
              BtnName="Submit"
              id={id}
            />
            <hr />
            <div className="col">
              {categories?.map((category) => (
                <button
                  key={category._id}
                  className="btn btn-outline-primary m-3"
                  onClick={() => {
                    setVisible(true);
                    setSelected(category);
                    setUpdatingName(category.name);
                    setUpdatingPhoto(category.photo);
                    setId(category._id);
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
            {/* Ant UI - popup category*/}
            <Modal
              open={visible}
              onOk={() => setVisible(false)}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <CategoryFormUpdate
                value={updatingName}
                setValue={setUpdatingName}
                handleSubmit={handleUpdate}
                handleDelete={handleDelete}
                updatingPhoto={updatingPhoto}
                setUpdatingPhoto={setUpdatingPhoto}
                id={id}
                BtnName="Update"
              />
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}
