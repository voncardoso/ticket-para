import type { NextApiRequest, NextApiResponse } from "next";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import initAuth from "../../utils/initAuth";
initAuth();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    const auth = getAuth();
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(user);
    return res.status(200).send("Usuário cadastrado com sucesso");
  } catch (error) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
}
