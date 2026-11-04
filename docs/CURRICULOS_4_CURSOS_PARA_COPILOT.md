# SharkTech — dados curriculares para inclusão de cursos

## Objetivo para o GitHub Copilot

Analise o projeto existente e implemente a inclusão dos **quatro cursos dos PDFs anexados** no banco de dados SQL e no front-end:

1. Técnico em Mecânica — código 2533.
2. Técnico em Manutenção Automotiva — código 2532.
3. Técnico em Eletrônica — código 2530.
4. Técnico em Eletromecânica — código 2529.

O site possui atualmente 7 cursos. Depois de incluir somente esses quatro, o total esperado é **11 cursos**, desde que a contagem atual do banco confirme os 7 registros. Não presuma que os dados já estão ausentes: consulte primeiro o banco e o código para evitar duplicidades.

Também há uma seção com dados de **Técnico em Biotecnologia** fornecidos diretamente pelo solicitante. Ela deve ser usada para conferir/atualizar o registro de Biotecnologia caso ele já esteja entre os 7 cursos atuais. **Não a trate automaticamente como um quinto curso novo**, pois o escopo principal solicitado é a inclusão dos quatro cursos dos PDFs. Se Biotecnologia não existir no banco, não a insira como quinto curso sem registrar essa divergência e solicitar validação.

---

# 1. Regras obrigatórias de implementação

1. Antes de alterar qualquer arquivo, examine a estrutura real do projeto: migrations, tabelas, relacionamentos, seeds, rotas da API, consultas SQL, serviços, componentes de listagem, página de detalhes, busca e comparação de cursos.
2. Siga o padrão já utilizado pelos 7 cursos existentes. Não crie um segundo padrão de cadastro nem suponha nomes de tabelas ou colunas sem conferir o schema.
3. Confira registros existentes usando primeiro o código oficial do curso e depois o nome normalizado. O código oficial informado abaixo não deve ser usado como chave primária se o projeto já possuir uma chave própria.
4. Faça uma migration SQL incremental e idempotente. Executá-la mais de uma vez não pode duplicar cursos, componentes curriculares ou séries. Preserve os 7 cursos existentes e seus relacionamentos.
5. Não apague, recrie ou sobrescreva tabelas existentes. Não altere credenciais, `.env`, configurações de conexão ou dados não relacionados a esta tarefa.
6. Use transação quando compatível com a estrutura atual. Respeite chaves estrangeiras, índices e convenções de nomenclatura existentes.
7. Preserve acentos e caracteres em português. Utilize o padrão UTF-8/utf8mb4 já adotado pelo projeto.
8. Não invente eixo tecnológico, perfil do egresso, requisitos de ingresso, duração ou descrição institucional quando a fonte não trouxer esses dados. Use `NULL`, omita o campo ou mantenha a regra de exibição já adotada no projeto.
9. Os resumos curtos incluídos abaixo são sínteses editoriais baseadas nos componentes curriculares, não transcrições de uma descrição oficial da instituição. Se o front-end exigir uma descrição, use-os como resumo de conteúdo curricular, sem apresentá-los como perfil oficial do egresso.
10. Não confunda a carga horária mínima de 3.000 horas com os totais anuais exibidos na matriz. Armazene os dois tipos de informação em campos distintos, conforme o schema permitir.
11. Não execute deploy nem aplique alterações destrutivas no banco remoto/produção. Prepare a migration, valide-a no ambiente de desenvolvimento e informe claramente o procedimento de aplicação no TiDB Cloud, se necessário.
12. Ao terminar, informe: arquivos alterados, migration criada, registros inseridos/atualizados, contagem final de cursos, testes executados e dados que ficaram sem preenchimento por falta de fonte.

## Comportamento esperado no front-end

