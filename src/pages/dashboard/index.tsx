import Sidbar from "@/components/sidbar";
import { PlusCircle, MagnifyingGlass } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import ImgEvent from "../../assets/img-show.jpg";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";

import { GetStaticProps } from "next";
import { getDatabase, ref, get } from "firebase/database";
import { database } from "@/services/firebase";
import CreateEvent from "./CreateEvent";

interface EventsProps {
  events: {
    id: string;
    name: string;
    date: string;
    hours: string;
    created_at: string;
    description: string;
  };
}

export default function Dashboard({ events }: EventsProps) {
  const data: EventsProps[] = events as any;

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
          <Dialog>
            <DialogTrigger className="text-gray-100 flex justify-center items-center w-56 h-56 border-2 border-gray-100 rounded-md border-dashed">
              <div>
                <PlusCircle size={80} />
                <strong className="mt-2">Criar Evento</strong>
              </div>
            </DialogTrigger>
            <CreateEvent />
          </Dialog>

          {data.map(({ id, name, date }: any) => {
            console.log(id);
            return (
              <Link
                className="shadow-xl shadow-green-800 text-gray-100 flex justify-center items-center w-56 h-56 rounded-md"
                href={`/dashboard/event/${id}`}
                key={id}
              >
                <div className="h-full w-full">
                  <Image
                    className="h-full w-full rounded-md transition duration-200 opacity-50 hover:opacity-25"
                    src={ImgEvent}
                    quality={100}
                    alt=""
                  />
                  <div className="mx-auto rounded-md w-11/12 relative bottom-14 text-center text-white bg-green-400  text-white">
                    <p>{name}</p>
                    <p>{date}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = ref(database, "event");
  let events = [] as any;
  try {
    const snapshot = await get(response);
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log("foi", data);
      events = Object.keys(data).map((id) => ({ id, ...data[id] }));
      // Faça o que for necessário com os dados lidos, como exibir em uma lista
    } else {
      console.log("Nenhum dado encontrado");
    }
  } catch (error) {}

  return {
    props: {
      events,
    },
  };
};
