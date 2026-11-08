/**
 * Dados institucionais usados em várias páginas.
 *
 * REGRA DO PROJETO: cada Informação aqui é classificada como
 * confirmado | histórico | pendente
 *
 * Nada pode ser inventado. Ao receber uma fonte nova, atualize AQUI —
 * todas as páginas leem deste arquivo.
 */

const DadosCeep = {
  contato: {
    nome: "Centro Estadual de Educação Profissional de Curitiba",
    sigla: "CEEP Curitiba",
    endereco: "Rua Frederico Maurer, 3015",
    bairro: "Boqueirão",
    cidade: "Curitiba",
    estado: "Paraná",
    cep: "81670-020",
    telefone: "(41) 3276-9534",
    inep: "41129857",
    email: null, // PENDENTE — não publicar sem confirmação
    horarios: null, // PENDENTE
    redesSociais: null, // PENDENTE
  },

  indicadores: [
    {
      valor: "1.137",
      rotulo: "matrículas — Censo Escolar 2025",
      origem: "confirmado",
    },
    {
      valor: "121",
      rotulo: "professores — Censo Escolar 2025",
      origem: "confirmado",
    },
    {
      valor: "5,7",
      rotulo: "IDEB 2025 — Ensino Médio",
      origem: "confirmado",
    },
  ],

  aprendizagem: {
    fonte: "Saeb 2023 — 3 º ano do Ensino Médio",
    itens: [
      { area: "Português", percentual: 64 },
      { area: "Matemática", percentual: 16 },
    ],
  },

  fluxo: [
    // Removidos indicadores de reprovação e abandono por solicitação institucional
  ],

  historia: [
    {
      ano: "1941",
      titulo: "Fundação",
      texto:
        "A instituição é criada com o nome de Instituto Técnico de Agronomia, Veterinária e Química do Paraná.",
      classe: "confirmado",
    },
    {
      ano: "Atualmente",
      titulo: "Centro Estadual de Educação Profissional de Curitiba",
      texto:
        "A instituição oferece cursos técnicos integrados ao Ensino Médio, na rede estadual do Paraná.",
      classe: "confirmado",
    },
  ],

  infraestrutura: {
    laboratoriosTecnicos: [
      "Laboratório de Eletromecânica",
      "Laboratório de Química",
      "Laboratório de Edificações",
      "Laboratório de Biologia",
      "Laboratório de Desenvolvimento de Sistemas",
      "Laboratório de Programação de Jogos Digitais",
      "Laboratório de Física",
    ],
  },

  sistemasOficiais: [
    {
      nome: "Matrícula na rede estadual",
      descricao:
        "A inscrição e a matrícula são feitas nos canais oficiais da Secretaria de Estado da Educação do Paraná.",
      url: "https://www.educacao.pr.gov.br/",
      rotulo: "Ir para o site da SEED-PR",
    },
    {
      nome: "Área do aluno da rede estadual",
      descricao:
        "Boletim, frequência e demais serviços acadêmicos ficam nos sistemas oficiais da SEED-PR.",
      url: "https://www.areadoaluno.seed.pr.gov.br/",
      rotulo: "Ir para a Área do Aluno da SEED",
    },
  ],
};
