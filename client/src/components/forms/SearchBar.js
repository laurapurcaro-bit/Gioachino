import React, { useState } from "react";
import axios from "axios";
import { useSearch } from "../../context/search";
import { useNavigate } from "react-router-dom";
import styling from "./SearchBar.module.css";
import stylingNavbar from "../nav/Navbar.module.css";
import { Trans } from "react-i18next";

export default function Searchbar() {
  // hook
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchBar = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/products/search/${values?.search}`);
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // with form you can submit with enter key
    <div className={styling.navbarLeft}>
      <span
        className={`${stylingNavbar.navElements} ${stylingNavbar.navbarFontLinks} ${styling.searchBarLink}`}
        onClick={toggleSearch}
      >
        <Trans>Search</Trans>
      </span>
      {isSearchOpen && (
        <form className={styling.form} onSubmit={handleSearchBar}>
          <input
            className={styling.searchBarInput}
            type="search"
            id="search-bar"
            placeholder="Search"
            onChange={(e) => setValues({ ...values, search: e.target.value })}
          />
          <button className={styling.buttonLink} type="submit"></button>
        </form>
      )}
    </div>
  );
}

{
  /* <form className="" onSubmit={handleSearchBar}>
      <input
        type="search"
        style={{ borderRadius: "0px", height: "30px", float: "left" }}
        className="form-control"
        placeholder="Search"
        onChange={(e) => setValues({ ...values, search: e.target.value })}
        value={values.search}
      />
      <button className={styling.buttonLink} type="submit">
        Search
      </button>
    </form> */
}
