import React, { Component } from 'react';

import { getBusinesses } from './api';
import LoadingScreen from './LoadingScreen';
import BusinessList from './BusinessList';

class App extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      loadingMessage: 'loading businesses'
    };

    getBusinesses()
      .then(businesses => {
          this.setState({
              loading: false,
              loadingMessage: 'loaded!',
              businesses
          })
      })
      .catch(console.error);
  }

  render() {
    return  this.state.loading
        ? <LoadingScreen message={this.state.loadingMessage}/>
        : <BusinessList businesses={this.state.businesses}/>;
  }
}

module.exports = App;
