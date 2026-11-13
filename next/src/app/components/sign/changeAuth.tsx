'use client'

import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import { useChangeAuth } from "@/src/app/hooks/auth/useChangeAuth";
import Image from "next/image";
import logo from "@/public/logo/logo-titulo.png"

export default function ChangeAuthPage() {
  const { showRegister, setShowRegister } = useChangeAuth();

  return (
    <div
      className={`w-full min-h-screen flex flex-col transition-all duration-300 ${
        showRegister ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <section className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 text-center text-lighter">


        <Image alt="DevNotes" src={logo} width={400} height={400} priority className="w-44 sm:w-56 md:w-80 h-auto select-none"/>

      </section>

      <section className="w-full lg:w-1/2 flex justify-center items-center p-6 bg-mid">

        <div className="auth-card">

          <h2 className="auth-title">
            {showRegister ? "Criar Conta" : "Login"}
          </h2>

          {showRegister ? <RegisterForm /> : <LoginForm />}

          <p className="text-sm text-darker mt-2 flex gap-1 items-center">
            {showRegister ? "Já tens conta?" : "Não tens conta?"}
            
            <button
              type="button"
              onClick={() => setShowRegister(!showRegister)}
              className="auth-link"
            >
              {showRegister ? "Faz login" : "Criar nova conta"}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}