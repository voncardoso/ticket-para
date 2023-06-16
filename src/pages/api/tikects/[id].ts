import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  console.log("aqui", id);
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();

  // Acesse a URL que você deseja converter em PDF
  await page.goto("http://localhost:3000");

  // Localize os campos de login e senha e preencha com as informações corretas
  await page.waitForSelector("#email", { timeout: 60000 });
  await page.type("#email", "teste@teste.com");
  await page.type("#password", "123456");

  // Envie o formulário de login
  await page.click('button[type="submit"]');

  // Aguarde o redirecionamento após o login (opcional)

  await page.waitForNavigation();

  // Gere o PDF
  await page.goto(
    `http://localhost:3000/dashboard/event/ticketes/${id}`
  );

  await page.waitForSelector("#tickte", { timeout: 60000 });

  const pdf = await page.pdf({ format: "A4", printBackground: true });

  // Encerre o navegador
  await browser.close();

  // Envie o PDF como resposta
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="example.pdf"');
  res.send(pdf);
}
