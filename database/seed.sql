
USE sharktech_ceep;

-- ---------------------------------------------------------------------
-- Eixos tecnologicos (Catalogo Nacional de cursos Tecnicos)
-- ---------------------------------------------------------------------
INSERT INTO area_conhecimento (id_area, nome) VALUES
  (1, 'Informação e Comunicação'),
  (2, 'Controle e Processos Industriais'),
  (3, 'Infraestrutura'),
  (4, 'Ambiente e Saúde'),
  (5, 'Produção Industrial');

-- ---------------------------------------------------------------------
-- cursos
-- Os NOMES são dado confirmado (constam na documentação do projeto).
-- A vinculação ao eixo é PROVISÓRIA (baseada no CNCT) e precisa ser
-- validada pela coordenação pedagógica.
-- Turno, duração, vagas, descrição, perfil e requisitos: PENDENTES.
-- ---------------------------------------------------------------------
INSERT INTO curso (nome, slug, id_area) VALUES
  ('Biotecnologia',                 'biotecnologia',                 4),
  ('Desenvolvimento de Sistemas',   'desenvolvimento-de-sistemas',   1),
  ('Edificações',                   'edificacoes',                   3),
  ('Eletromecânica',                'eletromecanica',                2),
  ('Eletrônica',                    'eletronica',                    2),
  ('Farmácia',                      'farmacia',                      4),
  ('Manutenção Automotiva',         'manutencao-automotiva',         2),
  ('Mecânica',                      'mecanica',                      2),
  ('Meio Ambiente',                 'meio-ambiente',                 4),
  ('Programação de Jogos Digitais', 'programacao-de-jogos-digitais', 1),
  ('Química',                       'quimica',                       5);

-- ---------------------------------------------------------------------
-- Conteúdo de demonstração — REMOVER ANTES DE PUBLICAR
-- ---------------------------------------------------------------------
INSERT INTO noticia (titulo, resumo, Conteúdo, categoria, publicada) VALUES
  ('[EXEMPLO] Periodo de matriculas para o proximo ano letivo',
   'Conteúdo de demonstração. Substituir por comunicado real da secretaria.',
   'Este registro existe apenas para demonstrar o funcionamento da pagina de noticias e comunicados. O texto definitivo deve ser fornecido pela secretaria do CEEP Curitiba.',
   'comunicado', 1),
  ('[EXEMPLO] Mostra de projetos dos cursos tecnicos',
   'Conteúdo de demonstração. Substituir por noticia real da instituicao.',
   'Este registro existe apenas para demonstrar o funcionamento da pagina de noticias e comunicados. O texto definitivo deve ser fornecido pela instituicao.',
   'evento', 1);

INSERT INTO documento (titulo, descricao, categoria, url_arquivo, data_publicacao) VALUES
  ('[EXEMPLO] Edital de matricula',
   'Documento de demonstração. Substituir pelo arquivo oficial.',
   'edital', '#', '2026-01-01');






