import { Outlet } from 'react-router-dom';

import { Footer, Header } from './components';
import { withProviders } from './providers';
import { useApi } from '@gear-js/react-hooks';

function Component() {
  const { isApiReady } = useApi();

  if (!isApiReady) {
    return <>!isApiReady</>;
  }

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

const App = withProviders(Component);

export { App };
