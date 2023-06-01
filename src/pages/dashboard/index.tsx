import Sidbar from "@/components/sidbar";
import {
  PlusCircle,
  MagnifyingGlass,
  X,
  TrashSimple,
} from "@phosphor-icons/react";
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
import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { useContext } from "react";
import { UserContextLogin } from "@/Context/useContextLogin";

interface EventsProps {
  data: [];
}

export default function Dashboard({ data }: EventsProps) {
  const { dataUser } = useContext(UserContextLogin);
  const events = data.filter((item: any) => item.uid === dataUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      typeTicket: [{ type: "", amount: "" }],
      name: "",
      date: "",
      hours: "",
      description: "",
    },
  });

  const {
    fields: typeTicketFields,
    append: typeTicketAppend,
    remove: typeTicketRemove,
  } = useFieldArray({
    control,
    name: "typeTicket",
  });

  async function handleCreateEvent(data: FieldValues) {
    const date = new Date().toISOString();
    console.log(data);
    const response = await addDoc(collection(database, "event"), {
      name: data.name,
      date: data.date,
      hours: data.hours,
      created_at: String(date),
      description: data.description,
      uid: dataUser,
      typeTicket: data.typeTicket,
    });

    if (response) {
      window.alert("Evento cadastrado com sucesso");
      reset();
    }
  }

  return (
    <section className="flex bg-background h-screen gap-5">
      <Sidbar />
      <div className="w-full h-screen overflow-y-auto">
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
              <div className="flex flex-col justify-center">
                <PlusCircle size={90} />
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
                <DialogContent className="overflow-y-auto  mx-px-4 text-white bg-gray-400 z-20 w-1/3 h-5/6 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md  shadow-green-50">
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

                    <div className="flex flex-col w-full  ">
                      <label htmlFor="" className="border-b-2">
                        Ingressos
                      </label>
                      {typeTicketFields.map((field, index) => (
                        <>
                          <label
                            key={field.id}
                            className="mt-4 flex flex-col w-full  "
                            htmlFor=""
                          >
                            Tipo {index + 1}
                            <input
                              className="p-2 roudend rounded-md mt-1 text-black"
                              type="text"
                              defaultValue={field.type}
                              {...register(`typeTicket.${index}.type`)}
                            />
                          </label>

                          <label
                            key={field.id}
                            className="mt-2 flex flex-col w-full  "
                            htmlFor=""
                          >
                            Valor {index + 1}
                            <input
                              className="p-2 roudend rounded-md mt-1 text-black"
                              type="text"
                              defaultValue={field.type}
                              {...register(`typeTicket.${index}.amount`)}
                            />
                          </label>
                          <button
                            className="mt-2 text-red-500 flex gap-1 text-left w-32 items-center hover:text-red-500"
                            type="button"
                            onClick={() => typeTicketRemove(index)}
                          >
                            <TrashSimple className="text-red-500" size={22} />{" "}
                            Remover
                          </button>
                        </>
                      ))}
                    </div>
                    <button
                      className="flex gap-1 text-center items-center hover:text-gold-400"
                      type="button"
                      onClick={() =>
                        typeTicketAppend({
                          type: "",
                          amount: "",
                        })
                      }
                    >
                      <PlusCircle className="text-gold-400" size={22} />{" "}
                      Adicionar tipo de ingresso
                    </button>

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

export const getStaticProps: GetStaticProps = async () => {
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
