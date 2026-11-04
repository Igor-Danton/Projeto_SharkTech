-- Inclusão idempotente das matrizes dos cursos 2533, 2532, 2530 e 2529.
-- Compatível com MySQL/TiDB: DDL é verificado pelo information_schema porque
-- alterações de esquema fazem commit implícito nesses bancos.
USE sharktech_ceep;
SET NAMES utf8mb4;

-- Novos campos do curso.
SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'curso'
      AND column_name = 'carga_horaria_minima') = 0,
  'ALTER TABLE curso ADD COLUMN carga_horaria_minima INT NULL AFTER carga_horaria_total',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'curso'
      AND column_name = 'codigo_matriz') = 0,
  'ALTER TABLE curso ADD COLUMN codigo_matriz VARCHAR(20) NULL AFTER codigo_itinerario',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'curso'
      AND column_name = 'modalidade') = 0,
  'ALTER TABLE curso ADD COLUMN modalidade VARCHAR(100) NULL AFTER codigo_matriz',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'curso'
      AND column_name = 'ano_implantacao') = 0,
  'ALTER TABLE curso ADD COLUMN ano_implantacao SMALLINT NULL AFTER modalidade',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'curso'
      AND column_name = 'dias_letivos_anuais') = 0,
  'ALTER TABLE curso ADD COLUMN dias_letivos_anuais SMALLINT NULL AFTER ano_implantacao',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

-- Resumos por série e dados adicionais para os componentes técnicos.
SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'curso_serie'
      AND column_name = 'formacao_geral_semanal') = 0,
  'ALTER TABLE curso_serie ADD COLUMN formacao_geral_semanal INT NULL',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'curso_serie'
      AND column_name = 'formacao_geral_anual') = 0,
  'ALTER TABLE curso_serie ADD COLUMN formacao_geral_anual INT NULL',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'curso_serie'
      AND column_name = 'aprofundamento_semanal') = 0,
  'ALTER TABLE curso_serie ADD COLUMN aprofundamento_semanal INT NULL',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'curso_serie'
      AND column_name = 'aprofundamento_anual') = 0,
  'ALTER TABLE curso_serie ADD COLUMN aprofundamento_anual INT NULL',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'curso_serie'
      AND column_name = 'diversificada_semanal') = 0,
  'ALTER TABLE curso_serie ADD COLUMN diversificada_semanal INT NULL',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'curso_serie'
      AND column_name = 'diversificada_anual') = 0,
  'ALTER TABLE curso_serie ADD COLUMN diversificada_anual INT NULL',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

-- Componentes técnicos reutilizam a tabela disciplina existente.
SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'disciplina'
      AND column_name = 'grupo_curricular') = 0,
  'ALTER TABLE disciplina ADD COLUMN grupo_curricular VARCHAR(70) NULL',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'disciplina'
      AND column_name = 'codigo_componente') = 0,
  'ALTER TABLE disciplina ADD COLUMN codigo_componente VARCHAR(20) NULL',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'disciplina'
      AND column_name = 'aulas_s1') = 0,
  'ALTER TABLE disciplina ADD COLUMN aulas_s1 TINYINT NULL',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'disciplina'
      AND column_name = 'aulas_s2') = 0,
  'ALTER TABLE disciplina ADD COLUMN aulas_s2 TINYINT NULL',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'disciplina'
      AND column_name = 'aulas_s3') = 0,
  'ALTER TABLE disciplina ADD COLUMN aulas_s3 TINYINT NULL',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'disciplina'
      AND column_name = 'horas_s1') = 0,
  'ALTER TABLE disciplina ADD COLUMN horas_s1 SMALLINT NULL',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'disciplina'
      AND column_name = 'horas_s2') = 0,
  'ALTER TABLE disciplina ADD COLUMN horas_s2 SMALLINT NULL',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'disciplina'
      AND column_name = 'horas_s3') = 0,
  'ALTER TABLE disciplina ADD COLUMN horas_s3 SMALLINT NULL',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'formacao_comum'
      AND column_name = 'id_curso') = 0,
  'ALTER TABLE formacao_comum ADD COLUMN id_curso INT NULL AFTER id_item',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'formacao_comum'
      AND column_name = 'bloco'
      AND (data_type <> 'varchar' OR character_maximum_length < 60)) = 1,
  'ALTER TABLE formacao_comum MODIFY COLUMN bloco VARCHAR(60) NOT NULL',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = DATABASE() AND table_name = 'disciplina'
      AND index_name = 'uq_disciplina_curso_codigo') = 0,
  'CREATE UNIQUE INDEX uq_disciplina_curso_codigo ON disciplina (id_curso, codigo_componente)',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = DATABASE() AND table_name = 'curso'
      AND index_name = 'uq_curso_codigo_matriz') = 0,
  'CREATE UNIQUE INDEX uq_curso_codigo_matriz ON curso (codigo_matriz)',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = DATABASE() AND table_name = 'formacao_comum'
      AND index_name = 'uq_formacao_curso_bloco_nome') = 0,
  'CREATE UNIQUE INDEX uq_formacao_curso_bloco_nome ON formacao_comum (id_curso, bloco, nome)',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.table_constraints
    WHERE constraint_schema = DATABASE() AND table_name = 'formacao_comum'
      AND constraint_name = 'fk_formacao_comum_curso') = 0,
  'ALTER TABLE formacao_comum ADD CONSTRAINT fk_formacao_comum_curso FOREIGN KEY (id_curso) REFERENCES curso (id_curso) ON UPDATE CASCADE ON DELETE CASCADE',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

