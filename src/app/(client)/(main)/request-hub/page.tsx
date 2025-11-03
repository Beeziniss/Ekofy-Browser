"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { requestHubOptions } from "@/gql/options/client-options";
import { RequestHubView } from "@/modules/client/request-hub";

const RequestHubPage = () => {
  // Prefetch requests data
  useQuery(requestHubOptions());

  return <RequestHubView />;
};

export default RequestHubPage;
