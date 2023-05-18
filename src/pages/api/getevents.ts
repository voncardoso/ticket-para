import { database } from "@/services/firebase";
import {
    collection,
    onSnapshot,
    addDoc,
    doc,
    getDocs,
  } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res:  NextApiResponse) {
    if (req.method === 'GET') {
      try {
        const collectionRef = collection(database, "event");
        const querySnapshot = await getDocs(collectionRef);
        const events = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        res.status(200).json(events);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar dados do Firebase.' });
      }
    } else {
      res.status(405).json({ message: 'Método não permitido.' });
    }
  }