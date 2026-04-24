"use client";

import { useEffect, useRef, useState } from "react";
import cx from "clsx";
import type { TimezoneOffset } from "../lib/timezone-offsets";
import { generateTimezoneOffsets } from "../lib/timezone-offsets";
import styles from "./timezone-offset-select.module.css";

const OFFSETS = generateTimezoneOffsets();

function getLabelForValue(value: string): string {
    return OFFSETS.find((o) => o.value === value)?.label ?? value;
}

interface TimezoneOffsetSelectProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
}

export function TimezoneOffsetSelect({ value, onChange, disabled, error }: TimezoneOffsetSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const activeItemRef = useRef<HTMLAnchorElement>(null);

    const filteredOffsets = filter
        ? OFFSETS.filter((o) => o.label.toLowerCase().includes(filter.toLowerCase()))
        : OFFSETS;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setFilter("");
                setActiveIndex(-1);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        activeItemRef.current?.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    const selectOffset = (offset: TimezoneOffset) => {
        onChange(offset.value);
        setIsOpen(false);
        setFilter("");
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
                setActiveIndex((i) => Math.min(i + 1, filteredOffsets.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, -1));
                break;
            case "Enter":
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex < filteredOffsets.length) {
                    selectOffset(filteredOffsets[activeIndex]);
                }
                break;
            case "Escape":
                setIsOpen(false);
                setFilter("");
                setActiveIndex(-1);
                break;
        }
    };

    return (
        <div ref={containerRef} className={cx("dropdown is-fullwidth", styles.container, { "is-active": isOpen })}>
            <input
                className={cx("input", { "is-danger": error })}
                type="text"
                value={isOpen ? filter : getLabelForValue(value)}
                placeholder={isOpen ? getLabelForValue(value) : "Select timezone"}
                onChange={(e) => {
                    setFilter(e.target.value);
                    setActiveIndex(-1);
                }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            />

            <div className="dropdown-menu" role="listbox">
                <div className={cx("dropdown-content", styles.content)}>
                    {filteredOffsets.length === 0 ? (
                        <div className="dropdown-item">
                            <p className="has-text-grey is-size-7">No matching timezone found.</p>
                        </div>
                    ) : (
                        filteredOffsets.map((offset, index) => (
                            <a
                                key={offset.value}
                                ref={activeIndex === index ? activeItemRef : null}
                                className={cx("dropdown-item", {
                                    "is-active":
                                        activeIndex === index || (activeIndex === -1 && offset.value === value),
                                })}
                                role="option"
                                aria-selected={offset.value === value}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    selectOffset(offset);
                                }}
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                {offset.label}
                            </a>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
