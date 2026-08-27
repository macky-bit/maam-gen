import { ProfileView } from "./components";
import styles from "./profile.module.css";

interface Props {
  onBack: () => void;
  onNavigate?: (page: "dashboard" | "account" | "help") => void;
}

export default function ProfilePage({ onBack }: Props) {
  return (
    <div className={styles.moduleShell}>
      <button type="button" className={`fixed left-4 top-20 z-[70] px-4 py-2.5 text-sm ${styles.backButton}`} onClick={onBack}>
        ← Back to StreamFlix
      </button>
      <ProfileView />
    </div>
  );
}
