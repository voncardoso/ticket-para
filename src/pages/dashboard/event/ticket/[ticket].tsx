import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "@/services/firebase";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";

interface EventsProps {
  data: {
    date: string;
    amount: string;
    type: string;
  };
}

export default function TicketPdf({ data }: EventsProps) {
  console.log(data);
  if (data?.amount) {
    return (
      <section id="tickte">
        <div
          className="bg-gradient-to-b from-blue-500 to-purple-500"
          style={{
            width: "700px",
            height: "200px",
            margin: "20px auto 20px auto",
            padding: "50px",
            borderRadius: "10px",
          }}
        >
          <h1>Evento 30</h1>
          <strong>Data: {data?.date}</strong>
          <strong>Valor: {data?.amount}</strong>
          <strong>Tipo: {data?.type}</strong>
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
