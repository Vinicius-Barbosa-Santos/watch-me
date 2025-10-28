import { useState, useEffect } from "react";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface MoviesResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const API_KEY = "3fd2be6f0c70a2a598f084ddfb75487c"; // API key pública do TMDB
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const useMovies = (
  category: "popular" | "top_rated" | "upcoming" | "now_playing" = "popular"
) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=pt-BR&page=1`
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar filmes");
        }

        const data: MoviesResponse = await response.json();
        setMovies(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category]);

  const getImageUrl = (path: string) => `${IMAGE_BASE_URL}${path}`;

  return { movies, loading, error, getImageUrl };
};

export const useMovieSearch = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(
          query
        )}&page=1`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar filmes");
      }

      const data: MoviesResponse = await response.json();
      setMovies(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string) => `${IMAGE_BASE_URL}${path}`;

  return { movies, loading, error, searchMovies, getImageUrl };
};
