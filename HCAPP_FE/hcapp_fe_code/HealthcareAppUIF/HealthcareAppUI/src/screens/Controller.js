import React, {useContext} from "react";
import Home from "../screens/home/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "../common/header/Header";
import * as PropTypes from "prop-types";
import {UserLoggedInContextProvider} from "../common/header/Header";

const Controller = () => {
    const baseUrl = ""; // SP RVW

  return (
      <Router>
          <div className="main-container">
            <Route
              exact
              path="/"
              render={(props) => <Home {...props} baseUrl={baseUrl} />}
            />
          </div>
      </Router>
  );
};

export default Controller;
