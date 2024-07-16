import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import client from './apollo/client';

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <div className="App">
          <h1>Meu Chatbot</h1>
        </div>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
