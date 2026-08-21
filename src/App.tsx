import { useState } from "react";
import LoginPage from "./modules/login/LoginPage";
import RegisterPage from "./modules/register/RegisterPage";
import Dashboard from "./modules/dashboard/Dashboard";
import WatchScreen from "./modules/movie/WatchScreen";
import PreviewModal from "./modules/movie/PreviewModal";
import type { Show } from "./modules/movie/types";

type Page = "login" | "register" | "dashboard" | "watch";

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [watching, setWatching] = useState<Show | null>(null);
  const [previewing, setPreviewing] = useState<Show | null>(null);

  const goToWatch = (show: Show) => {
    setPreviewing(null); // close the modal if it was open
    setWatching(show);
    setPage("watch");
  };

  if (page === "watch" && watching) {
    return (
      <WatchScreen
        title={watching.title}
        year={watching.year}
        rating={watching.rating}
        match={watching.match ?? 80}
        isSeries={watching.mediaType === "tv"}
        onBack={() => setPage("dashboard")}
      />
    );
  }

  if (page === "dashboard") {
    return (
      <>
        <Dashboard
          onSignOut={() => setPage("login")}
          onWatch={goToWatch}
          onInfo={setPreviewing}
        />
        <PreviewModal
          show={previewing}
          onClose={() => setPreviewing(null)}
          onSelect={setPreviewing}
          onPlay={goToWatch}
        />
      </>
    );
  }

  if (page === "register") {
    return <RegisterPage onNavigate={(p) => setPage(p)} />;
  }

  return <LoginPage onNavigate={(p) => setPage(p)} />;
}