START TRANSACTION;

-- Reaproveita cursos já semeados; a verificação considera código, slug e nome.
INSERT INTO curso (
  nome, slug, descricao, carga_horaria_minima, codigo_matriz, modalidade,
  ano_implantacao, dias_letivos_anuais, ativo
)
SELECT 'Técnico em Mecânica', 'mecanica',
       'Síntese curricular (não oficial): tecnologia dos materiais, desenho mecânico, manutenção de máquinas e equipamentos, mecânica, processos de fabricação, projetos mecânicos, resistência dos materiais e segurança do trabalho.',
       3000, '2533', 'Integrado ao Ensino Médio', 2025, 200, 1
 WHERE NOT EXISTS (
   SELECT 1 FROM curso
    WHERE codigo_matriz = '2533' OR slug = 'mecanica'
       OR nome COLLATE utf8mb4_unicode_ci IN ('Mecânica', 'Técnico em Mecânica')
 );

INSERT INTO curso (
  nome, slug, descricao, carga_horaria_minima, codigo_matriz, modalidade,
  ano_implantacao, dias_letivos_anuais, ativo
)
SELECT 'Técnico em Manutenção Automotiva', 'manutencao-automotiva',
       'Síntese curricular (não oficial): mecânica e manutenção de veículos, motores de combustão interna, sistemas elétricos e eletrônicos automotivos, metrologia, processos de fabricação, gestão industrial e sistemas hidráulicos e pneumáticos.',
       3000, '2532', 'Integrado ao Ensino Médio', 2025, 200, 1
 WHERE NOT EXISTS (
   SELECT 1 FROM curso
    WHERE codigo_matriz = '2532' OR slug = 'manutencao-automotiva'
       OR nome COLLATE utf8mb4_unicode_ci IN ('Manutenção Automotiva', 'Técnico em Manutenção Automotiva')
 );

INSERT INTO curso (
  nome, slug, descricao, carga_horaria_minima, codigo_matriz, modalidade,
  ano_implantacao, dias_letivos_anuais, ativo
)
SELECT 'Técnico em Eletrônica', 'eletronica',
       'Síntese curricular (não oficial): eletricidade e eletrônica analógica, digital e de potência, desenho elétrico, sistemas eletrônicos, automação industrial, máquinas elétricas, redes industriais e telecomunicações.',
       3000, '2530', 'Integrado ao Ensino Médio', 2025, 200, 1
 WHERE NOT EXISTS (
   SELECT 1 FROM curso
    WHERE codigo_matriz = '2530' OR slug = 'eletronica'
       OR nome COLLATE utf8mb4_unicode_ci IN ('Eletrônica', 'Técnico em Eletrônica')
 );

INSERT INTO curso (
  nome, slug, descricao, carga_horaria_minima, codigo_matriz, modalidade,
  ano_implantacao, dias_letivos_anuais, ativo
)
SELECT 'Técnico em Eletromecânica', 'eletromecanica',
       'Síntese curricular (não oficial): eletricidade, eletrônica, mecânica, automação e instalações elétricas, manutenção de máquinas, máquinas elétricas, processos de fabricação, projetos eletromecânicos e sistemas hidráulicos e pneumáticos.',
       3000, '2529', 'Integrado ao Ensino Médio', 2025, 200, 1
 WHERE NOT EXISTS (
   SELECT 1 FROM curso
    WHERE codigo_matriz = '2529' OR slug = 'eletromecanica'
       OR nome COLLATE utf8mb4_unicode_ci IN ('Eletromecânica', 'Técnico em Eletromecânica')
 );

