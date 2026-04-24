"use client";

import { useState } from "react";
import cx from "clsx";
import type { PassageGroup } from "../model/passage-group.types";
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

export function PassageGroupCard({ group }: PassageGroupCardProps) {
    const [expanded, setExpanded] = useState(false);
    const hasMultiple = group.passages.length > 1;

    const expandFooter = hasMultiple ? (
        <>
            <button
                type="button"
                className={cx(styles.expandBar, {
                    [styles.expandBarOpen]: expanded,
                    [styles.expandBarClosed]: !expanded,
                })}
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
            >
                <span className={cx(styles.chevron, { [styles.chevronOpen]: expanded })} aria-hidden="true" />
                {expanded ? "Hide" : `Show all ${group.passages.length} passages`}
            </button>

            <div className={cx(styles.detailsOuter, { [styles.detailsOuterOpen]: expanded })} aria-hidden={!expanded}>
                <div className={styles.detailsInner}>
                    <div className={styles.detailsHeaderRow}>
                        <span>Time</span>
                        <span>Base Fee</span>
                        <span>Charged Fee</span>
                    </div>
                    {group.passages.map((passage) => (
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
                        </div>
                    ))}
                </div>
            </div>
        </>
    ) : null;

    return <PassageCard passage={group.latest} labels={hasMultiple ? GROUP_LABELS : undefined} footer={expandFooter} />;
}
