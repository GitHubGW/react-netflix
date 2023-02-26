const API_KEY = "d20d691c4dcca268fa8e0c655d698616";
const BASE_URL = "https://api.themoviedb.org/3";

export const getNowPlayingMovies = async () => {
  return (await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=ko-KR`)).json();
};

export const getTopRatedMovies = async () => {
  return (await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=ko-KR`)).json();
};

export const getUpcomingMovies = async () => {
  return (await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=ko-KR`)).json();
};

export const getPopularMovies = async () => {
  return (await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR`)).json();
};
