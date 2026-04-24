"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPassages } from "../api/passages.api";
import { groupPassages } from "../lib/group-passages";
import { PassageGroupCard } from "./passage-group-card";
import styles from "./passage-list.module.css";

const columnClass = `column ${styles.scrollColumn}`;

export const PassageList = () => {
    const {
        data: passages,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["passages"],
        queryFn: fetchPassages,
    });

    if (isLoading) {
        return (
            <div className={columnClass}>
                <div className={styles.list}>
                    <p className={styles.heading}>Passage History</p>
                    {[0, 1, 2].map((i) => (
                        <div key={i} className={styles.skeletonCard} />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={columnClass}>
                <div className={styles.list}>
                    <p className={styles.heading}>Passage History</p>
                    <div className={styles.empty}>
                        <span className={styles.emptyIcon}>⚠</span>
                        Failed to load passages. Please refresh the page.
                    </div>
                </div>
            </div>
        );
    }

    const groups = groupPassages(passages ?? []);

    return (
        <div className={columnClass}>
            <div className={styles.list}>
                <p className={styles.heading}>
                    Passage History · {groups.length} group{groups.length !== 1 ? "s" : ""}
                </p>
                {groups.length === 0 ? (
                    <div className={styles.empty}>
                        <span className={styles.emptyIcon}>○</span>
                        No passages recorded yet.
                        <br />
                        Use the form to add the first one.
                    </div>
                ) : (
                    groups.map((group) => <PassageGroupCard key={group.key} group={group} />)
                )}
            </div>
        </div>
    );
};
