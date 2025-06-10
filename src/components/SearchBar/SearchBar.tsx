import  {toast } from "react-hot-toast";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSubmit: (value: string) => void;
}



const notify = () =>
  toast((t) => (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <span>
        Please enter your search <span style={{ color: "tomato" }}>query</span>.
      </span>
      <button onClick={() => toast.dismiss(t.id)}>Close</button>
    </div>
  ));
  
export default function SearchBar({ onSubmit }: SearchBarProps) {
  const handleSubmit = (formData: FormData) => {
    const queryStr = formData.get("query") as string;
    if (queryStr.trim() === "") {
      notify();
      return;
    }

    onSubmit(queryStr );
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <a
            className={styles.link}
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by TMDB
          </a>
          <form className={styles.form} action={handleSubmit}>
            <input
              className={styles.input}
              type="text"
              name="query"
              autoComplete="off"
              placeholder="Search movies..."
              autoFocus
            />
            <button className={styles.button} type="submit">
              Search
            </button>
          </form>
        </div>
      </header>
      
    </>
  );
}