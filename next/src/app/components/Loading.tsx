import Image from "next/image";
import logo from "@/public/logo/logo-titulo.png"

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Image
        src={logo}
        alt="A carregar..."
        width={200}
        height={200}
        priority
        className="w-50 h-50 animate-pulse select-none object-contain"
      />
    </div>
  );
}