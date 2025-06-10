import css from "./App.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import MovieModal from "../MovieModal/MovieModal.tsx";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import searchMovies from "../../services/movieService.ts";
import SearchBar from "../SearchBar/SearchBar.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
//import Loader from "../Loader/Loader.tsx";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
//import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";

const notify = () =>
  toast((t) => (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <span>
        <span style={{ color: "#c678dd" }}>No </span>movies{" "}
        <span style={{ color: "#e6c07b" }}>found</span>{" "}
        <span style={{ color: "#c678dd" }}>for</span> your request.
      </span>
      <button onClick={() => toast.dismiss(t.id)}>Close</button>
    </div>
  ));

interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [strForSearch, setStrForSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery<MovieResponse>({
    queryKey: ["movieQueryKey", strForSearch, currentPage],
    queryFn: () => searchMovies(strForSearch, currentPage),
    enabled: strForSearch !== "",
    placeholderData: keepPreviousData,
  });

  const getStrFromForm = (strFromForm: string) => {
    setStrForSearch(strFromForm);
    setCurrentPage(1);
  };

  const openModal = (selectedMovie: Movie) => {
    setIsModalOpen(true);
    setSelectedMovie(selectedMovie);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };
  const totalPage = data?.total_pages || 0;

  useEffect(() => {
    if (!isLoading && data && data.results.length === 0) {
      notify();
    }
  }, [isLoading, data]);

  return (
    <>
      <SearchBar onSubmit={getStrFromForm} />
      {isSuccess && totalPage > 1 && (
        <ReactPaginate
          pageCount={totalPage}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={(selectedItam) =>
            setCurrentPage(selectedItam.selected + 1)
          }
          forcePage={currentPage - 1}
          breakLabel="..."
          nextLabel=" >"
          previousLabel="< "
          renderOnZeroPageCount={null}
          containerClassName={css.pagination}
          activeClassName={css.active}
        />
      )}

      {isLoading && <p>Loading data, please wait...</p>}

      {isError ? (
        <ErrorMessage />
      ) : (
        strForSearch && (
          <MovieGrid onSelect={openModal} movies={data?.results ?? []} />
        )
      )}

      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}

      <Toaster />
    </>
  );
}
