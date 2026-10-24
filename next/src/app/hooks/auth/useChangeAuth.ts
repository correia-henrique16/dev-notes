import { useState } from "react";

export function useChangeAuth() {

    const [showRegister, setShowRegister] = useState<boolean>(false)

    return {
        showRegister, setShowRegister
    }
}