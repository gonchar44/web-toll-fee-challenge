"use client";

import { useEffect, useRef, useState } from "react";
import cx from "clsx";
import { VEHICLE_TYPE_ICON, VEHICLE_TYPE_FALLBACK_ICON } from "@/shared/lib/vehicle-type-icons";
import type { KnownVehicle } from "../model/passage-form.types";
import styles from "./vehicle-id-input.module.css";

interface VehicleIdInputProps {
    value: string;
    onChange: (vehicleId: string) => void;
    onVehicleTypeChange: (vehicleType: string) => void;
    knownVehicles: KnownVehicle[];
    disabled?: boolean;
}

export function VehicleIdInput({ value, onChange, onVehicleTypeChange, knownVehicles, disabled }: VehicleIdInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    const trimmedValue = value.trim().toLowerCase();

    const filteredVehicles = trimmedValue
        ? knownVehicles.filter(
              (v) =>
                  v.vehicleId.toLowerCase().includes(trimmedValue) ||
                  v.vehicleType.toLowerCase().includes(trimmedValue),
          )
        : knownVehicles;

    const isNewVehicle =
        trimmedValue.length > 0 && !knownVehicles.some((v) => v.vehicleId.toLowerCase() === trimmedValue);

    // Total navigable items: suggestions + optional "use as new" row
    const totalItems = filteredVehicles.length + (isNewVehicle ? 1 : 0);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setActiveIndex(-1);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value.replace(/\s/g, ""));
        onVehicleTypeChange("");
        setIsOpen(true);
        setActiveIndex(-1);
    };

    const selectExistingVehicle = (vehicle: KnownVehicle) => {
        onChange(vehicle.vehicleId);
        onVehicleTypeChange(vehicle.vehicleType);
        setIsOpen(false);
        setActiveIndex(-1);
    };

    const selectNewVehicle = () => {
        onChange(value.trim());
        setIsOpen(false);
        setActiveIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, totalItems - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, -1));
                break;
            case "Enter":
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex < filteredVehicles.length) {
                    selectExistingVehicle(filteredVehicles[activeIndex]);
                } else if (activeIndex === filteredVehicles.length && isNewVehicle) {
                    selectNewVehicle();
                }
                break;
            case "Escape":
                setIsOpen(false);
                setActiveIndex(-1);
                break;
        }
    };

    const showEmptyState = knownVehicles.length === 0 && !trimmedValue;
    const showNoMatch = !showEmptyState && filteredVehicles.length === 0 && !isNewVehicle && trimmedValue.length > 0;

    return (
        <div
            ref={containerRef}
            className={cx("dropdown is-fullwidth", styles.dropdownContainer, { "is-active": isOpen })}
        >
            <div className={styles.inputWrapper}>
                <input
                    className={cx("input", styles.inputWithChevron)}
                    type="text"
                    placeholder="e.g. ABC123"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                />
                <span
                    className={cx(styles.chevron, { [styles.chevronOpen]: isOpen, [styles.chevronDisabled]: disabled })}
                    aria-hidden="true"
                />
            </div>

            <div className="dropdown-menu" role="listbox">
                <div className="dropdown-content">
                    {showEmptyState && (
                        <div className="dropdown-item">
                            <p className="has-text-grey is-size-7">
                                No vehicles on record yet. Enter a license plate or vehicle ID to get started.
                            </p>
                        </div>
                    )}

                    {filteredVehicles.map((vehicle, index) => (
                        <a
                            key={vehicle.vehicleId}
                            className={cx("dropdown-item", { "is-active": activeIndex === index })}
                            role="option"
                            aria-selected={activeIndex === index}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                selectExistingVehicle(vehicle);
                            }}
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                            <div className="is-flex is-align-items-center is-justify-content-space-between">
                                <div className={cx("is-flex is-align-items-center", styles.vehicleItemLeft)}>
                                    <span>{VEHICLE_TYPE_ICON[vehicle.vehicleType] ?? VEHICLE_TYPE_FALLBACK_ICON}</span>
                                    <span className="has-text-weight-medium">{vehicle.vehicleId}</span>
                                </div>
                                {vehicle.isTollFree && (
                                    <span className="tag is-warning is-light is-small">toll-free</span>
                                )}
                            </div>
                        </a>
                    ))}

                    {isNewVehicle && (
                        <>
                            {filteredVehicles.length > 0 && <hr className="dropdown-divider" />}
                            <a
                                className={cx("dropdown-item", {
                                    "is-active": activeIndex === filteredVehicles.length,
                                })}
                                role="option"
                                aria-selected={activeIndex === filteredVehicles.length}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    selectNewVehicle();
                                }}
                                onMouseEnter={() => setActiveIndex(filteredVehicles.length)}
                            >
                                <span className="has-text-success has-text-weight-medium">+ Create new vehicle</span>
                            </a>
                        </>
                    )}

                    {showNoMatch && (
                        <div className="dropdown-item">
                            <p className="has-text-grey is-size-7">No matching vehicles found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
