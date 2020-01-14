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

export default {
  list: {
    // sample of a raw response from the 3rd party API
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
