import axios from "axios";
import type { Movie } from "../types/movie";
interface HttpResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export default async function searchMovies(
  data: string,
  page: number
): Promise<HttpResponse> {
  
  return (
    await axios.get<HttpResponse>(
      `https://api.themoviedb.org/3/search/movie?query=${data}&include_adult=false&language=en-US`,
      {
        params: {
          page: page,
        },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
          accept: "application/json",
        },
      }
    )
  ).data;
}
