import React, { useState } from "react";
import styles from "../MedicationCards/MedicationCards.module.css";
import { Items } from "../MedicationCards/MedicationCards";

interface MedicationCard {
  medication: Items;
  cardClicked: boolean;
  showParagraph: boolean;
}

const MedicationCard = (props: MedicationCard) => {
  const getParagraphsActiveStyle = () => {
    if (props.showParagraph) {
      return styles.cardParagraphActive;
    }
    return styles.cardParagraph;
  };

  return (
    <>
      <h4>
        <strong>{props.medication.openfda.generic_name}</strong>
      </h4>
      <div className={getParagraphsActiveStyle()}>
        {props.cardClicked ? (
          <>
            <p>
              <strong>Purpose:</strong> {props.medication.purpose}
            </p>
            <p>
              <strong>Ingredients:</strong> {props.medication.active_ingredient}
            </p>
            <p>
              <strong>{"Don't use: "}</strong> {props.medication.do_not_use}
            </p>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default MedicationCard;
