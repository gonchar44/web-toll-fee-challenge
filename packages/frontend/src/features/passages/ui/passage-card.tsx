import cx from "clsx";
import type { Passage } from "@/types";
import { formatPassageDateTime } from "../lib/format-date";
import styles from "./passage-card.module.css";

interface FeeItemProps {
    label: string;
    value: number;
}

function FeeItem({ label, value }: FeeItemProps) {
    return (
        <div className={styles.feeItem}>
            <span className={styles.feeLabel}>{label}</span>
            <span className={styles.feeValue}>
                {value}
                <span className={styles.feeUnit}>DKK</span>
            </span>
        </div>
    );
}

export interface PassageCardLabels {
    baseFee?: string;
    chargedFee?: string;
    dailyTotal?: string;
}

interface PassageCardProps {
    passage: Passage;
    labels?: PassageCardLabels;
    footer?: React.ReactNode;
}

export function PassageCard({ passage, labels, footer }: PassageCardProps) {
    return (
        <div className={cx(styles.card, { [styles.cardWithFooter]: !!footer })}>
            <div className={styles.header}>
                <span className={styles.vehicleId}>{passage.vehicleId}</span>
                <span className={styles.vehicleTypeBadge}>{passage.vehicleType}</span>
            </div>
            <p className={styles.timestamp}>{formatPassageDateTime(passage.timestamp)}</p>
            <div className={styles.divider} />
            <div className={styles.feeGrid}>
                <FeeItem label={labels?.baseFee ?? "Base Fee"} value={passage.baseFee} />
                <FeeItem label={labels?.chargedFee ?? "Charged Fee"} value={passage.chargedFee} />
                <FeeItem label={labels?.dailyTotal ?? "Daily Total"} value={passage.dailyTotal} />
            </div>
            {footer}
        </div>
    );
}
