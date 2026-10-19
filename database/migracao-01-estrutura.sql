USE sharktech_ceep;

ALTER TABLE curso ADD COLUMN carga_horaria_total INT NULL AFTER vagas;
ALTER TABLE curso ADD COLUMN codigo_itinerario VARCHAR(20) NULL AFTER carga_horaria_total;
ALTER TABLE curso ADD COLUMN observacao_matriz TEXT NULL AFTER requisitos_ingresso;

CREATE TABLE IF NOT EXISTS curso_serie (
  id_curso           INT NOT NULL,
  serie              TINYINT NOT NULL,
  itinerario_semanal INT NULL,
  itinerario_anual   INT NULL,
  total_semanal      INT NULL,
  total_anual        INT NULL,
  PRIMARY KEY (id_curso, serie),
  CONSTRAINT fk_serie_curso FOREIGN KEY (id_curso)
    REFERENCES curso (id_curso) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS formacao_comum (
  id_item    INT AUTO_INCREMENT PRIMARY KEY,
  bloco      ENUM('FGB','PFO') NOT NULL,
  ordem      INT NOT NULL,
  nome       VARCHAR(120) NOT NULL,
  aulas_s1   TINYINT NULL, aulas_s2 TINYINT NULL, aulas_s3 TINYINT NULL,
  horas_s1   SMALLINT NULL, horas_s2 SMALLINT NULL, horas_s3 SMALLINT NULL,
  observacao VARCHAR(300) NULL
) ENGINE=InnoDB;