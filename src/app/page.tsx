import { getQueryClient } from "@/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { pokemonOptions, testGQLOptions } from "./pokemon";
import { PokemonInfo } from "./pokemon-info";
import TestGraphQL from "./test-graphql";
import { Counter } from "@/components/counter";

export default function Home() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(pokemonOptions);
  void queryClient.prefetchQuery(testGQLOptions);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 font-semibold">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="mb-8 text-3xl font-bold">Demo Application</h1>
        </div>

        <Counter />

        <div className="space-y-4">
          <h2 className="text-center text-xl font-bold">Pokemon Info</h2>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <PokemonInfo />
            <TestGraphQL />
          </HydrationBoundary>
        </div>
      </div>
    </main>
  );
}
