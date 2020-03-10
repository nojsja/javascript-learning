import React from 'react';
import { Route, Router } from 'react-router-dom';
import { Provider } from 'mobx-react';

import createHistory from 'history/createBrowserHistory';
import PublicState from './stores/Public';
import UploadState from './stores/FileUpload';

import HomePage from './views/HomePage';

/* ------------------- global history ------------------- */
export const history = createHistory();

const stores = {
  pub: new PublicState(),
  upload: new UploadState(),
};

function App() {
  return (
    <Provider {...stores}>
      <Router history={history}>
        <Route path="/" component={HomePage} />
      </Router>
    </Provider>
  );
}

/* ------------------- export provider ------------------- */
export default App;
