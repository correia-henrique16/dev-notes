import { DashboardContent } from "../components/dashboard/DashboardContent";
import { Suspense } from "react";
import Loading from "../components/utils/Loading";


export default async function Dashboard() {
    

    return (
        <main className="min-h-screen w-full bg-darker flex justify-center">
            <div className="w-full max-w-7xl px-4 md:px-8 pt-4 pb-6 flex flex-col flex-1 min-h-[calc(100vh-2rem)]">
                <Suspense
                    fallback={
                        <div className="w-full flex-1 flex flex-col items-center justify-center gap-3 px-4 text-center">
                            <Loading />
                            <p className="text-sm text-lighter/70 max-w-md">
                                A carregar dashboard... Pode demorar 50 segundos na primeira chamada (ler Readme)
                            </p>
                        </div>
                        
                    }
                >
            
                    <DashboardContent />

                </Suspense>
            </div>
        </main>
    );
}
