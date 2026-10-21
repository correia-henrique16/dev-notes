import LoginForm from "./loginForm";
import Link from "next/link";

export default function RegisterPage() {
    return(
        <main >
            <div >
                
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