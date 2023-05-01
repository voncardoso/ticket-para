import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase, push, ref, set } from "firebase/database";
import initAuth from "../../utils/initAuth";
import { database, app } from "../../services/firebase";
initAuth();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { descricaoEvento, nomeEvento, quantidadeIngressos } = req.body;
  const data = {
    descricaoEvento: descricaoEvento,
    nomeEvento: nomeEvento,
    quantidadeIngressos: quantidadeIngressos,
  };
  try {
    const db = getDatabase(app);
    const refTabela = push(ref(db, "eventos"), data);
    console.log(refTabela);
    return res.status(200).send("Usuário cadastrado com sucesso");
  } catch (error) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
}
