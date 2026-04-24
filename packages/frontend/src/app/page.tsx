import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { PassageForm } from "@/features/passage-form/ui/passage-form";
import { PassageList } from "@/features/passages/ui/passage-list";
import { fetchVehicleTypes } from "@/features/vehicle-types/api/vehicle-types.api";
import { fetchPassages } from "@/features/passages/api/passages.api";

export default async function HomePage() {
    const queryClient = new QueryClient();
    await Promise.all([
        queryClient.prefetchQuery({ queryKey: ["vehicle-types"], queryFn: fetchVehicleTypes }),
        queryClient.prefetchQuery({ queryKey: ["passages"], queryFn: fetchPassages }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <main className="section">
                <div className="container">
                    <div className="mb-5">
                        <h1 className="title">Toll Passage Manager</h1>
                        <p className="subtitle">
                            Track daily toll fees, stay under the 120 DKK cap, and review which passages were actually
                            charged.
                        </p>
                    </div>

                    <div className="columns">
                        <PassageForm />
                        <PassageList />
                    </div>
                </div>
            </main>
        </HydrationBoundary>
    );
}