-- Completa e ativa somente os registros identificados por código, slug ou nome.
UPDATE curso
   SET nome = 'Técnico em Mecânica', ativo = 1,
       descricao = 'Síntese curricular (não oficial): tecnologia dos materiais, desenho mecânico, manutenção de máquinas e equipamentos, mecânica, processos de fabricação, projetos mecânicos, resistência dos materiais e segurança do trabalho.',
       carga_horaria_minima = 3000, codigo_matriz = '2533',
       modalidade = 'Integrado ao Ensino Médio', ano_implantacao = 2025,
       dias_letivos_anuais = 200
 WHERE codigo_matriz = '2533' OR (codigo_matriz IS NULL AND
       (slug = 'mecanica' OR nome COLLATE utf8mb4_unicode_ci IN ('Mecânica', 'Técnico em Mecânica')));

UPDATE curso
   SET nome = 'Técnico em Manutenção Automotiva', ativo = 1,
       descricao = 'Síntese curricular (não oficial): mecânica e manutenção de veículos, motores de combustão interna, sistemas elétricos e eletrônicos automotivos, metrologia, processos de fabricação, gestão industrial e sistemas hidráulicos e pneumáticos.',
       carga_horaria_minima = 3000, codigo_matriz = '2532',
       modalidade = 'Integrado ao Ensino Médio', ano_implantacao = 2025,
       dias_letivos_anuais = 200
 WHERE codigo_matriz = '2532' OR (codigo_matriz IS NULL AND
       (slug = 'manutencao-automotiva' OR nome COLLATE utf8mb4_unicode_ci IN ('Manutenção Automotiva', 'Técnico em Manutenção Automotiva')));

UPDATE curso
   SET nome = 'Técnico em Eletrônica', ativo = 1,
       descricao = 'Síntese curricular (não oficial): eletricidade e eletrônica analógica, digital e de potência, desenho elétrico, sistemas eletrônicos, automação industrial, máquinas elétricas, redes industriais e telecomunicações.',
       carga_horaria_minima = 3000, codigo_matriz = '2530',
       modalidade = 'Integrado ao Ensino Médio', ano_implantacao = 2025,
       dias_letivos_anuais = 200
 WHERE codigo_matriz = '2530' OR (codigo_matriz IS NULL AND
       (slug = 'eletronica' OR nome COLLATE utf8mb4_unicode_ci IN ('Eletrônica', 'Técnico em Eletrônica')));

UPDATE curso
   SET nome = 'Técnico em Eletromecânica', ativo = 1,
       descricao = 'Síntese curricular (não oficial): eletricidade, eletrônica, mecânica, automação e instalações elétricas, manutenção de máquinas, máquinas elétricas, processos de fabricação, projetos eletromecânicos e sistemas hidráulicos e pneumáticos.',
       carga_horaria_minima = 3000, codigo_matriz = '2529',
       modalidade = 'Integrado ao Ensino Médio', ano_implantacao = 2025,
       dias_letivos_anuais = 200
 WHERE codigo_matriz = '2529' OR (codigo_matriz IS NULL AND
       (slug = 'eletromecanica' OR nome COLLATE utf8mb4_unicode_ci IN ('Eletromecânica', 'Técnico em Eletromecânica')));

-- Biotecnologia só é atualizada se já estiver cadastrada; não é criada nesta migration.
UPDATE curso c
JOIN area_conhecimento a
  ON a.nome COLLATE utf8mb4_unicode_ci = 'Produção Industrial'
   SET c.id_area = a.id_area,
       c.descricao = 'Formação técnica voltada às atividades laboratoriais de biotecnologia e biociências, controle de processos industriais e laboratoriais, preparo de materiais e reagentes, análise de materiais biológicos e controle de qualidade.',
       c.perfil_egresso = 'O profissional poderá executar atividades laboratoriais de biotecnologia e biociências, preparar soluções e reagentes, analisar materiais biológicos, cultivar microrganismos, células e tecidos, trabalhar com biomoléculas e participar de processos de controle de qualidade.',
       c.requisitos_ingresso = 'Integrado ao Ensino Médio: ter concluído o Ensino Fundamental. Subsequente: ter concluído o Ensino Médio.'
 WHERE c.slug = 'biotecnologia';