- Os quatro cursos devem aparecer na listagem, busca, filtros, comparador e demais locais em que os cursos existentes aparecem.
- Cada curso deve abrir sua página de detalhes usando o mesmo padrão visual e estrutural dos demais.
- Exiba o nome oficial, modalidade integrada, carga horária mínima, código do curso e componentes curriculares quando esses campos fizerem parte do padrão atual do site.
- Quando houver matriz por série, apresente a distribuição por 1ª, 2ª e 3ª séries sem misturar aulas semanais com horas anuais.
- Não invente perfil de egresso ou requisitos de ingresso para os quatro cursos dos PDFs. Não exiba conteúdo fictício apenas para preencher cartões ou seções.
- Mantenha responsividade, acessibilidade, funcionamento do tema claro/escuro e links internos válidos.
- Atualize contagens e dados derivados da API; não deixe números fixos no HTML/JavaScript se o projeto já os obtém do banco.

---

# 2. Dados comuns das quatro matrizes dos PDFs

Os quatro documentos apresentam uma matriz curricular de **Educação Profissional Técnica de Nível Médio integrada ao Ensino Médio**, com três séries.

| Informação                                | Dado encontrado nas matrizes                                                     |
| ----------------------------------------- | -------------------------------------------------------------------------------- |
| Modalidade                                | Educação profissional técnica de nível médio integrada ao Ensino Médio           |
| Ano de implantação impresso               | 2025                                                                             |
| Dias letivos anuais                       | 200                                                                              |
| Turno indicado no modelo                  | Diurno/noturno                                                                   |
| Carga horária mínima                      | 3.000 horas                                                                      |
| Formação Geral Básica                     | 18 aulas semanais e 600 horas anuais em cada série                               |
| Aprofundamento                            | 3 aulas semanais e 100 horas anuais em cada série                                |
| Itinerário Formativo técnico-profissional | 9 aulas semanais e 300 horas anuais em cada série                                |
| Parte diversificada                       | Língua Espanhola: 4 aulas semanais; 133, 133 e 134 horas anuais, respectivamente |
| Total indicado por série                  | 34 aulas semanais; 1.133, 1.133 e 1.134 horas anuais, respectivamente            |

### Atenção à interpretação das cargas horárias

- A matriz informa **carga horária mínima de 3.000 horas** e, separadamente, mostra o total anual de 1.133/1.133/1.134 horas no quadro de distribuição. Preserve os valores em campos distintos. Não substitua a carga horária mínima por uma soma calculada dos subtotais do quadro.
- O quadro usa colunas de aulas semanais e horas anuais. Não misture essas unidades no banco nem na interface.
- A observação da matriz sobre Língua Espanhola informa oferta pelo CELEM e matrícula facultativa para o estudante, conforme a nota de rodapé do documento. Preserve essa observação quando a parte diversificada for exibida; não transforme a matrícula facultativa em requisito obrigatório do curso.
- Os componentes da Formação Geral Básica que aparecem nas matrizes incluem Língua Portuguesa, Arte, Educação Física, Língua Inglesa, Matemática, Educação Financeira, Educação Digital e Computação/Programação e IA, Química, Física, Biologia, Geografia, História, Sociologia e Filosofia. A distribuição de aulas por componente varia conforme a matriz; não invente uma distribuição única para os quatro cursos.
- O ano de implantação impresso nas matrizes é 2025, embora os arquivos enviados tenham `2026` no nome. Não altere esse dado para 2026 sem outra fonte oficial.
- Os PDFs não apresentam, na matriz principal, um texto institucional de “Sobre o curso”, perfil do egresso ou requisitos de ingresso. Esses campos não devem ser inventados.

---

# 3. Curso: Técnico em Mecânica

## Identificação

| Campo                       | Valor                                                |
| --------------------------- | ---------------------------------------------------- |
| Nome oficial                | Técnico em Mecânica                                  |
| Código do curso na matriz   | `2533`                                               |
| Modalidade                  | Integrado ao Ensino Médio                            |
| Carga horária mínima        | 3.000 horas                                          |
| Ano de implantação impresso | 2025                                                 |
| Eixo tecnológico            | Não identificado explicitamente na matriz consultada |
| Dias letivos anuais         | 200                                                  |

**Resumo curricular sugerido (não oficial):** formação técnica com conteúdos de tecnologia dos materiais, desenho mecânico, manutenção de máquinas e equipamentos, mecânica, processos de fabricação, projetos mecânicos, resistência dos materiais e segurança do trabalho.

## Componentes identificados na matriz

### Aprofundamento

