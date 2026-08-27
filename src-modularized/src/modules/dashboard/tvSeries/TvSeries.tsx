import { TvSeriesView } from "./components";
import styles from "./tvSeries.module.css";

interface Props {
  onBack: () => void;
}

export default function TvSeries({ onBack }: Props) {
  return (
    <div className={styles.page}>
      <button type="button" className={`fixed left-4 top-16 z-[70] px-4 py-2.5 text-sm ${styles.backButton}`} onClick={onBack}>
        ← Home
      </button>
      <TvSeriesView />
    </div>
  );
}
