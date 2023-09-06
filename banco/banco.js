const prompt=require("prompt-sync")({sigint:true});

class Utils {
    static configLanguage = "PT-BR";
    static configTime = {
        hour: "2-digit",
        minute: "2-digit"
    };

    static getFormatDate() {
        let date = new Date();
        return date.toLocaleDateString(this.configLanguage, this.configTime);
    }
}

class Conta {
    constructor(nome, numero, saldo) {
        this.nome = nome;
        this.numero = numero;
        this.saldo = saldo;
        this.extrato = [];
    }

    get exibirExtrato() {
        console.log(' ------ Extrato da conta ------ ');

        this.extrato.forEach(item => {
            console.log(item);
        });

        console.log(' ------ Fim do extrato ------ ');
    }

    registrarNoExtrato(item) {
        const dataFormatada = Utils.getFormatDate();
        const registro = `${dataFormatada} - ${item}`;
        this.extrato.push(registro);
    }
}

class ContaPoupanca extends Conta {
    #taxaDeSaque = 0.10;

    saque(valor) {
        if (valor <= 0) {
            throw new Error('O valor do saque deve ser maior que zero.');
        }
        if (valor > this.saldo) {
            throw new Error('Saldo insuficiente para o saque.');
        }

        let taxaDeSaqueDoValor = valor * this.#taxaDeSaque;
        let valorDeSaqueComATaxa = valor + taxaDeSaqueDoValor;

        this.saldo = this.saldo - valorDeSaqueComATaxa;
        this.registrarNoExtrato(`Saque de: R$ ${valor.toFixed(2)} - Saldo: R$ ${this.saldo.toFixed(2)}`);
        console.log(`O saldo atual após o saque é de: R$ ${this.saldo.toFixed(2)}`);
    }

    deposito(valor) {
        if (valor <= 0) {
            throw new Error('O valor do depósito deve ser maior que zero.');
        }

        this.saldo = this.saldo + valor;
        this.registrarNoExtrato(`Depósito de: R$ ${valor.toFixed(2)} - Saldo: R$ ${this.saldo.toFixed(2)}`);
        console.log(`\nO saldo atual após o depósito é de: R$ ${this.saldo.toFixed(2)}`);
        return this.extrato[0]
    }
}

const contas = [];

function criarContaPoupanca() {
    const nome = prompt('Digite o nome do titular da conta:');
    const numero = parseInt(prompt('Digite o número da conta:'));
    const saldoInicial = parseFloat(prompt('Digite o saldo inicial da conta:'));

    const novaContaPoupanca = new ContaPoupanca(nome, numero, saldoInicial);
    contas.push(novaContaPoupanca);
    console.log('\nConta criada com sucesso!');
}

function excluirConta() {
    const numeroConta = parseInt(prompt('Digite o número da conta a ser excluída:'));

    const index = contas.findIndex(conta => conta.numero === numeroConta);

    if (index !== -1) {
        contas.splice(index, 1);
        console.log('Conta excluída com sucesso!');
    } else {
        console.log('Conta não encontrada.');
    }
}

function verificaConta(){
    console.log('-----IDENTIFICACAO DE USUARIO-----\n')
    const numConta = parseInt(prompt('Informe o numero da Conta:'))
    const index = contas.findIndex(conta=> conta.numero === numConta)
    if(index !== -1){
        const contaPessoa = new ContaPoupanca(
             contas[index].nome, contas[index].numero,
             contas[index].saldo
             )
             const dados = [contaPessoa,numConta]
            return dados
    }else{
        console.log('\nConta nao encontrada!!!')
        console.log('\nRefaca a transacao ou cadatre um novo usuario!!!')
        return false
    }
}

function getSaque() {
    const check = verificaConta()
    if(check !== false){
        const index = contas.findIndex(conta=> conta.numero === check[1])
        const valorSaque = parseInt(prompt("Valor do saque:"));
        contas[index].saldo-=valorSaque
        check[0].saque(valorSaque)
        

    }else{
        return null
    }

}

function getDeposito() {
    const check = verificaConta()
    if(check !== false){
        const index = contas.findIndex(conta=> conta.numero === check[1])
        const valorDeposito = parseInt(prompt("Valor do deposito:"));
        contas[index].saldo+=valorDeposito
        check[0].deposito(valorDeposito)


    }else{
        return null
    }
}

function getSaldo() {
    const check = verificaConta()
    if(check !== false){
        const index = contas.findIndex(conta=> conta.numero === check[1])
        console.log(`\nSaldo total: ${contas[index].saldo}`)

    }else{
        return null
    }
}

function getExtrato() {
    const check = verificaConta()
    if(check !== false){
        check[0].exibirExtrato
    }else{
        return null
    }
}

function getTranferencia() {
    const check = verificaConta()
    if(check !== false){
        const indexE = contas.findIndex(conta=> conta.numero === check[1]);
        const valorDeposito = parseInt(prompt("Informe o valor:"));
        console.log('\n----IDENTIFICACAO REMETENTE-------\n')
        const checkTranferencia = verificaConta()
        if(checkTranferencia !== false){
            const indexR = contas.findIndex(conta=> conta.numero === checkTranferencia[1])
            contas[indexE].saldo-=valorDeposito //retira do saldo emissor
            contas[indexR].saldo+=valorDeposito //adiciona no saldo remetente
        }
    }
}

function mostrarMenu() {
    console.log('\n--- Menu ---');
    console.log('1. Criar Conta Poupança');
    console.log('2. Excluir Conta');
    console.log('3. Realizar Saque');
    console.log('4. Realizar Depósito');
    console.log('5. Verificar Saldo');
    console.log('6. Exibir Extrato');
    console.log('7. Tranferencia');
    console.log('8. Sair do Programa');
}

let continuar = true;

while (continuar) {
    mostrarMenu();
    const escolha = parseInt(prompt('Escolha uma opção (1-8):'));

    switch (escolha) {
        case 1:
            criarContaPoupanca();
            break;
        case 2:
            excluirConta();
            break;
        case 3:
            // Realizar saque
            getSaque();
            break;
        case 4:
            // Realizar depósito
            getDeposito();
            break;
        case 5:
            // Verificar saldo
            getSaldo();
            break;
        case 6:
            // Exibir extrato
            getExtrato();
            break;
        case 7:
            // Realizar transferencia
            getTranferencia();
            break;
        case 8:
            continuar = false;
            console.log('Programa encerrado.');
            break;
        default:
            console.log('Opção inválida.');
    }
}
