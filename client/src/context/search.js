import { useState, createContext, useContext } from "react";

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [values, setValues] = useState({
    search: "",
    results: [],
  });

  return (
    <SearchContext.Provider value={[values, setValues]}>
      {children}
    </SearchContext.Provider>
  );
};

const useSearch = () => useContext(SearchContext);

// So now we can use this hook in any component:
// const [auth, setAuth] = useAuth();

export { useSearch, SearchProvider };