-- Carga mínima e totais anuais ficam em campos distintos.
INSERT INTO curso_serie (
  id_curso, serie,
  formacao_geral_semanal, formacao_geral_anual,
  aprofundamento_semanal, aprofundamento_anual,
  itinerario_semanal, itinerario_anual,
  diversificada_semanal, diversificada_anual,
  total_semanal, total_anual
)
SELECT c.id_curso, s.serie, 18, 600, 3, 100, 9, 300,
       4, s.diversificada_anual, 34, s.total_anual
  FROM curso c
  JOIN (
    SELECT 1 AS serie, 133 AS diversificada_anual, 1133 AS total_anual
    UNION ALL SELECT 2, 133, 1133
    UNION ALL SELECT 3, 134, 1134
  ) s
 WHERE c.codigo_matriz IN ('2533', '2532', '2530', '2529')
ON DUPLICATE KEY UPDATE
  formacao_geral_semanal = VALUES(formacao_geral_semanal),
  formacao_geral_anual = VALUES(formacao_geral_anual),
  aprofundamento_semanal = VALUES(aprofundamento_semanal),
  aprofundamento_anual = VALUES(aprofundamento_anual),
  itinerario_semanal = VALUES(itinerario_semanal),
  itinerario_anual = VALUES(itinerario_anual),
  diversificada_semanal = VALUES(diversificada_semanal),
  diversificada_anual = VALUES(diversificada_anual),
  total_semanal = VALUES(total_semanal),
  total_anual = VALUES(total_anual);

-- Atualiza Biotecnologia apenas quando o curso já existe; não inventa modalidade única.
INSERT INTO curso_serie (
  id_curso, serie,
  formacao_geral_semanal, formacao_geral_anual,
  itinerario_semanal, itinerario_anual, total_semanal, total_anual
)
SELECT c.id_curso, s.serie,
       s.formacao_geral_semanal, s.formacao_geral_anual,
       s.itinerario_semanal, s.itinerario_anual, s.total_semanal, s.total_anual
  FROM curso c
  JOIN (
    SELECT 1 AS serie, 24 AS formacao_geral_semanal, 800 AS formacao_geral_anual,
           3 AS itinerario_semanal, 100 AS itinerario_anual, 30 AS total_semanal, 1000 AS total_anual
    UNION ALL SELECT 2, 18, 600, 14, 467, 34, 1133
    UNION ALL SELECT 3, 12, 400, 19, 633, 33, 1099
  ) s
 WHERE c.slug = 'biotecnologia'
ON DUPLICATE KEY UPDATE
  formacao_geral_semanal = VALUES(formacao_geral_semanal),
  formacao_geral_anual = VALUES(formacao_geral_anual),
  itinerario_semanal = VALUES(itinerario_semanal),
  itinerario_anual = VALUES(itinerario_anual),
  total_semanal = VALUES(total_semanal),
  total_anual = VALUES(total_anual);

-- Formação Geral Básica: a distribuição individual por componente não foi informada.
INSERT INTO formacao_comum (
  id_curso, bloco, ordem, nome,
  aulas_s1, aulas_s2, aulas_s3, horas_s1, horas_s2, horas_s3, observacao
)
SELECT c.id_curso, 'FGB', f.ordem, f.nome,
       NULL, NULL, NULL, NULL, NULL, NULL,
       'Distribuição semanal e anual por componente não informada na matriz.'
  FROM curso c
  JOIN (
    SELECT 1 AS ordem, 'Língua Portuguesa' AS nome
    UNION ALL SELECT 2, 'Arte'
    UNION ALL SELECT 3, 'Educação Física'
    UNION ALL SELECT 4, 'Língua Inglesa'
    UNION ALL SELECT 5, 'Matemática'
    UNION ALL SELECT 6, 'Educação Financeira'
    UNION ALL SELECT 7, 'Educação Digital'
    UNION ALL SELECT 8, 'Computação/Programação e IA'
    UNION ALL SELECT 9, 'Química'
    UNION ALL SELECT 10, 'Física'
    UNION ALL SELECT 11, 'Biologia'
    UNION ALL SELECT 12, 'Geografia'
    UNION ALL SELECT 13, 'História'
    UNION ALL SELECT 14, 'Sociologia'
    UNION ALL SELECT 15, 'Filosofia'
  ) f
 WHERE c.codigo_matriz IN ('2533', '2532', '2530', '2529')
