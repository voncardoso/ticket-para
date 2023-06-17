import { useForm } from "react-hook-form";
import logo from "../../../assets/logo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function LoginMobile() {
  const router = useRouter();
  const [loadin, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <section className="bg-background h-screen flex justify-between items-center">
      <form action="" className=" w-80  max-w-full  mx-auto grid grid-cols p-4">
        <Image
          className="mx-auto w-32 relative bottom-15"
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
          E-mail
        </label>
        <input
          className="w-full max-w-full w-full p-3 rounded-md mt-1"
          type="email"
          id="email"
          required
          {...register("email")}
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
