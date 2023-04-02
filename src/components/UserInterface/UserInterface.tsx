import { useEffect, useState } from "react";
import SearchBox from "../SearchBox/SearchBox";
import MedicationCards from "../MedicationCards/MedicationCards";
export default function UserInterface() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);
  const [items, setItems] = useState([]);

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      return setQuery(event.currentTarget.value);
    }
  };

  useEffect(() => {
    const medication = query;
    if (medication) {
      fetch(
        `https://api.fda.gov/drug/label.json?=${process.env.OPEN_FDA_KEY}&search=openfda.generic_name:${medication}+openfda.brand_name${medication}`
      )
        .then(res => res.json())
        .then(
          result => {
            setIsLoaded(true);
            setItems(result.results);
          },
          error => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }
  }, [query]);
  // console.log(error);
  return (
    <>
      <SearchBox query={query} handleSearch={handleSearch} />
      {!error ? (
        !query ? (
          <p>Make a search</p>
        ) : !isLoaded ? (
          <div>...Loading</div>
        ) : (
          <MedicationCards items={items} />
        )
      ) : (
        <p>{error}</p>
      )}
    </>
  );
}