ON DUPLICATE KEY UPDATE
  ordem = VALUES(ordem),
  aulas_s1 = VALUES(aulas_s1), aulas_s2 = VALUES(aulas_s2), aulas_s3 = VALUES(aulas_s3),
  horas_s1 = VALUES(horas_s1), horas_s2 = VALUES(horas_s2), horas_s3 = VALUES(horas_s3),
  observacao = VALUES(observacao);

-- Parte Diversificada: Língua Espanhola ofertada pelo CELEM, matrícula facultativa.
INSERT INTO formacao_comum (
  id_curso, bloco, ordem, nome,
  aulas_s1, aulas_s2, aulas_s3, horas_s1, horas_s2, horas_s3, observacao
)
SELECT c.id_curso, d.bloco, d.ordem, d.nome,
       d.aulas_s1, d.aulas_s2, d.aulas_s3,
       d.horas_s1, d.horas_s2, d.horas_s3, d.observacao
  FROM curso c
  JOIN (
    SELECT 'Parte Diversificada' AS bloco, 1 AS ordem, 'Língua Espanhola' AS nome,
           4 AS aulas_s1, 4 AS aulas_s2, 4 AS aulas_s3,
           133 AS horas_s1, 133 AS horas_s2, 134 AS horas_s3,
           'Oferta pelo CELEM; matrícula facultativa para o estudante, conforme a observação da matriz.' AS observacao
  ) d
 WHERE c.codigo_matriz IN ('2533', '2532', '2530', '2529')
ON DUPLICATE KEY UPDATE
  ordem = VALUES(ordem),
  aulas_s1 = VALUES(aulas_s1), aulas_s2 = VALUES(aulas_s2), aulas_s3 = VALUES(aulas_s3),
  horas_s1 = VALUES(horas_s1), horas_s2 = VALUES(horas_s2), horas_s3 = VALUES(horas_s3),
  observacao = VALUES(observacao);

