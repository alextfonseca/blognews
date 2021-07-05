import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useEffect } from "react";

import styles from "./newsList.module.scss";

interface NewListProps {
  sources: Source[];
  data: {
    articles: Article[];
  };
}

interface Article {
  source: {
    id: string;
    name: string;
  };
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
}

interface Source {
  id?: string;
  name?: string;
}

export default function newsList(props: NewListProps) {
  const newsArray = props.data.articles;
  const sources = props.sources;

  function changeSource() {
    const data = document.getElementById("source") as HTMLSelectElement;

    Router.push(`/newsList/${data.value}`);
  }

  useEffect(() => {
    const data = document.getElementById("source") as HTMLSelectElement;
    data.value = "source";
  }, []);

  return (
    <>
      <Head>
        <title>Noticias | blognews</title>
      </Head>
      <div className={styles.filter}>
        <label htmlFor="">Filtre por</label>

        <select name="" id="source" onChange={changeSource}>
          <option value="source">Fonte</option>
          {sources.map(source => {
            return <option value={source.id}>{source.name}</option>;
          })}
        </select>
      </div>
      <section className={styles.content} id="topo">
        {newsArray.map(news => {
          return (
            <div key={news.title} className={styles.newsList}>
              <div>
                <span>
                  {new Intl.DateTimeFormat("pt-br").format(news.createdAt)}
                </span>
                <span>{news.source.name}</span>
              </div>
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
    "https://newsapi.org/v2/top-headlines?country=br&apiKey=f076cd3a334e415cb74ea093d5eb9833"
  );

  const data = await response.json();

  const sourcesData = await fetch(
    "https://newsapi.org/v2/top-headlines/sources?country=br&apiKey=f076cd3a334e415cb74ea093d5eb9833"
  ).then(result => {
    return result.json();
  });

  const sources = sourcesData.sources.map(source => {
    return {
      id: source.id,
      name: source.name,
    };
  });

  return {
    props: {
      sources: sources,
      data: data,
    },
    revalidate: 60 * 60,
  };
}
