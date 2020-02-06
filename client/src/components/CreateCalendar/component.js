import React from "react";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";

import { getMyCalendars } from "./queries";
import GoogleSignInButton from "../GoogleSignInButton";
import { component as Loading } from "../LoadingComponent";

class CreateCalendarComponent extends React.Component {
  render() {
    if (this.props.data.loading) {
      return <Loading />;
    }

    // if there are any errors at all, assume login failed, show them
    // login button
    if (this.props.data.error) {
      return (
        <div>
          <pre>
            Login failed!{" "}
            {this.props.data.error.graphQLErrors.map(({ message }, i) => (
              <span key={i}>{message}</span>
            ))}
          </pre>
          <div>
            <GoogleSignInButton />
          </div>
        </div>
      );
    } else {
      const { getMyCalendars } = this.props.data;
      return (
        <div>
          <div className="row">
            <div className="col s12">
              <div className="row">
                <div className="input-field col s12">
                  <i className="material-icons prefix">textsms</i>
                  <input
                    type="text"
                    id="autocomplete-input"
                    className="autocomplete"
                  />
                  <label htmlFor="autocomplete-input">Autocomplete</label>
                </div>
              </div>
            </div>
          </div>
          {getMyCalendars.map(calendar => {
            return <div key={calendar}>{calendar.summary}</div>;
          })}
        </div>
      );
    }
  }
}

CreateCalendarComponent.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    getMyCalendars: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        summary: PropTypes.string,
        description: PropTypes.string
      })
    ),
    error: PropTypes.object
  })
};

export default graphql(getMyCalendars, {
  options: {
    fetchPolicy: "cache-and-network"
  }
})(CreateCalendarComponent);
