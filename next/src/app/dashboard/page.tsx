import { DashboardContent } from "../components/dashboard/DashboardContent";
import { Suspense } from "react";


export default async function Dashboard() {
    

    return (
        <main className="min-h-screen w-full bg-darker flex justify-center">
            <div className="w-full max-w-7xl px-4 md:px-8 pt-4 pb-6 flex flex-col flex-1 min-h-[calc(100vh-2rem)]">
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
