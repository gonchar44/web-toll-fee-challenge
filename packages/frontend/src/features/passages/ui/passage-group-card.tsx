"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import cx from "clsx";
import type { PassageGroup } from "../model/passage-group.types";
import { deletePassage } from "../api/passages.api";
import { PassageCard } from "./passage-card";
import { formatPassageTime } from "../lib/format-date";
import styles from "./passage-group-card.module.css";

const GROUP_LABELS = {
    baseFee: "Latest Base Fee",
    chargedFee: "Latest Charged Fee",
    dailyTotal: "Daily Total",
};

interface PassageGroupCardProps {
    group: PassageGroup;
}

export const PassageGroupCard = ({ group }: PassageGroupCardProps) => {
    const [expanded, setExpanded] = useState(false);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: deletePassage,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["passages"] }),
        onSettled: () => setConfirmingId(null),
    });

    const handleDelete = (id: string) => {
        mutation.mutate(id);
    };

    const isDeleting = mutation.isPending;
    const count = group.passages.length;
    const expandLabel = expanded
        ? "Hide"
        : count === 1
          ? "Show 1 passage"
          : `Show all ${count} passages`;

    const expandFooter = (
        <>
            <button
                type="button"
                className={styles.expandBar}
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
            >
                <span className={cx(styles.chevron, { [styles.chevronOpen]: expanded })} aria-hidden="true" />
                {expandLabel}
            </button>

            <div className={cx(styles.detailsOuter, { [styles.detailsOuterOpen]: expanded })} aria-hidden={!expanded}>
                <div className={styles.detailsInner}>
                    <div className={styles.detailsHeaderRow}>
                        <span>Time</span>
                        <span>Base Fee</span>
                        <span>Charged Fee</span>
                        <span />
                    </div>
                    {group.passages.map((passage) => {
                        const isConfirming = confirmingId === passage.id;
                        const isThisDeleting = isDeleting && mutation.variables === passage.id;

                        return (
                            <div key={passage.id} className={styles.detailsRow}>
                                <span className={styles.detailsCell}>{formatPassageTime(passage.timestamp)}</span>
                                <span className={styles.detailsCell}>
                                    {passage.baseFee}
                                    <span className={styles.detailsFeeUnit}>DKK</span>
                                </span>
                                <span className={styles.detailsCell}>
                                    {passage.chargedFee}
                                    <span className={styles.detailsFeeUnit}>DKK</span>
                                </span>
                                <span className={styles.actionCell}>
                                    {isConfirming ? (
                                        <>
                                            <button
                                                type="button"
                                                className={styles.confirmBtn}
                                                onClick={() => handleDelete(passage.id)}
                                                disabled={isThisDeleting}
                                            >
                                                {isThisDeleting ? "…" : "Delete"}
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.cancelBtn}
                                                onClick={() => setConfirmingId(null)}
                                                disabled={isThisDeleting}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            className={styles.deleteBtn}
                                            onClick={() => setConfirmingId(passage.id)}
                                            disabled={isDeleting}
                                            aria-label="Delete passage"
                                        >
                                            ×
                                        </button>
                                    )}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );

    return (
        <PassageCard
            passage={group.latest}
            labels={count > 1 ? GROUP_LABELS : undefined}
            footer={expandFooter}
        />
    );
};
