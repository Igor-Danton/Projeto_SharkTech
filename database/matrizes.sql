USE sharktech_ceep;
SET NAMES utf8mb4;

-- Cursos sem matriz fornecida: desativados (não apagados)
UPDATE curso SET ativo = 0
 WHERE slug IN ('eletromecanica','eletronica','manutencao-automotiva','mecanica');

-- ---------------- Dados do curso ----------------
UPDATE curso SET ativo=1, nome='Técnico em Desenvolvimento de Sistemas', turno='Manhã e Tarde',
  carga_horaria_total=3234, codigo_itinerario=NULL, observacao_matriz=NULL
 WHERE slug='desenvolvimento-de-sistemas';

UPDATE curso SET ativo=1, nome='Técnico em Programação de Jogos Digitais', turno='Manhã e Tarde',
  carga_horaria_total=3032, codigo_itinerario=NULL, observacao_matriz=NULL
 WHERE slug='programacao-de-jogos-digitais';

UPDATE curso SET ativo=1, nome='Técnico em Química', turno='Manhã e Tarde',
  carga_horaria_total=3233, codigo_itinerario='1615',
  observacao_matriz='Divergência na matriz: a 3ª série aparece com 33 aulas semanais em uma tabela e 32 na tabela da página padrão (valor não reconciliado). O total semanal não consta no resumo. A soma dos totais anuais (3.234 h) difere em 1 h do total informado (3.233 h). A versão operacional da matriz traz o turno como campo a preencher.'
 WHERE slug='quimica';

UPDATE curso SET ativo=1, nome='Técnico em Meio Ambiente', turno='Manhã e Tarde',
  carga_horaria_total=3233, codigo_itinerario='1609',
  observacao_matriz='Divergência na matriz: a tabela informa 34 aulas semanais na 3ª série, mas a nota de rodapé menciona 32 (valor não reconciliado). A soma dos totais anuais (3.232 h) difere em 1 h do total informado (3.233 h).'
 WHERE slug='meio-ambiente';

UPDATE curso SET ativo=1, nome='Técnico em Farmácia', turno='Manhã e Tarde',
  carga_horaria_total=3233, codigo_itinerario=NULL, observacao_matriz=NULL
 WHERE slug='farmacia';

UPDATE curso SET ativo=1, nome='Técnico em Edificações', turno='Manhã e Tarde',
  carga_horaria_total=3233, codigo_itinerario='1603',
  observacao_matriz='Divergência na matriz: a tabela informa 34 aulas semanais na 3ª série, mas a nota de rodapé menciona 32 (valor não reconciliado). A soma dos totais anuais (3.232 h) difere em 1 h do total informado (3.233 h).'
 WHERE slug='edificacoes';

UPDATE curso SET ativo=1, nome='Técnico em Biotecnologia', turno='Manhã e Tarde',
  carga_horaria_total=3233, codigo_itinerario='1602',
  observacao_matriz='A soma dos totais anuais (3.232 h) difere em 1 h do total informado (3.233 h).'
 WHERE slug='biotecnologia';

-- ---------------- Limpa o que será recarregado ----------------
DELETE FROM disciplina WHERE id_curso IN (SELECT id_curso FROM curso WHERE slug IN
 ('desenvolvimento-de-sistemas','programacao-de-jogos-digitais','quimica','meio-ambiente',
  'farmacia','edificacoes','biotecnologia'));
DELETE FROM curso_serie;
DELETE FROM formacao_comum;

-- ---------------- Carga por série ----------------
-- (curso, série, itinerário sem., itinerário anual, total sem., total anual)
INSERT INTO curso_serie (id_curso, serie, itinerario_semanal, itinerario_anual, total_semanal, total_anual) VALUES
((SELECT id_curso FROM curso WHERE slug='desenvolvimento-de-sistemas'),1,5,167,32,1067),
((SELECT id_curso FROM curso WHERE slug='desenvolvimento-de-sistemas'),2,12,401,32,1067),
((SELECT id_curso FROM curso WHERE slug='desenvolvimento-de-sistemas'),3,19,634,33,1100),

