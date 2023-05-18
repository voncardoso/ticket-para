import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { useState } from "react";
import backgroundLogin from "../assets/backgroundLogin.jpg";
import logo from "../assets/logo.png";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { database } from "@/services/firebase";

type Inputs = {
  email: string;
  password: string;
  name: string;
};

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [loadin, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleCreateUser(data: FieldValues) {
    const date = new Date();
    const response = await addDoc(collection(database, "user"), {
      email: data.email,
      uid: data.uid,
      created_at: String(date),
    });
    console.log("response", response)
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    const { email, password } = data as Inputs;
    setLoading(true);
    try {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          if(user){
            handleCreateUser(user)
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
      setLoading(false);
      setError(false);
      window.alert("Usuário cdastrado com sucesso!!");
      router.push("/");
    } catch (error) {
      setError(true);
      setLoading(false);
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
          <h1 className="text-white text-3xl mb-8">Cadastre-se</h1>

          {error ? (
            <div className="border-2 p-2 text-center mb-4 rounded-md border-red-600 text-red-600 ">
              <p>E-mail invalido</p>
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
              Cadastrando...
            </button>
          ) : (
            <button className="text-white text-xl mt-8 bg-green-300 p-3 rounded-md cursor-pointer hover:bg-green-100 transition duration-500">
              Cadastrar
            </button>
          )}
        </form>

        <Link
          className="texte-center text-white flex justify-center  pb-6 "
          href="/"
        >
          Volta para o
          <p className="ml-1 text-green-300 hover:underline">Login</p>
        </Link>
      </div>
      <div className="max-md:hidden ">
        <Image
          className=" w-full h-screen "
          src={backgroundLogin}
          alt="logo do site"
        />
      </div>
    </section>
  );
}
