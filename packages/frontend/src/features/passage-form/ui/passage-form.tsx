"use client";

import { useState } from "react";
import { VehicleIdInput } from "./vehicle-id-input";
import { useKnownVehicles } from "../hooks/use-known-vehicles";

export function PassageForm() {
    const [vehicleId, setVehicleId] = useState("");
    const [vehicleType, setVehicleType] = useState("");

    const knownVehicles = useKnownVehicles();

    return (
        <div className="column is-3">
            <div className="field">
                <label className="label">License plate / Vehicle ID</label>
                <div className="control">
                    <VehicleIdInput
                        value={vehicleId}
                        onChange={setVehicleId}
                        onVehicleTypeChange={setVehicleType}
                        knownVehicles={knownVehicles}
                    />
                </div>
            </div>
            {vehicleId && (
                <p className="help">
                    ID: <strong>{vehicleId}</strong>
                    {vehicleType && (
                        <>
                            {" "}
                            · Type auto-filled: <strong>{vehicleType}</strong>
                        </>
                    )}
                </p>
            )}
        </div>
    );
}
