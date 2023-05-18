import Sidbar from "@/components/sidbar";
import { PlusCircle, MagnifyingGlass, X } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import ImgEvent from "../../assets/img-show.jpg";
import {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogPortal,
  DialogClose,
} from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { GetStaticProps } from "next";
import { database } from "@/services/firebase";
import { FieldValues, useForm } from "react-hook-form";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { api } from "../../lib/api";

interface EventsProps {
  data: {
    id: string;
    name: string;
    date: string;
    hours: string;
    created_at: string;
    description: string;
  };
}

type DashboardProps = {
  data: any; // Defina o tipo de dados esperado para a resposta
};

export default function Dashboard({ data }: EventsProps) {
  const events: EventsProps[] = data as any;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function handleCreateEvent(data: FieldValues) {
    const teste = new Date();
    const response = await addDoc(collection(database, "event"), {
      name: data.name,
      date: data.date,
      hours: data.hours,
      created_at: String(teste),
      description: data.description,
    });

    if (response) {
      window.alert("Evento cadastrado com sucesso");
      reset();
    }
  }

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
            <DialogPortal>
              <DialogOverlay className=" fixed inset-0 bg-black bg-opacity-50" />
              <motion.div
                className="modal "
                initial={{ opacity: 0, y: 0, x: 0 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{
                  ease: "linear",
                  duration: 0.5,
                  x: { duration: 0.5 },
                }}
              >
                <DialogContent className=" mx-px-4 text-white bg-gray-400 z-20 w-96  fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md  shadow-green-50">
                  <header className="pt-5 px-5 flex justify-between">
                    <h1 className="text-xl text font-bold">Cadastrar Evento</h1>
                    <DialogClose asChild>
                      <button className="relative bottom-2">
                        <X />
                      </button>
                    </DialogClose>
                  </header>
                  <form
                    className="px-4 flex flex-col gap-4 mt-4 mb-4 items-center"
                    action=""
                    onSubmit={handleSubmit(handleCreateEvent)}
                  >
                    <label className="flex flex-col w-full  " htmlFor="">
                      Nome
                      <input
                        className="p-2 roudend rounded-md mt-1 text-black"
                        type="text"
                        {...register("name")}
                      />
                    </label>

                    <label className="flex flex-col w-full  " htmlFor="">
                      Data
                      <input
                        className="p-2 roudend rounded-md mt-1 text-black"
                        type="date"
                        {...register("date")}
                      />
                    </label>

                    <label className="flex flex-col w-full  " htmlFor="">
                      Horario
                      <input
                        className="p-2 roudend rounded-md mt-1 text-black"
                        type="time"
                        {...register("hours")}
                      />
                    </label>

                    <label className="flex flex-col w-full  " htmlFor="">
                      Descrição
                      <textarea
                        className="p-2 roudend rounded-md mt-1 text-black"
                        id=""
                        {...register("description")}
                      />
                    </label>

                    <button className="mt-1 text-white w-full bg-green-300 p-3 rounded-md cursor-pointer hover:bg-green-100 transition duration-500">
                      Cadastrar
                    </button>
                  </form>
                </DialogContent>
              </motion.div>
            </DialogPortal>
          </Dialog>

          {events?.map(({ id, name, date }: any) => {
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

export const getStaticProps: GetStaticProps<DashboardProps> = async () => {

  const collectionRef = collection(database, "event");
  const querySnapshot = await getDocs(collectionRef);
  const data = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

    return {
      props: {
        data,
      },
    };
};
