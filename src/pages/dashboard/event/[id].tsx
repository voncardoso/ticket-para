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
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
