"use client";

import { useEffect, useRef, useState } from "react";
import cx from "clsx";
import type { SelectProps } from "./select.types";
import styles from "./select.module.css";

function getLabelForValue(value: string, options: SelectProps["options"]): string | undefined {
    return options.find((o) => o.value === value)?.label;
}

export function Select({
    value,
    onChange,
    options,
    placeholder = "Select an option",
    disabled,
    error,
    searchable,
    emptyMessage = "No options found.",
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const activeItemRef = useRef<HTMLLIElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedLabel = getLabelForValue(value, options);

    const enabledOptions = options.filter((o) => !o.disabled);
    const filteredOptions =
        searchable && filter
            ? enabledOptions.filter((o) => o.label.toLowerCase().includes(filter.toLowerCase()))
            : enabledOptions;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                close();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        activeItemRef.current?.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    function open() {
        if (disabled) return;
        setIsOpen(true);
        setActiveIndex(-1);
    }

    function close() {
        setIsOpen(false);
        setFilter("");
        setActiveIndex(-1);
    }

    function selectOption(optionValue: string) {
        onChange(optionValue);
        close();
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
        if (!isOpen) {
            if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open();
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, -1));
                break;
            case "Enter":
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
                    selectOption(filteredOptions[activeIndex].value);
                }
                break;
            case "Escape":
                e.preventDefault();
                close();
                break;
        }
    }

    const triggerClasses = cx(styles.trigger, {
        [styles.triggerError]: !!error,
        [styles.triggerDisabled]: !!disabled,
        [styles.triggerOpen]: isOpen,
    });

    return (
        <div
            ref={containerRef}
            className={cx(styles.container, { [styles.containerOpen]: isOpen })}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
        >
            {searchable ? (
                <div className={styles.inputWrapper}>
                    <input
                        ref={inputRef}
                        className={cx(styles.trigger, styles.searchInput, {
                            [styles.triggerError]: !!error,
                            [styles.triggerDisabled]: !!disabled,
                            [styles.triggerOpen]: isOpen,
                        })}
                        type="text"
                        value={isOpen ? filter : (selectedLabel ?? "")}
                        placeholder={isOpen ? (selectedLabel ?? placeholder) : placeholder}
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setActiveIndex(-1);
                        }}
                        onFocus={open}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        autoComplete="off"
                        aria-autocomplete="list"
                        aria-expanded={isOpen}
                        aria-haspopup="listbox"
                    />
                    <span
                        className={cx(styles.chevronFloat, {
                            [styles.chevronFloatOpen]: isOpen,
                            [styles.chevronFloatDisabled]: disabled,
                        })}
                        aria-hidden="true"
                    />
                </div>
            ) : (
                <button
                    type="button"
                    className={triggerClasses}
                    onClick={() => (isOpen ? close() : open())}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    {value ? (
                        <span className={styles.triggerContent}>
                            {(() => {
                                const opt = options.find((o) => o.value === value);
                                return opt ? (
                                    <>
                                        {opt.icon && <span className={styles.icon}>{opt.icon}</span>}
                                        <span>{opt.label}</span>
                                        {opt.badge && (
                                            <span
                                                className={cx(
                                                    "tag",
                                                    `is-${opt.badge.variant ?? "warning"}`,
                                                    "is-light",
                                                    "is-small",
                                                    styles.badgeInline,
                                                )}
                                            >
                                                {opt.badge.text}
                                            </span>
                                        )}
                                    </>
                                ) : null;
                            })()}
                        </span>
                    ) : (
                        <span className={styles.placeholder}>{placeholder}</span>
                    )}
                    <span className={cx(styles.chevron, { [styles.chevronOpen]: isOpen })} aria-hidden="true" />
                </button>
            )}

            {isOpen && (
                <ul className={styles.panel} role="listbox" aria-label={placeholder}>
                    {filteredOptions.length === 0 ? (
                        <li className={styles.empty}>{emptyMessage}</li>
                    ) : (
                        filteredOptions.map((opt, index) => {
                            const isActive = activeIndex === index;
                            const isSelected = opt.value === value;
                            return (
                                <li
                                    key={opt.value}
                                    ref={isActive ? activeItemRef : null}
                                    className={cx(styles.option, {
                                        [styles.optionActive]: isActive,
                                        [styles.optionSelected]: isSelected && !isActive,
                                    })}
                                    role="option"
                                    aria-selected={isSelected}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        selectOption(opt.value);
                                    }}
                                    onMouseEnter={() => setActiveIndex(index)}
                                >
                                    {opt.icon && <span className={styles.icon}>{opt.icon}</span>}
                                    <span className={styles.optionLabel}>{opt.label}</span>
                                    {opt.badge && (
                                        <span
                                            className={cx(
                                                "tag",
                                                `is-${opt.badge.variant ?? "warning"}`,
                                                "is-light",
                                                "is-small",
                                                styles.badge,
                                            )}
                                        >
                                            {opt.badge.text}
                                        </span>
                                    )}
                                </li>
                            );
                        })
                    )}
                </ul>
            )}
        </div>
    );
}
