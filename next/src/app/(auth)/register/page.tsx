import RegisterForm from "./registerForm";
import Link from "next/link";

export default function RegisterPage() {
    return(
        <main >
            <div >
                
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