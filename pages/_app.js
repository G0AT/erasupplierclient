import { ApolloProvider } from '@apollo/client';
import client from '../config/apollo';
import SubAlmacenState from '../context/subAlmacen/SubAlmacenState';

const MyApp = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <SubAlmacenState>
        <Component {...pageProps} />
      </SubAlmacenState>
    </ApolloProvider>
  )
}

export default MyApp;