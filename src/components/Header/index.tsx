import Link from "next/link";
import styles from "./styles.module.scss";

export const Header = () => {
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <Link href="/">
          <a>
            Blog<span>News</span>
          </a>
        </Link>
        <nav>
          <a href="/">Início</a>
          <Link href="/news/all">
            Notícias
          </Link>
        </nav>
      </div>
    </header>
  );
};
