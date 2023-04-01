import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { SetStateAction, useEffect, useState } from "react";

const fdaKey = process.env.OPEN_FDA_API;

const inter = Inter({ subsets: ["latin"] });

type MedicationPurpose = {
  content: string;
};

type MedicationsResults = {
  purposes: MedicationPurpose[];
};

type Medications = {
  results: MedicationsResults[];
};

interface SearchQuery {
  key: String;
  target: {
    value: string;
  };
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
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

  const handleCardClicked = () => {
    setCardClicked(!cardClicked);
    setShowParagraph(!showParagraph);
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      return setQuery(event.currentTarget.value);
    }
  };
  useEffect(() => {
    const medication = query;
    if (medication) {
      fetch(
        `https://api.fda.gov/drug/label.json?=${fdaKey}&search=openfda.generic_name:${medication}+openfda.brand_name${medication}`
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
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}></div>
        <h1 className={styles.h1}>Medicines Label Summarizer</h1>
        <div className={styles.center}>
          <div className={styles.searchboxContainer}>
            <input type="text" placeholder="Search" onKeyDown={handleSearch} />
          </div>
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
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Docs <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Learn <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Templates <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Deploy <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
      </main>
    </>
  );
}
