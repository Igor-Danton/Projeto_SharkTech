# Informações pendentes

Lista do que **não pode ser publicado** enquanto a escola não confirmar.
Enquanto estiver aqui, o site mostra a etiqueta "Informação pendente".

Ao receber a confirmação, atualize `public/js/dados.js` (dados institucionais)
ou o próprio banco, pelo painel administrativo (dados de curso).

## Institucional

| Item                                      | Situação                | Onde aparece                |
| ----------------------------------------- | ----------------------- | --------------------------- |
| E-mail oficial da escola                  | pendente                | rodapé, contato, secretaria |
| Horário de atendimento da secretaria      | pendente                | secretaria, contato         |
| Redes sociais oficiais                    | pendente                | rodapé                      |
| Missão institucional                      | pendente                | instituição                 |
| Quantidade atual de laboratórios          | histórico (cerca de 15) | estrutura                   |
| Tamanho do acervo da biblioteca           | pendente                | estrutura                   |
| Datas e nomes das mudanças de denominação | pendente                | linha do tempo              |

## Conflito de dados a resolver

| Item         | Valor em uso            | Outro valor encontrado antes | Ação                                                                 |
| ------------ | ----------------------- | ---------------------------- | -------------------------------------------------------------------- |
| Telefone     | (41) 3276-9534          | (41) 3284-6820               | confirmar com a secretaria qual é o número de atendimento ao público |
| Laboratórios | cerca de 15 (histórico) | 32 (fonte a reconfirmar)     | pedir o número atual à direção                                       |

## Por curso (11 cursos)

Para **cada** curso faltam: descrição, carga horária/duração, turno, número de vagas,
perfil do egresso, requisitos de ingresso e matriz curricular (disciplinas).

O eixo tecnológico de cada curso foi preenchido de forma **provisória**, com base no
Catálogo Nacional de Cursos Técnicos. A coordenação precisa validar essa classificação.

## Conteúdo de demonstração a remover

O `seed.sql` insere registros com o prefixo `[EXEMPLO]` em `noticia` e `documento`,
apenas para a apresentação. Antes de qualquer publicação real:

```sql
DELETE FROM noticia WHERE titulo LIKE '[EXEMPLO]%';
DELETE FROM documento WHERE titulo LIKE '[EXEMPLO]%';
```
