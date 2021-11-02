import Head from "next/head";
import Link from "next/link";

import styles from "./home.module.scss";

export default function Home() {
  return (
    <>
      <Head>
        <title>Inicio | blognews</title>
      </Head>
      <div className={styles.container}>
        <main className={styles.content}>
          <span>👋🏼Olá, seja bem vindo !</span>
          <h1>
            Todas as notícias do Brasil e do mundo
            <span> em um só lugar.</span>
          </h1>

          <Link href="/news/all">
            <button>Notícias</button>
          </Link>
        </main>

        <img src="/images/news.svg" alt="jornal" />
      </div>
    </>
  );
}