((SELECT id_curso FROM curso WHERE slug='programacao-de-jogos-digitais'),1,4,133,31,1032),
((SELECT id_curso FROM curso WHERE slug='programacao-de-jogos-digitais'),2,10,334,30,1000),
((SELECT id_curso FROM curso WHERE slug='programacao-de-jogos-digitais'),3,16,534,30,1000),

((SELECT id_curso FROM curso WHERE slug='quimica'),1,3,100,NULL,1000),
((SELECT id_curso FROM curso WHERE slug='quimica'),2,14,465,NULL,1133),
((SELECT id_curso FROM curso WHERE slug='quimica'),3,19,635,NULL,1101),

((SELECT id_curso FROM curso WHERE slug='meio-ambiente'),1,3,100,30,1000),
((SELECT id_curso FROM curso WHERE slug='meio-ambiente'),2,13,433,33,1099),
((SELECT id_curso FROM curso WHERE slug='meio-ambiente'),3,20,667,34,1133),

((SELECT id_curso FROM curso WHERE slug='farmacia'),1,4,133,31,1033),
((SELECT id_curso FROM curso WHERE slug='farmacia'),2,13,434,33,1100),
((SELECT id_curso FROM curso WHERE slug='farmacia'),3,19,634,33,1100),

((SELECT id_curso FROM curso WHERE slug='edificacoes'),1,3,100,30,1000),
((SELECT id_curso FROM curso WHERE slug='edificacoes'),2,13,433,33,1099),
((SELECT id_curso FROM curso WHERE slug='edificacoes'),3,20,667,34,1133),

((SELECT id_curso FROM curso WHERE slug='biotecnologia'),1,3,100,30,1000),
((SELECT id_curso FROM curso WHERE slug='biotecnologia'),2,14,467,34,1133),
((SELECT id_curso FROM curso WHERE slug='biotecnologia'),3,19,633,33,1099);

-- ---------------- Componentes técnicos (ordem da matriz) ----------------
INSERT INTO disciplina (nome, id_curso) VALUES
('Análise e Projeto de Sistemas',(SELECT id_curso FROM curso WHERE slug='desenvolvimento-de-sistemas')),
('Banco de Dados',(SELECT id_curso FROM curso WHERE slug='desenvolvimento-de-sistemas')),
('Ciência da Computação',(SELECT id_curso FROM curso WHERE slug='desenvolvimento-de-sistemas')),
('Lógica Computacional',(SELECT id_curso FROM curso WHERE slug='desenvolvimento-de-sistemas')),
('Programação Back-End',(SELECT id_curso FROM curso WHERE slug='desenvolvimento-de-sistemas')),
('Programação Front-End',(SELECT id_curso FROM curso WHERE slug='desenvolvimento-de-sistemas')),
('Programação Mobile',(SELECT id_curso FROM curso WHERE slug='desenvolvimento-de-sistemas')),
('Programação no Desenvolvimento de Sistemas',(SELECT id_curso FROM curso WHERE slug='desenvolvimento-de-sistemas')),
('Ciências de Dados',(SELECT id_curso FROM curso WHERE slug='desenvolvimento-de-sistemas')),
('Computação Gráfica',(SELECT id_curso FROM curso WHERE slug='desenvolvimento-de-sistemas')),

