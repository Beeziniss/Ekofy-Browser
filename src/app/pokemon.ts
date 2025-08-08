import { graphql } from "@/gql";
import { execute } from "@/gql/execute";
import { queryOptions } from "@tanstack/react-query";

const SingleFilmQuery = graphql(`
  query SingleFilm {
    allFilms {
      films {
        title
        director
        releaseDate
      }
    }
  }
`);

export const pokemonOptions = queryOptions({
  queryKey: ["pokemon"],
  queryFn: async () => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/25");

    return response.json();
  },
});

export const testGQLOptions = queryOptions({
  queryKey: ["films"],
  queryFn: () => execute(SingleFilmQuery),
});
