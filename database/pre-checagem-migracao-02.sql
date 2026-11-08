-- PRÉ-CHECAGEM SOMENTE LEITURA — sharktech_ceep
-- Execute no MySQL Shell conectado ao TiDB Cloud antes da migration revisada.
-- Nenhum comando abaixo modifica dados ou estrutura.

USE sharktech_ceep;

SELECT DATABASE() AS banco, VERSION() AS versao;

-- Deve retornar os quatro registros conhecidos: IDs 4, 7, 5 e 8.
SELECT id_curso, nome, slug, ativo, id_area
  FROM curso
 WHERE slug IN ('mecanica', 'manutencao-automotiva', 'eletronica', 'eletromecanica')
 ORDER BY id_curso;

-- Estado atual do catálogo: esperado 11 registros, 7 ativos e 4 inativos.
SELECT COUNT(*) AS total_registros,
       SUM(ativo = 1) AS ativos,
       SUM(ativo = 0) AS inativos
  FROM curso;

-- Verifica códigos de matriz se a coluna já existir; no estado atual ela está ausente.
SELECT COLUMN_NAME
  FROM information_schema.columns
 WHERE table_schema = DATABASE()
   AND table_name = 'curso'
   AND column_name IN ('carga_horaria_minima', 'codigo_matriz', 'modalidade',
                       'ano_implantacao', 'dias_letivos_anuais')
 ORDER BY COLUMN_NAME;

-- Confirma a chave primária de curso_serie e ausência de duplicidades na chave lógica.
SHOW INDEX FROM curso_serie;
SELECT id_curso, serie, COUNT(*) AS repeticoes
  FROM curso_serie
 GROUP BY id_curso, serie
HAVING COUNT(*) > 1;

-- Mostra constraints e índices atuais das tabelas que serão ampliadas.
SHOW INDEX FROM disciplina;
SHOW INDEX FROM formacao_comum;

-- Se o resultado da listagem de cursos não corresponder aos quatro IDs/slugs esperados,
-- pare e não execute a migration até revisar o ambiente.
