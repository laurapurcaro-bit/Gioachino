import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function AdminShowProducts() {
  // context
  const [auth] = useAuth();
  const navigate = useNavigate();
  //  hook
  const [products, setProducts] = useState([]);
  const [slug_param, setSlug_param] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await axios.get("/products");
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleButtons = (slug) => {
    setSlug_param(slug);
    navigate(`dashboard/admin/products/update/${slug}`);
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
            <div className="p-3 mt-2 mb-2 h4 bg-light">Admin Products</div>
            {products?.map((p) => (
              <Link key={p._id} to={`update/${p.slug}`}>
                <div className="card mb-3">
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img
                        src={`${process.env.REACT_APP_API}/product/photo/${p._id}`}
                        className="img img-fluid rounded-start"
                        // Make sure all images are the same size
                        style={{
                          float: "left",
                          width: "150px",
                          height: "200px",
                          objectFit: "cover",
                        }}
                        alt={p.name}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text">{p.description}</p>
                        <p className="card-text">
                          <small className="text-muted">
                            {moment(p.createdAt).format(
                              "MMMM Do YYYY, h:mm:ss a"
                            )}
                          </small>
                        </p>
                        <div>
                          <button
                            className="btn btn-primary btn-sm m-2"
                            onClick={(e) => handleButtons(p.slug)}
                            value={slug_param}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-danger btn-sm m-2"
                            onClick={(e) => handleButtons(p.slug)}
                            value={slug_param}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
