import React, { Component } from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import styles from "./styles";

import { connect } from "react-redux";
import { updateFocus } from "@patwoz/react-navigation-is-focused-hoc";

import AppNav from "./Navigation/AppNav.js";
import AuthNav from "./Navigation/AuthNav.js";

class App extends Component {
  componentDidMount() {
    StatusBar.setBackgroundColor(styles.headerColor, true);
    StatusBar.setBarStyle("white-content", true);
  }

  render() {
    return this.props.authenticated ? (
      <AppNav
        onNavigationStateChange={(prevState, currentState) => {
          updateFocus(currentState);
        }}
      />
    ) : (
      <AuthNav />
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  };
}

export default connect(mapStateToProps)(App);
