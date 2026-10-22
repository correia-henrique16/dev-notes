import { DashboardContent } from "../components/dashboard/DashboardContent";
import { Suspense } from "react";


export default async function Dashboard() {
    

    return (
        <main className="min-h-screen w-full bg-darker flex justify-center">
        <div className="w-full max-w-5xl px-4 py-8">
            <Suspense
                fallback={
                    <div className="text-lighter animate-pulse">
                    A carregar dashboard...
                    </div>
                }
            >
        
            <DashboardContent />

            </Suspense>
        </div>
    </main>
    );
}
