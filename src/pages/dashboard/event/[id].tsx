import Sidbar from "@/components/sidbar";
import {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogPortal,
  DialogClose,
} from "@radix-ui/react-dialog";
import QRCodeLink from "qrcode";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Checks, QrCode, Ticket, X, XCircle } from "@phosphor-icons/react";
import { randomBytes } from "crypto";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { database } from "@/services/firebase";
import { GetStaticPaths, GetStaticProps } from "next";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface ticketProps {
  amount: string;
  date: string;
  event_id: string;
  hash_id: string;
  id: string;
  type: string;
  checked: true | false;
}

interface EventsProps {
  data: [];
}

export default function Event({ data }: EventsProps) {
  const router = useRouter();
  const { id } = router.query;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();
  const [dataEvent, setDataEvent] = useState<any>([]);
  const tickets = data?.filter((item: any) => item.event_id === id);
  const [ImageQrCode, setImageQrCode] = useState("");

  useEffect(() => {
    async function GetEvent() {
      const docRef = doc(database, "event", `${id}`);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      setDataEvent(data);
    }
    GetEvent();
  }, [id]);

  // function para gerar hash
  function createSHA256Hash() {
    const randomBytesLength = 16; // Comprimento em bytes do hash desejado
    const randomBytesBuffer = randomBytes(randomBytesLength);
    const randomHash = randomBytesBuffer.toString("hex");
    return randomHash;
  }

  async function handleCreateTicket(data: any) {
    const tickt = {
      amount: data.amount,
      type: data.type,
      date: new Date().toISOString(),
      event_id: id,
      hash_id: createSHA256Hash(),
      checked: false,
    };

    let response = {};
    for (let i = 0; i < data.quantity; i++) {
      response = await addDoc(collection(database, "ticket"), tickt);
    }

    if (response) {
      window.alert("Ingressos cadastrado com sucesso");
      reset();
    }
  }

  const dateEvent = new Date(dataEvent?.date);

  function geradorQRCODE(tikect: any) {
    console.log("qr", tikect);
    let imgQrCode = "";
    let countString = JSON.stringify(tikect.hash_id);

    QRCodeLink.toDataURL(
      countString,
      {
        width: 400,
        margin: 3,
      },
      function (err, url) {
        imgQrCode = url;
      }
    );

    setImageQrCode(imgQrCode);
  }

  async function teste(id: string) {
    console.log(id);
    const response = await api.get(`https://ticket-para.vercel.app/api/${id}`, {
      responseType: "blob", // Configura o tipo de resposta para blob
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const urlTeste = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = urlTeste;
    link.setAttribute("download", `test.pdf`);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    // link.parentNode.removeChild(link);
  }

  return (
    <section className="flex bg-background h-screen gap-5">
      <Sidbar />
      <div className="w-full h-screen overflow-y-auto">
        <header>
          <h1 className="p-2 pt-4 text-2xl text-white">
            {dataEvent?.name} |{" "}
            {dateEvent.toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })}
          </h1>
        </header>
        <div className="p-4 text-center text-white">Grafico de ingressos</div>
        <header className="p-4 flex justify-end">
          <Dialog>
            <DialogTrigger className="bg-green-400 opacity-75 py-1 px-4 rounded font-font-medium rounded-sm text-white hover:opacity-95">
              Cadastrar Ingresso
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
                      Cadastrar Ingresso
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
                    onSubmit={handleSubmit(handleCreateTicket)}
                  >
                    <label className="flex flex-col w-full  " htmlFor="">
                      Tipo de ingresso
                      <select
                        id=""
                        className="p-2 roudend rounded-md mt-1 text-black"
                        {...register("type", { required: true })}
                      >
                        <option value="">Selecione o ingresso</option>
                        {dataEvent?.typeTicket?.map((item: any) => {
                          console.log(item);
                          return (
                            <>
                              <option value={item.type}>{item.type}</option>
                            </>
                          );
                        })}
                      </select>
                    </label>

                    <label className="flex flex-col w-full" htmlFor="">
                      {dataEvent?.typeTicket?.map((item: any) => {
                        if (watch("type") === item.type) {
                          setValue("amount", item.amount);
                          return (
                            <>
                              Valor
                              <input
                                className="p-2 roudend rounded-md mt-1 text-black"
                                defaultValue={item.amount}
                                {...register("amount", { required: true })}
                              />
                            </>
                          );
                        }
                      })}
                    </label>

                    {watch("type") && (
                      <label className="flex flex-col w-full  " htmlFor="">
                        Quantidade de Ingresso
                        <input
                          className="p-2 roudend rounded-md mt-1 text-black"
                          type="number"
                          {...register("quantity")}
                        />
                      </label>
                    )}
                    <button className="mt-1 text-white w-full bg-green-300 p-3 rounded-md cursor-pointer hover:bg-green-100 transition duration-500">
                      Cadastrar
                    </button>
                  </form>
                </DialogContent>
              </motion.div>
            </DialogPortal>
          </Dialog>
        </header>
        <div className=" pr-5">
          <table className="table-auto w-full text-center ">
            <thead>
              <tr className="bg-gray-400 text-white">
                <th className="p-2 rounded-ss-md">Nº</th>
                <th className="p-2 ">Data</th>
                <th className="p-2 ">Valor</th>
                <th className="p-2 ">Tipo</th>
                <th className="p-2 "></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tickets?.map((ticket: ticketProps, index) => {
                console.log(ticket.id);
                // format date
                let dataString = ticket.date;
                const data = new Date(dataString);
                const dataUTC = data.toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                });
                return (
                  <tr
                    key={ticket.hash_id}
                    className="bg-gray-300 text-white border-b-2 border-gray-400 cursor-pointer hover:opacity-75"
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{dataUTC}</td>
                    <td className="p-2">{ticket.amount}</td>
                    <td className="p-2">{ticket.type}</td>
                    <td
                      className="p-2"
                      onClick={() => {
                        geradorQRCODE(ticket);
                      }}
                    >
                      <Dialog>
                        <DialogTrigger className="text-white opacity-75 py-1 px-4 rounded font-font-medium rounded-sm text-white hover:opacity-95">
                          <QrCode weight="duotone" size={22} />
                        </DialogTrigger>

                        <DialogPortal>
                          <DialogOverlay className=" fixed inset-0 bg-black bg-opacity-50" />
                          <DialogContent className="p-4 mx-px-4 text-white bg-gray-400 z-20   fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md  shadow-green-50">
                            <DialogClose asChild>
                              <button className="relative bottom-2">
                                <X />
                              </button>
                            </DialogClose>

                            <div className="p-4 w-8xl roudend rounded-md flex bg-gradient-to-b from-blue-500 to-purple-500 gap-10">
                              <div className="w-full">
                                <strong>Nome do evento</strong>
                                <p>Tipo do ingresso: {ticket.type}</p>
                              </div>
                              <img className="w-32" src={ImageQrCode} alt="" />
                            </div>
                            <div className="w-full flex justify-center cursor-pointer">
                              <a
                                className="p-2"
                                onClick={() => {
                                  teste(ticket.id);
                                }}
                              >
                                Baixar ingresso
                              </a>
                            </div>
                          </DialogContent>
                        </DialogPortal>
                      </Dialog>
                    </td>
                    <td>
                      {ticket.checked ? (
                        <Checks className="text-green-300" size={30} />
                      ) : (
                        <XCircle className="text-red-600" size={28} />
                      )}
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const collectionRef = collection(database, "ticket");
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
