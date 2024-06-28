import '@gear-js/vara-ui/dist/style.css';
import { useAccount, useApi } from '@gear-js/react-hooks';

import { withProviders } from './providers';
import { Container, Footer, Header } from './components';
import { useWalletSync } from './features/wallet/hooks/use-wallet';
import { Routing } from './pages';

function Component() {
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();

  useWalletSync();

  const isAppReady = isApiReady && isAccountReady;

  return (
    <main>
      {isAppReady ? (
        <>
          <Header />
          <Routing />
          <Container>
            <Footer />
          </Container>
        </>
      ) : (
        <p>init</p>
      )}
    </main>
  );
}

export const App = withProviders(Component);
