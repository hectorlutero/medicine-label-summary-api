import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useState } from "react";

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

export default function Home({
  medications,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [cardClicked, setCardClicked] = useState(false);

  const getStyle = () => {
    if (cardClicked) return styles.medicineCardActive;
    else return styles.medicineCard;
  };

  const handleCardClicked = () => {
    setCardClicked(!cardClicked);
  };

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
          <ul>
            {medications.results.map(medication => (
              <div
                className={getStyle()}
                key={medication.openfda.generic_name}
                onClick={handleCardClicked}
              >
                <strong>{medication.openfda.generic_name}</strong>
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
            ))}
          </ul>
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

export const getStaticProps: GetStaticProps<{
  medications: Medications[];
}> = async () => {
  const res = fetch(
    `https://api.fda.gov/drug/label.json?=${fdaKey}&search=acetaminophen`
  );
  console.log(res);
  const medications: Medications[] = await (await res).json();
  console.log(medications.results[0]);
  return {
    props: {
      medications,
    },
  };
};
