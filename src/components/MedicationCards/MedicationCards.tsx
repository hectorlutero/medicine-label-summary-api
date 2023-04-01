import { useState } from "react";
import styles from "./MedicationCards.module.css";
import MedicationCard from "../MedicationCard/MedicationCard";

export interface Items {
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
              <MedicationCard
                medication={medication}
                cardClicked={cardClicked}
                showParagraph={showParagraph}
              />
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
