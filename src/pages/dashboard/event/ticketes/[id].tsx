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
export default function TicketsPdf({ data }: EventsProps){
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

      if(data?.length !== 0){
        return(
            <section  className="">
                {data?.map((item: any) =>{
                    let dateEvent = new Date(item?.date);
                    return(
                        <div
                            key={item.hash_id}
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
                            <h1 className="font-bold text-xl">{item?.event}</h1>
                            <span><strong>Data:</strong> {dateEvent.toLocaleDateString("pt-BR", {
                                                            timeZone: "UTC",
                                                            })}</span>
                            <span><strong>Valor:</strong> {item.amount}</span>
                            <span><strong>Tipo:</strong> {item.type}</span>
                          </div>
                          <div>
                           <img className="w-36" src={geradorQRCODE(item?.hash_id)} alt="" />
                          </div>
                        </div>
                    )
                })}
            </section>
        )
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
    console.log("parametro",params)
    const collectionRef = collection(database, "ticket");
    const querySnapshot = await getDocs(collectionRef);
    const tickets = querySnapshot.docs.map((doc) => ({
     ...doc.data(),
     id: doc.id,
    }));

    const data = tickets.filter((item: any) => item.event_id === params?.id
    )
    return {
      props: {
        data,
      },
    };
  };