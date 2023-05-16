import Sidbar from "@/components/sidbar";

export default function Event() {
  return (
    <section className="flex bg-background h-screen gap-5">
      <Sidbar />
      <div className="w-full">
        <div className="p-4 text-center text-white">Grafico de ingressos</div>
        <div>
          <header>
            <button>Cadastrar ingresso</button>
          </header>
          <table>
            <thead>
              <tr>
                <th>Nº</th>
                <th>Evento</th>
                <th>Ingresso</th>
                <th>Valor</th>
                <th>tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
