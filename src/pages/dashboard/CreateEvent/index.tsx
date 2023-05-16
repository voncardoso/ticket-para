import { X } from "@phosphor-icons/react";
import {
  DialogOverlay,
  DialogContent,
  DialogPortal,
  DialogClose,
} from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { FieldValues, useForm } from "react-hook-form";
import { getDatabase, push, ref, set } from "firebase/database";
import { database } from "../../../services/firebase";

export function CreateEvent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  async function handleCreateEvent(data: FieldValues) {
    console.log(data);
    const teste = new Date();
    console.log(teste);
    const response = await push(ref(database, "event"), {
      name: data.name,
      date: data.date,
      hours: data.hours,
      created_at: String(teste),
      description: data.description,
    });

    console.log("response", response);
  }

  return (
    <AnimatePresence>
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
    </AnimatePresence>
  );
}
