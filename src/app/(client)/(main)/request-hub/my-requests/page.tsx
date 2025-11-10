"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { requestHubOptions } from "@/gql/options/client-options";
import { MyRequestsView } from "@/modules/client/request-hub";

const MyRequestsPage = () => {
  // Prefetch requests data
  useQuery(requestHubOptions());

  return <MyRequestsView />;
};

export default MyRequestsPage;
