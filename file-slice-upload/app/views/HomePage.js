import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import {
  Route, BrowserRouter as Router, Link,
} from 'react-router-dom';

import UploadPage from './upload/UploadPage';

import { history } from '../App';

// 批量引入所有图片(可以指定所有图片类型)
// const requireContext = require.context('resources/install', true, /^\.\/.*\.(jpg|png)$/);
// const requireContext = require.context('resources/public', true, /.*/);
// requireContext.keys().map(requireContext);

@inject('pub') @observer
class HomePage extends Component {
  static propTypes = {
    pub: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
    this.lastActiveItem = null;
  }

  /* ------------------- react event ------------------- */


  componentDidMount() {

  }

  componentWillUnmount() {

  }

  /* ------------------- page event ------------------- */

  /* ------------------- page render ------------------- */

  render() {
    const { match } = this.props;

    return (
      <div className="container-router">
        <p>
          <Link to="/">home</Link>
        </p>
        <p>
          <Link to="/upload">upload</Link>
        </p>

        <p>HomePage</p>
        <div>
          <Route path={`${match.path}upload`} component={UploadPage} />
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {};

export default HomePage;