| Código | Componente          |
| ------ | ------------------- |
| `3916` | Tecnologia mecânica |
| `3828` | Desenho mecânico    |
| `857`  | Eletrotécnica       |

### Itinerário Formativo técnico-profissional

| Código | Componente                            |
| ------ | ------------------------------------- |
| `3918` | Introdução à mecânica                 |
| `1682` | Manutenção de máquinas e equipamentos |
| `3910` | Mecânica                              |
| `3920` | Processos de fabricação               |
| `3921` | Projetos mecânicos                    |
| `1525` | Resistência dos materiais             |
| `4014` | Segurança do trabalho                 |

## Unidades curriculares detalhadas no documento

| Série indicada | Unidade curricular                    | Hora-relógio anual indicada |
| -------------- | ------------------------------------- | --------------------------: |
| 1ª             | Tecnologia mecânica                   |                       100 h |
| 2ª             | Desenho mecânico                      |                       100 h |
| 1ª             | Introdução à mecânica                 |                        33 h |
| 1ª             | Manutenção de máquinas e equipamentos |                        67 h |
| 1ª             | Mecânica                              |                       133 h |
| 1ª             | Segurança do trabalho                 |                        67 h |
| 3ª             | Projetos mecânicos                    |                       100 h |
| 3ª             | Resistência de materiais              |                       100 h |

## Conteúdos técnicos relevantes

- Tecnologia mecânica: materiais ferrosos e não ferrosos, polímeros e elastômeros, ensaios mecânicos, tratamentos térmicos e termoquímicos, metalurgia e fundição.
- Desenho mecânico: perspectivas, projeção ortogonal, cotas, tolerâncias, ajustes, cortes, seções, conjuntos mecânicos e softwares de desenho.
- Manutenção: tipos de manutenção, análise de falhas, manutenção preventiva e corretiva e planejamento.
- Projetos mecânicos: normas técnicas, elaboração, planejamento e execução de projetos de peças e equipamentos.
- Resistência dos materiais: dimensionamento e elementos de máquinas.

**Fonte principal:** `mecanica_2026.pdf`, matriz curricular na página 1 e detalhamento das unidades curriculares nas páginas seguintes.

---

# 4. Curso: Técnico em Manutenção Automotiva

## Identificação

| Campo                       | Valor                                                |
| --------------------------- | ---------------------------------------------------- |
| Nome oficial                | Técnico em Manutenção Automotiva                     |
| Código do curso na matriz   | `2532`                                               |
| Modalidade                  | Integrado ao Ensino Médio                            |
| Carga horária mínima        | 3.000 horas                                          |
| Ano de implantação impresso | 2025                                                 |
| Eixo tecnológico            | Não identificado explicitamente na matriz consultada |
| Dias letivos anuais         | 200                                                  |

**Resumo curricular sugerido (não oficial):** formação técnica orientada à mecânica e manutenção de veículos, motores de combustão interna, sistemas elétricos e eletrônicos automotivos, metrologia, processos de fabricação, gestão industrial e sistemas hidráulicos e pneumáticos.

## Componentes identificados na matriz

### Aprofundamento

| Código | Componente                        |
| ------ | --------------------------------- |
| `1522` | Tecnologia mecânica dos materiais |
| `3828` | Desenho mecânico                  |
| `1545` | Eletricidade                      |

### Itinerário Formativo técnico-profissional

| Código | Componente                                 |
| ------ | ------------------------------------------ |
| `3082` | Eletricidade automotiva                    |
| `3083` | Eletrônica automotiva                      |
| `2141` | Gestão industrial                          |
| `3085` | Mecânica automobilística                   |
| `3919` | Mecânica e manutenção                      |
| `1502` | Metrologia                                 |
| `3087` | Motores de combustão interna               |
| `3920` | Processos de fabricação                    |
| `2129` | Segurança do trabalho e controle ambiental |
| `3826` | Sistemas hidráulicos e pneumáticos         |

## Unidades curriculares detalhadas no documento

