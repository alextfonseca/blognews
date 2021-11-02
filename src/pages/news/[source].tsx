import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";

import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import styles from "./newsList.module.scss";

interface SourcesProps {
  source?: string;
  sources: Source[];
  news: {
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
  publishedAt: string;
}

interface Source {
  id?: string;
  name?: string;
}

export default function Source(props: SourcesProps) {
  const news = props.news.articles;
  const sources = props.sources;

  async function changeSource() {
    const source = document.getElementById("source") as HTMLSelectElement;

    Router.push(`/news/${source.value}`);
  }

  async function changeCategory() {
    const category = document.getElementById("category") as HTMLSelectElement;

    Router.push(`/news/category/${category.value}`);
  }

  useEffect(() => {
    const source = document.getElementById("source") as HTMLSelectElement;
    source.value = props.source;
  }, []);

  return (
    <>
      <Head>
        <title>Noticias | blognews</title>
      </Head>
      <div className={styles.filter}>
        <label htmlFor="">Filtre por</label>

        <select name="" id="source" onChange={changeSource}>
          <option value="all">Todas</option>
          {sources.map(source => {
            return <option key={source.id} value={source.id}>{source.name}</option>;
          })}
        </select>
        ou
        <select name="" id="category" onChange={changeCategory} defaultValue="category">
          <option value="category">
            Categoria
          </option>
          <option value="business">Negócios</option>
          <option value="entertainment">Entretenimento</option>
          <option value="general">Geral</option>
          <option value="health">Saúde</option>
          <option value="science">Ciência</option>
          <option value="sports">Esportes</option>
          <option value="technology">Tecnologia</option>
        </select>
      </div>
      <section className={styles.content} id="topo">
        {news.length > 0 ? (
          news.map(news => {
            return (
              <div key={news.title} className={styles.newsList}>
                <div>
                  <span>
                    {format(parseISO(news.publishedAt), "d MMM yy", {
                      locale: ptBR,
                    })}
                  </span>
                  <span>{news.source.name}</span>
                </div>
                <Link href={news.url}>
                  <a>{news.title}</a>
                </Link>
                <p>{news.description}</p>
              </div>
            );
          })
        ) : (
          <p>Categoria inexistente</p>
        )}
      </section>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const sourcesData = await fetch(
    "https://newsapi.org/v2/top-headlines/sources?country=br&apiKey=f076cd3a334e415cb74ea093d5eb9833"
  ).then(result => {
    return result.json();
  });

  const paths = sourcesData.sources.map(source => {
    return {
      params: {
        source: source.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ctx => {
  const { source } = ctx.params;

  const sourcesData = await fetch(
    "https://newsapi.org/v2/top-headlines/sources?country=br&apiKey=f076cd3a334e415cb74ea093d5eb9833"
  ).then(result => {
    return result.json();
  });

  var response;
  var news = {};

  const sourcesID = sourcesData.sources.map(source => {
    return source.id;
  });

  if (sourcesID.includes(source)) {
    let response = await fetch(
      `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=f076cd3a334e415cb74ea093d5eb9833`
    );

    news = await response.json();
  } else {
    response = await fetch(
      "https://newsapi.org/v2/top-headlines?country=br&apiKey=f076cd3a334e415cb74ea093d5eb9833"
    );

    news = await response.json();
  }

  return {
    props: {
      source: source,
      sources: sourcesData.sources,
      news: news,
    },
    revalidate: 60 * 60,
  };
};
