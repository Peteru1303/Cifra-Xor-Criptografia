import express, { Request, Response } from "express";
import { text } from "node:stream/consumers";

const dns = require('dns'); //resposta do stack overflow para um erro de conexão que tinha no postman

// Set default result order for DNS resolution
dns.setDefaultResultOrder('ipv4first');

const app = express();
const PORT = process.env.PORT ?? 3000;
app.use(express.json());



// Funcao para criptografar
function criptografar(req: Request, res: Response): void {

    let mensagem: any = req.body.textoClaro;
    let chave: any = req.body.chave;
    let resultado: any = [];
    let calculo: number;
    let textoCifrado: any = [];

    let i: number;

    if (chave.length == 0) {
        res.status(400).json({Message: "Erro: chave vazia!"});
    }

    for (i = 0; i < mensagem.length; i++) {
        resultado[i] = mensagem.codePointAt(i) ^ chave.codePointAt(i % chave.length) //condicional XoR
        console.log(resultado[i])
        calculo = resultado[i] //auxiliar com tipo number
        resultado[i] = calculo.toString(2) //transforma em binario
        let zero: any = '0';
        while (resultado [i].length < 8) //adiciona padding para ser sempre 8 binarios
        {
            resultado[i] = zero + resultado[i];
        }
        console.log(parseInt(resultado[i], 2)) //verifica como fica no decimal denovo
        console.log(resultado[i])
        textoCifrado = textoCifrado + (resultado[i]); //concatena o resultado da iteração atual ao resultado final
        console.log(textoCifrado)
    }
    
    res.status(200).json(textoCifrado)
}


// Funcao para descriptografar
function descriptografar(req: Request, res: Response): void {

    let resultado: any = [];
    let chave: any = req.body.chave;
    let textoDec: any = req.body.textoCifrado;
    let textoClaro: any = []
    let byte: any = [] 
    let auxiliar: any = []

    let tamanho: number = 0;
    let tamanhoChave: number;
    let i: number;

    tamanhoChave = chave.length;
    tamanho = textoDec.length;

    if (tamanhoChave == 0) {
        res.status(400).json({Message: "Erro: chave vazia!"});
        return;
    }

    byte = textoDec.substring()
    for (i = 0; i < (tamanho/8); i++) {
        byte = textoDec.substring(i*8, (i+1)*8)
        auxiliar = parseInt(byte, 2)
        console.log(auxiliar) //console log do binario transformado de binario em decimal
        resultado[i] = auxiliar ^ chave.codePointAt(i % chave.length)
        console.log(resultado[i]) //console log do resultado do Xor
        console.log(parseInt(chave.codePointAt(i))) //valor decimal da chave
        textoClaro = textoClaro + (String.fromCharCode(resultado[i])); //transforma de unicode para string, não pode aplicar na resposta ou merge tudo.
    }

    res.status(200).json(textoClaro)
}

app.post('/cifrar', criptografar);
app.post('/decifrar', descriptografar);


app.listen(PORT, () => console.log(`API rodando na URL : http://localhost:${PORT}`));