import React, { useState } from "react";
import styles from "@/components/SearchBox/SearchBox.module.css";

function SearchBox(props: {
  query: string;
  handleSearch: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  const query = props.query;
  return (
    <>
      <div className={styles.searchboxContainer}>
        <input
          type="text"
          placeholder="Search"
          onKeyDown={props.handleSearch}
        />
      </div>
    </>
  );
}

export default SearchBox;
