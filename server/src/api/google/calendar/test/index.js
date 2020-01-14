/**
 * This file should contain any mock responses and/or mock graphQL queries +
 * mutations. These are used only for testing.abs
 *
 * mockQueries: These can be copied directly from graphiQL in used with the
 * `gql` tool to make the query usable in the integration tests
 *
 * mockMutations: Same as mockQueries
 *
 * mockResponses: The root properties should be mappable to the corresponding
 * `datasource.js` file for this model (i.e. should match the `method names` used
 * in testing for the sake of clarity). The `METHOD_NAME.raw` should contain a
 * raw response from the external datasource (be it 1st or 3rd party). The
 * `METHOD_NAME.reduced` should contain a formatted response that we expect our
 * graphQL resolvers to return. It is OK for `.raw` and `.reduced` to yeild the
 * same result. This design pattern is just intended to be forward-thinking.
 */
import gql from "graphql-tag";

export const mockQueries = {
  getCalendars: gql`
    query {
      getCalendars {
        kind
        etag
        id
        summary
        description
        location
        timeZone
        conferenceProperties {
          allowedConferenceSolutionTypes
        }
      }
    }
  `
};

export const mockMutations = {};

export const mockResponses = {
  list: {
    raw: [
      {
        kind: "calendar#calendarListEntry",
        etag: '"1578409468263000"',
        id: "e33rdl5f6c7qu6kp3oqc4ci9og@group.calendar.google.com",
        summary: "TEST1",
        description: "TEST1A",
        location: null,
        timeZone: "UTC",
        conferenceProperties: {
          allowedConferenceSolutionTypes: ["eventHangout"]
        }
      }
    ],
    // sample result from our API after optionally transforming the raw response
    reduced: [
      {
        kind: "calendar#calendarListEntry",
        etag: '"1578409468263000"',
        id: "e33rdl5f6c7qu6kp3oqc4ci9og@group.calendar.google.com",
        summary: "TEST1",
        description: "TEST1A",
        location: null,
        timeZone: "UTC",
        conferenceProperties: {
          allowedConferenceSolutionTypes: ["eventHangout"]
        }
      }
    ]
  },
  createCalendar: {
    raw: {
      kind: "calendar#calendar",
      etag: '"lO1DEZXES82bm5FrxtzDShzbXNs"',
      id: "umvpabki1joae0vm1jh7ie43vg@group.calendar.google.com",
      summary: "test calendar",
      description: "some description",
      timeZone: "UTC",
      conferenceProperties: { allowedConferenceSolutionTypes: [] }
    },
    reduced: {
      kind: "calendar#calendar",
      etag: '"lO1DEZXES82bm5FrxtzDShzbXNs"',
      id: "umvpabki1joae0vm1jh7ie43vg@group.calendar.google.com",
      summary: "test calendar",
      description: "some description",
      timeZone: "UTC",
      conferenceProperties: { allowedConferenceSolutionTypes: [] }
    }
  }
};
