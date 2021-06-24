import Head from "next/head";
import Link from "next/link";
import styles from "./newsList.module.scss";

export default function newsList(props) {
  const newsArray = props.articles;
  return (
    <>
      <Head>
        <title>Noticias | blognews</title>
      </Head>
      <section className={styles.content}>
        {newsArray.map((news) => {
          return (
            <div key={news.title} className={styles.newsList}>
              <span>
                {new Intl.DateTimeFormat("pt-br").format(news.createdAt)}
              </span>
              <Link href={news.url}>
                <a>{news.title}</a>
              </Link>
              <p>{news.description}</p>
            </div>
          );
        })}
      </section>
    </>
  );
}

export async function getStaticProps() {
  const response = await fetch(
    "https://newsapi.org/v2/top-headlines?sources=google-news-br&apiKey=f076cd3a334e415cb74ea093d5eb9833",
  );

  const data = await response.json();

  return {
    props: {
      articles: data.articles,
    },
    revalidate: 60 * 60,
  };
}
