class Pessoa {
    constructor(nome, cpf) {
        this._nome = nome;
        this._cpf = cpf;
    }

    get nome() {
        return this._nome;
    }

    get cpf() {
        return this._cpf;
    }

    set nome(novoNome) {
        this._nome = novoNome;
    }

    set cpf(novoCpf) {
        this._cpf = novoCpf;
    }

    mostrarDados() {
        return `Nome: ${this._nome}, CPF: ${this._cpf}`;
    }
}

class Morador extends Pessoa {
    constructor(nome, cpf, codigoAcesso) {
        super(nome, cpf);
        this._codigoAcesso = codigoAcesso;
    }

    get codigoAcesso() {
        return this._codigoAcesso;
    }

    set codigoAcesso(novoCodigoAcesso) {
        this._codigoAcesso = novoCodigoAcesso;
    }

    mostrarDados() {
        return `${super.mostrarDados()}, Código de Acesso: ${this._codigoAcesso}`;
    }
}

class Apartamento {
    constructor(numero, edificio, andar, bloco, morador) {
        this._numero = numero;
        this._edificio = edificio;
        this._andar = andar;
        this._bloco = bloco;
        this._morador = morador;
    }

    get numero() {
        return this._numero;
    }

    get edificio() {
        return this._edificio;
    }

    get andar() {
        return this._andar;
    }

    get bloco() {
        return this._bloco;
    }

    get morador() {
        return this._morador;
    }

    set numero(novoNumero) {
        this._numero = novoNumero;
    }

    set edificio(novoEdificio) {
        this._edificio = novoEdificio;
    }

    set andar(novoAndar) {
        this._andar = novoAndar;
    }

    set bloco(novoBloco) {
        this._bloco = novoBloco;
    }

    set morador(novoMorador) {
        this._morador = novoMorador;
    }

    mostrarDadosApartamento() {
        console.log("-- DADOS DO APARTAMENTO:");
        console.log(`Número: ${this._numero}`);
        console.log(`Edifício: ${this._edificio}`);
        console.log(`Andar: ${this._andar}`);
        console.log(`Bloco: ${this._bloco}`);
        console.log("-- DADOS DO MORADOR:");
        console.log(this._morador.mostrarDados());
        console.log("-------------------------------");

    }
}
class Main {
    constructor() {
        this.criarApartamentos();
    }

    criarApartamentos() {
        const morador1 = new Morador("João Silva", "123.456.789-00", "A123");
        const morador2 = new Morador("Maria Santos", "987.654.321-00", "B456");
        const morador3 = new Morador("Pedro Oliveira", "456.789.123-00", "C789");
        const morador4 = new Morador("Ana Costa", "321.654.987-00", "D012");
        const morador5 = new Morador("Carlos Pereira", "654.321.987-00", "E345");

        const apartamento1 = new Apartamento("101", "Edifício Central", "1º", "A", morador1);
        const apartamento2 = new Apartamento("202", "Edifício Central", "2º", "B", morador2);
        const apartamento3 = new Apartamento("303", "Edifício Central", "3º", "C", morador3);
        const apartamento4 = new Apartamento("404", "Edifício Central", "4º", "D", morador4);
        const apartamento5 = new Apartamento("505", "Edifício Central", "5º", "E", morador5);

        const apartamentos = [apartamento1, apartamento2, apartamento3, apartamento4, apartamento5];

        console.log("APARTAMENTOS:");
        console.log("---------------------------");
        
        apartamentos.forEach((apartamento, index) => {
            console.log(`\nApartamento ${index + 1}:`);
            apartamento.mostrarDadosApartamento();
        });
    }
}


const apartamentos = new Main();