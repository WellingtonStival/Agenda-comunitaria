# Agenda Comunitária

A Agenda Comunitária é um projeto da disciplina Atividade Extensionista II, do curso de Análise e Desenvolvimento de Sistemas. Ela dá continuidade ao trabalho iniciado na Atividade Extensionista I, com a proposta de ajudar na organização das consultas da Clínica Comunitária Casa Mãe de Misericórdia, no setor Vila Itatiaia, em Goiânia (GO).

A ideia é que a recepção tenha um lugar para registrar os horários pedidos por telefone ou pessoalmente. A recepcionista informa o nome e o telefone do paciente, a especialidade, a data e o horário da consulta. Também pode incluir o profissional e alguma observação, se precisar. O paciente não acessa o sistema.

Na tela inicial, aparece um resumo das consultas de hoje: o total, as pendentes e as que já foram atendidas. Na aba Agenda, dá para consultar os registros, filtrar por data, especialidade ou profissional e corrigir ou cancelar um agendamento. Depois da consulta, a recepção pode marcar o atendimento como concluído. Se marcar por engano, é só usar o botão Reabrir para voltar a pendente.

O formulário também sugere profissionais e especialidades que já foram usados, para evitar ter que digitar tudo novamente. Antes de salvar, o sistema confere os campos obrigatórios e verifica se a data não está no passado.

O projeto usa apenas HTML, CSS e JavaScript puro. Os agendamentos ficam salvos no localStorage do navegador, sem banco de dados, backend ou APIs externas. O HTML contém a página, o CSS cuida da aparência e o JavaScript reúne as funções da agenda.

Para abrir no computador, baixe a pasta do projeto e abra o arquivo `index.html` no navegador. Se baixar em ZIP, extraia a pasta antes. Não precisa instalar nada nem iniciar um servidor, e essa versão local funciona sem internet.

Também é possível acessar a versão publicada no [GitHub Pages](https://wellingtonstival.github.io/Agenda-comunitaria/). Nesse caso, é preciso ter internet para carregar o site, mas os registros continuam salvos somente no navegador de quem está usando.

Isso significa que os horários cadastrados em um computador não aparecem automaticamente em outro. Limpar os dados do navegador também pode apagar os agendamentos.

No trabalho acadêmico, a proposta está relacionada ao ODS 03 — Saúde e bem-estar, por apoiar a organização do atendimento da clínica, e ao ODS 09 — Indústria, inovação e infraestrutura, pelo uso de uma ferramenta digital para uma necessidade da comunidade. A contribuição esperada é facilitar a rotina da recepção; os resultados precisam ser observados durante os testes.

Este é um protótipo acadêmico para demonstração e testes com dados fictícios. Ele não foi preparado para guardar informações médicas reais ou dados sensíveis.
