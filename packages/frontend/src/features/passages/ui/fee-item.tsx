import styles from "./passage-card.module.css";

interface FeeItemProps {
    label: string;
    value: number;
}

export const FeeItem = ({ label, value }: FeeItemProps) => (
    <div className={styles.feeItem}>
        <span className={styles.feeLabel}>{label}</span>
        <span className={styles.feeValue}>
            {value}
            <span className={styles.feeUnit}>DKK</span>
        </span>
    </div>
);
