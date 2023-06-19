import { database } from "@/services/firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function LeitorQrCode() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState("");
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

  async function updateQrCode(idticket: any) {
    let repleceQr = dataWrithQr;
    console.log("teste", idticket?.replace(/"/g, ""));
    try {
      const washingtonRef = doc(database, "ticket", idticket.replace(/"/g, ""));
      const response = await updateDoc(washingtonRef, {
        checked: true,
      });
      window.alert("Ingresso Verificado com sucesso");
      window.location.reload();
    } catch (error) {}
  }

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 400,
          height: 400,
        },
        fps: 5,
      },
      true
    );

    scanner.render(success, error);

    function success(result: any) {
      scanner.clear();
      updateQrCode(result);
      setScanResult(result);
    }

    function error(err: any) {
      console.warn(err);
    }
  }, []);

  return (
    <div className="Scanner">
      {scanResult ? (
        <div>
          Dados do QR Code: <span>{scanResult}</span>
        </div>
      ) : (
        <div id="reader"></div>
      )}
    </div>
  );
}
