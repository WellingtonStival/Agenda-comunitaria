const CHAVE_ARMAZENAMENTO = "agendaComunitariaAgendamentos";

const paineis = document.querySelectorAll(".painel");
const abas = document.querySelectorAll("[data-aba]");
const atalhos = document.querySelectorAll("[data-abrir-aba]");

const formulario = document.querySelector("#form-agendamento");
const campoIdentificador = document.querySelector("#agendamento-id");
const campoPaciente = document.querySelector("#paciente");
const campoTelefone = document.querySelector("#telefone");
const campoEspecialidade = document.querySelector("#especialidade");
const campoProfissional = document.querySelector("#profissional");
const campoData = document.querySelector("#data");
const campoHorario = document.querySelector("#horario");
const campoObservacao = document.querySelector("#observacao");
const tituloFormulario = document.querySelector("#titulo-formulario");
const botaoSalvar = document.querySelector("#botao-salvar");
const botaoCancelarEdicao = document.querySelector("#botao-cancelar-edicao");
const mensagemFormulario = document.querySelector("#mensagem-formulario");
const agendaVazia = document.querySelector("#agenda-vazia");
const resultadoVazio = document.querySelector("#resultado-vazio");
const areaTabela = document.querySelector("#area-tabela");
const listaAgendamentos = document.querySelector("#lista-agendamentos");
const filtrosAgenda = document.querySelector("#filtros-agenda");
const filtroData = document.querySelector("#filtro-data");
const filtroEspecialidade = document.querySelector("#filtro-especialidade");
const filtroProfissional = document.querySelector("#filtro-profissional");
const botaoLimparFiltros = document.querySelector("#limpar-filtros");


const sugestoesEspecialidades = document.querySelector("#sugestoes-especialidades");
const sugestoesProfissionais = document.querySelector("#sugestoes-profissionais");
const botaoAgendaHoje = document.querySelector("#ver-agenda-hoje");

const camposObrigatorios = [
  campoPaciente,
  campoTelefone,
  campoEspecialidade,
  campoData,
  campoHorario
];

let agendamentos = carregarAgendamentos();

// Datas
function obterDataAtual() {
  // Data local
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
   const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function limparEspacos(texto) {
  return String(texto || "").trim().replace(/\s+/g, " ");
}

function normalizarTexto(texto) {
  // Comparação dos nomes
  return limparEspacos(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

function formatarProfissional(texto) {
  return limparEspacos(texto).toLocaleUpperCase("pt-BR");
}

// Dados salvos
function carregarAgendamentos() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_ARMAZENAMENTO);

    if (!dadosSalvos) {
      return [];
    }

    const dados = JSON.parse(dadosSalvos);

    if (!Array.isArray(dados)) {
      return [];
    }

    // Registros antigos
    return dados.map((agendamento) => ({
      ...agendamento,
      profissional: formatarProfissional(agendamento.profissional),
      status: agendamento.status === "atendido" ? "atendido" : "pendente"
    }));
  } catch (erro) {
    console.error("Não foi possível carregar os agendamentos.", erro);
    return [];
  }
}

function salvarAgendamentos(novosAgendamentos) {
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(novosAgendamentos));
    agendamentos = novosAgendamentos;
    return true;
  } catch (erro) {
    window.alert("Não foi possível salvar a alteração. Verifique se o navegador permite salvar dados e tente novamente.");
    return false;
  }
}

