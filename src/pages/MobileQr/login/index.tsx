import { useForm } from "react-hook-form";
import logo from "../../../assets/logo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { database } from "@/services/firebase";

export default function LoginMobile() {
  const router = useRouter();
  const [loadin, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function handleLoginUser(user: any) {
    const collectionRef = collection(database, "UserEvent");
    const querySnapshot = await getDocs(collectionRef);
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const userTrue = data.filter(
      (item: any) =>
        item.nameuser === user.nameuser && item.password === user.password
    ) as any;
    console.log(userTrue.id);
    if (userTrue.length === 1) {
      router.push(`/MobileQr/leitorqrcode/${userTrue[0].id}`);
    } else {
      console.log("usuario usuario inexistente", userTrue);
    }
  }

  return (
    <section className="bg-background h-screen flex items-center">
      <form
        action=""
        className=" w-80  max-w-full  mx-auto grid grid-cols p-4"
        onSubmit={handleSubmit(handleLoginUser)}
      >
        <Image
          className="mx-auto w-32 relative bottom-14"
          src={logo}
          alt="logo do site"
        />
        <h1 className="text-white text-3xl mb-8">Login</h1>
        {error ? (
          <div className="border-2 p-2 text-center mb-4 rounded-md border-red-600 text-red-600 ">
            <p>E-mail ou senha invalido!</p>
          </div>
        ) : (
          ""
        )}
        <label className="text-white text-lg" htmlFor="">
          Usuario
        </label>
        <input
          className="w-full max-w-full w-full p-3 rounded-md mt-1"
          type="text"
          id="email"
          required
          {...register("nameuser")}
        />
        <label className="text-white mt-4 text-lg" htmlFor="">
          Senha
        </label>
        <input
          className="p-3 rounded-md mt-1"
          type="password"
          id="password"
          {...register("password")}
        />
        {loadin ? (
          <button className="text-white text-xl mt-8 bg-green-300 p-3 rounded-md cursor-pointer hover:bg-green-100 transition duration-500">
            Entrando...
          </button>
        ) : (
          <button
            type="submit"
            className="text-white text-xl mt-8 bg-green-300 p-3 rounded-md cursor-pointer hover:bg-green-100 transition duration-500"
          >
            Entrar
          </button>
        )}
      </form>
    </section>
  );
}