| Série indicada | Unidade curricular                         | Hora-relógio anual indicada |
| -------------- | ------------------------------------------ | --------------------------: |
| 1ª             | Tecnologia mecânica dos materiais          |                       100 h |
| 3ª             | Desenho mecânico                           |                       100 h |
| 1ª             | Gestão Industrial                          |                        67 h |
| 1ª             | Mecânica e Manutenção                      |                       100 h |
| 1ª             | Metrologia                                 |                        67 h |
| 1ª             | Segurança do trabalho e Controle ambiental |                        67 h |
| 2ª             | Mecânica Automobilística                   |                       100 h |
| 2ª             | Motores de Combustão interna               |                       100 h |
| 2ª             | Processos de fabricação                    |                       100 h |
| 3ª             | Eletricidade Automotiva                    |                       100 h |
| 3ª             | Eletrônica Automotiva                      |                       100 h |
| 3ª             | Sistemas hidráulicos e pneumáticos         |                       100 h |

## Conteúdos técnicos relevantes

- Materiais usados em sistemas mecânicos e automotivos, propriedades dos materiais e tratamentos.
- Desenho mecânico, leitura e interpretação de desenhos técnicos.
- Gestão industrial, metrologia, segurança do trabalho e controle ambiental.
- Mecânica automobilística e motores de combustão interna.
- Processos de fabricação.
- Eletricidade e eletrônica aplicadas a veículos.
- Sistemas hidráulicos e pneumáticos.

**Fonte principal:** `manutencao_automotiva_2026.pdf`, matriz curricular na página 1 e detalhamento das unidades curriculares nas páginas seguintes.

---

# 5. Curso: Técnico em Eletrônica

## Identificação

| Campo                       | Valor                                                |
| --------------------------- | ---------------------------------------------------- |
| Nome oficial                | Técnico em Eletrônica                                |
| Código do curso na matriz   | `2530`                                               |
| Modalidade                  | Integrado ao Ensino Médio                            |
| Carga horária mínima        | 3.000 horas                                          |
| Ano de implantação impresso | 2025                                                 |
| Eixo tecnológico            | Não identificado explicitamente na matriz consultada |
| Dias letivos anuais         | 200                                                  |

**Resumo curricular sugerido (não oficial):** formação técnica em eletricidade e eletrônica analógica, digital e de potência, desenho elétrico, sistemas eletrônicos, automação industrial, máquinas elétricas, redes industriais e telecomunicações.

## Componentes identificados na matriz

### Aprofundamento

| Código | Componente           |
| ------ | -------------------- |
| `1909` | Desenho elétrico     |
| `1547` | Automação industrial |

### Itinerário Formativo técnico-profissional

| Código | Componente                         |
| ------ | ---------------------------------- |
| `1545` | Eletricidade                       |
| `3805` | Eletrônica                         |
| `2141` | Gestão industrial                  |
| `3820` | Máquinas elétricas                 |
| `3713` | Redes industriais                  |
| `4376` | Segurança do trabalho              |
| `1548` | Sistemas digitais                  |
| `1552` | Sistemas eletrônicos               |
| `3826` | Sistemas hidráulicos e pneumáticos |
| `230`  | Telecomunicações                   |

## Unidades curriculares detalhadas no documento

| Série indicada | Unidade curricular                 | Hora-relógio anual indicada |
| -------------- | ---------------------------------- | --------------------------: |
| 2ª             | Automação Industrial               |                       100 h |
| 3ª             | Automação Industrial               |                       100 h |
| 1ª             | Desenho Elétrico                   |                       100 h |
| 1ª             | Eletricidade                       |                       200 h |
| 2ª             | Eletrônica                         |                       167 h |
| 1ª             | Gestão Industrial                  |                        67 h |
| 3ª             | Máquinas Elétricas                 |                        67 h |
| 2ª             | Redes Industriais                  |                        67 h |
| 1ª             | Segurança no Trabalho              |                        33 h |
| 3ª             | Sistemas Digitais                  |                        67 h |
| 2ª             | Sistemas Eletrônicos               |                        67 h |
| 3ª             | Sistemas Hidráulicos e Pneumáticos |                        67 h |
| 3ª             | Telecomunicações                   |                       100 h |

## Conteúdos técnicos relevantes

