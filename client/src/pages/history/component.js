import React from "react";
import GetMyTaskHistory from "../../graphql/queries/hooks/get-my-task-history";

export default function Home() {
  const { data, loading, error } = GetMyTaskHistory();

  if (loading) {
    return <div>loading</div>;
  }

  console.log(data);

  return <div>Hello History!</div>;
}
