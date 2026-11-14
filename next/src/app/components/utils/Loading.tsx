import Image from "next/image";
import logoBranco from "@/public/logo/logo-titulo.png"
import logoPreto from "@/public/logo/logo-titulo-dark.png"

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Image
        src={logoBranco}
        alt="A carregar..."
        width={200}
        height={200}
        priority
        className="w-50 h-50 animate-pulse select-none object-contain block light:hidden"
      />

      <Image
        src={logoPreto}
        alt="A carregar..."
        width={200}
        height={200}
        priority
        className="w-50 h-50 animate-pulse select-none object-contain hidden light:block"
      />
    </div>
  );
}