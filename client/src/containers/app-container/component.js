import React, { useEffect, useState } from "react";

import getApolloClient from "../../services/apollo-client";
import AppComponent from "../../App";

export default function App() {
  const [apolloClient, setApolloClient] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getApolloClient().then(client => {
      setApolloClient(client);
      setLoading(false);
    });
  }, []);

  return <AppComponent apolloClient={apolloClient} isLoading={isLoading} />;
}
