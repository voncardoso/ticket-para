import Sidbar from "@/components/sidbar";
import { PlusCircle, MagnifyingGlass } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import ImgEvent from "../../assets/img-show.jpg";

export default function Dashboard() {
  return (
    <section className="flex bg-background h-screen gap-5">
      <Sidbar />
      <div className="w-full">
        <header className="flex justify-end p-4 ">
          <label className="flex gap-2 bg-gray-400 p-2 rounded-md" htmlFor="">
            <MagnifyingGlass className="text-gray-100" size={24} />
            <input
              className="bg-gray-400"
              type="text"
              placeholder="Pesquisar"
            />
          </label>
        </header>
        <div className="w-full flex gap-5 flex-wrap">
          <Link
            className="text-gray-100 flex justify-center items-center w-56 h-56 border-2 border-gray-100 rounded-md border-dashed"
            href=" "
          >
            <div>
              <PlusCircle size={80} />
              <strong className="mt-2">Criar Evento</strong>
            </div>
          </Link>
          <Link
            className=" text-gray-100 flex justify-center items-center w-56 h-56 rounded-md"
            href=""
          >
            <div className="h-full w-full">
              <Image
                className="h-full w-full rounded-md transition duration-500 opacity-50 hover:opacity-25"
                src={ImgEvent}
                quality={100}
                alt=""
              />
              <div className="mx-auto rounded-md w-11/12 relative bottom-14 text-center text-white bg-white bg-opacity-50 text-white">
                <p>festa de formatura</p>
                <p>12/12/2032</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
