import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";

import { parseISO } from "date-fns";
import ReactLoading from 'react-loading';

import styles from "../newsList.module.scss";

interface CategoryProps {
  category?: string;
  articles: Article[];
  sources: Source[];
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

export default function Category(props: CategoryProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const newsArray = props.articles;
  const sources = props.sources;

  async function changeSource() {
    const source = document.getElementById("source") as HTMLSelectElement;

    Router.push(`/news/${source.value}`);
  }

  async function changeCategory() {
    const category = document.getElementById("category") as HTMLInputElement;

    Router.push(`/news/category/${category.value}`);
  }

  useEffect(() => {
    let isMounted = true;

    const handleStart = (url) => {
      url !== router.pathname ? setLoading(true) : setLoading(false);
    };

    const handleComplete = () => {
      setLoading(false);
    }

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);

    const category = document.getElementById("category") as HTMLInputElement;
    category.value = props.category;

    return () => { isMounted = false };
  }, []);

  return (
    <>
      <Head>
        <title>Noticias | blognews</title>
      </Head>

      { loading ? (
        <div className={styles.bodyLoading}>
          <ReactLoading type={"spin"} color={"#fff"} />
        </div>
      )
      : (
        <>
          <div className={styles.filter}>
            <label htmlFor="">Filtre por</label>

            <select name="" id="source" onChange={changeSource}>
              <option value="all">Todas</option>
              {sources.map(source => {
                return <option key={source.id} value={source.id}>{source.name}</option>;
              })}
            </select>
            ou
            <form action="">
              <select name="" id="category" onChange={changeCategory}>
                <option value="category">Categoria</option>
                <option value="business">Negócios</option>
                <option value="entertainment">Entretenimento</option>
                <option value="general">Geral</option>
                <option value="health">Saúde</option>
                <option value="science">Ciência</option>
                <option value="sports">Esportes</option>
                <option value="technology">Tecnologia</option>
              </select>
            </form>
          </div>
          <section className={styles.content} id="topo">
            {newsArray.length > 0 ? (
              newsArray.map(news => {
                return (
                  <div key={news.title} className={styles.newsList}>
                    <span>
                      {new Intl.DateTimeFormat("pt-br").format(parseISO(news.publishedAt))}
                    </span>
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
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  var categorys = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
  ];

  const paths = categorys.map(category => {
    return {
      params: {
        category,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ctx => {
  const { category } = ctx.params;

  const sources = await fetch(
    "https://newsapi.org/v2/top-headlines/sources?country=br&apiKey=f076cd3a334e415cb74ea093d5eb9833"
  ).then(result => {
    return result.json();
  });

  var response;
  var data;

  if (category != "category") {
    response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=br&category=${category}&apiKey=c0bffcb244204b53bea1427a12aec6ae`
    );

    data = await response.json();
  } else {
    response = await fetch(
      "https://newsapi.org/v2/top-headlines?sources=google-news-br&apiKey=c0bffcb244204b53bea1427a12aec6ae"
    );

    data = await response.json();
  }

  return {
    props: {
      category: category,
      articles: data.articles,
      sources: sources.sources,
    },
    revalidate: 60 * 60,
  };
};
