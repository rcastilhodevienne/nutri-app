// Repositório de Aceleradores e Orientações baseados no objetivo
const bdNutri = {
    emagrecimento: {
        estrategia: "Défice Calórico Moderado (300-500 kcal). Foco em densidade nutricional alta e baixa densidade calórica para promover saciedade.",
        orientacoes: [
            "Aumentar a ingestão de água para 35ml a 40ml por kg de peso.",
            "Priorizar proteínas magras em todas as refeições (ovos, peixe, frango).",
            "Iniciar almoço e jantar por um grande prato de salada folhosa.",
            "Evitar calorias líquidas (sumos, refrigerantes, álcool)."
        ]
    },
    hipertrofia: {
        estrategia: "Superavit Calórico Leve (300-500 kcal). Foco no aporte proteico adequado (1.6 a 2.2g/kg) e hidratos de carbono em volta do treino.",
        orientacoes: [
            "Manter hidratação adequada para otimizar a síntese proteica.",
            "Garantir ingestão de hidratos de carbono complexos antes do treino para energia.",
            "Consumir uma fonte de proteína até 2 horas pós-treino.",
            "Não negligenciar o sono, é onde ocorre a recuperação muscular."
        ]
    },
    manutencao: {
        estrategia: "Dieta Normocalórica. Foco em reeducação alimentar, equilíbrio de macronutrientes e construção de hábitos sustentáveis.",
        orientacoes: [
            "Praticar a regra 80/20 (80% alimentos in natura, 20% alimentos de conforto).",
            "Mastigar devagar e prestar atenção aos sinais de saciedade.",
            "Incluir pelo menos 3 porções de fruta e 2 de vegetais ao dia.",
            "Manter a regularidade dos horários das refeições."
        ]
    }
};

function gerarPlano() {
    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);
    const objetivo = document.getElementById('objetivo').value;
    const restricao = document.getElementById('restricao').value;

    if (!nome || !idade || isNaN(peso) || isNaN(altura) || !objetivo) {
        alert("Por favor, preencha todos os dados da anamnese e selecione um objetivo.");
        return;
    }

    // Cálculo de IMC
    const alturaMetros = altura / 100;
    const imc = (peso / (alturaMetros * alturaMetros)).toFixed(1);

    // Preencher dados do paciente
    document.getElementById('out-nome').textContent = nome;
    document.getElementById('out-idade').textContent = idade + " anos";
    document.getElementById('out-imc').textContent = imc;

    // Buscar dados no repositório
    let estrategiaTexto = bdNutri[objetivo].estrategia;
    
    // Aplicar regras de restrição
    if (restricao === 'vegetariano') {
        estrategiaTexto += " Adaptação: Fontes proteicas baseadas em leguminosas, tofu, tempeh e suplementação de B12 necessária.";
    } else if (restricao === 'intolerante') {
        estrategiaTexto += " Adaptação: Remoção total de fontes de glúten/lactose. Foco em tubérculos, arroz e leites vegetais fortificados.";
    }

    document.getElementById('out-estrategia').textContent = estrategiaTexto;

    // Preencher orientações
    const lista = document.getElementById('out-orientacoes');
    lista.innerHTML = '';
    bdNutri[objetivo].orientacoes.forEach(orientacao => {
        const li = document.createElement('li');
        li.textContent = orientacao;
        lista.appendChild(li);
    });

    // Mostrar a área de relatório
    document.getElementById('area-relatorio').style.display = 'block';
}

function descarregarPDF() {
    const elemento = document.getElementById('documento-pdf');
    const nomePaciente = document.getElementById('nome').value.split(' ')[0]; // Pega o primeiro nome

    // Configurações do PDF
    const opcoes = {
        margin:       10,
        filename:     `Dieta_${nomePaciente}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Altera temporariamente a textarea para div apenas para a impressão do PDF ficar bonita
    const textarea = document.getElementById('texto-dieta');
    const valorDieta = textarea.value;
    const pTemporario = document.createElement('p');
    pTemporario.style.whiteSpace = 'pre-wrap';
    pTemporario.textContent = valorDieta;
    
    textarea.parentNode.replaceChild(pTemporario, textarea);

    // Gera o PDF
    html2pdf().set(opcoes).from(elemento).save().then(() => {
        // Devolve a textarea após descarregar para continuar editável
        pTemporario.parentNode.replaceChild(textarea, pTemporario);
    });
}
