import '../styles/globals.css';
import Logo from '../components/Logo';

function MyApp({ Component, pageProps }) {
  return (
      <>
        <Logo />
        <Component {...pageProps} />
      </>
  );
}

export default MyApp;
