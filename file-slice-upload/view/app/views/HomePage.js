import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

import RouteWithSubRoutes from 'router/RouteWithSubRoutes';

import ModalActions from 'components/ModalActions';
import Upload from './upload';

import { history } from 'app/App';

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
  }

  onDataChange = (data) => {
    console.log(`tree changed: `, data);
  }

  push = (path) => {
    history.push(path);
  }

  render() {
    const { match, routes } = this.props;

    return (
      <div className="container-router">
        <Upload/>
         {
            routes && routes.map((route, i) => 
              <RouteWithSubRoutes key={`${route.path}_${i}`} route={route}/>
            )
          }
        <ModalActions/>
      </div>
    );
  }
}

HomePage.propTypes = {};

export default HomePage;
