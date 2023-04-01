import { useState } from "react";
import styles from "./MedicationCards.module.css";

interface Items {
  openfda: {
    generic_name: string;
  };
  purpose: string;
  active_ingredient: string;
  do_not_use: string;
}

const MedicationCards = (props: { items: Items[] }) => {
  const [cardClicked, setCardClicked] = useState(false);
  const [showParagraph, setShowParagraph] = useState(false);

  const handleCardClicked = () => {
    setCardClicked(!cardClicked);
    setShowParagraph(!showParagraph);
  };

  const { items } = props;
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

  return (
    <>
      <ul>
        {items ? (
          items.map(medication => (
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
                      <strong>{"Don't use: "}</strong> {medication.do_not_use}
                    </p>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>Not found</div>
        )}
      </ul>
    </>
  );
};

export default MedicationCards;
