import React, { useState } from "react";
import { InputGroup, Button, Alert } from "react-bootstrap";
import { Legend, BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";

import { component as Loading } from "../../components/loading";
import GetMyTaskReport from "../../graphql/queries/hooks/get-my-task-report";
import { useWindowSize } from "../../utils";

export default function Home() {
  const { data, loading, error } = GetMyTaskReport();
  const [showSeconds, setShowSeconds] = useState(false);
  const [showMinutes, setShowMinutes] = useState(true);
  const [showHours, setShowHours] = useState(false);
  const [showDays, setShowDays] = useState(false);
  const [showWeeks, setShowWeeks] = useState(false);
  const windowSize = useWindowSize();
  const maxBarSize = 20;
  // the key of which to sum all values and to determine max domain of graph
  let maxKey = null;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    console.error(error);
    return (
      <Alert variant="danger">
        An error has occurred. Please try again. Report this to a developer if
        the issue persists.
      </Alert>
    );
  }

  const { getMyTaskReport } = data;

  // safe to assume that there will always be more seconds than min/hr/day/wks
  if (showSeconds) {
    maxKey = "seconds";
  } else if (showMinutes) {
    maxKey = "minutes";
  } else if (showHours) {
    maxKey = "hours";
  } else if (showDays) {
    maxKey = "days";
  } else if (showWeeks) {
    maxKey = "weeks";
  } else {
    maxKey = "minutes";
  }

  // calculate max domain for the graph
  const max = Math.max.apply(
    Math,
    getMyTaskReport.map(function(o) {
      return o[maxKey];
    })
  );

  return (
    <div>
      <h2>Your Task Reports</h2>
      <p>
        Interact with the chart below to view how much time you have spent on
        your tasks!
      </p>
      <div className="center mt-0 mb-0 m-auto">
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <Button
              variant="outline-secondary"
              className={showSeconds ? "bg-primary text-white" : null}
              onClick={() => setShowSeconds(!showSeconds)}
            >
              Seconds
            </Button>
            <Button
              variant="outline-secondary"
              className={showMinutes ? "bg-primary text-white" : null}
              onClick={() => setShowMinutes(!showMinutes)}
            >
              Minutes
            </Button>
            <Button
              variant="outline-secondary"
              className={showHours ? "bg-primary text-white" : null}
              onClick={() => setShowHours(!showHours)}
            >
              Hours
            </Button>
            <Button
              variant="outline-secondary"
              className={showDays ? "bg-primary text-white" : null}
              onClick={() => setShowDays(!showDays)}
            >
              Days
            </Button>
            <Button
              variant="outline-secondary"
              className={[
                showWeeks ? "bg-primary text-white" : null,
                "rounded-right"
              ]}
              onClick={() => setShowWeeks(!showWeeks)}
            >
              Weeks
            </Button>
          </InputGroup.Prepend>
        </InputGroup>
      </div>
      <div className="">
        <BarChart
          width={windowSize.width * 0.9}
          height={windowSize.height}
          data={getMyTaskReport}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          layout="vertical"
        >
          <Legend verticalAlign="top" align="center" />
          <XAxis type="number" domain={[0, max]} />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          {showSeconds ? (
            <Bar
              dataKey="seconds"
              maxBarSize={maxBarSize}
              fill="#F7DF84"
              label
            />
          ) : null}
          {showMinutes ? (
            <Bar
              dataKey="minutes"
              maxBarSize={maxBarSize}
              fill="#7EB59C"
              label
            />
          ) : null}
          {showHours ? (
            <Bar dataKey="hours" maxBarSize={maxBarSize} fill="#D0CEAE" label />
          ) : null}
          {showDays ? (
            <Bar dataKey="days" maxBarSize={maxBarSize} fill="#E9BA8D" label />
          ) : null}
          {showWeeks ? (
            <Bar dataKey="weeks" maxBarSize={maxBarSize} fill="#F25B4D" label />
          ) : null}
        </BarChart>
      </div>
    </div>
  );
}
