import React from "react";

import GetTasks from "../../graphql/queries/hooks/get-tasks";
import { component as Loading } from "../../components/loading";

export default function Home() {
  const { error, data, loading } = GetTasks();

  if (loading) {
    return <Loading />;
  }

  console.log(data);
  return <div>Hello Tasks!</div>;
}
