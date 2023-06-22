import '../styles/globals.css';
import Logo from '../components/Logo';
import WaitForRouter from '../components/WaitForRouter';

function MyApp({ Component, pageProps }) {
  return (
      <>
        <Logo />
        <WaitForRouter>
          <Component {...pageProps} />
        </WaitForRouter>
      </>
  );
}

export default MyApp;
