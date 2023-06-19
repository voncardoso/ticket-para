import { database } from "@/services/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { GetStaticPaths, GetStaticProps } from "next";
import { useEffect, useState } from "react";
import QRCodeLink from "qrcode";

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
export default function TicketsPdf({ data }: EventsProps) {
  function geradorQRCODE(tikect: string) {
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
    return imgQrCode;
  }

  // função para mostrar o array em lista de 4 items
  function splitForArrayForFour() {
    var resultado = [];
    var grupo = 0;

    if (data) {
      for (var i = 0; i < data.length; i++) {
        if (resultado[grupo] === undefined) {
          resultado[grupo] = [];
        }

        resultado[grupo].push(data[i]);

        if ((i + 1) % 5 === 0) {
          grupo = grupo + 1;
        }
      }
    }

    return resultado;
  }

  if (data?.length !== 0) {
    return (
      <>
        {splitForArrayForFour()?.map((item) => {
          console.log("item", item);
          return (
            <section style={{ height: "1105px" }} key={1} className="">
              {item?.map((ticket: any) => {
                let dateEvent = new Date(ticket?.date);
                return (
                  <div
                    key={ticket.hash_id}
                    id="tickte"
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
                      <h1 className="font-bold text-xl">{ticket?.event}</h1>
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
                      <img
                        className="w-36"
                        src={geradorQRCODE(ticket?.id)}
                        alt=""
                      />
                    </div>
                  </div>
                );
              })}
            </section>
          );
        })}
      </>
    );
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: "UuFKnMBdN84meKjwK6Er" } }],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  console.log("parametro", params);
  const collectionRef = collection(database, "ticket");
  const querySnapshot = await getDocs(collectionRef);
  const tickets = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  const data = tickets.filter((item: any) => item.event_id === params?.id);
  return {
    props: {
      data,
    },
  };
};
