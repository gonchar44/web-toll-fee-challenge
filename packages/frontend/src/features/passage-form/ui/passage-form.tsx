"use client";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import cx from "clsx";
import { VehicleIdInput } from "./vehicle-id-input";
import { VehicleTypeSelect } from "./vehicle-type-select";
import { PassageDateTimeInput } from "./passage-date-time-input";
import { FieldError } from "./field-error";
import { useKnownVehicles } from "../hooks/use-known-vehicles";
import { passageFormSchema, type PassageFormValues } from "../model/passage-form.schema";
import { createPassage } from "@/features/passages/api/passages.api";
import { fetchVehicleTypes } from "@/features/vehicle-types/api/vehicle-types.api";

export function PassageForm() {
    const queryClient = useQueryClient();
    const knownVehicles = useKnownVehicles();
    const { data: vehicleTypes = [] } = useQuery({
        queryKey: ["vehicle-types"],
        queryFn: fetchVehicleTypes,
        staleTime: Infinity,
    });

    const [isVehicleTypeAutoFilled, setIsVehicleTypeAutoFilled] = useState(false);

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
            setIsVehicleTypeAutoFilled(false);
        },
    });

    const onSubmit = (values: PassageFormValues) => mutation.mutate(values);
    const isPending = isSubmitting || mutation.isPending;

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="column is-3">
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
                                onVehicleTypeChange={(type) => {
                                    setValue("vehicleType", type);
                                    setIsVehicleTypeAutoFilled(!!type);
                                }}
                                knownVehicles={knownVehicles}
                                disabled={isPending}
                            />
                        )}
                    />
                </div>
                <FieldError message={errors.vehicleId?.message} />
            </div>

            <div className="field">
                <label className="label">Vehicle Type</label>
                <div className="control">
                    <Controller
                        name="vehicleType"
                        control={control}
                        render={({ field }) => (
                            <VehicleTypeSelect
                                value={field.value}
                                onChange={field.onChange}
                                options={vehicleTypes}
                                disabled={isVehicleTypeAutoFilled || isPending}
                            />
                        )}
                    />
                </div>
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

            {mutation.isError && <FieldError message="Failed to record passage. Please try again." />}
        </form>
    );
}
