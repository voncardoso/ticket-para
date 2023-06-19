declare module "instascan" {
  export class Scanner {
    constructor(opts: any);
    addListener(event: string, callback: (content: string) => void): void;
    start(camera: any): void;
    stop(): void;
    // Outras definições de métodos e propriedades conforme necessário
  }
}
