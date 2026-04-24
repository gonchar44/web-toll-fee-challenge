"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import cx from "clsx";
import { VehicleIdInput } from "./vehicle-id-input";
import { PassageDateTimeInput } from "./passage-date-time-input";
import { FieldError } from "./field-error";
import { useKnownVehicles } from "../hooks/use-known-vehicles";
import { passageFormSchema, type PassageFormValues } from "../model/passage-form.schema";
import { createPassage } from "@/features/passages/api/passages.api";
import styles from "./passage-form.module.css";

export function PassageForm() {
    const queryClient = useQueryClient();
    const knownVehicles = useKnownVehicles();

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<PassageFormValues>({
        resolver: zodResolver(passageFormSchema),
        defaultValues: { vehicleId: "", vehicleType: "", timestamp: "" },
    });

    const mutation = useMutation({
        mutationFn: createPassage,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["passages"] });
            reset();
        },
    });

    const onSubmit = (values: PassageFormValues) => mutation.mutate(values);
    const isPending = isSubmitting || mutation.isPending;

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
            <div className="field">
                <label className="label">License plate / Vehicle ID</label>
                <div className="control">
                    <Controller
                        name="vehicleId"
                        control={control}
                        render={({ field }) => (
                            <VehicleIdInput
                                value={field.value}
                                onChange={field.onChange}
                                onVehicleTypeChange={(type) => setValue("vehicleType", type)}
                                knownVehicles={knownVehicles}
                                disabled={isPending}
                            />
                        )}
                    />
                </div>
                <FieldError message={errors.vehicleId?.message} />
                <FieldError message={errors.vehicleType?.message} />
            </div>

            <div className="field">
                <label className="label">Date &amp; Time</label>
                <div className="control">
                    <Controller
                        name="timestamp"
                        control={control}
                        render={({ field }) => (
                            <PassageDateTimeInput
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isPending}
                                error={errors.timestamp?.message}
                            />
                        )}
                    />
                </div>
                <FieldError message={errors.timestamp?.message} />
            </div>

            <div className="field">
                <div className="control">
                    <button
                        type="submit"
                        className={cx("button is-primary is-fullwidth", { "is-loading": isPending })}
                        disabled={isPending}
                    >
                        Record Passage
                    </button>
                </div>
            </div>

            {mutation.isError && (
                <FieldError message="Failed to record passage. Please try again." />
            )}
        </form>
    );
}
