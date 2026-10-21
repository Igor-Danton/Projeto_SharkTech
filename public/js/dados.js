/**
 * Dados institucionais usados em várias páginas.
 *
 * REGRA DO PROJETO: cada informação aqui é classificada como
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
    { valor: "7", rotulo: "cursos técnicos", origem: "confirmado" },
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
    fonte: "Saeb 2023 — 3º ano do Ensino Médio",
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
    confirmada: [
      "Biblioteca",
      "Cozinha",
      "Laboratório de informática",
      "Laboratório de ciências",
      "Quadra de esportes",
      "Sala da diretoria",
      "Sanitários",
      "Dependências com acessibilidade",
      "Alimentação escolar",
      "Água filtrada",
    ],

    laboratoriosTecnicos: [
      "Eletromecânica",
      "Edificações",
      "Informática",
      "Matemática",
      "Biologia",
      "Física",
      "Química",
      "Desenvolvimento de Sistemas",
      "Programação de Jogos Digitais",
    ],

    quantidadeLaboratorios: {
      valor: "cerca de 15 laboratórios",
      classificacao: "historico",
      observacao:
        "Número de referência histórica, para cursos básicos e específicos. A quantidade atual precisa ser confirmada pela direção antes de ser publicada como dado vigente.",
    },

    biblioteca: {
      texto:
        "O CEEP Curitiba possui biblioteca. Há registros históricos de uma biblioteca central ligada aos cursos técnicos e de acervo voltado à formação profissional.",
      acervo: null, // PENDENTE — não publicar quantidade de livros sem fonte atual
    },
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
