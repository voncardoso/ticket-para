import { database } from "@/services/firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";

export default function LeitorQrCode() {
  const router = useRouter();
  const [dataWrithQr, setDataWrithQr] = useState<any>([]);
  const { id } = router.query;
  const [users, setUsers] = useState<any>([]);
  const [tickets, setTickets] = useState<any>([]);
  useEffect(() => {
    async function getUser() {
      const collectionRef = collection(database, "UserEvent");
      const querySnapshot = await getDocs(collectionRef);
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as any;
      const user = data.filter((item: any) => item.id === id);
      setUsers(user);
    }
    getUser();
  }, [id]);

  useEffect(() => {
    async function getUser() {
      const collectionRef = collection(database, "ticket");
      const querySnapshot = await getDocs(collectionRef);
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as any;
      const ticket = data.filter(
        (item: any) => item.event_id === users[0]?.event_id
      );

      setTickets(ticket);
    }
    getUser();
  }, [users]);

  async function updateQrCode(idticket: string) {
    let repleceQr = dataWrithQr;
    console.log("teste", idticket?.replace(/"/g, ""));
    try {
      const washingtonRef = doc(database, "ticket", idticket.replace(/"/g, ""));
      const response = await updateDoc(washingtonRef, {
        checked: true,
      });
      window.alert("Ingresso Verificado com sucesso");
    } catch (error) {}
  }

  return (
    <div className="h-screen">
      <QrReader
        style={{ width: "500px" }}
        onResult={(result: any, error) => {
          if (!!result) {
            setDataWrithQr(result?.text);
            updateQrCode(result?.text);
          }

          if (!!error) {
            //console.info(error);
          }
        }}
      />
      <div>teste {dataWrithQr}</div>
    </div>
  );
}
