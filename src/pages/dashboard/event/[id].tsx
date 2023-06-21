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
import {
  Checks,
  CurrencyDollar,
  DownloadSimple,
  QrCode,
  Ticket,
  X,
  XCircle,
} from "@phosphor-icons/react";
import { randomBytes } from "crypto";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { database } from "@/services/firebase";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Pagination from "@mui/material/Pagination";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { FormEvent } from "react";
import { CircularProgress } from "@mui/material";
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
  const [activeModal, setActiveModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  const [dataEvent, setDataEvent] = useState<any>([]);
  const tickets = data
    ?.filter((item: any) => item.event_id === id)
    .sort((a: any, b: any) => {
      let dataString = a.date;
      const data = new Date(dataString);
      const dataUTC_A = data.toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      }) as any;

      let dataString_B = b.date;
      const data_B = new Date(dataString_B);
      const dataUTC_B = data_B.toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      }) as any;

      console.log(dataUTC_A, dataUTC_B);
      return dataUTC_A.localeCompare(dataUTC_B);
    });
  const [ImageQrCode, setImageQrCode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // função para fazer calculo dos ingressos
  const incomeBalance = tickets?.reduce(
    (acc: any, ticket: any, index) => {
      let amount = ticket.amount.replace(/,/g, ".");
      console.log(Number(ticket.amount));
      acc.total += 1;
      acc.valorTotal += Number(amount);

      if (ticket.checked == true) {
        acc.verifiedTickets += 1;
      }
      if (ticket.checked == false) {
        acc.noTicketsChecked += 1;
      }
      return acc;
    },
    {
      total: 0,
      valorTotal: 0,
      verifiedTickets: 0,
      noTicketsChecked: 0,
    }
  );
  console.log(tickets);
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
      event: dataEvent?.name,
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

  // funçao para gerar o qrcode
  function geradorQRCODE(tikect: any) {
    console.log("qr", tikect);

    let imgQrCode = "";
    let countString = JSON.stringify(tikect);

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

  async function pdfTicketItem(id: string) {
    setActiveModal(true);
    const response = await api.get(`https://ticket-para.vercel.app/api/${id}`, {
      responseType: "blob", // Configura o tipo de resposta para blob
    });

    if (response) {
      setActiveModal(false);
    }
    const blob = new Blob([response.data], { type: "application/pdf" });
    const urlTeste = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = urlTeste;
    link.setAttribute("download", `test.pdf`);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();
  }

  async function pdfTicketLote() {
    setActiveModal(true);
    const response = await api.get(
      `https://ticket-para.vercel.app/api/tikects/${id}`,
      {
        responseType: "blob", // Configura o tipo de resposta para blob
      }
    );

    if (response) {
      setActiveModal(false);
    }
    const blob = new Blob([response.data], { type: "application/pdf" });
    const urlTeste = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = urlTeste;
    link.setAttribute("download", `test.pdf`);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();
  }

  // criar paginação
  function paginate(items: any, currentPage: any, itemsPerPage: any) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    if (items) {
      return items.slice(startIndex, endIndex);
    }
  }

  const paginatedData = paginate(tickets, currentPage, itemsPerPage);
  const totalPages = Math.ceil(tickets?.length / itemsPerPage);

  function goToPage(event: any, pageNumber: any) {
    setCurrentPage(pageNumber);
  }

  if (data) {
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
          <ul className="p-4 pl-0 text-center text-white flex justify-between gap-5">
            <li className="p-4 pt-2   bg-gray-300 w-full rounded">
              <header className="text-left flex justify-between items-center text-green-300 mb-2">
                <span className="text-sm font-semibold ">Valor arrecadado</span>
                <CurrencyDollar weight="bold" size={20} />
              </header>
              <strong className="text-4xl">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(incomeBalance.valorTotal)}
              </strong>
            </li>
            <li className="p-4 pt-2   bg-gray-300 w-full rounded">
              <header className="text-left flex justify-between items-center text-amber-600 mb-2">
                <span className="text-sm font-semibold">Total</span>
                <Ticket weight="bold" size={20} />
              </header>
              <strong className="text-4xl ">{incomeBalance.total}</strong>
            </li>
            <li className="p-4 pt-2   bg-gray-300 w-full rounded">
              <header className="text-left flex justify-between items-center text-blue-500 mb-2 ">
                <span className="text-sm font-semibold">Verificados</span>
                <Checks weight="bold" size={22} />
              </header>
              <strong className="text-4xl">
                {incomeBalance.verifiedTickets}
              </strong>
            </li>
            <li className="p-4 pt-2   bg-gray-300 w-full rounded">
              <header className="text-left flex justify-between items-center text-red-500 mb-2">
                <span className="text-sm font-semibold">Não verificados</span>
                <XCircle weight="bold" size={20} />
              </header>
              <strong className="text-4xl">
                {incomeBalance.noTicketsChecked}
              </strong>
            </li>
          </ul>
          <header className="p-4 pl-0 flex justify-between">
            <button
              className="
            flex
            gap-2
            items-center
            text-fuchsia-500 opacity-75 py-1 px-4 
            font-semibold
            rounded text-white hover:opacity-95"
              onClick={() => {
                pdfTicketLote();
              }}
            >
              <DownloadSimple size={20} /> Baixar ingressos
            </button>
            <Dialog>
              <DialogTrigger className="bg-green-400 opacity-75 py-1 px-4 rounded font-font-medium  text-white hover:opacity-95">
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
          <div className=" pr-5 mb-5">
            <table className="table-auto w-full text-center ">
              <thead>
                <tr className="bg-gray-400 text-white ">
                  <th className="p-2 rounded-ss-md">Data</th>
                  <th className="p-2 ">Valor</th>
                  <th className="p-2 ">Tipo</th>
                  <th className="p-2 "></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginatedData?.map((ticket: ticketProps, index: any) => {
                  console.log(ticket.id);
                  // format date
                  let dataString = ticket.date;
                  const data = new Date(dataString);
                  const dataUTC = data.toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  });

                  return (
                    <tr
                      key={ticket.id}
                      className="bg-gray-300 text-white border-b-2 border-gray-400 cursor-pointer hover:opacity-75"
                    >
                      <td className="p-2">{dataUTC}</td>
                      <td className="p-2">{ticket.amount}</td>
                      <td className="p-2">{ticket.type}</td>
                      <td
                        className="p-2"
                        onClick={() => {
                          geradorQRCODE(ticket.id);
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
                              <div
                                className="bg-gradient-to-b from-blue-500 to-purple-500 flex gap-2 justify-center justify-between items-center"
                                style={{
                                  width: "700px",
                                  height: "200px",
                                  margin: "20px auto 20px auto",
                                  padding: "20px 40px",
                                  borderRadius: "10px",
                                }}
                              >
                                <div className="flex flex-col gap-2">
                                  <h1 className="font-bold text-xl">
                                    {dataEvent?.name}
                                  </h1>
                                  <span>
                                    <strong>Data:</strong>{" "}
                                    {dateEvent.toLocaleDateString("pt-BR", {
                                      timeZone: "UTC",
                                    })}
                                  </span>
                                  <span>
                                    <strong>Valor:</strong> {ticket.amount}
                                  </span>
                                  <span>
                                    <strong>Tipo:</strong> {ticket.type}
                                  </span>
                                </div>
                                <div>
                                  <div>
                                    <img
                                      className="w-32"
                                      src={ImageQrCode}
                                      alt=""
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="w-full flex justify-center cursor-pointer">
                                <a
                                  className="mt-4 p-2 text-fuchsia-500 opacity-75 py-1 px-4 
                                  font-semibold
                                  rounded text-white hover:opacity-95 flex items-center gap-2"
                                  onClick={() => {
                                    pdfTicketItem(ticket.id);
                                  }}
                                >
                                  <DownloadSimple size={20} /> Baixar ingresso
                                </a>
                              </div>
                            </DialogContent>
                          </DialogPortal>
                        </Dialog>
                      </td>
                      <td>
                        {ticket.checked ? (
                          <Checks className="text-blue-500 " size={24} />
                        ) : (
                          <XCircle className="text-red-500" size={24} />
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
          <div className="w-full flex justify-center">
            <ThemeProvider theme={darkTheme}>
              <Pagination
                className=" mb-3 text-white"
                count={totalPages}
                onChange={goToPage}
                variant="text"
                shape="rounded"
                style={{ color: "red" }}
              />
            </ThemeProvider>
          </div>

          {activeModal === true ? (
            <div className=" position absolut z-40 fixed inset-0 bg-black bg-opacity-50">
              <div className="flex justify-center flex-col items-center p-20 text-2xl text-white bg-gray-400 z-20   fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md  shadow-green-50">
                <CircularProgress size={60} color="success" />
                <h1 className="mt-5">Gerando Pdf...</h1>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </section>
    );
  }
}

//export const getStaticPaths: GetStaticPaths = async () => {
//  return {
//    paths: [{ params: { id: "UuFKnMBdN84meKjwK6Er" } }],
//    fallback: true,
//  };
//};

export const getServerSideProps: GetServerSideProps = async () => {
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
