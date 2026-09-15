
USE sharktech_ceep;

-- ---------------------------------------------------------------------
-- Eixos tecnologicos (Catalogo Nacional de Cursos Tecnicos)
-- ---------------------------------------------------------------------
INSERT INTO area_conhecimento (id_area, nome) VALUES
  (1, 'Informacao e Comunicacao'),
  (2, 'Controle e Processos Industriais'),
  (3, 'Infraestrutura'),
  (4, 'Ambiente e Saude'),
  (5, 'Producao Industrial');

-- ---------------------------------------------------------------------
-- Cursos
-- Os NOMES sao dado confirmado (constam na documentacao do projeto).
-- A vinculacao ao eixo e' PROVISORIA (baseada no CNCT) e precisa ser
-- validada pela coordenacao pedagogica.
-- Turno, duracao, vagas, descricao, perfil e requisitos: PENDENTES.
-- ---------------------------------------------------------------------
INSERT INTO curso (nome, slug, id_area) VALUES
  ('Biotecnologia',                 'biotecnologia',                 4),
  ('Desenvolvimento de Sistemas',   'desenvolvimento-de-sistemas',   1),
  ('Edificacoes',                   'edificacoes',                   3),
  ('Eletromecanica',                'eletromecanica',                2),
  ('Eletronica',                    'eletronica',                    2),
  ('Farmacia',                      'farmacia',                      4),
  ('Manutencao Automotiva',         'manutencao-automotiva',         2),
  ('Mecanica',                      'mecanica',                      2),
  ('Meio Ambiente',                 'meio-ambiente',                 4),
  ('Programacao de Jogos Digitais', 'programacao-de-jogos-digitais', 1),
  ('Quimica',                       'quimica',                       5);

-- ---------------------------------------------------------------------
-- Conteudo de demonstracao — REMOVER ANTES DE PUBLICAR
-- ---------------------------------------------------------------------
INSERT INTO noticia (titulo, resumo, conteudo, categoria, publicada) VALUES
  ('[EXEMPLO] Periodo de matriculas para o proximo ano letivo',
   'Conteudo de demonstracao. Substituir por comunicado real da secretaria.',
   'Este registro existe apenas para demonstrar o funcionamento da pagina de noticias e comunicados. O texto definitivo deve ser fornecido pela secretaria do CEEP Curitiba.',
   'comunicado', 1),
  ('[EXEMPLO] Mostra de projetos dos cursos tecnicos',
   'Conteudo de demonstracao. Substituir por noticia real da instituicao.',
   'Este registro existe apenas para demonstrar o funcionamento da pagina de noticias e comunicados. O texto definitivo deve ser fornecido pela instituicao.',
   'evento', 1);

INSERT INTO documento (titulo, descricao, categoria, url_arquivo, data_publicacao) VALUES
  ('[EXEMPLO] Edital de matricula',
   'Documento de demonstracao. Substituir pelo arquivo oficial.',
   'edital', '#', '2026-01-01');