-- Aprofundamento e itinerário técnico-profissional.
-- Horas anuais só são preenchidas quando aparecem na tabela detalhada do documento;
-- aulas semanais por componente permanecem NULL quando não foram fornecidas.
INSERT INTO disciplina (
  id_curso, nome, grupo_curricular, codigo_componente,
  aulas_s1, aulas_s2, aulas_s3, horas_s1, horas_s2, horas_s3
)
SELECT c.id_curso, d.nome, d.bloco, d.codigo_componente,
       NULL, NULL, NULL, d.horas_s1, d.horas_s2, d.horas_s3
  FROM curso c
  JOIN (
    SELECT '2533' AS codigo_curso, 'Aprofundamento' AS bloco, '3916' AS codigo_componente, 1 AS ordem, 'Tecnologia mecânica' AS nome, 100 AS horas_s1, NULL AS horas_s2, NULL AS horas_s3
    UNION ALL SELECT '2533', 'Aprofundamento', '3828', 2, 'Desenho mecânico', NULL, 100, NULL
    UNION ALL SELECT '2533', 'Aprofundamento', '857', 3, 'Eletrotécnica', NULL, NULL, NULL
    UNION ALL SELECT '2533', 'Aprofundamento', NULL, 99, 'Subtotal do Aprofundamento', 100, 100, 100
    UNION ALL SELECT '2533', 'Itinerário Formativo técnico-profissional', '3918', 1, 'Introdução à mecânica', 33, NULL, NULL
    UNION ALL SELECT '2533', 'Itinerário Formativo técnico-profissional', '1682', 2, 'Manutenção de máquinas e equipamentos', 67, NULL, NULL
    UNION ALL SELECT '2533', 'Itinerário Formativo técnico-profissional', '3910', 3, 'Mecânica', 133, NULL, NULL
    UNION ALL SELECT '2533', 'Itinerário Formativo técnico-profissional', '3920', 4, 'Processos de fabricação', NULL, NULL, NULL
    UNION ALL SELECT '2533', 'Itinerário Formativo técnico-profissional', '3921', 5, 'Projetos mecânicos', NULL, NULL, 100
    UNION ALL SELECT '2533', 'Itinerário Formativo técnico-profissional', '1525', 6, 'Resistência dos materiais', NULL, NULL, 100
    UNION ALL SELECT '2533', 'Itinerário Formativo técnico-profissional', '4014', 7, 'Segurança do trabalho', 67, NULL, NULL
    UNION ALL SELECT '2533', 'Itinerário Formativo técnico-profissional', NULL, 99, 'Subtotal do Itinerário Formativo técnico-profissional', 300, 300, 300

    UNION ALL SELECT '2532', 'Aprofundamento', '1522', 1, 'Tecnologia mecânica dos materiais', 100, NULL, NULL
    UNION ALL SELECT '2532', 'Aprofundamento', '3828', 2, 'Desenho mecânico', NULL, NULL, 100
    UNION ALL SELECT '2532', 'Aprofundamento', '1545', 3, 'Eletricidade', NULL, NULL, NULL
    UNION ALL SELECT '2532', 'Aprofundamento', NULL, 99, 'Subtotal do Aprofundamento', 100, 100, 100
    UNION ALL SELECT '2532', 'Itinerário Formativo técnico-profissional', '3082', 1, 'Eletricidade automotiva', NULL, NULL, 100
    UNION ALL SELECT '2532', 'Itinerário Formativo técnico-profissional', '3083', 2, 'Eletrônica automotiva', NULL, NULL, 100
    UNION ALL SELECT '2532', 'Itinerário Formativo técnico-profissional', '2141', 3, 'Gestão industrial', 67, NULL, NULL
    UNION ALL SELECT '2532', 'Itinerário Formativo técnico-profissional', '3085', 4, 'Mecânica automobilística', NULL, 100, NULL
    UNION ALL SELECT '2532', 'Itinerário Formativo técnico-profissional', '3919', 5, 'Mecânica e manutenção', 100, NULL, NULL
    UNION ALL SELECT '2532', 'Itinerário Formativo técnico-profissional', '1502', 6, 'Metrologia', 67, NULL, NULL
    UNION ALL SELECT '2532', 'Itinerário Formativo técnico-profissional', '3087', 7, 'Motores de combustão interna', NULL, 100, NULL
    UNION ALL SELECT '2532', 'Itinerário Formativo técnico-profissional', '3920', 8, 'Processos de fabricação', NULL, 100, NULL
    UNION ALL SELECT '2532', 'Itinerário Formativo técnico-profissional', '2129', 9, 'Segurança do trabalho e controle ambiental', 67, NULL, NULL
    UNION ALL SELECT '2532', 'Itinerário Formativo técnico-profissional', '3826', 10, 'Sistemas hidráulicos e pneumáticos', NULL, NULL, 100
    UNION ALL SELECT '2532', 'Itinerário Formativo técnico-profissional', NULL, 99, 'Subtotal do Itinerário Formativo técnico-profissional', 300, 300, 300

    UNION ALL SELECT '2530', 'Aprofundamento', '1909', 1, 'Desenho elétrico', 100, NULL, NULL
    UNION ALL SELECT '2530', 'Aprofundamento', '1547', 2, 'Automação industrial', NULL, 100, 100
    UNION ALL SELECT '2530', 'Aprofundamento', NULL, 99, 'Subtotal do Aprofundamento', 100, 100, 100
    UNION ALL SELECT '2530', 'Itinerário Formativo técnico-profissional', '1545', 1, 'Eletricidade', 200, NULL, NULL
    UNION ALL SELECT '2530', 'Itinerário Formativo técnico-profissional', '3805', 2, 'Eletrônica', NULL, 167, NULL
    UNION ALL SELECT '2530', 'Itinerário Formativo técnico-profissional', '2141', 3, 'Gestão industrial', 67, NULL, NULL
    UNION ALL SELECT '2530', 'Itinerário Formativo técnico-profissional', '3820', 4, 'Máquinas elétricas', NULL, NULL, 67
    UNION ALL SELECT '2530', 'Itinerário Formativo técnico-profissional', '3713', 5, 'Redes industriais', NULL, 67, NULL
    UNION ALL SELECT '2530', 'Itinerário Formativo técnico-profissional', '4376', 6, 'Segurança do trabalho', 33, NULL, NULL
    UNION ALL SELECT '2530', 'Itinerário Formativo técnico-profissional', '1548', 7, 'Sistemas digitais', NULL, NULL, 67
    UNION ALL SELECT '2530', 'Itinerário Formativo técnico-profissional', '1552', 8, 'Sistemas eletrônicos', NULL, 67, NULL
    UNION ALL SELECT '2530', 'Itinerário Formativo técnico-profissional', '3826', 9, 'Sistemas hidráulicos e pneumáticos', NULL, NULL, 67
    UNION ALL SELECT '2530', 'Itinerário Formativo técnico-profissional', '230', 10, 'Telecomunicações', NULL, NULL, 100
    UNION ALL SELECT '2530', 'Itinerário Formativo técnico-profissional', NULL, 99, 'Subtotal do Itinerário Formativo técnico-profissional', 300, 300, 300

    UNION ALL SELECT '2529', 'Aprofundamento', '1547', 1, 'Automação industrial', NULL, NULL, 67
    UNION ALL SELECT '2529', 'Aprofundamento', '1682', 2, 'Manutenção de máquinas e equipamentos', NULL, 67, NULL
    UNION ALL SELECT '2529', 'Aprofundamento', '3910', 3, 'Mecânica', 100, 33, 33
    UNION ALL SELECT '2529', 'Aprofundamento', NULL, 99, 'Subtotal do Aprofundamento', 100, 100, 100
    UNION ALL SELECT '2529', 'Itinerário Formativo técnico-profissional', '1545', 1, 'Eletricidade', 167, 67, NULL
    UNION ALL SELECT '2529', 'Itinerário Formativo técnico-profissional', '3805', 2, 'Eletrônica', NULL, 67, 67
    UNION ALL SELECT '2529', 'Itinerário Formativo técnico-profissional', '4033', 3, 'Gestão ambiental', 33, NULL, NULL
    UNION ALL SELECT '2529', 'Itinerário Formativo técnico-profissional', '3810', 4, 'Instalações elétricas', NULL, 67, NULL
    UNION ALL SELECT '2529', 'Itinerário Formativo técnico-profissional', '3820', 5, 'Máquinas elétricas', NULL, NULL, 67
    UNION ALL SELECT '2529', 'Itinerário Formativo técnico-profissional', '3920', 6, 'Processos de fabricação', NULL, 67, 67
    UNION ALL SELECT '2529', 'Itinerário Formativo técnico-profissional', '3808', 7, 'Projetos em eletromecânica', 67, 33, 33
    UNION ALL SELECT '2529', 'Itinerário Formativo técnico-profissional', '4014', 8, 'Segurança do trabalho', 33, NULL, NULL
    UNION ALL SELECT '2529', 'Itinerário Formativo técnico-profissional', '3826', 9, 'Sistemas hidráulicos e pneumáticos', NULL, NULL, 67
    UNION ALL SELECT '2529', 'Itinerário Formativo técnico-profissional', NULL, 99, 'Subtotal do Itinerário Formativo técnico-profissional', 300, 300, 300
  ) d ON d.codigo_curso = c.codigo_matriz
 WHERE c.codigo_matriz IN ('2533', '2532', '2530', '2529')
   AND d.codigo_componente IS NOT NULL
 ORDER BY d.codigo_curso, d.bloco, d.ordem
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  grupo_curricular = VALUES(grupo_curricular),
  aulas_s1 = VALUES(aulas_s1), aulas_s2 = VALUES(aulas_s2), aulas_s3 = VALUES(aulas_s3),
  horas_s1 = VALUES(horas_s1), horas_s2 = VALUES(horas_s2), horas_s3 = VALUES(horas_s3);

