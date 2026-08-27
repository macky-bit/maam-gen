import { AccountView } from "./components";
import styles from "./account.module.css";

interface Props {
	onBack: () => void;
	onNavigate?: (page: "dashboard" | "profile" | "help") => void;
}

export default function AccountPage({ onBack }: Props) {
	return (
		<div className={styles.moduleShell}>
			<div className={styles.backRow}>
				<button type="button" className={styles.backButton} onClick={onBack}>
					← Back to StreamFlix
				</button>
			</div>
			<AccountView />
		</div>
	);
}
