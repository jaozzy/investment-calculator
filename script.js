// Scroll da NavBar //
const navbarHeight = document.querySelector('.navs').offsetHeight;

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const targetOffset = targetSection.offsetTop - navbarHeight;

        window.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
        });

        // Rolando um pouco acima da seção para evitar que o título seja coberto pela barra de navegação
        window.scrollBy(0, -navbarHeight);
    });
});

// Formatação de Dinheiro // 
function formatCurrency(value) {
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return formatter.format(value);
}

// Variáveis globais
let monthlyIncome = 0;
let familyMembers = 0;
let investments = 0;

// Função para calcular o valor inicial como 20% da renda familiar
function calculateInitialAmount() {
    return 0.2 * monthlyIncome; // 20% da renda da família
}

// Função para atualizar o plano financeiro
function updateFinancialPlan() {
    monthlyIncome = parseFloat(document.getElementById('monthly-income').value); // Atualiza o valor da renda mensal
    const pib = calculatePIB();
    const essentialExpenses = 0.5 * monthlyIncome;
    const personalExpenses = 0.3 * monthlyIncome;
    const investments = 0.2 * monthlyIncome; // Calcula automaticamente os 20% da renda familiar como investimento

    // Exibir resultados no plano financeiro
    document.getElementById('pib-value').textContent =  isNaN(pib) ? 'R$ 0,00' : `${formatCurrency(pib)}`;
    document.querySelector('#despesase').textContent =  isNaN(essentialExpenses) ? 'R$ 0,00' : `${formatCurrency(essentialExpenses)}`;
    document.querySelector('#despesasp').textContent =  isNaN(personalExpenses) ? 'R$ 0,00' : `${formatCurrency(personalExpenses)}`;
    document.querySelector('#investimentos').textContent = isNaN(investments) ? 'R$ 0,00' : `${formatCurrency(investments)}`;
    document.getElementById('pib-value').textContent = `${formatCurrency(pib)}`;
    document.querySelector('#despesase').textContent = isNaN(essentialExpenses) ?  'R$ 0,00' : `${formatCurrency(essentialExpenses)}`;
    document.querySelector('#despesasp').textContent =  isNaN(personalExpenses) ? 'R$ 0,00' : `${formatCurrency(personalExpenses)}`;
    document.getElementById('financial-plan').style.display = 'block';

    // Atualizar automaticamente os campos das calculadoras
    document.getElementById('interest-rate-compound').value = 0.5; // Valor padrão de 0.5% de taxa de juros ao mês
    document.getElementById('months-compound').value = 10; // Valor padrão de 10 meses de período
    document.getElementById('tax-compound').value = 20; // Valor padrão de 20% de taxa de imposto

    // Recalcular as calculadoras
    calculateCompound();
    calculateSimple();
}

// Função para calcular o PIB per capita
function calculatePIB() {
    familyMembers = parseInt(document.getElementById('family-members').value);
    if (familyMembers > 0) {
        const pib = monthlyIncome / familyMembers;
        return pib;
    } else {
        return 0; // Evita o cálculo com zero membros da família
    }
}

// Evento de envio do formulário
const form = document.getElementById('financial-manager-form');
form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Obter valores do formulário
    monthlyIncome = parseFloat(document.getElementById('monthly-income').value);
    familyMembers = parseInt(document.getElementById('family-members').value);

    // Validar entradas
    if (isNaN(monthlyIncome) || isNaN(familyMembers) || monthlyIncome <= 0 || familyMembers <= 0) {
        alert('Por favor, insira valores válidos.');
        return;
    }

    // Calcular e exibir PIB per capita
    updateFinancialPlan();
    const pibResult = calculatePIB();
    if (pibResult === 0 || isNaN(pibResult)) {
        document.getElementById('pib-value').textContent = 'R$ 0,00';
    } 
    else {
        document.getElementById('pib-value').textContent = `PIB Per Capita: BRL ${formatCurrency(pibResult)}`;
    }
    document.getElementById('pib-result').style.display = 'block';
});

// Calculadora de Juros Compostos
function calculateCompound() {
    const interestRate = parseFloat(document.getElementById('interest-rate-compound').value / 100);
    const months = parseInt(document.getElementById('months-compound').value);
    const taxRate = parseFloat(document.getElementById('tax-compound').value) / 100;
    const monthlyValue = 0.2 * monthlyIncome;;

    // Calcular o investimento como 20% da renda familiar

    let totalInvested = (monthlyValue * months);
    let totalFinal = totalInvested;

    for (let i = 0; i < months; i++) {
        totalFinal += totalFinal * interestRate;
    }

    const grossEarnings = totalFinal - totalInvested;
    const taxAmount = grossEarnings * taxRate;
    const netEarnings = grossEarnings - taxAmount;

    // Exibir resultados, substituindo NaN por 0
    document.getElementById('total-invested-compound').textContent = isNaN(totalInvested) ? 'R$ 0,00' : formatCurrency(totalInvested);
    document.getElementById('total-final-compound').textContent = isNaN(totalFinal) ? 'R$ 0,00' : formatCurrency(totalFinal);
    document.getElementById('gross-earnings-compound').textContent = isNaN(grossEarnings) ? 'R$ 0,00' : formatCurrency(grossEarnings);
    document.getElementById('tax-compound-result').textContent = isNaN(taxAmount) ? 'R$ 0,00' : formatCurrency(taxAmount);
    document.getElementById('net-earnings-compound').textContent = isNaN(netEarnings) ? 'R$ 0,00' : formatCurrency(netEarnings);
}

// Calculadora de Juros Simples 
function calculateSimple() {
    const interestRate = parseFloat(document.getElementById('interest-rate-simple').value) / 100;
    const months = parseInt(document.getElementById('months-simple').value);

    // Calcular o investimento como 20% da renda familiar
    const investments = 0.2 * monthlyIncome;

    const finalAmount = investments + (investments * interestRate * months);
    const totalInterest = finalAmount - investments;

    // Exibir resultados
    document.getElementById('final-amount-simple').textContent = isNaN(finalAmount) ? 'R$ 0,00' : formatCurrency(finalAmount); // Verifica se finalAmount é NaN
    document.getElementById('total-interest-simple').textContent = isNaN(totalInterest) ? 'R$ 0,00' : formatCurrency(totalInterest); // Verifica se totalInterest é NaN
}

function calculateSelic() {
    const months = parseInt(document.getElementById('months-tesouro').value);
    fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados?formato=json')
        .then(response => response.json())
        .then(data => {
            const monthlyAmount = parseFloat(document.getElementById('monthly-income').value);
            const monthlyInvest = (0.2 * monthlyAmount);
            const taxaSelicAtual = data[data.length - 1].valor;
            const totalInvested = parseFloat(monthlyInvest * months);
            const lucro = parseFloat(totalInvested + (totalInvested * taxaSelicAtual));
            const retorno = ((monthlyInvest * taxaSelicAtual) * months);

            document.getElementById('total-invested-selic').textContent = isNaN(totalInvested) ? 'R$ 0,00' : formatCurrency(totalInvested);
            document.getElementById('total-retorno-selic').textContent = isNaN(retorno) ? 'R$ 0,00' : formatCurrency(retorno);
            document.getElementById('total-lucro-selic').textContent = isNaN(lucro) ? 'R$ 0,00' : formatCurrency(lucro);
        })
        .catch(error => console.error('Ocorreu um erro ao buscar a taxa Selic:', error));
}

// Inicialização
updateFinancialPlan();
calculateCompound();
calculateSimple();
calculateSelic();
