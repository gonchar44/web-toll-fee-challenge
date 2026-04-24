import type { Passage } from "@/types";
import { VEHICLE_TYPE_FALLBACK_ICON, VEHICLE_TYPE_ICON } from "@/shared/lib/vehicle-type-icons";
import { formatPassageDateTime } from "../lib/format-date";
import { FeeItem } from "./fee-item";
import styles from "./passage-card.module.css";

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

export const PassageCard = ({ passage, labels, footer }: PassageCardProps) => {
    const icon = VEHICLE_TYPE_ICON[passage.vehicleType] ?? VEHICLE_TYPE_FALLBACK_ICON;

    return (
        <div className={styles.card}>
            <div className={styles.cardBody}>
                <div className={styles.header}>
                    <span className={styles.vehicleId}>{passage.vehicleId}</span>
                    <span className={styles.vehicleTypeBadge}>
                        <span className={styles.vehicleTypeIcon}>{icon}</span>
                        {passage.vehicleType}
                    </span>
                </div>
                <p className={styles.timestamp}>{formatPassageDateTime(passage.timestamp)}</p>
                <div className={styles.divider} />
                <div className={styles.feeGrid}>
                    <FeeItem label={labels?.baseFee ?? "Base Fee"} value={passage.baseFee} />
                    <FeeItem label={labels?.chargedFee ?? "Charged Fee"} value={passage.chargedFee} />
                    <FeeItem label={labels?.dailyTotal ?? "Daily Total"} value={passage.dailyTotal} />
                </div>
            </div>
            {footer}
        </div>
    );
};
