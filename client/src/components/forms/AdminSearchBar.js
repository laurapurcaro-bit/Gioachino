import axios from "axios";
import { useSearch } from "../../context/search";
import { useNavigate } from "react-router-dom";

export default function Searchbar() {
  // hook
  const [values, setValues] = useSearch([]);
  const navigate = useNavigate();

  const handleSearchBar = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `/admin/orders/search/${values?.search}`
      );
      // console.log("SEARCH RESULTS", data);
      setValues({ ...values, results: [data] });
      navigate("/dashboard/admin/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // with form you can submit with enter key
    <form className="d-flex" onSubmit={handleSearchBar}>
      <input
        type="search"
        style={{ borderRadius: "0px", height: "30px", float: "left" }}
        className="form-control"
        placeholder="Search"
        onChange={(e) => setValues({ ...values, search: e.target.value })}
        value={values.search}
      />
      <button
        className="btn btn-outline-primary mt-2"
        type="submit"
        style={{
          borderRadius: "0px",
          height: "30px",
          float: "left",
          textAlign: "center",
        }}
      >
        Search
      </button>
    </form>
  );
}
