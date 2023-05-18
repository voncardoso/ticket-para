import type { AppProps } from "next/app";
import "../services/firebase";
import "@/styles/globals.css";
import { UserStorageLogin } from "@/Context/useContextLogin";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserStorageLogin>
      <Component {...pageProps} />
    </UserStorageLogin>
  );
}