- Desenho elétrico: simbologia eletroeletrônica, diagramas, desenho técnico, desenho assistido por computador e placas de circuito impresso.
- Eletricidade: circuitos de corrente contínua e alternada, magnetismo, eletromagnetismo e análise de circuitos.
- Eletrônica: fundamentos de semicondutores, eletrônica analógica, digital e de potência.
- Automação industrial: instalações elétricas prediais e industriais, dispositivos de comando e proteção, acionamento de motores e CLP.
- Sistemas digitais, sistemas eletrônicos, máquinas elétricas, redes industriais e telecomunicações.

**Fonte principal:** `eletronica_2026.pdf`, matriz curricular na página 1 e detalhamento das unidades curriculares nas páginas seguintes.

---

# 6. Curso: Técnico em Eletromecânica

## Identificação

| Campo                       | Valor                                                |
| --------------------------- | ---------------------------------------------------- |
| Nome oficial                | Técnico em Eletromecânica                            |
| Código do curso na matriz   | `2529`                                               |
| Modalidade                  | Integrado ao Ensino Médio                            |
| Carga horária mínima        | 3.000 horas                                          |
| Ano de implantação impresso | 2025                                                 |
| Eixo tecnológico            | Não identificado explicitamente na matriz consultada |
| Dias letivos anuais         | 200                                                  |

**Resumo curricular sugerido (não oficial):** formação técnica que integra eletricidade, eletrônica, mecânica, automação e instalações elétricas, com conteúdos de manutenção de máquinas, máquinas elétricas, processos de fabricação, projetos eletromecânicos e sistemas hidráulicos e pneumáticos.

## Componentes identificados na matriz

### Aprofundamento

| Código | Componente                            |
| ------ | ------------------------------------- |
| `1547` | Automação industrial                  |
| `1682` | Manutenção de máquinas e equipamentos |
| `3910` | Mecânica                              |

### Itinerário Formativo técnico-profissional

| Código | Componente                         |
| ------ | ---------------------------------- |
| `1545` | Eletricidade                       |
| `3805` | Eletrônica                         |
| `4033` | Gestão ambiental                   |
| `3810` | Instalações elétricas              |
| `3820` | Máquinas elétricas                 |
| `3920` | Processos de fabricação            |
| `3808` | Projetos em eletromecânica         |
| `4014` | Segurança do trabalho              |
| `3826` | Sistemas hidráulicos e pneumáticos |

## Unidades curriculares detalhadas no documento

| Série indicada | Unidade curricular                    | Hora-relógio anual indicada |
| -------------- | ------------------------------------- | --------------------------: |
| 3ª             | Automação Industrial                  |                        67 h |
| 1ª             | Eletricidade                          |                       167 h |
| 2ª             | Eletricidade                          |                        67 h |
| 2ª             | Eletrônica                            |                        67 h |
| 3ª             | Eletrônica                            |                        67 h |
| 1ª             | Gestão Ambiental                      |                        33 h |
| 2ª             | Instalações Elétricas                 |                        67 h |
| 2ª             | Manutenção de Máquinas e Equipamentos |                        67 h |
| 3ª             | Máquinas Elétricas                    |                        67 h |
| 1ª             | Mecânica                              |                       100 h |
| 2ª             | Mecânica                              |                        33 h |
| 3ª             | Mecânica                              |                        33 h |
| 2ª             | Processos de Fabricação               |                        67 h |
| 3ª             | Processos de Fabricação               |                        67 h |
| 1ª             | Projetos em Eletromecânica            |                        67 h |
| 2ª             | Projetos em Eletromecânica            |                        33 h |
| 3ª             | Projetos em Eletromecânica            |                        33 h |
| 1ª             | Segurança no Trabalho                 |                        33 h |
| 3ª             | Sistemas Hidráulicos e Pneumáticos    |                        67 h |

## Conteúdos técnicos relevantes

- Eletricidade: fundamentos físicos, circuitos de corrente contínua e alternada e análise de circuitos.
- Eletrônica: semicondutores, diodos, eletrônica analógica, potência e digital.
- Automação industrial: controladores lógicos programáveis, programação Ladder, GRAFCET e controle de partida/velocidade de motores.
- Instalações elétricas prediais e industriais.
- Máquinas elétricas, manutenção de máquinas e equipamentos e mecânica.
- Processos de fabricação, projetos eletromecânicos e instalações.
- Gestão ambiental, segurança do trabalho e sistemas hidráulicos e pneumáticos.