// Navegação
function abrirAba(nomeDaAba) {
  document.querySelector(".conteudo").classList.toggle("conteudo--agenda", nomeDaAba === "agenda");

  if (nomeDaAba === "inicio") {
    atualizarResumoHoje();
  }

  paineis.forEach((painel) => {
    painel.hidden = painel.id !== nomeDaAba;
  });

  abas.forEach((aba) => {
    const estaAtiva = aba.dataset.aba === nomeDaAba;
    aba.classList.toggle("ativa", estaAtiva);
    aba.setAttribute("aria-selected", String(estaAtiva));
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function mostrarMensagem(texto, tipo) {
  mensagemFormulario.textContent = texto;
  mensagemFormulario.className = `mensagem mensagem--${tipo}`;
  mensagemFormulario.hidden = false;
}

function esconderMensagem() {
 mensagemFormulario.hidden = true;
  mensagemFormulario.textContent = "";
}

// Validação
function validarFormulario() {
  camposObrigatorios.forEach((campo) => {
    campo.classList.toggle("invalido", !campo.value.trim());
  });
  const primeiroCampoVazio = camposObrigatorios.find((campo) => !campo.value.trim());

  if (primeiroCampoVazio) {
    mostrarMensagem("Preencha todos os campos obrigatórios antes de salvar.", "erro");
    formulario.reportValidity();
    primeiroCampoVazio.focus();
    return false;
  }

  if (campoData.value < obterDataAtual()) {
    campoData.classList.add("invalido");
    mostrarMensagem("Escolha a data de hoje ou uma data futura para a consulta.", "erro");
    campoData.focus();
    return false;
  }

  if (!formulario.checkValidity()) {
    mostrarMensagem("Revise os dados informados antes de salvar.", "erro");
    formulario.reportValidity();
    return false;
  }

  return true;
}

function limparFormulario() {
  formulario.reset();
  campoIdentificador.value = "";
  tituloFormulario.textContent = "Novo agendamento";
  botaoSalvar.textContent = "Salvar agendamento";
  botaoCancelarEdicao.hidden = true;
  formulario.querySelectorAll(".invalido").forEach((campo) => {
    campo.classList.remove("invalido");
  });
}


function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function ordenarAgendamentos() {
  agendamentos.sort((primeiro, segundo) => {
    const horarioPrimeiro = `${primeiro.data} ${primeiro.horario}`;
    const horarioSegundo = `${segundo.data} ${segundo.horario}`;
    return horarioPrimeiro.localeCompare(horarioSegundo);
  });
}

function criarCelula(texto, rotulo) {
  const celula = document.createElement("td");
  celula.textContent = texto;
  celula.dataset.rotulo = rotulo;
  return celula;
}

// Filtros e sugestões
function obterOpcoesUnicas(campo) {
  const opcoes = new Map();

  agendamentos.forEach((agendamento) => {
    const texto = limparEspacos(agendamento[campo]);

    if (!texto) {
      return;
    }

    const valor = normalizarTexto(texto);
    const rotulo = campo === "profissional" ? formatarProfissional(texto) : texto;

    if (!opcoes.has(valor)) {
      opcoes.set(valor, rotulo);
    }
  });

  return [...opcoes.entries()].sort((primeira, segunda) =>
    primeira[1].localeCompare(segunda[1], "pt-BR")
  );
}

function atualizarFiltro(seletor, opcoes, textoPadrao) {
  const valorAtual = seletor.value;
  seletor.replaceChildren(new Option(textoPadrao, ""));

  opcoes.forEach(([valor, rotulo]) => {
   seletor.add(new Option(rotulo, valor));
  });

  const valorAindaExiste = [...seletor.options].some(
    (opcao) => opcao.value === valorAtual
  );
  seletor.value = valorAindaExiste ? valorAtual : "";
}

function atualizarSugestoes(lista, campo) {
  lista.replaceChildren();

  obterOpcoesUnicas(campo).forEach(([, rotulo]) => {
    lista.appendChild(new Option(rotulo, rotulo));
  });
}

function atualizarResumoHoje() {
  const hoje = obterDataAtual();
  const consultasHoje = agendamentos.filter((agendamento) => agendamento.data === hoje);
  const atendidas = consultasHoje.filter((agendamento) => agendamento.status === "atendido").length;

  document.querySelector("#data-resumo").textContent = formatarData(hoje);
  document.querySelector("#total-hoje").textContent = consultasHoje.length;
  document.querySelector("#pendentes-hoje").textContent = consultasHoje.length - atendidas;
  document.querySelector("#atendidas-hoje").textContent = atendidas;
  document.querySelector("#resumo-vazio").hidden = consultasHoje.length > 0;
}

function obterAgendamentosFiltrados() {
  return agendamentos.filter((agendamento) => {
    const correspondeData = !filtroData.value || agendamento.data === filtroData.value;
    const correspondeEspecialidade =
      !filtroEspecialidade.value ||
      normalizarTexto(agendamento.especialidade) === filtroEspecialidade.value;
    const correspondeProfissional =
      !filtroProfissional.value ||
      normalizarTexto(agendamento.profissional) === filtroProfissional.value;

    return correspondeData && correspondeEspecialidade && correspondeProfissional;
  });
}

function criarCelulaSituacao(agendamento) {
  const celula = document.createElement("td");
  celula.dataset.rotulo = "Status";

  const indicadorSituacao = document.createElement("span");
  indicadorSituacao.className = `status status--${agendamento.status}`;
  indicadorSituacao.textContent = agendamento.status === "atendido" ? "Atendido" : "Pendente";
  celula.appendChild(indicadorSituacao);

  return celula;
}

// Atualiza agenda
function atualizarAgenda() {
  atualizarResumoHoje();
  atualizarSugestoes(sugestoesEspecialidades, "especialidade");
  atualizarSugestoes(sugestoesProfissionais, "profissional");
  ordenarAgendamentos();
  listaAgendamentos.replaceChildren();

  atualizarFiltro(
    filtroEspecialidade,
    obterOpcoesUnicas("especialidade"),
    "Todas as especialidades"
  );
  atualizarFiltro(
    filtroProfissional,
    obterOpcoesUnicas("profissional"),
    "Todos os profissionais"
  );

  const agendamentosFiltrados = obterAgendamentosFiltrados();
  const possuiAgendamentos = agendamentos.length > 0;
  const possuiResultados = agendamentosFiltrados.length > 0;

  agendaVazia.hidden = possuiAgendamentos;
  filtrosAgenda.hidden = !possuiAgendamentos;
  resultadoVazio.hidden = !possuiAgendamentos || possuiResultados;
  areaTabela.hidden = !possuiResultados;

  agendamentosFiltrados.forEach((agendamento) => {
    const linha = document.createElement("tr");
    linha.classList.toggle("linha--atendido", agendamento.status === "atendido");

    linha.appendChild(criarCelula(agendamento.paciente, "Paciente"));
    linha.appendChild(criarCelula(agendamento.telefone, "Telefone"));
    linha.appendChild(criarCelula(agendamento.especialidade, "Especialidade"));
    linha.appendChild(criarCelula(agendamento.profissional || "Não informado", "Profissional"));
    linha.appendChild(criarCelula(formatarData(agendamento.data), "Data"));
    linha.appendChild(criarCelula(agendamento.horario, "Horário"));
    linha.appendChild(criarCelulaSituacao(agendamento));

    const celulaAcoes = document.createElement("td");
    const acoes = document.createElement("div");
    acoes.className = "acoes-agendamento";

    const botaoSituacao = document.createElement("button");
    botaoSituacao.type = "button";
    botaoSituacao.className = "botao-tabela botao-tabela--status";
    botaoSituacao.textContent = agendamento.status === "atendido" ? "Reabrir" : "Marcar atendido";
    botaoSituacao.dataset.acao = "status";
    botaoSituacao.dataset.id = agendamento.id;
    botaoSituacao.setAttribute(
      "aria-label",
      agendamento.status === "atendido"
        ? `Marcar agendamento de ${agendamento.paciente} como pendente`
        : `Marcar agendamento de ${agendamento.paciente} como atendido`
    );

    const botaoEditar = document.createElement("button");
    botaoEditar.type = "button";
    botaoEditar.className = "botao-tabela";
    botaoEditar.textContent = "Editar";
    botaoEditar.dataset.acao = "editar";
    botaoEditar.dataset.id = agendamento.id;
    botaoEditar.setAttribute("aria-label", `Editar agendamento de ${agendamento.paciente}`);

    const botaoExcluir = document.createElement("button");
    botaoExcluir.type = "button";
    botaoExcluir.className = "botao-tabela botao-tabela--excluir";
    botaoExcluir.textContent = "Cancelar";
    botaoExcluir.dataset.acao = "excluir";
    botaoExcluir.dataset.id = agendamento.id;
    botaoExcluir.setAttribute("aria-label", `Cancelar agendamento de ${agendamento.paciente}`);

    acoes.append(botaoSituacao, botaoEditar, botaoExcluir);
    celulaAcoes.appendChild(acoes);
    linha.appendChild(celulaAcoes);
    listaAgendamentos.appendChild(linha);
  });
}

function alternarSituacao(identificador) {
  const agendamento = agendamentos.find((item) => item.id === identificador);

  if (!agendamento) {
    return;
  }

  const novaSituacao = agendamento.status === "atendido" ? "pendente" : "atendido";
  const novosAgendamentos = agendamentos.map((item) =>
    item.id === identificador ? { ...item, status: novaSituacao } : item
  );

  if (!salvarAgendamentos(novosAgendamentos)) {
    return;
  }

  atualizarAgenda();
}



function editarAgendamento(identificador) {
  const agendamento = agendamentos.find((item) => item.id === identificador);

  if (!agendamento) {
    return;
  }

  campoIdentificador.value = agendamento.id;
  campoPaciente.value = agendamento.paciente;
    campoTelefone.value = agendamento.telefone;
  campoEspecialidade.value = agendamento.especialidade;
  campoProfissional.value = agendamento.profissional || "";
  campoData.value = agendamento.data;
  campoHorario.value = agendamento.horario;
  campoObservacao.value = agendamento.observacao || "";

  tituloFormulario.textContent = "Editar agendamento";
  botaoSalvar.textContent = "Salvar alterações";
  botaoCancelarEdicao.hidden = false;
  esconderMensagem();
  abrirAba("agendamento");
  campoPaciente.focus();
}

function excluirAgendamento(identificador) {
  const agendamento = agendamentos.find((item) => item.id === identificador);

  if (!agendamento) {
    return;
  }

  const confirmou = window.confirm(
    `Deseja cancelar o agendamento de ${agendamento.paciente}?`
  );

  if (!confirmou) {
    return;
  }

  const novosAgendamentos = agendamentos.filter((item) => item.id !== identificador);

  if (!salvarAgendamentos(novosAgendamentos)) {
    return;
  }

  atualizarAgenda();

  if (campoIdentificador.value === identificador) {
    limparFormulario();
  }
}

abas.forEach((aba) => {
  aba.addEventListener("click", () => abrirAba(aba.dataset.aba));
});

atalhos.forEach((atalho) => {
  atalho.addEventListener("click", (evento) => {
    evento.preventDefault();
    abrirAba(atalho.dataset.abrirAba);
  });
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  esconderMensagem();

  if (!validarFormulario()) {
    return;
  }

  const identificadorEmEdicao = campoIdentificador.value;
  const agendamentoExistente = agendamentos.find((item) => item.id === identificadorEmEdicao);
  const agendamento = {
    id: identificadorEmEdicao || String(Date.now()),
    paciente: campoPaciente.value.trim(),
    telefone: campoTelefone.value.trim(),
    especialidade: campoEspecialidade.value.trim(),
    profissional: formatarProfissional(campoProfissional.value),
    data: campoData.value,
    horario: campoHorario.value,
    observacao: campoObservacao.value.trim(),
    status: agendamentoExistente?.status || "pendente"
  };

  const novosAgendamentos = [...agendamentos];

  if (identificadorEmEdicao) {
    const indice = agendamentos.findIndex((item) => item.id === identificadorEmEdicao);
    novosAgendamentos[indice] = agendamento;
  } else {
    novosAgendamentos.push(agendamento);
  }

  if (!salvarAgendamentos(novosAgendamentos)) {
    return;
  }

  atualizarAgenda();
  limparFormulario();

  const mensagem = identificadorEmEdicao
    ? "Agendamento atualizado com sucesso."
    : "Agendamento salvo com sucesso.";
  mostrarMensagem(mensagem, "sucesso");
});

formulario.addEventListener("input", (evento) => {
  evento.target.classList.remove("invalido");
});

botaoCancelarEdicao.addEventListener("click", () => {
  limparFormulario();
  esconderMensagem();
});

campoProfissional.addEventListener("blur", () => {
  campoProfissional.value = formatarProfissional(campoProfissional.value);
});

[filtroData, filtroEspecialidade, filtroProfissional].forEach((filtro) => {
  filtro.addEventListener("change", atualizarAgenda);
});

botaoLimparFiltros.addEventListener("click", () => {
  filtroData.value = "";
  filtroEspecialidade.value = "";
  filtroProfissional.value = "";
  atualizarAgenda();
});

botaoAgendaHoje.addEventListener("click", () => {
  filtroData.value = obterDataAtual();
  filtroEspecialidade.value = "";
  filtroProfissional.value = "";
  atualizarAgenda();
  abrirAba("agenda");
});

listaAgendamentos.addEventListener("click", (evento) => {
  const botao = evento.target.closest("button[data-acao]");

  if (!botao) {
    return;
  }

  if (botao.dataset.acao === "status") {
    alternarSituacao(botao.dataset.id);
  } else if (botao.dataset.acao === "editar") {
    editarAgendamento(botao.dataset.id);
  } else {
    excluirAgendamento(botao.dataset.id);
  }
});

campoData.min = obterDataAtual();
atualizarAgenda();