('Análise e Projetos de Jogos Digitais I',(SELECT id_curso FROM curso WHERE slug='programacao-de-jogos-digitais')),
('Análise e Projetos de Jogos Digitais II',(SELECT id_curso FROM curso WHERE slug='programacao-de-jogos-digitais')),
('Banco de Dados',(SELECT id_curso FROM curso WHERE slug='programacao-de-jogos-digitais')),
('Ciência da Computação',(SELECT id_curso FROM curso WHERE slug='programacao-de-jogos-digitais')),
('Fundamentos em Programação de Jogos Digitais',(SELECT id_curso FROM curso WHERE slug='programacao-de-jogos-digitais')),
('Game Design',(SELECT id_curso FROM curso WHERE slug='programacao-de-jogos-digitais')),
('Lógica Computacional',(SELECT id_curso FROM curso WHERE slug='programacao-de-jogos-digitais')),
('Produção Audiovisual',(SELECT id_curso FROM curso WHERE slug='programacao-de-jogos-digitais')),
('Programação de Jogos Digitais I',(SELECT id_curso FROM curso WHERE slug='programacao-de-jogos-digitais')),
('Programação de Jogos Digitais II',(SELECT id_curso FROM curso WHERE slug='programacao-de-jogos-digitais')),
('Programação Mobile Aplicada a Jogos Digitais',(SELECT id_curso FROM curso WHERE slug='programacao-de-jogos-digitais')),
('Programação Web Aplicada a Jogos Digitais',(SELECT id_curso FROM curso WHERE slug='programacao-de-jogos-digitais')),

('Físico-Química',(SELECT id_curso FROM curso WHERE slug='quimica')),
('Legislação e Normas',(SELECT id_curso FROM curso WHERE slug='quimica')),
('Processos Industriais',(SELECT id_curso FROM curso WHERE slug='quimica')),
('Química Analítica',(SELECT id_curso FROM curso WHERE slug='quimica')),
('Química Aplicada ao Meio Ambiente',(SELECT id_curso FROM curso WHERE slug='quimica')),
('Química Inorgânica',(SELECT id_curso FROM curso WHERE slug='quimica')),
('Química Orgânica',(SELECT id_curso FROM curso WHERE slug='quimica')),

('Análise, Controle e Química Ambiental',(SELECT id_curso FROM curso WHERE slug='meio-ambiente')),
('Educação Ambiental',(SELECT id_curso FROM curso WHERE slug='meio-ambiente')),
('Estudo de Impactos e Riscos Ambientais',(SELECT id_curso FROM curso WHERE slug='meio-ambiente')),
('Gestão de Recursos Naturais',(SELECT id_curso FROM curso WHERE slug='meio-ambiente')),
('Gestão de Resíduos',(SELECT id_curso FROM curso WHERE slug='meio-ambiente')),
('Informática Aplicada',(SELECT id_curso FROM curso WHERE slug='meio-ambiente')),
('Legislação e Segurança Ambiental',(SELECT id_curso FROM curso WHERE slug='meio-ambiente')),
('Metodologia Científica e Comunicação',(SELECT id_curso FROM curso WHERE slug='meio-ambiente')),
('Sistemas de Gestão Ambiental',(SELECT id_curso FROM curso WHERE slug='meio-ambiente')),

('Bases Biológicas Aplicadas à Saúde',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Biossegurança e Segurança do Trabalho',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Controle de Qualidade',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Dispensação de Produtos Farmacêuticos e Correlatados',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Empreendedorismo',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Farmácia Hospitalar',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Farmacologia I',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Farmacologia II',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Farmacotécnica',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Fundamentos da Farmácia',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Fundamentos da Fisiopatologia',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Homeopatia e Fitoterapia',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Microbiologia e Parasitologia Aplicada à Saúde',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Química Aplicada',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Redação Técnica',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Saúde Pública',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Toxicologia',(SELECT id_curso FROM curso WHERE slug='farmacia')),
('Primeiros Socorros',(SELECT id_curso FROM curso WHERE slug='farmacia')),