**Fonte principal:** `eletromecanica_2026.pdf`, matriz curricular na página 1 e detalhamento das unidades curriculares nas páginas seguintes.

---

# 7. Dados de referência fornecidos pelo solicitante: Técnico em Biotecnologia

> Esta seção não veio de um dos quatro PDFs anexados. Os dados abaixo foram fornecidos diretamente pelo solicitante. Verifique se Biotecnologia já existe entre os 7 cursos atuais. Caso exista, use os dados para conferência/atualização; caso não exista, não o adicione como quinto curso novo sem validar a divergência de escopo.

## Identificação e descrição

| Campo            | Valor                                                                                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome             | Técnico em Biotecnologia                                                                                                                              |
| Eixo tecnológico | Produção Industrial                                                                                                                                   |
| Modalidade       | Há referência a curso integrado ao Ensino Médio e subsequente; não escolher uma única modalidade sem conferir como o projeto modela ofertas distintas |

### Sobre o curso

Formação técnica voltada às atividades laboratoriais de biotecnologia e biociências, controle de processos industriais e laboratoriais, preparo de materiais e reagentes, análise de materiais biológicos e controle de qualidade.

### Perfil do egresso

O profissional poderá executar atividades laboratoriais de biotecnologia e biociências, preparar soluções e reagentes, analisar materiais biológicos, cultivar microrganismos, células e tecidos, trabalhar com biomoléculas e participar de processos de controle de qualidade.

### Requisitos de ingresso

- Para o curso integrado ao Ensino Médio: ter concluído o Ensino Fundamental.
- Para o curso subsequente: ter concluído o Ensino Médio.

## Carga horária por série

| Série | Itinerário técnico — aulas/semana | Itinerário técnico — h/ano | Total — aulas/semana | Total — h/ano |
| ----- | --------------------------------: | -------------------------: | -------------------: | ------------: |
| 1ª    |                                 3 |                        100 |                   30 |         1.000 |
| 2ª    |                                14 |                        467 |                   34 |         1.133 |
| 3ª    |                                19 |                        633 |                   33 |         1.099 |

## Componentes técnicos

- Análise Ambiental
- Bioquímica
- Bromatologia
- Fundamentos da Biotecnologia
- Gestão da Qualidade
- Microbiologia Industrial
- Processos Agroindustriais
- Processos Industriais
- Química Analítica Aplicada

A carga horária individual de cada componente técnico e sua distribuição por série **não foram informadas**.

## Formação Geral Básica

Os números abaixo são aulas semanais por série. O subtotal de cada série também informa a carga horária anual.

| Componente                            |             1ª série |             2ª série |             3ª série |
| ------------------------------------- | -------------------: | -------------------: | -------------------: |
| Arte                                  |                    2 |                    0 |                    0 |
| Educação Física                       |                    2 |                    0 |                    2 |
| Língua Inglesa                        |                    — |                    — |                    — |
| Língua Portuguesa                     |                    3 |                    3 |                    4 |
| Filosofia                             |                    2 |                    0 |                    0 |
| Geografia                             |                    2 |                    2 |                    0 |
| História                              |                    2 |                    2 |                    0 |
| Sociologia                            |                    0 |                    2 |                    0 |
| Matemática                            |                    3 |                    3 |                    4 |
| Física                                |                    2 |                    0 |                    2 |
| Química                               |                    2 |                    2 |                    0 |
| Biologia                              |                    2 |                    2 |                    0 |
| **Subtotal da Formação Geral Básica** | **24 aulas · 800 h** | **18 aulas · 600 h** | **12 aulas · 400 h** |

Não substitua os traços de Língua Inglesa por zero: o dado foi fornecido como não especificado.

## Parte Flexível Obrigatória

