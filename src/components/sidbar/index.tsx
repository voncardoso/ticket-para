import { CalendarBlank, Gear, SignOut } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import logomarca from "../../assets/logomarca.png";
import Image from "next/image";
import { getAuth, createUserWithEmailAndPassword,signOut } from "firebase/auth";
import { auth } from "firebase-admin";
import { isToken } from "typescript";
//import { signOut } from "firebase/auth";
//import { getAuth } from "firebase/auth";

export default function Sidbar() {
  const router = useRouter();
  const { id } = router.query;
  const [colorEvent, setColorEvent] = useState("text-white");
  useEffect(() => {
    if (router.pathname === "/dashboard") {
      setColorEvent("text-green-300");
    } else {
      setColorEvent("text-white");
    }
    
  },[router.pathname]);
  function logOut(auth : any){
    getAuth().signOut().then(() =>{
      localStorage.removeItem("tokenIngressoPara-v1");
      router.push("/ ");
    })
  }
  return (
    <aside className="w-48 h-screen max-md:w-16 bg-gray-400 flex flex-col justify-between">
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
          className={`max-md:hidden ${colorEvent} text mt-10 flex items-center gap-2 cursor-pointer hover:text-green-300`}
        >
          <CalendarBlank size={22} />
          Eventos
        </Link>
        <Link
          href={`/dashboard/event/config/${id}`}
          className={`max-md:hidden ${colorEvent} text mt-5 flex items-center gap-2 cursor-pointer hover:text-green-300`}
        >
          <Gear size={22} />
          Configuração
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
          onClick={logOut}
        >
          <SignOut size={24} />
          Sair
        </Link>
        <Link
          //type ="submit"
          href=""
          //onSubmit={logout}
          className="md:hidden text-lg flex items-center gap-2 cursor-pointer hover:text-green-300"
        >
          <SignOut size={26} />
        </Link>
      </div>
    </aside>
  );
}
