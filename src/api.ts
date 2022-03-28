import { MovieData } from "./interfaces/movie.interface";

const API_KEY: string = "d20d691c4dcca268fa8e0c655d698616";
const BASE_URL: string = "https://api.themoviedb.org/3";

export const handleGetNowPlayingMovies = async (): Promise<MovieData> => {
  return (await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=ko-KR`)).json();
};

export const handleGetTopRatedMovies = async () => {
  return (await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=ko-KR`)).json();
};

export const handleGetUpcomingMovies = async () => {
  return (await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=ko-KR`)).json();
};

export const handleGetPopularMovies = async () => {
  return (await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR`)).json();
};
