import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
    return (
        <main className={`section ${styles.main}`}>
            <div className={`container ${styles.container}`}>
                <p className={styles.code}>404</p>
                <h1 className={`title ${styles.title}`}>Page not found</h1>
                <p className={`subtitle ${styles.subtitle}`}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className={styles.buttons}>
                    <Link href="/" className="button is-dark">
                        Go home
                    </Link>
                </div>
            </div>
        </main>
    );
}
