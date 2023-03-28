import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import CategoryForm from "../../components/forms/CategoryForms";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal } from "antd";

export default function AdminCategory() {
  // context
  const [auth] = useAuth();
  // state
  const [name, setName] = useState("");
  // Create category
  const [categories, setCategories] = useState([]);
  // Flag to show modal
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  // Update category
  const [updatingName, setUpdatingName] = useState("");

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
      const { data } = await axios.post("/category", { name: name });
      if (data?.error) {
        toast.error(data.error);
      } else {
        // Show the newly created category
        loadCategory();
        toast.success(`Category ${data.name} created`);
        setName("");
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
      // Update the category
      const { data } = await axios.put(`/category/${selected._id}`, {
        name: updatingName,
      });
      if (data?.error) {
        toast.error(data.error);
      } else {
        // Show the newly created category

        toast.success(`Category "${data.name}" updated`);
        setSelected(null);
        setUpdatingName("");
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
      // Update the category
      const { data } = await axios.delete(`/category/${selected._id}`);
      if (data?.error) {
        toast.error(data.error);
      } else {
        // Show the newly created category
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
            <div className="p-3 mt-2 mb-2 h4 bg-light">Manage Categories</div>
            <CategoryForm
              value={name}
              setValue={setName}
              handleSubmit={handleSubmit}
              BtnName="Submit"
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
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
            {/* Ant UI */}
            <Modal
              open={visible}
              onOk={() => setVisible(false)}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <CategoryForm
                value={updatingName}
                setValue={setUpdatingName}
                handleSubmit={handleUpdate}
                handleDelete={handleDelete}
                BtnName="Update"
              />
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}
