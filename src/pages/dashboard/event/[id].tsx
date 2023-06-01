import Sidbar from "@/components/sidbar";
import { Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogPortal,
  DialogClose, } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { useRouter } from 'next/router';
import { useForm, useFormState } from "react-hook-form";
import { Download, X } from "@phosphor-icons/react";
import { randomBytes } from 'crypto';
import { addDoc, and, collection, getDocs } from "firebase/firestore";
import { database } from "@/services/firebase";
import { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";
import QRCode from "react-qr-code";
import { increment } from "firebase/database";

interface ticketProps  {

    amount: string, 
    date: string
    event_id: string,
    hash_id: string,
    id: string
    type: string
  
}

interface EventsProps {
  data: []
}

export default function Event({data} : EventsProps) {
  //gerar QRCode
  const [nomeEvento,setNomeEvento] = useState()
  const [dataEvento,setDataEvento] = useState()
  const [horaEvento,setHoraEventoset] = useState() 
  const [descricaoEvento,setdescricaoEvento] = useState() 
  const [valorIngresso,setvalorIngresso] = useState() 
  const [nomeClinete,setNomeCliente] = useState() 
  const [cpfCliente,setcpfCliente] = useState() 
  const [formaPagamento,setFormaPagamento] = useState() 

  //Salvar QRCode
  const ImprimirIgresso = () => {
    const svg = document.getElementById("QRCode");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      
      //Nome Da imagem
      downloadLink.download = `${"Ingresso"}`;
      //downloadLink.download = `${"ingresso"}`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    }
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
    
    //const db = getDatabase(app);
    event.preventDefault()
    addDoc(collection(database, "ingressos"), {
      nome_evento: nomeEvento,
      data_evento: dataEvento,
      horaEvento: horaEvento,
      descricaoEvento: descricaoEvento,
      valorIngresso: valorIngresso,
      nomeClinete: nomeClinete,
      cpfCliente : cpfCliente,
      formaPagamento : formaPagamento,
      QRCode : img.src
    });
  }

  const router = useRouter();
  const { id } = router.query;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const tickets = data?.filter((item: any) => item.event_id === id)

  console.log("ticket",tickets)
  // function para gerar hash
  function createSHA256Hash() {
    const randomBytesLength = 16; // Comprimento em bytes do hash desejado
    const randomBytesBuffer = randomBytes(randomBytesLength);
    const randomHash = randomBytesBuffer.toString('hex');
    return randomHash;
  }



  async function handleCreateTicket(data: any){
    const tickt = {
      amount: data.amount,
      type: data.type,
      date: new Date().toISOString(),
      event_id: id,
      hash_id: createSHA256Hash()
    }
    const response = await addDoc(collection(database, "ticket"), tickt);
    
    if(response){
      window.alert("Ingresso cadastrado com sucesso")
      reset()
    }
  }
  return (
    <section className="flex bg-background h-screen gap-5">
      <div>
        <form onSubmit={ImprimirIgresso} >
          <input type="text" placeholder="Nome do Evento" onChange={(e) =>setNomeEvento(e.target.value)}></input><br></br>
          <input type="text" placeholder="Data do Evento" onChange={(e) =>setDataEvento(e.target.value)}></input><br></br>
          <input type="text" placeholder="Hora do evento" onChange={(e) =>setHoraEventoset(e.target.value)}></input><br></br>
          <input type="text" placeholder="Descrição do evento" onChange={(e) =>setdescricaoEvento(e.target.value)}></input><br></br>
          <input type="text" placeholder="Valor do Ingresso" onChange={(e) =>setvalorIngresso(e.target.value)}></input><br></br>
          <input type="text" placeholder="Nome do cliente" onChange={(e) =>setNomeCliente(e.target.value)}></input><br></br>
          <input type="text" placeholder="CPF do cliente" onChange={(e) =>setcpfCliente(e.target.value)}></input><br></br>
          <input type="text" placeholder="Forma de Pagamento" onChange={(e) =>setFormaPagamento(e.target.value)}></input><br></br>
          <button type ="submit">Cadastrar</button>
        </form>
      </div>
      
       
      <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
          <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value = {nomeEvento + dataEvento + horaEvento + descricaoEvento + valorIngresso + nomeClinete + cpfCliente + formaPagamento}
          //value2={inputValue2}
          viewBox={`0 0 256 256`}
          id="QRCode"
          ></QRCode>
      </div>

      

      <Sidbar />
      <div className="w-full h-screen overflow-y-auto">
        <header>
          <h1 className="p-2 text-2xl text-white">Nome do Evento | Data do evento</h1>
        </header>
        <div className="p-4 text-center text-white">Grafico de ingressos</div>
        <header className="p-4 flex justify-end">
          <Dialog>
            <DialogTrigger className="bg-green-400 opacity-75 py-1 px-4 rounded font-font-medium rounded-sm text-white hover:opacity-95">
              Cadastrar Ingresso
            </DialogTrigger>
            <DialogPortal>
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
                    <h1 className="text-xl text font-bold">Cadastrar Ingresso</h1>
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
                      Valor
                      <input
                        className="p-2 roudend rounded-md mt-1 text-black"
                        type="text"
                        {...register("amount")}
                      />
                    </label>

                    <label className="flex flex-col w-full  " htmlFor="">
                      Tipo
                      <input
                        className="p-2 roudend rounded-md mt-1 text-black"
                        type="text"
                        {...register("type")}
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
        <div className=" pr-5">
          <table className="table-auto w-full text-center ">
            <thead>
              <tr className="bg-gray-400 text-white">
                <th className="p-2 rounded-ss-md">Nº</th>
                <th className="p-2 ">Data</th>
                <th className="p-2 ">Valor</th>
                <th className="p-2 ">Tipo</th>
                <th className="p-2 "></th>
              </tr>
            </thead>
            <tbody>
              {tickets?.map((ticket: ticketProps, index ) =>{
                // format date
                 let dataString = ticket.date;
                 const data = new Date(dataString);
                 const dataUTC = data.toLocaleDateString("pt-BR", {
                   timeZone: "UTC",
                 });
                return(
                  <tr key={ticket.hash_id}  className="bg-gray-300 text-white border-b-2 border-gray-400 cursor-pointer hover:opacity-75">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{dataUTC}</td>
                    <td className="p-2">{ticket.amount}</td>
                    <td className="p-2">{ticket.type}</td>
                    <td className="p-2"></td>
                  </tr>
                )
              })}
      
              <tr className=" bg-gray-400  border-b-2 border-gray-400 ">
                <td
                  colSpan={5}
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

export const getStaticPaths: GetStaticPaths = async () =>{
  return {
    paths: [
      {params: {id: "UuFKnMBdN84meKjwK6Er"}}
    ],
    fallback: true
  }
}


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