-- Biotecnologia: insere apenas componentes ainda ausentes, sem atribuir códigos ou cargas.
INSERT INTO disciplina (id_curso, nome)
SELECT c.id_curso, d.nome
  FROM curso c
 CROSS JOIN (
    SELECT 'Análise Ambiental' AS nome
    UNION ALL SELECT 'Bioquímica'
    UNION ALL SELECT 'Bromatologia'
    UNION ALL SELECT 'Fundamentos da Biotecnologia'
    UNION ALL SELECT 'Gestão da Qualidade'
    UNION ALL SELECT 'Microbiologia Industrial'
    UNION ALL SELECT 'Processos Agroindustriais'
    UNION ALL SELECT 'Processos Industriais'
    UNION ALL SELECT 'Química Analítica Aplicada'
  ) d
 WHERE c.slug = 'biotecnologia'
   AND NOT EXISTS (
     SELECT 1
       FROM disciplina existente
      WHERE existente.id_curso = c.id_curso
        AND existente.nome COLLATE utf8mb4_unicode_ci =
            d.nome COLLATE utf8mb4_unicode_ci
   );

-- Reaplica os valores fornecidos para Biotecnologia sem criar esse curso se ausente.
INSERT INTO formacao_comum (
  id_curso, bloco, ordem, nome,
  aulas_s1, aulas_s2, aulas_s3, horas_s1, horas_s2, horas_s3, observacao
)
SELECT c.id_curso, d.bloco, d.ordem, d.nome,
       d.aulas_s1, d.aulas_s2, d.aulas_s3, d.horas_s1, d.horas_s2, d.horas_s3, d.observacao
  FROM curso c
  JOIN (
    SELECT 'FGB' AS bloco, 1 AS ordem, 'Arte' AS nome, 2 AS aulas_s1, 0 AS aulas_s2, 0 AS aulas_s3, NULL AS horas_s1, NULL AS horas_s2, NULL AS horas_s3, NULL AS observacao
    UNION ALL SELECT 'FGB', 2, 'Educação Física', 2, 0, 2, NULL, NULL, NULL, NULL
    UNION ALL SELECT 'FGB', 3, 'Língua Inglesa', NULL, NULL, NULL, NULL, NULL, NULL, 'Aulas não especificadas no dado fornecido; não equivalem a zero.'
    UNION ALL SELECT 'FGB', 4, 'Língua Portuguesa', 3, 3, 4, NULL, NULL, NULL, NULL
    UNION ALL SELECT 'FGB', 5, 'Filosofia', 2, 0, 0, NULL, NULL, NULL, NULL
    UNION ALL SELECT 'FGB', 6, 'Geografia', 2, 2, 0, NULL, NULL, NULL, NULL
    UNION ALL SELECT 'FGB', 7, 'História', 2, 2, 0, NULL, NULL, NULL, NULL
    UNION ALL SELECT 'FGB', 8, 'Sociologia', 0, 2, 0, NULL, NULL, NULL, NULL
    UNION ALL SELECT 'FGB', 9, 'Matemática', 3, 3, 4, NULL, NULL, NULL, NULL
    UNION ALL SELECT 'FGB', 10, 'Física', 2, 0, 2, NULL, NULL, NULL, NULL
    UNION ALL SELECT 'FGB', 11, 'Química', 2, 2, 0, NULL, NULL, NULL, NULL
    UNION ALL SELECT 'FGB', 12, 'Biologia', 2, 2, 0, NULL, NULL, NULL, NULL
    UNION ALL SELECT 'FGB', 99, 'Subtotal da Formação Geral Básica', 24, 18, 12, 800, 600, 400, NULL
    UNION ALL SELECT 'PFO', 1, 'Projeto de Vida', 2, 1, 1, 67, 33, 33, NULL
    UNION ALL SELECT 'PFO', 2, 'Educação Financeira', 1, 1, 1, 33, 33, 33, NULL
    UNION ALL SELECT 'PFO', 99, 'Subtotal da Parte Flexível Obrigatória', 3, 2, 2, 100, 66, 66, NULL
  ) d
 WHERE c.slug = 'biotecnologia'
ON DUPLICATE KEY UPDATE
  ordem = VALUES(ordem),
  aulas_s1 = VALUES(aulas_s1), aulas_s2 = VALUES(aulas_s2), aulas_s3 = VALUES(aulas_s3),
  horas_s1 = VALUES(horas_s1), horas_s2 = VALUES(horas_s2), horas_s3 = VALUES(horas_s3),
  observacao = VALUES(observacao);

COMMIT;

-- Conferência: esperado 4 registros ativos com códigos distintos e 3 séries cada.
SELECT id_curso, codigo_matriz, nome, ativo, carga_horaria_minima, modalidade
  FROM curso
 WHERE codigo_matriz IN ('2533', '2532', '2530', '2529')
 ORDER BY codigo_matriz;

SELECT c.codigo_matriz, COUNT(s.serie) AS series_cadastradas
  FROM curso c
  LEFT JOIN curso_serie s ON s.id_curso = c.id_curso
 WHERE c.codigo_matriz IN ('2533', '2532', '2530', '2529')
 GROUP BY c.codigo_matriz
 ORDER BY c.codigo_matriz;

SELECT COUNT(*) AS total_cursos,
       SUM(ativo = 1) AS cursos_ativos
  FROM curso;
