import { MovieData } from "./interfaces/movie.interface";

const API_KEY: string = "d20d691c4dcca268fa8e0c655d698616";
const BASE_URL: string = "https://api.themoviedb.org/3";

export const handleGetNowPlayingMovies = async (): Promise<MovieData> => {
  return (await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`)).json();
};