| Componente                                 |            1ª série |           2ª série |           3ª série |
| ------------------------------------------ | ------------------: | -----------------: | -----------------: |
| Projeto de Vida                            |      2 aulas · 67 h |      1 aula · 33 h |      1 aula · 33 h |
| Educação Financeira                        |       1 aula · 33 h |      1 aula · 33 h |      1 aula · 33 h |
| **Subtotal da Parte Flexível Obrigatória** | **3 aulas · 100 h** | **2 aulas · 66 h** | **2 aulas · 66 h** |

### Conferência aritmética dos dados fornecidos

- Formação Geral Básica: 800 + 600 + 400 = 1.800 h.
- Itinerário técnico: 100 + 467 + 633 = 1.200 h.
- Parte Flexível Obrigatória: 100 + 66 + 66 = 232 h.
- Soma desses subtotais: 3.232 h, igual à soma dos totais anuais informados (1.000 + 1.133 + 1.099).
- Esses números foram transcritos do conteúdo fornecido pelo solicitante; não foram verificados em um PDF de Biotecnologia nesta tarefa.

---

# 8. Estrutura de dados esperada (adaptar ao schema existente)

Use os dados acima como fonte para preencher o modelo relacional já utilizado pelo projeto. A organização lógica desejada é:

- **Curso:** nome, código oficial da matriz, modalidade, carga horária mínima, ano de implantação, dias letivos anuais e demais campos existentes.
- **Matriz/estrutura curricular:** curso relacionado, série, área (Formação Geral Básica, Aprofundamento, Itinerário Formativo técnico-profissional ou Parte Diversificada), componente, aulas semanais e horas anuais, quando os valores forem conhecidos.
- **Componente/unidade curricular:** código do componente quando fornecido, nome, grupo/área, série e carga horária conforme a fonte.
- **Descrição e perfil:** armazenar somente quando houver dado de origem ou resumo claramente identificado como síntese curricular. Não converter resumo editorial em perfil oficial do egresso.

Não crie essas tabelas literalmente sem antes verificar o schema. Se o projeto já tiver tabelas equivalentes, reutilize-as. Se a estrutura atual não permitir registrar aulas semanais e horas anuais separadamente, proponha a alteração mínima e explique antes de fazer uma migração incompatível.

---

# 9. Checklist de validação do Copilot

- [ ] Identificar os 7 cursos existentes e confirmar a contagem real no banco.
- [ ] Confirmar se os códigos 2533, 2532, 2530 e 2529 já existem.
- [ ] Confirmar se Biotecnologia já está cadastrada; não inserir como quinto curso novo sem validação.
- [ ] Criar migration idempotente para os quatro cursos dos PDFs, sem duplicar registros.
- [ ] Cadastrar os componentes de Aprofundamento e do Itinerário Formativo com seus códigos e nomes.
- [ ] Registrar carga horária mínima separadamente dos subtotais anuais da matriz.
- [ ] Registrar separadamente aulas semanais e horas anuais, sem misturar unidades.
- [ ] Não inventar perfil do egresso, requisitos ou eixo tecnológico para os quatro cursos dos PDFs.
- [ ] Atualizar listagem, detalhe, busca, filtros, comparador e contadores do front-end.
- [ ] Validar endpoints/API e consultas SQL dos 4 novos cursos.
- [ ] Verificar acentuação, responsividade, links e tema claro/escuro.
- [ ] Executar testes sem aplicar alterações destrutivas ou deploy em produção.
- [ ] Entregar relatório final com arquivos e migrations alterados, contagem de cursos e eventuais lacunas.

---

# 10. Fontes utilizadas

- `mecanica_2026.pdf` — matriz curricular (página 1) e detalhamento de unidades curriculares nas páginas seguintes.
- `manutencao_automotiva_2026.pdf` — matriz curricular (página 1) e detalhamento de unidades curriculares nas páginas seguintes.
- `eletronica_2026.pdf` — matriz curricular (página 1) e detalhamento de unidades curriculares nas páginas seguintes.
- `eletromecanica_2026.pdf` — matriz curricular (página 1) e detalhamento de unidades curriculares nas páginas seguintes.
- Dados de Biotecnologia — texto fornecido pelo solicitante nesta conversa; não há PDF de Biotecnologia entre os quatro arquivos analisados.
