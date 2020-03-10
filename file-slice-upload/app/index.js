import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import './styles/public.css';
import './styles/public.scss';

import App from './App';

render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextRootContainer = require('./App').default;
    render(<NextRootContainer />, document.getElementById('root'));
  })
}
