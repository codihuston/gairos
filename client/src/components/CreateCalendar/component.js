import React from "react";
import { graphql } from "react-apollo";

import { me } from "./queries";
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
          <div class="row">
            <div class="col s12">
              <div class="row">
                <div class="input-field col s12">
                  <i class="material-icons prefix">textsms</i>
                  <input
                    type="text"
                    id="autocomplete-input"
                    class="autocomplete"
                  />
                  <label for="autocomplete-input">Autocomplete</label>
                </div>
              </div>
            </div>
          </div>
          {getMyCalendars.map(calendar => {
            return <div>{calendar.summary}</div>;
          })}
        </div>
      );
    }
  }
}

// TODO: this query, at least in this context, must always be pulled freshly
// (not from the apollo cache)!
export default graphql(me)(CreateCalendarComponent);
