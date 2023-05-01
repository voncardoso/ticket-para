import Image from "next/image";
import background from "../assets/backgroundLogin.jpg";
import logo from "../assets/logo.png";
import Link from "next/link";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { api } from "@/lib/api";
import { useState } from "react";

type Inputs = {
  email: string;
  password: string;
};

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loadin, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    const { email, password } = data as Inputs;
    setLoading(true);
    try {
      const response = await api.post("api/auth", {
        email: email,
        password: password,
      });
      if (response.status === 200) {
        window.localStorage.setItem(
          "tokenIngressoPara-v1",
          response.data.token
        );
        setLoading(false);
        console.log(response);
      }
    } catch (error) {}
  };
  return (
    <section className="max-md:grid-cols-1 bg-background h-full grid lg:grid-cols-2 justify-between items-center">
      <div className=" w-full max-w-lg mx-auto h-screen flex flex-col justify-between p-94">
        <div></div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" w-full max-w-full  mx-auto grid grid-cols p-4"
        >
          <Image
            className="mx-auto w-52 relative bottom-20"
            src={logo}
            alt="logo do site"
          />
          <h1 className="text-white text-3xl mb-8">Login</h1>
          <label className="text-white text-lg" htmlFor="">
            E-mail
          </label>
          <input
            className="w-full max-w-full w-full p-3 rounded-md mt-1"
            type="email"
            required
            {...register("email")}
          />
          <label className="text-white mt-4 text-lg" htmlFor="">
            Senha
          </label>
          <input
            className="p-3 rounded-md mt-1"
            type="password"
            {...register("password")}
          />

          {loadin ? (
            <button className="text-white text-xl mt-8 bg-green-300 p-3 rounded-md cursor-pointer hover:bg-green-100 transition duration-500">
              Entrando...
            </button>
          ) : (
            <button className="text-white text-xl mt-8 bg-green-300 p-3 rounded-md cursor-pointer hover:bg-green-100 transition duration-500">
              Entrar
            </button>
          )}
        </form>

        <a
          className="texte-center text-white flex justify-center  pb-6 "
          href=""
        >
          Não tem cadastro?
          <p className="ml-1 text-green-300 hover:underline">Cadastre-se</p>
        </a>
      </div>

      <div className="max-md:hidden ">
        <Image
          className=" w-full h-screen "
          src={background}
          alt="logo do site"
        />
      </div>
    </section>
  );
}
