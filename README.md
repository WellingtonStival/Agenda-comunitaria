# Agenda Comunitária

A Agenda Comunitária foi desenvolvida para a disciplina Atividade Extensionista II, do curso de Análise e Desenvolvimento de Sistemas, dando continuidade ao trabalho da Atividade Extensionista I.

O projeto é um sistema simples para organizar o agendamento de consultas. Ele será apresentado e testado na Clínica Comunitária Casa Mãe de Misericórdia, localizada no setor Vila Itatiaia, em Goiânia (GO).

A ideia é ajudar a recepção a registrar os pedidos feitos por telefone ou pessoalmente. A recepcionista preenche os dados do paciente, escolhe a data e o horário e salva a consulta. O paciente não acessa o sistema.

Na aba Agenda, é possível consultar os horários, filtrar por data, especialidade ou profissional, editar os dados e cancelar um agendamento. Depois da consulta, basta marcar o paciente como atendido. Se isso for feito por engano, o botão Reabrir permite voltar para pendente.

A tela inicial mostra quantas consultas estão agendadas para hoje e quantas estão pendentes ou já foram atendidas. No formulário, os nomes de profissionais e especialidades já utilizados aparecem como sugestões. Os campos obrigatórios são verificados antes de salvar, e o sistema não aceita datas anteriores ao dia atual.

O desenvolvimento foi feito com HTML, CSS e JavaScript puro. Os dados ficam no localStorage do navegador, sem banco de dados, servidor ou serviços externos.

Para usar, baixe a pasta do projeto e abra o arquivo `index.html` no navegador. Se o download vier em ZIP, extraia os arquivos primeiro. Não precisa instalar nada, e o sistema funciona sem internet.

Os arquivos estão separados de forma simples: o `index.html` contém a página, o `css/style.css` cuida da aparência e o `js/app.js` reúne o funcionamento da agenda. A logo da clínica está na pasta `assets`.

Como os agendamentos ficam apenas no navegador utilizado, eles não aparecem automaticamente em outro computador. Limpar os dados do navegador também pode apagar os registros.

O projeto se relaciona com o ODS 03 — Saúde e bem-estar, pela proposta de apoiar a organização do atendimento em uma clínica comunitária, e com o ODS 09 — Indústria, inovação e infraestrutura, pelo uso de uma solução digital para uma necessidade local. Essa é a relação proposta no trabalho; os resultados do uso deverão ser observados durante os testes na clínica.

Este é um protótipo acadêmico, feito para demonstração com dados fictícios. Não deve ser usado para armazenar dados médicos reais ou informações sensíveis.
