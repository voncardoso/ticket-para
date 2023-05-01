// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const token = await user.getIdToken();
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
}