('Administração de Obras',(SELECT id_curso FROM curso WHERE slug='edificacoes')),
('Controle e Proteção Ambiental',(SELECT id_curso FROM curso WHERE slug='edificacoes')),
('Instalações Elétricas',(SELECT id_curso FROM curso WHERE slug='edificacoes')),
('Instalações Hidráulicas',(SELECT id_curso FROM curso WHERE slug='edificacoes')),
('Instalações Prediais',(SELECT id_curso FROM curso WHERE slug='edificacoes')),
('Introdução à Construção Civil',(SELECT id_curso FROM curso WHERE slug='edificacoes')),
('Materiais de Construção',(SELECT id_curso FROM curso WHERE slug='edificacoes')),
('Mecânica dos Solos',(SELECT id_curso FROM curso WHERE slug='edificacoes')),
('Projetos em Construção Civil',(SELECT id_curso FROM curso WHERE slug='edificacoes')),
('Segurança do Trabalho na Construção Civil',(SELECT id_curso FROM curso WHERE slug='edificacoes')),
('Sistemas Estruturais',(SELECT id_curso FROM curso WHERE slug='edificacoes')),
('Técnicas Construtivas',(SELECT id_curso FROM curso WHERE slug='edificacoes')),
('Topografia',(SELECT id_curso FROM curso WHERE slug='edificacoes')),

('Análise Ambiental',(SELECT id_curso FROM curso WHERE slug='biotecnologia')),
('Bioquímica',(SELECT id_curso FROM curso WHERE slug='biotecnologia')),
('Bromatologia',(SELECT id_curso FROM curso WHERE slug='biotecnologia')),
('Fundamentos da Biotecnologia',(SELECT id_curso FROM curso WHERE slug='biotecnologia')),
('Gestão da Qualidade',(SELECT id_curso FROM curso WHERE slug='biotecnologia')),
('Microbiologia Industrial',(SELECT id_curso FROM curso WHERE slug='biotecnologia')),
('Processos Agroindustriais',(SELECT id_curso FROM curso WHERE slug='biotecnologia')),
('Processos Industriais',(SELECT id_curso FROM curso WHERE slug='biotecnologia')),
('Química Analítica Aplicada',(SELECT id_curso FROM curso WHERE slug='biotecnologia'));

-- ---------------- Formação comum (FGB e PFO) ----------------
INSERT INTO formacao_comum (bloco, ordem, nome, aulas_s1, aulas_s2, aulas_s3, horas_s1, horas_s2, horas_s3, observacao) VALUES
('FGB', 1,'Arte',2,0,0,NULL,NULL,NULL,NULL),
('FGB', 2,'Educação Física',2,0,2,NULL,NULL,NULL,NULL),
('FGB', 3,'Língua Inglesa',NULL,NULL,NULL,NULL,NULL,NULL,'Conforme a matriz; há registros de P/NP em algumas versões. Valor não informado no resumo.'),
('FGB', 4,'Língua Portuguesa',3,3,4,NULL,NULL,NULL,'Valores das matrizes sem P/NP explícito.'),
('FGB', 5,'Filosofia',2,0,0,NULL,NULL,NULL,NULL),
('FGB', 6,'Geografia',2,2,0,NULL,NULL,NULL,NULL),
('FGB', 7,'História',2,2,0,NULL,NULL,NULL,'Em algumas matrizes aparece P/NP.'),
('FGB', 8,'Sociologia',0,2,0,NULL,NULL,NULL,NULL),
('FGB', 9,'Matemática',3,3,4,NULL,NULL,NULL,NULL),
('FGB',10,'Física',2,0,2,NULL,NULL,NULL,NULL),
('FGB',11,'Química',2,2,0,NULL,NULL,NULL,NULL),
('FGB',12,'Biologia',2,2,0,NULL,NULL,NULL,NULL),
('FGB',99,'Subtotal da Formação Geral Básica',24,18,12,800,600,400,NULL),
('PFO', 1,'Projeto de Vida',2,1,1,67,33,33,NULL),
('PFO', 2,'Educação Financeira',1,1,1,33,33,33,NULL),
('PFO',99,'Subtotal da Parte Flexível Obrigatória',3,2,2,100,66,66,NULL);