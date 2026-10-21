import RegisterForm from "./registerForm";
import Link from "next/link";

export default function RegisterPage() {
    return(
        <main className="centered bg-darker">
            <div className="xl:w-8/12 w-full bg-mid flex flex-col items-center gap-3">
                
                <h1 >Register</h1>
                <RegisterForm />

                <p >
                    Já tens conta?
                    <Link href="/login"
                     >
                        Faz login
                    </Link>
                </p>

            </div>
            
        </main>
    )
}