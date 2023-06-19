import Sidbar from "@/components/sidbar";
import { database } from "@/services/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { GetStaticPaths, GetStaticProps } from "next";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogPortal,
  DialogClose,
} from "@radix-ui/react-dialog";
import { Trash, X } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface EventsProps {
  data: { name: string; date: string };
  dataUser: [];
}

export default function Config({ data, dataUser }: EventsProps) {
  const router = useRouter();
  const { id } = router.query;
  const dateEvent = new Date(data?.date);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  async function handleCreateUser(data: any) {
    const user = {
      name: data.name,
      nameuser: data.nameuser,
      password: data.password,
      event_id: id,
    };
    const response = await addDoc(collection(database, "UserEvent"), user);
    if (response) {
      window.alert("Usuario cadastrado com sucesso");
      reset();
    }
  }

  const datauser = dataUser?.filter((item: any) => item.event_id === id);

  async function deleteItem(itemId: any) {
    try {
      const response = await deleteDoc(doc(database, "UserEvent", itemId));

      window.alert("Usuario cadastrado com sucesso");

      console.log("Item excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir o item:", error);
    }
  }
  console.log(dataUser);
  return (
    <section className="flex bg-background h-screen gap-5">
      <Sidbar />
      <div className="w-full">
        <header>
          <h1 className="p-2 pt-4 text-2xl text-white">
            {data?.name} | {""}
            {dateEvent.toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })}
          </h1>
        </header>
        <header className="p-4 pl-0 flex justify-end w-full">
          <Dialog>
            <DialogTrigger className="bg-green-400 opacity-75 py-1 px-4 rounded font-font-medium  text-white hover:opacity-95">
              Cadastrar Usuario
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
                    <h1 className="text-xl text font-bold">
                      Cadastrar Usuario
                    </h1>
                    <DialogClose asChild>
                      <button className="relative bottom-2">
                        <X />
                      </button>
                    </DialogClose>
                  </header>
                  <form
                    className="px-4 flex flex-col gap-4 mt-4 mb-4 items-center"
                    action=""
                    onSubmit={handleSubmit(handleCreateUser)}
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
                      Nome de usuario
                      <input
                        className="p-2 roudend rounded-md mt-1 text-black"
                        type="text"
                        {...register("nameuser")}
                      />
                    </label>
                    <label className="flex flex-col w-full  " htmlFor="">
                      Senha
                      <input
                        className="p-2 roudend rounded-md mt-1 text-black"
                        type="text"
                        {...register("password")}
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
        </header>
        <div className=" pr-5 mb-5">
          <table className="table-auto w-full text-center ">
            <thead>
              <tr className="bg-gray-400 text-white ">
                <th className="p-2 rounded-ss-md">Nome</th>
                <th className="p-2 ">Nome de usuario</th>
                <th className="p-2 ">Senha</th>
                <th className="p-2 "></th>
              </tr>
            </thead>
            <tbody>
              {datauser?.map((user: any, index) => {
                console.log(user.id);
                // format date
                let dataString = user.date;
                const data = new Date(dataString);
                const dataUTC = data.toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                });
                return (
                  <tr
                    key={user.hash_id}
                    className="bg-gray-300 text-white border-b-2 border-gray-400 cursor-pointer hover:opacity-75"
                  >
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.nameuser}</td>
                    <td className="p-2">{user.password}</td>
                    <td className="p-2 flex justify-center text-red-500">
                      <Trash
                        size={22}
                        onClick={() => {
                          deleteItem(user.id);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}

              <tr className=" bg-gray-400  border-b-2 border-gray-400 ">
                <td
                  colSpan={6}
                  className="p-2 rounded-ee-md rounded-es-md"
                ></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: "UuFKnMBdN84meKjwK6Er" } }],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;

  const docRef = doc(database, "event", `${params?.id}`);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  const serializedData = data === undefined ? null : data;

  const docRefUser = collection(database, "UserEvent");
  const docSnapUser = await getDocs(docRefUser);
  const dataUser = docSnapUser.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  const serializedDataUser = dataUser === undefined ? null : dataUser;

  return {
    props: {
      data: serializedData,
      dataUser,
    },
  };
};
