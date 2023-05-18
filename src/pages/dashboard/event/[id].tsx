import Sidbar from "@/components/sidbar";
import { Dialog, DialogPortal, DialogTrigger } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
export default function Event() {
  return (
    <section className="flex bg-background h-screen gap-5">
      <Sidbar />
      <div className="w-full">
        <div className="p-4 text-center text-white">Grafico de ingressos</div>
        <header className="p-4 flex justify-end">
          <Dialog>
            <DialogTrigger className="bg-green-400 opacity-75 py-1 px-4 rounded font-font-medium rounded-sm text-white hover:opacity-95">
              Cadastrar Ingresso
            </DialogTrigger>
            <DialogPortal>
              <motion.div
                className="modal "
                initial={{ opacity: 0, y: 0, x: 0 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{
                  ease: "linear",
                  duration: 0.5,
                  x: { duration: 0.5 },
                }}
              ></motion.div>
            </DialogPortal>
          </Dialog>
        </header>
        <div className=" pr-5">
          <table className="table-auto w-full text-center ">
            <thead>
              <tr className="bg-gray-400 text-white">
                <th className="p-2 rounded-ss-md">Nº</th>
                <th className="p-2 ">Data</th>
                <th className="p-2 ">Valor</th>
                <th className="p-2 ">tipo</th>
                <th className="p-2 "></th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-300 text-white border-b-2 border-gray-400 cursor-pointer hover:opacity-75">
                <td className="p-2">1</td>
                <td className="p-2">2</td>
                <td className="p-2">3</td>
                <td className="p-2">4</td>
                <td className="p-2"></td>
              </tr>
              <tr className="bg-gray-300 text-white border-b-2 border-gray-400 cursor-pointer hover:opacity-75">
                <td className="p-2">1</td>
                <td className="p-2">2</td>
                <td className="p-2">3</td>
                <td className="p-2">4</td>
                <td className="p-2"></td>
              </tr>
              <tr className="bg-gray-300 text-white border-b-2 border-gray-400 cursor-pointer hover:opacity-75">
                <td className="p-2">1</td>
                <td className="p-2">2</td>
                <td className="p-2">3</td>
                <td className="p-2">4</td>
                <td className="p-2"></td>
              </tr>

              <tr className=" bg-gray-400  border-b-2 border-gray-400 ">
                <td
                  colSpan={5}
                  className="p-2 rounded-ee-md rounded-es-md"
                ></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
