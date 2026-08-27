import { AccountView } from "./components";
import styles from "./account.module.css";

interface Props {
  onBack: () => void;
  onNavigate?: (page: "dashboard" | "profile" | "help") => void;
}

export default function AccountPage({ onBack }: Props) {
  return (
    <div className={styles.moduleShell}>
      <button type="button" className={`fixed left-4 top-20 z-[70] px-4 py-2.5 text-sm ${styles.backButton}`} onClick={onBack}>
        ← Back to StreamFlix
      </button>
      <AccountView />
    </div>
  );
}
