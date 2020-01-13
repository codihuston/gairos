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
  }
};
