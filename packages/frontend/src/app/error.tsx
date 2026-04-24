"use client";

import styles from "./error.module.css";

type ErrorPageProps = {
    reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
    return (
        <main className={`section ${styles.main}`}>
            <div className={`container ${styles.container}`}>
                <p className={styles.code}>!</p>
                <h1 className={`title ${styles.title}`}>Something went wrong</h1>
                <p className={`subtitle ${styles.subtitle}`}>
                    An unexpected error occurred. Please try again or come back later.
                </p>
                <div className={styles.buttons}>
                    <button className="button is-dark" onClick={reset}>
                        Try again
                    </button>
                </div>
            </div>
        </main>
    );
}
