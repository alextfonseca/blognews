import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Header } from "../components/Header";

import ReactLoading from 'react-loading';

import "../../styles/global.scss";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
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

    return () => { isMounted = false };
  }, []);

  return (
    <>
      <Header />
      
      { loading ? (
        <div className="bodyLoading">
          <ReactLoading type={"spin"} color={"#fff"} />
        </div>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}

export default MyApp;
