const Modal = {
    open(){
        // Abrir modal
        // Adicionar class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close (){
        // Fechar modal
        // Remover class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

//vai armazenar no local storage
// para nao 'resetar' mais a pagina depois de atualizar
const Storage = {
    get() { // ele vai retornar o string vazio
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
    },
    // Storage so armazena string
    // entao usa-se JSON para 'stringar' os valores
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON. stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },
    
    remove(index){
        if (window.confirm ("Are you sure you want to delete that information?"))
        // vai perguntar pro usuario se deseja remover
        // ou nao aquela transacao
        
        {

            Transaction.all.splice(index, 1),

            App.reload() // vai atualizar a aplicacao (onde aparecer)
        }
        

    },

    incomes(){
        let income = 0;
        // pegar todas as transacoes
    Transaction.all.forEach((transaction) => {
            // '=>' substitui a palava 'function'

            // se for maior que zero
            if(transaction.amount > 0) {
                // somar a uma variavel e retornar o valor
                income += transaction.amount;
                }
        })        

        return income;
    },

    expenses(){
        let expense = 0;
        // pegar todas as transacoes
        Transaction.all.forEach((transaction) => {
            // '=>' substitui a palava 'function'

            // se for MENOR que zero
            if(transaction.amount < 0) {
                // adiciona a uma variavel e retornar o valor
                expense += transaction.amount;
                }
        })        

        return expense;
    },

    total(){
        return Transaction.incomes() + Transaction.expenses();
        // vai ser + por que 'expenses' já vai ter um valor negativo
    }
}

//substituir os dados html com os dados do js

const DOM = {
    transactionsContainer:document.querySelector('#data-table tbody'),
// depois, colocou-se o index como argumento
// trazendo funcionalidade para o botao de delete
    addTransactions(transaction, index) {
        
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
        
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income":"expense" 

        const amount = Utils.formatCurrancy(transaction.amount)

        const html = `
        
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
        
        `
        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrancy (Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrancy (Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrancy (Transaction.total())
    },
    
    clearTransactions() { // vai limpar a cada novo cadastro de transacoes
        DOM.transactionsContainer.innerHTML = ""
    }

}


const Utils = {
// Vai formatar os caracteres para mostrar valores em REAL BR
// e as casas decimais.
    formatAmount(value) {
        value = Number(value) * 100 
        // vai deixar de ser string e virar number
    return Math.round(value)
    },
    // vai formatar a exibicao da data
    // e colocar dia -> mes - > ano
    formatDate(date) {
        const splittedDate = date.split("-") //separacao por -
        
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrancy(value) {
        const signal = Number(value) < 0 ? "-":" "
        value = String(value).replace(/\D/g, "") // vai substituir caracteres
        value = Number(value) / 100 // vai adicionar casa decimal
        value = value.toLocaleString("eng", {
            style: "currency", // tipo de Moeda
            currency: "USD" // moeda
        })

        return signal + value // retornar caractere completo
    }
}

const Form = { // dar funcionalidade para o 
               // preenchimento do formulario
    description: document.querySelector('#description'),
    amount: document.querySelector('#amount'),
    date: document.querySelector('#date'),
    // ligando js com html de acordo com os dados da tabela
    // ver 'input group' no index.html
    getValues(){

        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }

    },

    validateField(){
        const {description, amount, date} = Form.getValues()
        // vai verificar se os campo ta ou nao preenchidos
        if( description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
                throw new Error("Please, fill all the form.")
            }
    },

    formatValues () {
        let {description, amount, date} = Form.getValues()
        
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

    return {
            description,
            amount,
            date
        }


    },
    
    clearFields() {
        Form.description.value === ""
        Form.amount.value === ""
        Form.date.value === ""
    },

    submit(event) {

        event.preventDefault() // interromper a mudanca do url
        // depois: verificar se as informacoes foram preenchidas
        
        try {
            
            Form.validateField()
        // formatar os dados para salvar
            const transaction = Form.formatValues()
        // depois: salvar de fato
            Transaction.add(transaction)
        // apagar os dados do formulario
            Form.clearFields()
        // fechar o modal
            Modal.close()
        // Atualizar a aplicacao
        

        } catch (error) { // vai exibir um alerta de erro
            alert(error.message)

        }

        
    }
}



Storage.get()

const App = {
    // 'init' vai iniciar a aplicação
    // e recarregar os dados com os novos valores
    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransactions(transaction, index)
        })
        
        DOM.updateBalance()

        Storage.set(Transaction.all)

    },
    reload(){ // 'reload' refazer a apliacao com
              // os valores cadastrados
        DOM.clearTransactions()
        App.init()

    },
}


App.init()