import LoginForm from "./loginForm";
import Link from "next/link";

export default function RegisterPage() {
    return(
        <main className="centered bg-darker">
            <div className="xl:w-8/12 w-full bg-mid flex flex-col items-center gap-3">
                
                <h1 >Login</h1>
                <LoginForm />

                <p >
                    Não tens conta?
                    <Link href="/register"
                     >
                        Criar nova conta
                    </Link>
                </p>

            </div>
            
        </main>
    )
}