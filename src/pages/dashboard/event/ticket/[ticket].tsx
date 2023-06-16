import { doc, getDoc} from "firebase/firestore";
import { database } from "@/services/firebase";
import { GetStaticPaths, GetStaticProps } from "next";
import { useEffect, useState } from "react";
import QRCodeLink from "qrcode";
interface EventsProps {
  data: {
    date: string;
    amount: string;
    type: string;
    event: string;
    hash_id: string;
  };
}

export default function TicketPdf({ data }: EventsProps) {
  const [ImageQrCode, setImageQrCode] = useState("");
  const dateEvent = new Date(data?.date);
  

  
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

    console.log(imgQrCode)
    setImageQrCode(imgQrCode);
  }
  useEffect(() =>{
  function getQrCode(){
    if(data?.hash_id){
      geradorQRCODE(data?.hash_id)
    }
  }
  getQrCode()
  }, [data])

  
  if (data?.amount) {
    return (
      <section id="tickte" className="flex">
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
            <h1 className="font-bold text-xl">{data?.event}</h1>
            <span><strong>Data:</strong> {dateEvent.toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })}</span>
            <span><strong>Valor:</strong> {data?.amount}</span>
            <span><strong>Tipo:</strong> {data?.type}</span>
          </div>
          <div>
            <img className="w-36" src={ImageQrCode} alt="" />
          </div>
        </div>
      </section>
    );
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { ticket: "IABktSBvoW4X1XY2QZDg" } }],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  console.log(params);
  const docRef = doc(database, "ticket", `${params?.ticket}`);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  const serializedData = data === undefined ? null : data;
  console.log("aqui", serializedData);
  return {
    props: {
      data: serializedData,
    },
  };
};
