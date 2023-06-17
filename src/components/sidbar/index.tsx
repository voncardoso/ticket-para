import { CalendarBlank, SignOut } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import logomarca from "../../assets/logomarca.png";
import Image from "next/image";

export default function Sidbar() {
  const router = useRouter();
  const [colorEvent, setColorEvent] = useState("text-white");
  useEffect(() => {
    if (router.pathname === "/dashboard") {
      setColorEvent("text-green-300");
    } else {
      setColorEvent("text-white");
    }
  }, [router.pathname]);
  return (
    <aside className="w-44 h-screen max-md:w-16 bg-gray-400 flex flex-col justify-between">
      <div className="p-4 text-white">
        <Link href="" className="">
          {" "}
          <h1 className="text-2xl font-semibold text-white max-md:hidden">
            <Image
              className="mx-auto w-12 relative bottom-15"
              src={logomarca}
              alt="logo do site"
            />
          </h1>
          <h1 className="md:hidden  text-lg font-semibold text-white max-md:block max-">
            Ing. Pará
          </h1>
        </Link>
        <Link
          href="/dashboard"
          className={`max-md:hidden ${colorEvent} text-lg mt-10 flex items-center gap-2 cursor-pointer hover:text-green-300`}
        >
          <CalendarBlank size={24} />
          Eventos
        </Link>
        <Link
          href="/dashboard"
          className={`md:hidden ${colorEvent} text-lg mt-10 flex items-center gap-2 cursor-pointer hover:text-green-300`}
        >
          <CalendarBlank size={26} />
        </Link>
      </div>
      <div className="p-4 mb-5 text-white">
        <Link
          href=""
          className="max-md:hidden text-lg flex items-center gap-2 cursor-pointer hover:text-green-300"
        >
          <SignOut size={24} />
          Sair
        </Link>
        <Link
          href=""
          className="md:hidden text-lg flex items-center gap-2 cursor-pointer hover:text-green-300"
        >
          <SignOut size={26} />
        </Link>
      </div>
    </aside>
  );
}
