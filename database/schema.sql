-- =====================================================================
-- Shark Tech — Novo Site Institucional do CEEP Curitiba
-- Schema do banco de dados (MySQL 8+)
--
-- Base: modelagem da documentacao (secao 4.2 do PDF do Projeto Integrador).
-- Alteracoes feitas em relacao ao DER original estao marcadas com [ALTERACAO].
-- A justificativa de cada uma esta no README.md (secao "Alteracoes no DER").
-- =====================================================================

DROP DATABASE IF EXISTS sharktech_ceep;

CREATE DATABASE sharktech_ceep
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE sharktech_ceep;

-- ---------------------------------------------------------------------
-- AREA DE CONHECIMENTO
-- ---------------------------------------------------------------------

CREATE TABLE area_conhecimento (
  id_area INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- CURSO
-- ---------------------------------------------------------------------

CREATE TABLE curso (
  id_curso            INT AUTO_INCREMENT PRIMARY KEY,
  nome                VARCHAR(120) NOT NULL,
  slug                VARCHAR(120) NOT NULL UNIQUE,
  id_area             INT NULL,
  turno               VARCHAR(60) NULL,
  duracao             VARCHAR(60) NULL,
  descricao           TEXT NULL,
  vagas               INT NULL,

  -- Novas informacoes provenientes das matrizes curriculares
  carga_horaria_total INT NULL,
  codigo_itinerario   VARCHAR(20) NULL,

  imagem_capa         VARCHAR(200) NULL,
  perfil_egresso      TEXT NULL,
  requisitos_ingresso TEXT NULL,

  -- Divergencias ou observacoes da matriz curricular
  observacao_matriz   TEXT NULL,

  ativo               TINYINT(1) NOT NULL DEFAULT 1,

  CONSTRAINT fk_curso_area FOREIGN KEY (id_area)
    REFERENCES area_conhecimento (id_area)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- PROFESSOR
-- ---------------------------------------------------------------------

CREATE TABLE professor (
  id_professor  INT AUTO_INCREMENT PRIMARY KEY,
  nome          VARCHAR(120) NOT NULL,
  especialidade VARCHAR(120) NULL,
  id_curso      INT NULL,

  CONSTRAINT fk_professor_curso FOREIGN KEY (id_curso)
    REFERENCES curso (id_curso)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- DISCIPLINA
-- ---------------------------------------------------------------------

CREATE TABLE disciplina (
  id_disciplina INT AUTO_INCREMENT PRIMARY KEY,
  nome          VARCHAR(120) NOT NULL,
  carga_horaria INT NULL,
  ementa        TEXT NULL,
  id_curso      INT NOT NULL,
  id_professor  INT NULL,

  CONSTRAINT fk_disciplina_curso FOREIGN KEY (id_curso)
    REFERENCES curso (id_curso)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT fk_disciplina_professor FOREIGN KEY (id_professor)
    REFERENCES professor (id_professor)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- ALUNO
-- ---------------------------------------------------------------------

CREATE TABLE aluno (
  id_aluno      INT AUTO_INCREMENT PRIMARY KEY,
  nome          VARCHAR(120) NOT NULL,
  email         VARCHAR(160) NOT NULL UNIQUE,
  turma         VARCHAR(60) NULL,
  data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_curso      INT NULL,

  CONSTRAINT fk_aluno_curso FOREIGN KEY (id_curso)
    REFERENCES curso (id_curso)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- AVALIACAO (atende RF03, RF04 e RF08)
-- ---------------------------------------------------------------------

CREATE TABLE avaliacao (
  id_avaliacao   INT AUTO_INCREMENT PRIMARY KEY,
  nota            TINYINT NULL,
  comentario      TEXT NOT NULL,
  data_avaliacao  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status          ENUM('pendente', 'aprovada', 'rejeitada')
                  NOT NULL DEFAULT 'pendente',
  tipo            ENUM('avaliacao', 'depoimento')
                  NOT NULL DEFAULT 'avaliacao',
  id_aluno        INT NOT NULL,
  id_curso        INT NOT NULL,

  CONSTRAINT fk_avaliacao_aluno FOREIGN KEY (id_aluno)
    REFERENCES aluno (id_aluno)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT fk_avaliacao_curso FOREIGN KEY (id_curso)
    REFERENCES curso (id_curso)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT ck_avaliacao_nota
    CHECK (nota IS NULL OR (nota BETWEEN 1 AND 5))
) ENGINE=InnoDB;

CREATE INDEX idx_avaliacao_curso_status
  ON avaliacao (id_curso, status, tipo);

-- ---------------------------------------------------------------------
-- USUARIO_ADMIN [ALTERACAO]
-- ---------------------------------------------------------------------

CREATE TABLE usuario_admin (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(120) NOT NULL,
  email      VARCHAR(160) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  perfil     ENUM('admin', 'editor') NOT NULL DEFAULT 'admin',
  criado_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- NOTICIA [ALTERACAO]
-- ---------------------------------------------------------------------

CREATE TABLE noticia (
  id_noticia      INT AUTO_INCREMENT PRIMARY KEY,
  titulo          VARCHAR(180) NOT NULL,
  resumo          VARCHAR(300) NULL,
  conteudo        TEXT NOT NULL,
  categoria       ENUM('noticia', 'comunicado', 'evento')
                  NOT NULL DEFAULT 'noticia',
  data_publicacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  publicada       TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- DOCUMENTO [ALTERACAO]
-- ---------------------------------------------------------------------

CREATE TABLE documento (
  id_documento    INT AUTO_INCREMENT PRIMARY KEY,
  titulo          VARCHAR(180) NOT NULL,
  descricao       VARCHAR(300) NULL,
  categoria       ENUM(
                    'edital',
                    'formulario',
                    'regulamento',
                    'calendario',
                    'outro'
                  ) NOT NULL DEFAULT 'outro',
  url_arquivo     VARCHAR(300) NOT NULL,
  data_publicacao DATE NOT NULL,
  publicado       TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- CURSO_SERIE
-- Informacoes de carga horaria e itinerario por serie
-- ---------------------------------------------------------------------

CREATE TABLE curso_serie (
  id_curso           INT NOT NULL,
  serie              TINYINT NOT NULL,
  itinerario_semanal INT NULL,
  itinerario_anual   INT NULL,
  total_semanal      INT NULL,
  total_anual        INT NULL,

  PRIMARY KEY (id_curso, serie),

  CONSTRAINT fk_serie_curso FOREIGN KEY (id_curso)
    REFERENCES curso (id_curso)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- FORMACAO_COMUM
-- Formacao Geral Basica (FGB) e Parte Flexivel Obrigatoria (PFO)
-- ---------------------------------------------------------------------

CREATE TABLE formacao_comum (
  id_item     INT AUTO_INCREMENT PRIMARY KEY,
  bloco       ENUM('FGB', 'PFO') NOT NULL,
  ordem       INT NOT NULL,
  nome        VARCHAR(120) NOT NULL,

  aulas_s1    TINYINT NULL,
  aulas_s2    TINYINT NULL,
  aulas_s3    TINYINT NULL,

  horas_s1    SMALLINT NULL,
  horas_s2    SMALLINT NULL,
  horas_s3    SMALLINT NULL,

  observacao  VARCHAR(300) NULL
) ENGINE=InnoDB;