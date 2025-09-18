"use client";

import React from "react";

/* const SingleFilmQuery = graphql(`
  query SingleFilm {
    allFilms {
      films {
        title
        director
        releaseDate
      }
    }
  }
`); */

const TestGraphQL = () => {
  /* const { data, isPending } = useSuspenseQuery({
    queryKey: ["film"],
    queryFn: () => execute(SingleFilmQuery),
  }); */

  /* if (isPending) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  } */

  return (
    <div className="mt-5 space-y-2">
      {/* {data?.allFilms?.films?.map(
        (film) =>
          film && (
            <Card key={film.title}>
              <CardContent>
                <h3>{film.title}</h3>
                <p>Director: {film.director}</p>
                <p>Release Date: {film.releaseDate}</p>
              </CardContent>
            </Card>
          ),
      )} */}
    </div>
  );
};

export default TestGraphQL;
