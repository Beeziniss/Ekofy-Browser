"use client";

import { pokemonOptions } from "@/app/pokemon";
import { useSuspenseQuery } from "@tanstack/react-query";

export function PokemonInfo() {
  const { data } = useSuspenseQuery(pokemonOptions);

  return (
    <div className="flex items-center justify-center">
      <figure>
        <img src={data.sprites.front_shiny} height={200} alt={data.name} />
        <h2>I&apos;m {data.name}</h2>
      </figure>
    </div>
  );
}
