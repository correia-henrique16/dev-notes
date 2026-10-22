/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

export function useChangeAuth() {

    const [showRegister, setShowRegister] = useState<boolean>(false)

    return {
        showRegister, setShowRegister
    }
}