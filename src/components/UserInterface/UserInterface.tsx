import styles from "@/components/UserInterface/UserInterface.module.css";
import { useEffect, useState } from "react";
import SearchBox from "../SearchBox/SearchBox";

export default function UserInterface() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);
  const [items, setItems] = useState([]);
  const [cardClicked, setCardClicked] = useState(false);
  const [showParagraph, setShowParagraph] = useState(false);

  const getMedicineCardActiveStyle = () => {
    if (cardClicked) return styles.medicineCardActive;
    else return styles.medicineCard;
  };
  const getParagraphsActiveStyle = () => {
    if (showParagraph) {
      return styles.cardParagraphActive;
    }
    return styles.cardParagraph;
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      return setQuery(event.currentTarget.value);
    }
  };

  const handleCardClicked = () => {
    setCardClicked(!cardClicked);
    setShowParagraph(!showParagraph);
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
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          error => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }
  }, [query]);
  console.log(items);
  return (
    <>
      <SearchBox query={query} handleSearch={handleSearch} />

      {!query ? (
        <p>Make a search</p>
      ) : !isLoaded ? (
        <div>...Loading</div>
      ) : (
        <ul>
          {items ? (
            items.map(
              (medication: {
                openfda: { generic_name: string };
                purpose: string;
                active_ingredient: string;
                do_not_use: string;
              }) => (
                <div
                  className={getMedicineCardActiveStyle()}
                  key={medication.openfda.generic_name}
                  onClick={handleCardClicked}
                >
                  <h4>
                    <strong>{medication.openfda.generic_name}</strong>
                  </h4>
                  <div className={getParagraphsActiveStyle()}>
                    {cardClicked ? (
                      <>
                        <p>
                          <strong>Purpose:</strong> {medication.purpose}
                        </p>
                        <p>
                          <strong>Ingredients:</strong>{" "}
                          {medication.active_ingredient}
                        </p>
                        <p>
                          <strong>{"Don't use: "}</strong>{" "}
                          {medication.do_not_use}
                        </p>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              )
            )
          ) : (
            <div>Not found</div>
          )}
        </ul>
      )}
    </>
  );
}
