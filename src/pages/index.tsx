import Image from "next/image";
import background from "../assets/backgroundLogin.jpg";
import logo from "../assets/logo.png";
import Link from "next/link";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { api } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const [loadin, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    const { email, password } = data as Inputs;
    setLoading(true);
    console.log("teste");
    try {
      const response = await api.post("api/auth", {
        email: email,
        password: password,
      });
      console.log(response);
      if (response.status === 200) {
        window.localStorage.setItem(
          "tokenIngressoPara-v1",
          response.data.token
        );
        setLoading(false);
        setError(false);
        router.push("/dashboard");
      }
    } catch (error) {
      setLoading(false);
      setError(true);
    }
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

        <Link
          className="texte-center text-white flex justify-center  pb-6 "
          href="/register"
        >
          Não tem cadastro?
          <p className="ml-1 text-green-300 hover:underline">Cadastre-se</p>
        </Link>
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
