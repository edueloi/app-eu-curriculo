import React, { useState, useRef } from 'react';
import {
  StyleSheet, View, ScrollView, TouchableOpacity,
  Dimensions, Animated, TextInput,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

/* ═══════════════════════════════════════════════════════════════
   BANCO DE PERGUNTAS — quiz de múltipla escolha
   cada pergunta tem: pergunta, 4 opções, correta (índice 0-3),
   explicação da resposta certa e dica extra
═══════════════════════════════════════════════════════════════ */
const CATEGORIAS = [
  {
    id: 'comportamental',
    nome: 'Comportamental',
    icone: 'account-voice',
    emoji: '🧠',
    gradient: ['#4F46E5', '#7C3AED'],
    desc: 'Perguntas clássicas de qualquer processo seletivo',
    perguntas: [
      {
        id: 'c1',
        pergunta: 'Como você estrutura a resposta "Fale sobre você"?',
        opcoes: [
          'Conto minha vida desde a infância até hoje com o máximo de detalhe possível',
          'Foco em formação, experiência relevante e por que quero a vaga — em até 2 minutos',
          'Digo apenas meu nome, cargo atual e quanto tempo tenho de experiência',
          'Deixo o recrutador fazer perguntas específicas em vez de eu falar livremente',
        ],
        correta: 1,
        explicacao: 'A estrutura ideal é: formação → experiência relevante → conexão com a vaga. Máximo 2 minutos. Recrutadores ouvem dezenas de candidatos — objetividade e clareza são diferenciais imediatos.',
        dica: 'Método FAB: Formação → Atividade principal → Benefício para a empresa.',
      },
      {
        id: 'c2',
        pergunta: 'Qual é a melhor forma de responder sobre seu ponto fraco?',
        opcoes: [
          '"Sou muito perfeccionista e me dedico demais" — mostra comprometimento',
          'Negar ter pontos fracos — demonstra autoconfiança para o recrutador',
          'Citar uma fraqueza real e mostrar o que está fazendo para superar',
          'Transformar um ponto forte em fraqueza, como "sou muito proativo"',
        ],
        correta: 2,
        explicacao: 'Recrutadores são treinados para detectar respostas ensaiadas. "Sou perfeccionista" virou clichê e afasta o candidato. A resposta autêntica — fraqueza real + ação concreta de melhoria — demonstra maturidade e autoconhecimento.',
        dica: 'Escolha algo fora das competências centrais da vaga e sempre termine com o plano de melhoria.',
      },
      {
        id: 'c3',
        pergunta: 'Qual método é mais eficaz para responder perguntas comportamentais como "conte sobre um desafio"?',
        opcoes: [
          'SWOT — listar forças, fraquezas, oportunidades e ameaças',
          'SMART — definir objetivo específico, mensurável, alcançável, relevante e temporal',
          'STAR — Situação, Tarefa, Ação tomada e Resultado obtido',
          'PDCA — Planejar, Executar, Verificar e Agir',
        ],
        correta: 2,
        explicacao: 'O método STAR estrutura respostas comportamentais com narrativa clara: contexto (Situação), responsabilidade (Tarefa), o que você fez (Ação) e o impacto mensurável (Resultado). É o padrão usado pela maioria das empresas top.',
        dica: 'Prepare 5-6 histórias STAR antes da entrevista cobrindo temas: liderança, conflito, falha, inovação, pressão.',
      },
      {
        id: 'c4',
        pergunta: '"Por que quer trabalhar aqui?" — o que o recrutador quer ouvir de fato?',
        opcoes: [
          'Que o salário e os benefícios são os melhores do mercado',
          'Que a empresa é grande e isso garante estabilidade de emprego',
          'Que você pesquisou a empresa e vê alinhamento real com seus valores e objetivos',
          'Que você está desempregado e precisa muito da oportunidade',
        ],
        correta: 2,
        explicacao: 'Essa pergunta testa se você pesquisou e se tem motivação real — não apenas se quer qualquer emprego. Conectar missão da empresa, produto ou cultura com seus valores mostra interesse genuíno e diferencia você de candidatos que mandam currículo em massa.',
        dica: 'Pesquise: site oficial, LinkedIn da empresa, Glassdoor, notícias recentes. Cite algo específico.',
      },
      {
        id: 'c5',
        pergunta: 'Como reagir quando o recrutador diz "me convença por que devo te contratar"?',
        opcoes: [
          'Listar todos os seus cursos e certificados para mostrar preparo técnico',
          'Conectar suas 3 maiores competências às necessidades específicas da vaga com exemplos',
          'Dizer que é o candidato mais dedicado e que vai se esforçar muito',
          'Perguntar ao recrutador o que ele está buscando antes de responder qualquer coisa',
        ],
        correta: 1,
        explicacao: 'A pergunta pede uma proposta de valor, não um currículo falado. O recrutador quer ouvir: quais problemas você resolve + evidência concreta. Conectar suas top competências às dores da vaga (que você mapeou na descrição) é a resposta mais persuasiva.',
        dica: 'Prepare sua "proposta de valor em 60 segundos": competência + resultado + relevância para a vaga.',
      },
      {
        id: 'c6',
        pergunta: 'Qual atitude demonstra mais inteligência emocional durante uma entrevista?',
        opcoes: [
          'Nunca demonstrar emoção ou entusiasmo para parecer profissional e frio',
          'Criticar o ex-empregador para justificar a saída do emprego anterior',
          'Fazer perguntas inteligentes sobre a empresa ao final da entrevista',
          'Concordar com tudo que o recrutador diz para criar uma boa impressão',
        ],
        correta: 2,
        explicacao: 'Fazer perguntas relevantes demonstra curiosidade, preparo e interesse genuíno — três sinais de maturidade profissional. Criticar ex-empregadores levanta red flags sobre seu perfil. Concordar com tudo parece falta de personalidade.',
        dica: 'Prepare 3 perguntas: sobre o time, sobre os desafios da posição e sobre os próximos passos do processo.',
      },
      {
        id: 'c7',
        pergunta: 'Você está em uma entrevista e não sabe responder uma pergunta técnica. O que fazer?',
        opcoes: [
          'Inventar uma resposta plausível — o recrutador provavelmente não vai checar',
          'Dizer que não sabe e ficar em silêncio esperando a próxima pergunta',
          'Admitir que não sabe, mostrar como raciocina sobre o tema e como aprenderia',
          'Mudar de assunto rapidamente para um tema que você domina',
        ],
        correta: 2,
        explicacao: 'Inventar respostas é fatal — recrutadores técnicos percebem. Admitir "não sei, mas meu raciocínio seria X e eu aprenderia assim" demonstra honestidade, pensamento crítico e capacidade de aprendizado — qualidades muito valorizadas.',
        dica: 'Use: "Não tenho experiência direta, mas minha abordagem seria... e eu buscaria aprender por..."',
      },
      {
        id: 'c8',
        pergunta: '"Onde você se vê em 5 anos?" — qual resposta é mais estratégica?',
        opcoes: [
          '"Quero ter minha própria empresa e empreender" — mostra ambição',
          '"Ainda não pensei nisso, prefiro viver o presente" — demonstra autenticidade',
          '"No mesmo cargo, sou fiel e não gosto de mudanças" — transmite estabilidade',
          '"Crescendo em [área] e contribuindo com [resultado] na empresa" — ambição realista alinhada',
        ],
        correta: 3,
        explicacao: 'Dizer que quer empreender sugere que vai sair logo. Dizer que não pensa nisso mostra falta de planejamento. A resposta ideal mostra ambição dentro do contexto da empresa, conectando crescimento pessoal ao crescimento da organização.',
        dica: 'Nunca mencione o desejo de empreender. Conecte sua ambição a algo que a empresa pode oferecer.',
      },
    ],
  },
  {
    id: 'tecnico',
    nome: 'Tecnologia',
    icone: 'code-braces',
    emoji: '💻',
    gradient: ['#0F172A', '#1D4ED8'],
    desc: 'Conceitos técnicos para vagas de TI',
    perguntas: [
      {
        id: 't1',
        pergunta: 'O que é uma API REST e qual verbo HTTP usar para criar um recurso?',
        opcoes: [
          'REST é um banco de dados remoto; usa-se GET para criar recursos',
          'REST é um estilo arquitetural para APIs; usa-se POST para criação',
          'REST é uma linguagem de programação; usa-se CREATE para novos registros',
          'REST é um protocolo de segurança; usa-se PUT para todos os tipos de operação',
        ],
        correta: 1,
        explicacao: 'REST (Representational State Transfer) é um estilo arquitetural — não uma linguagem nem protocolo. Os verbos principais: GET (buscar), POST (criar), PUT (atualizar completo), PATCH (atualizar parcial), DELETE (remover). POST é o padrão para criação de novos recursos.',
        dica: 'Saiba também: POST não é idempotente, PUT e DELETE são. Isso cai muito em entrevistas.',
      },
      {
        id: 't2',
        pergunta: 'Qual a diferença entre autenticação e autorização?',
        opcoes: [
          'São sinônimos — ambos verificam se o usuário pode acessar o sistema',
          'Autenticação verifica quem você é; autorização verifica o que você pode fazer',
          'Autorização verifica quem você é; autenticação verifica suas permissões',
          'Autenticação é feita no frontend; autorização é feita no backend',
        ],
        correta: 1,
        explicacao: 'Autenticação = identidade (quem é você? login/senha, biometria, token). Autorização = permissão (o que você pode fazer? admin, usuário, leitura, escrita). Um usuário autenticado pode não ter autorização para acessar determinado recurso.',
        dica: 'Exemplo: você autentica com seu usuário, mas só é autorizado a ver seus próprios dados — não os de outros.',
      },
      {
        id: 't3',
        pergunta: 'O que significa "código limpo" segundo Robert Martin (Uncle Bob)?',
        opcoes: [
          'Código sem comentários — tudo deve ser auto-explicativo pelo nome das variáveis',
          'Código que passa em todos os testes automatizados sem erros',
          'Código legível, com responsabilidade única por função e fácil de mudar por quem não o escreveu',
          'Código compacto com o menor número possível de linhas',
        ],
        correta: 2,
        explicacao: 'Clean Code de Uncle Bob define que código limpo é: legível como prosa, com funções pequenas e de única responsabilidade (SRP), nomes expressivos e que possa ser modificado por qualquer desenvolvedor sem surpresas. Compacto nem sempre é limpo.',
        dica: 'Princípios centrais: SRP, DRY (Don\'t Repeat Yourself), KISS (Keep It Simple). Leia o livro ou um resumo antes da entrevista.',
      },
      {
        id: 't4',
        pergunta: 'O que é SQL Injection e como prevenir?',
        opcoes: [
          'É um ataque de força bruta em senhas; previne-se com rate limiting',
          'É quando o banco de dados falha; previne-se com replicação',
          'É inserção de código malicioso em queries SQL; previne-se com prepared statements e ORMs',
          'É vazamento de dados por backup mal configurado; previne-se com criptografia',
        ],
        correta: 2,
        explicacao: 'SQL Injection ocorre quando dados do usuário são inseridos diretamente na query sem sanitização, permitindo ao atacante manipular o banco. Prevenção: usar prepared statements (parametrized queries), ORMs modernos ou stored procedures. Jamais concatenar input do usuário diretamente.',
        dica: 'OWASP Top 10 lista SQL Injection como uma das vulnerabilidades mais críticas. Saber o básico é esperado em qualquer entrevista de backend.',
      },
      {
        id: 't5',
        pergunta: 'O que faz o comando "git rebase" e quando usá-lo?',
        opcoes: [
          'Cria uma cópia do repositório em outra branch — usado para backup',
          'Desfaz o último commit — usado quando um erro precisa ser revertido',
          'Move ou reaplica commits sobre outra base — para manter histórico linear antes de merge',
          'Sincroniza o repositório local com o remoto — equivalente ao git pull',
        ],
        correta: 2,
        explicacao: 'git rebase reaplica seus commits sobre o topo de outra branch, criando um histórico linear e limpo. É preferido ao merge em branches de feature para manter o histórico legível. Regra de ouro: nunca faça rebase em branches compartilhadas (main/develop).',
        dica: 'Entrevistas de nível pleno/sênior frequentemente pedem a diferença entre merge e rebase. Pratique os dois.',
      },
      {
        id: 't6',
        pergunta: 'Qual a diferença entre processo e thread?',
        opcoes: [
          'Processos são mais rápidos; threads consomem mais memória',
          'Processo tem espaço de memória próprio e isolado; thread compartilha memória com outras threads do mesmo processo',
          'Thread é um processo de alta prioridade; processo é uma thread de baixa prioridade',
          'São equivalentes — o sistema operacional trata os dois da mesma forma',
        ],
        correta: 1,
        explicacao: 'Processo = programa em execução com memória isolada. Thread = unidade de execução dentro de um processo, compartilhando o mesmo espaço de memória. Threads são mais leves mas exigem sincronização (mutex, semáforos) para evitar race conditions. Conceito fundamental em concorrência.',
        dica: 'Para vagas de backend, saiba também o que é deadlock, race condition e como Node.js lida com isso via event loop.',
      },
      {
        id: 't7',
        pergunta: 'O que é Big O notation e por que importa?',
        opcoes: [
          'É uma métrica de qualidade de código definida pela empresa Big O Inc.',
          'É a quantidade de linhas de código em um algoritmo — menos linhas = O(1)',
          'Descreve como o tempo/espaço de um algoritmo cresce com a entrada — mede eficiência',
          'É o número máximo de usuários simultâneos que um sistema suporta',
        ],
        correta: 2,
        explicacao: 'Big O notation descreve a complexidade assintótica de um algoritmo: como tempo de execução ou uso de memória escala com o tamanho da entrada (n). O(1) = constante, O(n) = linear, O(n²) = quadrático. Fundamental para discutir trade-offs de performance em entrevistas técnicas.',
        dica: 'Saiba de cabeça: busca binária = O(log n), ordenação eficiente = O(n log n), busca em lista = O(n), acesso em hash map = O(1).',
      },
    ],
  },
  {
    id: 'lideranca',
    nome: 'Liderança',
    icone: 'account-tie',
    emoji: '🚀',
    gradient: ['#064E3B', '#059669'],
    desc: 'Gestão de pessoas, times e conflitos',
    perguntas: [
      {
        id: 'l1',
        pergunta: 'Um colaborador de alta performance está desmotivado. Qual é o primeiro passo?',
        opcoes: [
          'Oferecer aumento imediato para garantir que ele não saia',
          'Transferi-lo de time para dar um novo desafio sem conversar antes',
          'Fazer um 1:1 para escutar sem julgamento e entender a causa raiz',
          'Dar mais responsabilidades para que ele fique ocupado e não pense em sair',
        ],
        correta: 2,
        explicacao: 'Desmotivação tem causas diferentes: falta de propósito, reconhecimento, autonomia, problemas externos. Oferecer dinheiro sem diagnóstico resolve por pouco tempo. O 1:1 escuta primeiro — a solução emerge do diagnóstico, não do pressuposto do gestor.',
        dica: 'Teoria da Autodeterminação: as 3 necessidades básicas de motivação são autonomia, competência e pertencimento.',
      },
      {
        id: 'l2',
        pergunta: 'Como dar um feedback negativo de forma eficaz?',
        opcoes: [
          'Em público, para que a equipe inteira aprenda com o erro do colaborador',
          'Por e-mail, para que a pessoa tenha tempo de processar antes de reagir',
          'Em privado, usando o modelo SBI: Situação específica, Comportamento observado, Impacto gerado',
          'Primeiro elogiar muito para depois falar o problema — o famoso "sanduíche de feedback"',
        ],
        correta: 2,
        explicacao: 'O modelo SBI é o padrão gold: "Na reunião de ontem [situação], quando você interrompeu o colega [comportamento], o time não conseguiu concluir o ponto [impacto]." Privado + específico + comportamento (não pessoa) + impacto concreto. O sanduíche dilui a mensagem e confunde.',
        dica: 'Regra: elogie em público, corrija em privado. Feedback sobre comportamento, nunca sobre a pessoa.',
      },
      {
        id: 'l3',
        pergunta: 'Qual é a diferença entre liderança situacional e liderança transformacional?',
        opcoes: [
          'Situacional lidera apenas em crises; transformacional é o modelo do dia a dia',
          'Situacional adapta o estilo ao nível de maturidade do liderado; transformacional inspira mudança de comportamento e cultura',
          'São o mesmo conceito com nomes diferentes criados por escolas diferentes',
          'Situacional é para times grandes; transformacional é para times pequenos e ágeis',
        ],
        correta: 1,
        explicacao: 'Liderança situacional (Hersey & Blanchard) adapta o estilo ao momento do colaborador: diretivo para iniciante, coaching para quem está aprendendo, de suporte para quem já sabe mas inseguro, delegação para o maduro. Transformacional (Burns/Bass) foca em inspirar propósito, mudar cultura e elevar o time.',
        dica: 'Cite ambas em entrevistas de liderança — demonstra vocabulário gerencial avançado.',
      },
      {
        id: 'l4',
        pergunta: 'Um projeto importante está atrasado e o prazo é amanhã. O que você faz primeiro?',
        opcoes: [
          'Culpar a equipe pelo atraso em reunião para deixar claro quem é responsável',
          'Pedir extensão de prazo imediatamente sem analisar o que é possível entregar',
          'Mapear o que pode ser entregue, comunicar ao stakeholder com alternativas e redistribuir esforços',
          'Trabalhar a noite inteira sozinho para compensar o atraso do time',
        ],
        correta: 2,
        explicacao: 'Bom líder age em crise: primeiro diagnóstico rápido (o que pode ser feito?), depois comunicação proativa ao stakeholder com cenários e alternativas, então redistribuição de recursos. Culpar o time destrói confiança. Stakeholder prefere saber antes do que ser surpreendido.',
        dica: 'Princípio: comunique problemas cedo com opções, não tarde com desculpas.',
      },
      {
        id: 'l5',
        pergunta: 'Como construir confiança em um time que você acabou de assumir?',
        opcoes: [
          'Mostrar autoridade logo no primeiro dia estabelecendo novas regras e processos',
          'Fazer mudanças rápidas para demonstrar que você é eficiente e sabe o que faz',
          'Ouvir cada pessoa individualmente, entender como o time funciona antes de mudar qualquer coisa',
          'Ser amigo de todos e evitar qualquer tipo de conflito no início',
        ],
        correta: 2,
        explicacao: 'Novo líder que chega mudando tudo rapidamente destrói o contexto que funciona e perde o time. Ouvir primeiro (1:1s com todos), entender as dinâmicas existentes e só então agir — isso constrói confiança real. "Escuta > agenda própria" nos primeiros 90 dias.',
        dica: 'Leia "Os Primeiros 90 Dias" de Michael Watkins — conceito clássico cobrado em entrevistas de liderança.',
      },
      {
        id: 'l6',
        pergunta: 'O que é OKR e como diferencia de uma meta comum?',
        opcoes: [
          'OKR é uma ferramenta de gestão financeira para definir orçamentos por área',
          'OKR é idêntico à meta — apenas um nome mais moderno para o mesmo conceito',
          'OKR (Objective + Key Results) conecta objetivo inspirador a resultados mensuráveis; meta comum é apenas um número',
          'OKR é uma metodologia ágil usada exclusivamente em times de tecnologia',
        ],
        correta: 2,
        explicacao: 'OKR = Objective (direção qualitativa e inspiradora) + Key Results (métricas concretas que provam o progresso). Diferença da meta: OKR é ambicioso por design (atingir 70% já é sucesso), é transparente para toda a empresa e conecta o trabalho individual à estratégia. Usado por Google, Intel, Spotify.',
        dica: 'Meta = "aumentar vendas em 10%". OKR = Obj: "Tornar a equipe de vendas a melhor do setor" + KR1: "NPS de clientes de 72 para 85" + KR2: "Taxa de conversão de 12% para 18%".',
      },
    ],
  },
  {
    id: 'vendas',
    nome: 'Vendas',
    icone: 'handshake',
    emoji: '💰',
    gradient: ['#78350F', '#D97706'],
    desc: 'Negociação, persuasão e fechamento',
    perguntas: [
      {
        id: 'v1',
        pergunta: 'Cliente diz "está muito caro". Qual é a resposta mais estratégica?',
        opcoes: [
          'Dar desconto imediato para não perder a venda',
          'Explicar que o preço é justo e que ele está errado em achar caro',
          'Perguntar o que está por trás da objeção e reforçar o valor, não o preço',
          'Oferecer um produto mais barato e com menos recursos',
        ],
        correta: 2,
        explicacao: 'Preço como objeção quase sempre é percepção de valor, não falta de budget real. Dar desconto imediato treina o cliente a barganhar e desvaloriza o produto. A abordagem certa: investigar a objeção real, depois conectar o preço ao ROI e ao valor específico para aquele cliente.',
        dica: 'Pergunte: "Para te ajudar melhor, além do preço, tem alguma outra preocupação?" — a resposta quase sempre revela o bloqueio real.',
      },
      {
        id: 'v2',
        pergunta: 'O que é o método SPIN Selling?',
        opcoes: [
          'Técnica de cold call onde você aborda rapidamente Situação, Proposta, Interesse e Negociação',
          'Metodologia de qualificação que avalia: Solução, Preço, Integração e Necessidade',
          'Método de perguntas: Situação, Problema, Implicação e Necessidade-Solução para descobrir dores reais',
          'Framework de follow-up pós-venda: Suporte, Pesquisa, Indicação e Novo negócio',
        ],
        correta: 2,
        explicacao: 'SPIN Selling (Neil Rackham) é uma sequência de perguntas para vendas consultivas: Situação (contexto atual) → Problema (desafios) → Implicação (consequências do problema) → Necessidade-Solução (o que resolveria). Faz o cliente perceber o próprio problema antes de apresentar a solução.',
        dica: 'SPIN é essencial para vendas B2B complexas. Em entrevistas de vendas consultivas, citar SPIN + Challenger Sale diferencia muito.',
      },
      {
        id: 'v3',
        pergunta: 'Qual métrica melhor indica a saúde do funil de vendas a longo prazo?',
        opcoes: [
          'Número de ligações realizadas por dia pelo time comercial',
          'Receita do mês atual comparada ao mesmo mês do ano anterior',
          'Número de propostas enviadas na semana',
          'Velocity do pipeline: quantidade × taxa de conversão × ticket médio ÷ ciclo de venda',
        ],
        correta: 3,
        explicacao: 'Pipeline velocity é a métrica mais completa: combina volume, qualidade e velocidade do funil. Ligações e propostas medem atividade, não resultado. Comparação anual ignora a saúde atual. Velocity = (nº oportunidades × taxa de fechamento × ticket médio) ÷ tempo médio do ciclo — revela onde agir.',
        dica: 'Demonstrar conhecimento de métricas de funil (pipeline velocity, CAC, LTV, churn) impressiona muito em entrevistas de vendas B2B.',
      },
      {
        id: 'v4',
        pergunta: 'O que é o conceito de "Challenger Sale"?',
        opcoes: [
          'Vendedor que desafia o cliente em público para demonstrar confiança',
          'Abordagem onde o vendedor ensina algo novo ao cliente, adapta a mensagem e assume o controle da conversa',
          'Técnica de fechar negócios usando pressão de tempo e escassez artificial',
          'Modelo de vendas onde o cliente define todos os termos da negociação',
        ],
        correta: 1,
        explicacao: 'Challenger Sale (Dixon & Adamson) identifica que o perfil mais eficaz em vendas complexas é o "Challenger": ensina o cliente sobre algo que ele não sabia (insight), adapta a mensagem ao contexto específico e guia a conversa proativamente. Supera "relationship builders" em performance por larga margem.',
        dica: 'Cite Challenger Sale + SPIN + Solution Selling em entrevistas consultivas. Mostra profundidade técnica em metodologias de vendas.',
      },
      {
        id: 'v5',
        pergunta: 'Qual é a diferença entre ICP e persona no contexto de vendas B2B?',
        opcoes: [
          'ICP e persona são o mesmo conceito com nomes diferentes',
          'ICP descreve a empresa ideal para vender; persona descreve o perfil do decisor dentro dela',
          'ICP é usado em marketing; persona é exclusivo de vendas',
          'Persona descreve a empresa ideal; ICP descreve o comportamento do comprador',
        ],
        correta: 1,
        explicacao: 'ICP (Ideal Customer Profile) define características da empresa-alvo: porte, setor, faturamento, maturidade tecnológica, dores específicas. Persona descreve o humano decisor dentro dessa empresa: cargo, motivações, objeções, como compra. Você usa o ICP para prospectar, a persona para se comunicar.',
        dica: 'ICP bem definido aumenta drasticamente a taxa de conversão porque você para de desperdiçar tempo com leads fora do perfil.',
      },
    ],
  },
  {
    id: 'rh',
    nome: 'RH & Pessoas',
    icone: 'account-group',
    emoji: '🤝',
    gradient: ['#831843', '#EC4899'],
    desc: 'Recrutamento, cultura e talentos',
    perguntas: [
      {
        id: 'rh1',
        pergunta: 'O que é a metodologia "Entrevista Estruturada" e sua vantagem?',
        opcoes: [
          'Entrevista feita apenas por e-mail com roteiro fixo para economizar tempo do recrutador',
          'Entrevista com perguntas padronizadas e critérios de avaliação definidos previamente para todos os candidatos',
          'Entrevista dividida em 3 partes: técnica, comportamental e dinâmica de grupo',
          'Entrevista feita por um comitê de pelo menos 5 avaliadores simultaneamente',
        ],
        correta: 1,
        explicacao: 'Entrevista estruturada usa as mesmas perguntas para todos os candidatos, com critérios de avaliação definidos antes — reduz viés inconsciente, aumenta validade preditiva e permite comparação justa. Estudos mostram que prevê performance 2x melhor que entrevistas não estruturadas.',
        dica: 'Combine com perguntas baseadas em evidências (STAR) para máxima eficácia preditiva.',
      },
      {
        id: 'rh2',
        pergunta: 'O que mede o eNPS e como interpretar os resultados?',
        opcoes: [
          'Mede satisfação de clientes externos em experiências de atendimento',
          'Mede o número de indicações de candidatos feitas por funcionários',
          'Mede a probabilidade de funcionários recomendarem a empresa como lugar para trabalhar — faixa boa: 30+',
          'Mede o índice de absenteísmo e presenteísmo da equipe',
        ],
        correta: 2,
        explicacao: 'eNPS (Employee Net Promoter Score) pergunta: "De 0 a 10, quanto você recomendaria a empresa como lugar para trabalhar?" Promotores (9-10) menos Detratores (0-6) = eNPS. Escala: abaixo de 0 = crítico, 0-20 = razoável, 20-50 = bom, 50+ = excelente. Indica saúde geral da cultura.',
        dica: 'Combine eNPS com entrevistas de pulso para entender o "porquê" por trás do número.',
      },
      {
        id: 'rh3',
        pergunta: 'Qual é a causa mais comum de turnover voluntário segundo pesquisas de mercado?',
        opcoes: [
          'Salário abaixo do mercado — principal motivo em mais de 80% dos casos',
          'Falta de relacionamento com colegas e clima organizacional ruim',
          'Gestão direta — "as pessoas não deixam empresas, deixam gestores"',
          'Benefícios insatisfatórios como plano de saúde e vale-refeição',
        ],
        correta: 2,
        explicacao: 'Pesquisas de Gallup e LinkedIn consistentemente mostram que a relação com o gestor direto é o principal driver de turnover voluntário. Salário importa, mas raramente é o único motivo — quando é citado, frequentemente mascara problemas de gestão ou falta de crescimento.',
        dica: '"As pessoas não deixam empresas, deixam gestores" — frase que virou axioma em RH, mas com nuances: também contam propósito, crescimento e cultura.',
      },
      {
        id: 'rh4',
        pergunta: 'O que é People Analytics e como aplica no dia a dia de RH?',
        opcoes: [
          'É o uso de redes sociais para recrutamento passivo de candidatos',
          'É o software de folha de pagamento mais usado no Brasil',
          'É o uso de dados e análises para tomar decisões sobre pessoas: turnover, performance, contratação',
          'É uma metodologia de avaliação de desempenho baseada em feedback 360°',
        ],
        correta: 2,
        explicacao: 'People Analytics usa dados (de RH, performance, comportamento) para tomar decisões mais objetivas: prever turnover antes que aconteça, identificar perfis de alta performance para recrutamento, medir impacto de treinamentos. Transforma RH de área operacional em estratégica com evidências.',
        dica: 'Citar People Analytics + experiências com dados diferencia muito candidatos a cargos de RH pleno/sênior.',
      },
    ],
  },
  {
    id: 'financas',
    nome: 'Finanças',
    icone: 'chart-line',
    emoji: '📊',
    gradient: ['#1E3A5F', '#0284C7'],
    desc: 'Análise financeira e controladoria',
    perguntas: [
      {
        id: 'f1',
        pergunta: 'Uma empresa tem lucro de R$500k mas fluxo de caixa negativo. Como isso é possível?',
        opcoes: [
          'É impossível — lucro positivo implica necessariamente caixa positivo',
          'O contador errou — provavelmente usou o regime errado',
          'O lucro é calculado em competência (quando a venda ocorre); o caixa registra o pagamento real — vendas a prazo geram lucro sem entrada imediata de dinheiro',
          'Isso só acontece em empresas em falência ou com dívidas bancárias muito altas',
        ],
        correta: 2,
        explicacao: 'Regime de competência registra a receita quando a venda acontece, não quando o dinheiro entra. Uma empresa pode vender muito a prazo (lucro alto) mas pagar fornecedores à vista (caixa negativo). É uma das principais causas de falência de empresas lucrativas — o "lucro" existe no papel, mas não no banco.',
        dica: 'Por isso o DFC (Demonstração de Fluxo de Caixa) é tão importante quanto o DRE. Saber ler os dois é básico em finanças.',
      },
      {
        id: 'f2',
        pergunta: 'O que é EBITDA e por que é amplamente usado em avaliações de empresas?',
        opcoes: [
          'É o lucro líquido depois de todos os impostos — a métrica mais conservadora de rentabilidade',
          'É o resultado operacional antes de juros, impostos, depreciação e amortização — indica capacidade operacional',
          'É a receita bruta total sem nenhuma dedução — representa o tamanho do negócio',
          'É um indicador de liquidez que mostra se a empresa pode pagar dívidas de curto prazo',
        ],
        correta: 1,
        explicacao: 'EBITDA (Earnings Before Interest, Taxes, Depreciation and Amortization) elimina efeitos de estrutura de capital (juros), impostos e itens não-caixa (depreciação). Permite comparar eficiência operacional entre empresas com estruturas financeiras diferentes. Muito usado em M&A: empresa vale X vezes o EBITDA.',
        dica: 'Limitação do EBITDA: ignora necessidades de capex. "EBITDA mascara problemas de caixa" — conhecer a crítica demonstra maturidade financeira.',
      },
      {
        id: 'f3',
        pergunta: 'Qual a diferença entre VPL (Valor Presente Líquido) e TIR (Taxa Interna de Retorno)?',
        opcoes: [
          'VPL é para projetos de longo prazo; TIR é para projetos de curto prazo',
          'São o mesmo indicador calculado por métodos diferentes',
          'VPL mostra o valor em R$ que um projeto gera acima do custo de capital; TIR mostra a taxa de retorno do projeto',
          'VPL mede risco; TIR mede o retorno esperado sem considerar riscos',
        ],
        correta: 2,
        explicacao: 'VPL traz todos os fluxos futuros a valor presente descontados pelo custo de capital — se positivo, o projeto cria valor. TIR é a taxa que zera o VPL — se maior que o custo de capital, vale o investimento. VPL é preferido quando projetos têm fluxos irregulares (TIR pode ter múltiplas soluções).',
        dica: 'Regra prática: VPL > 0 e TIR > custo de capital = faça o projeto. Saiba calcular ambos no Excel.',
      },
      {
        id: 'f4',
        pergunta: 'O que é capital de giro e por que uma empresa pode ter problema mesmo sendo rentável?',
        opcoes: [
          'Capital de giro é o patrimônio líquido da empresa, que pode cair se houver prejuízo',
          'Capital de giro é o dinheiro investido em maquinário e instalações da empresa',
          'Capital de giro é o recurso para financiar o ciclo operacional — prazo entre gastar e receber pode gerar ruptura de caixa',
          'Capital de giro é o limite de crédito disponível em bancos para empréstimos de curto prazo',
        ],
        correta: 2,
        explicacao: 'Capital de giro financia o ciclo: comprar → produzir → vender → receber. Se você compra em 30 dias mas recebe em 60, precisa de capital para cobrir o gap. Uma empresa em crescimento acelerado frequentemente precisa de mais capital de giro que sua geração de caixa — causando ruptura mesmo com lucro.',
        dica: 'Indicadores: PMR (prazo médio de recebimento), PMP (prazo médio de pagamento), PME (prazo médio de estoque). Ciclo financeiro = PMR + PME - PMP.',
      },
    ],
  },
  {
    id: 'marketing',
    nome: 'Marketing',
    icone: 'bullhorn',
    emoji: '📢',
    gradient: ['#7C2D12', '#EA580C'],
    desc: 'Estratégia, growth e branding',
    perguntas: [
      {
        id: 'm1',
        pergunta: 'Qual é a diferença entre CAC e LTV e por que a relação entre eles importa?',
        opcoes: [
          'CAC é custo de aquisição de cliente; LTV é o valor total gerado pelo cliente — LTV deve ser maior que CAC para o negócio ser viável',
          'CAC mede satisfação; LTV mede fidelidade — ambos devem ser minimizados',
          'São métricas de mídia paga: CAC é para Facebook Ads e LTV para Google Ads',
          'CAC e LTV são sinônimos de CPC e CPM em campanhas digitais',
        ],
        correta: 0,
        explicacao: 'CAC (Custo de Aquisição de Cliente) = total gasto em marketing e vendas ÷ número de clientes adquiridos. LTV (Lifetime Value) = receita média por cliente × tempo de relacionamento. Regra geral: LTV ÷ CAC deve ser > 3 para o negócio ser saudável. LTV < CAC = empresa perde dinheiro em cada cliente.',
        dica: 'Saiba também Payback Period: quanto tempo para recuperar o CAC. Meta saudável: < 12 meses para SaaS.',
      },
      {
        id: 'm2',
        pergunta: 'O que é growth hacking e qual exemplo mais ilustra o conceito?',
        opcoes: [
          'É hacking de sistemas concorrentes para obter dados de mercado de forma ilegal',
          'É comprar tráfego pago de forma agressiva para crescer rápido sem limite de orçamento',
          'É encontrar alavancas de crescimento não-óbvias via experimentação — ex: Dropbox que cresceu 3.900% com indicações bônus',
          'É contratar muitos vendedores ao mesmo tempo para atingir metas agressivas de curto prazo',
        ],
        correta: 2,
        explicacao: 'Growth hacking é mentalidade de crescimento via experimentação rápida em todo o funil (não só marketing). O Dropbox é o case clássico: em vez de pagar anúncios caros, criou indicação onde ambos ganham espaço extra → cresceu 3.900% em 15 meses com custo marginal próximo de zero. Scalability é a chave.',
        dica: 'Outros cases: Hotmail (assinatura com link de cadastro), Airbnb (integração com Craigslist), PayPal (pagamento de usuários para cadastro).',
      },
      {
        id: 'm3',
        pergunta: 'O que é o modelo AIDA em marketing?',
        opcoes: [
          'Análise, Impacto, Desempenho e Avaliação — framework de análise de campanhas',
          'Atenção, Interesse, Desejo e Ação — descreve as etapas da jornada de decisão do consumidor',
          'Alcance, Impressão, Dados e Analytics — métricas principais de campanhas digitais',
          'Awareness, Integration, Distribution e Activation — estratégia de lançamento de produtos',
        ],
        correta: 1,
        explicacao: 'AIDA (Atenção → Interesse → Desejo → Ação) é um dos modelos mais antigos e ainda relevantes de marketing: primeiro captura a atenção, gera interesse com benefícios, cria desejo conectando à necessidade, e finaliza com uma chamada para ação clara. Base de qualquer copywriting eficiente.',
        dica: 'AIDA é a base; para funis modernos de conteúdo, veja também TOFU/MOFU/BOFU e o flywheel do HubSpot.',
      },
      {
        id: 'm4',
        pergunta: 'Qual a diferença entre marketing de conteúdo e inbound marketing?',
        opcoes: [
          'São idênticos — inbound marketing é apenas o nome mais moderno para marketing de conteúdo',
          'Marketing de conteúdo é uma tática dentro da estratégia mais ampla de inbound marketing',
          'Inbound é para B2C; marketing de conteúdo é exclusivo para B2B',
          'Marketing de conteúdo usa mídia paga; inbound usa apenas orgânico',
        ],
        correta: 1,
        explicacao: 'Inbound marketing é a estratégia de atrair clientes voluntariamente (vs. interromper com outbound). Marketing de conteúdo — criar artigos, vídeos, podcasts relevantes — é a principal tática de inbound, mas não a única. SEO, email marketing, redes sociais e lead nurturing também compõem o inbound.',
        dica: 'Hierarquia: Inbound Marketing (estratégia) > Marketing de Conteúdo (tática principal) > Blog/SEO/vídeo (canais de execução).',
      },
    ],
  },
  {
    id: 'psicologia',
    nome: 'Psicologia',
    icone: 'head-heart-outline',
    emoji: '🧠',
    gradient: ['#4C1D95', '#7C3AED'],
    desc: 'Clínica, escuta ativa e saúde mental',
    perguntas: [
      {
        id: 'psi1',
        pergunta: 'Em uma primeira sessão, um paciente chora ao falar sobre a família. Qual é a postura correta do psicólogo?',
        opcoes: [
          'Interromper o choro com uma pergunta técnica para manter o foco terapêutico',
          'Acolher o momento com presença e silêncio, deixando o paciente elaborar no próprio ritmo',
          'Encerrar a sessão antecipadamente para não sobrecarregar o paciente na primeira consulta',
          'Oferecer imediatamente uma solução para o problema familiar relatado',
        ],
        correta: 1,
        explicacao: 'A escuta empática e o acolhimento sem julgamento são pilares da aliança terapêutica. Interromper ou apressar a elaboração emocional compromete a segurança do vínculo. O silêncio respeitoso é uma ferramenta clínica poderosa na psicologia.',
        dica: 'Conceito-chave: aliança terapêutica. Carl Rogers: aceitação incondicional, empatia e congruência são os três fatores curativos centrais.',
      },
      {
        id: 'psi2',
        pergunta: 'Qual a diferença entre psicose e neurose na perspectiva psicanalítica?',
        opcoes: [
          'Psicose é mais grave que neurose apenas porque exige medicação; a diferença é farmacológica',
          'Neurose é inconsciente; psicose é sempre consciente e voluntária',
          'Na neurose o sujeito reprime o conflito e mantém contato com a realidade; na psicose há ruptura com a realidade e foraclusão do Nome-do-Pai',
          'São sinônimos modernos de introversão e extroversão',
        ],
        correta: 2,
        explicacao: 'Para Freud e Lacan, na neurose o mecanismo central é o recalque — o conflito fica no inconsciente, mas o sujeito mantém o teste de realidade. Na psicose, Lacan descreve a foraclusão do Nome-do-Pai, gerando ruptura com a realidade e possível delírio/alucinação.',
        dica: 'Para entrevistas em saúde mental: domine os mecanismos de defesa (recalque, projeção, negação, sublimação) e as estruturas clínicas lacanianas.',
      },
      {
        id: 'psi3',
        pergunta: 'O que é o DSM-5 e qual sua função na prática clínica?',
        opcoes: [
          'É um manual de técnicas terapêuticas que indica o tratamento correto para cada transtorno',
          'É um sistema classificatório de transtornos mentais baseado em critérios descritivos, usado para diagnóstico — não prescreve tratamento',
          'É um teste psicológico padronizado aplicado em avaliações neuropsicológicas',
          'É a legislação brasileira que regulamenta o exercício da psicologia clínica',
        ],
        correta: 1,
        explicacao: 'O DSM-5 (Manual Diagnóstico e Estatístico de Transtornos Mentais) é um sistema classificatório descritivo da APA — organiza critérios diagnósticos, mas não indica tratamento nem explica etiologia. É distinto do CID-11 (OMS). O psicólogo usa ambos como referência, não como receita.',
        dica: 'Diferencie: DSM-5 (APA, foco clínico) vs CID-11 (OMS, foco epidemiológico). Em entrevistas de saúde mental, conhecer os dois é esperado.',
      },
      {
        id: 'psi4',
        pergunta: 'Quando o psicólogo é obrigado a quebrar o sigilo profissional?',
        opcoes: [
          'Sempre que a família do paciente solicitar informações sobre o tratamento',
          'Quando o plano de saúde exige relatório detalhado para autorizar sessões',
          'Quando há risco iminente e concreto de morte para o paciente ou terceiros — situação de notificação compulsória',
          'O sigilo é absoluto e nunca pode ser quebrado em nenhuma circunstância',
        ],
        correta: 2,
        explicacao: 'O Código de Ética do CFP (Conselho Federal de Psicologia) prevê a quebra de sigilo quando há risco real e iminente de vida — do paciente (suicídio com plano) ou de terceiros. Também há obrigação de notificação em casos de violência contra criança/adolescente (ECA). Família e planos de saúde não justificam quebra automática.',
        dica: 'Leia o Código de Ética do CFP (Resolução CFP 10/2005) — cai muito em concursos e entrevistas na área de saúde mental.',
      },
      {
        id: 'psi5',
        pergunta: 'O que é TCC (Terapia Cognitivo-Comportamental) e em quais condições tem mais evidência científica?',
        opcoes: [
          'É uma abordagem baseada exclusivamente em técnicas de relaxamento muscular progressivo',
          'É uma terapia de longa duração focada em explorar traumas da infância por associação livre',
          'É uma abordagem estruturada que identifica e modifica pensamentos disfuncionais e comportamentos — com forte evidência em ansiedade, depressão e TOC',
          'É um tipo de psicoterapia de grupo derivada da psicanálise lacaniana',
        ],
        correta: 2,
        explicacao: 'A TCC, desenvolvida por Aaron Beck, parte da relação entre pensamentos automáticos, emoções e comportamentos. É a abordagem com maior número de ensaios clínicos randomizados, com evidência robusta para transtornos de ansiedade, depressão, TOC, TEPT e fobias específicas. É estruturada, focada em metas e geralmente de curta a média duração.',
        dica: 'Aaron Beck (TCC) vs Albert Ellis (TREC) vs Skinner (comportamental puro) — diferencie as origens para mostrar profundidade teórica.',
      },
    ],
  },
  {
    id: 'enfermagem',
    nome: 'Enfermagem',
    icone: 'needle',
    emoji: '💉',
    gradient: ['#065F46', '#10B981'],
    desc: 'Cuidado, técnica e ética hospitalar',
    perguntas: [
      {
        id: 'enf1',
        pergunta: 'O que é a SAE (Sistematização da Assistência de Enfermagem) e por que é obrigatória?',
        opcoes: [
          'É um sistema informatizado de prontuário eletrônico exigido pelo CFM',
          'É um método de organização do trabalho da enfermagem que garante cuidado individualizado, seguro e documentado — obrigatório pelo COFEN',
          'É a escala de plantão elaborada pelo enfermeiro-chefe do setor',
          'É um protocolo exclusivo de UTIs para controle de infecção hospitalar',
        ],
        correta: 1,
        explicacao: 'A SAE é regulamentada pela Resolução COFEN 358/2009. Organiza o cuidado em 5 etapas do Processo de Enfermagem: coleta de dados, diagnóstico, planejamento, implementação e avaliação. Garante continuidade, segurança e respaldo legal para o enfermeiro.',
        dica: 'Memorize as 5 etapas do PE (Processo de Enfermagem) e cite a Resolução COFEN 358/2009 — diferencia muito em entrevistas hospitalares.',
      },
      {
        id: 'enf2',
        pergunta: 'Qual o procedimento correto ao identificar um erro de medicação antes de administrá-la?',
        opcoes: [
          'Administrar assim mesmo para não atrasar o tratamento e comunicar depois',
          'Descartar o medicamento silenciosamente e não registrar para não prejudicar o colega',
          'Suspender a administração, comunicar imediatamente ao médico responsável, registrar no prontuário e preencher notificação de evento adverso',
          'Apenas avisar o paciente e aguardar a prescrição correta sem outros procedimentos',
        ],
        correta: 2,
        explicacao: 'Segurança do paciente é prioridade absoluta. O protocolo correto: NÃO administrar, comunicar o prescritor, registrar no prontuário e notificar via sistema de farmacovigilância (NOTIVISA). A subnotificação é um problema grave no Brasil — cultura de segurança exige transparência, não punição.',
        dica: 'Os 5 certos de administração de medicamentos: paciente certo, medicamento certo, dose certa, via certa, horário certo. Hoje se acrescenta: registro correto e motivo certo.',
      },
      {
        id: 'enf3',
        pergunta: 'O que são os diagnósticos de enfermagem da NANDA-I?',
        opcoes: [
          'São laudos médicos elaborados pelo enfermeiro em substituição ao médico em emergências',
          'São julgamentos clínicos sobre respostas humanas a condições de saúde — usados pelo enfermeiro para planejar intervenções independentes',
          'São apenas registros administrativos exigidos pelo plano de saúde para faturamento',
          'São diagnósticos exclusivos de enfermeiros especialistas em UTI',
        ],
        correta: 1,
        explicacao: 'Os diagnósticos NANDA-I são taxonomia padronizada de julgamentos clínicos do enfermeiro sobre respostas do paciente (ex: "Dor aguda", "Risco de queda", "Ansiedade"). São diferentes do diagnóstico médico — o enfermeiro não diagnostica doenças, mas as respostas humanas a elas, planejando intervenções de enfermagem (NIC) e resultados esperados (NOC).',
        dica: 'Tríade NANDA-NIC-NOC: diagnóstico → intervenção → resultado. Conhecer essa estrutura é fundamental para qualquer entrevista hospitalar de enfermagem.',
      },
      {
        id: 'enf4',
        pergunta: 'Como agir diante de um paciente com sinais de sepse?',
        opcoes: [
          'Aguardar o médico chegar para não tomar nenhuma ação antes da avaliação completa',
          'Administrar antibiótico de amplo espectro por conta própria para não perder tempo',
          'Reconhecer os critérios (SIRS ou qSOFA), acionar imediatamente a equipe médica, coletar hemocultura, garantir acesso venoso e monitorar sinais vitais',
          'Isolar o paciente em quarto privativo e aguardar resultado de cultura antes de qualquer medida',
        ],
        correta: 2,
        explicacao: 'Sepse é emergência — cada hora sem tratamento aumenta a mortalidade em ~7%. O enfermeiro deve reconhecer os critérios (febre/hipotermia, taquicardia, taquipneia, alteração do nível de consciência), acionar a equipe, coletar hemoculturas ANTES do antibiótico, garantir acesso venoso calibroso e monitorar continuamente.',
        dica: '"Bundle" de sepse (1 hora): hemoculturas, lactato, acesso venoso, volume e antibiótico. O enfermeiro é fundamental nessa cadeia — conhecê-la é esperado em entrevistas hospitalares e de UTI.',
      },
      {
        id: 'enf5',
        pergunta: 'Qual a diferença entre as atribuições do Enfermeiro e do Técnico de Enfermagem?',
        opcoes: [
          'Não há diferença legal — ambos podem realizar todos os procedimentos de enfermagem',
          'O técnico pode prescrever medicamentos simples; o enfermeiro apenas coordena a equipe',
          'O enfermeiro tem formação de nível superior, realiza SAE, prescrevem cuidados e supervisionam; o técnico executa procedimentos sob supervisão do enfermeiro',
          'O técnico é responsável pela gestão do setor; o enfermeiro executa os procedimentos técnicos',
        ],
        correta: 2,
        explicacao: 'A Lei do Exercício Profissional de Enfermagem (Lei 7.498/86) e o Decreto 94.406/87 definem: enfermeiro — nível superior, dirige serviços, realiza SAE, prescreve cuidados, supervisiona. Técnico — nível médio, executa ações de maior complexidade técnica sob supervisão. Auxiliar — procedimentos de menor complexidade. Hierarquia clara com responsabilidades distintas.',
        dica: 'Cite a Lei 7.498/86 em entrevistas — demonstra conhecimento da legislação profissional, que é valorizado em concursos e seleções hospitalares.',
      },
    ],
  },
  {
    id: 'pedagogia',
    nome: 'Pedagogia',
    icone: 'teach',
    emoji: '📚',
    gradient: ['#1E40AF', '#3B82F6'],
    desc: 'Docência, aprendizagem e currículo',
    perguntas: [
      {
        id: 'ped1',
        pergunta: 'O que é a teoria da Zona de Desenvolvimento Proximal (ZDP) de Vygotsky?',
        opcoes: [
          'É a zona geográfica ideal para instalação de escolas conforme critérios do MEC',
          'É a distância entre o que o aluno já sabe sozinho e o que consegue aprender com mediação — onde ocorre o desenvolvimento real',
          'É um método de avaliação por competências usado em escolas de tempo integral',
          'É a teoria que defende aprendizagem somente por descoberta individual, sem interferência do professor',
        ],
        correta: 1,
        explicacao: 'Vygotsky define a ZDP como o espaço entre o nível de desenvolvimento real (o que o aluno faz sozinho) e o potencial (o que faz com ajuda de um par mais capaz). É nessa zona que o ensino deve atuar — nem tão fácil (já sabe) nem tão difícil (fora do alcance). A mediação do professor é central para o desenvolvimento cognitivo.',
        dica: 'Vygotsky × Piaget: para Vygotsky o social precede o individual; para Piaget o desenvolvimento precede a aprendizagem. Diferenciar os dois é clássico em entrevistas pedagógicas.',
      },
      {
        id: 'ped2',
        pergunta: 'O que são as competências socioemocionais e por que estão na BNCC?',
        opcoes: [
          'São habilidades de esportes e artes incluídas para diversificar o currículo escolar',
          'São competências exclusivas do ensino médio relacionadas a escolha de carreira profissional',
          'São habilidades como autoconhecimento, empatia, colaboração e resiliência — incluídas na BNCC porque influenciam diretamente no aprendizado acadêmico e na vida cidadã',
          'São avaliações psicológicas obrigatórias aplicadas anualmente pelos pedagogos escolares',
        ],
        correta: 2,
        explicacao: 'A BNCC (2018) inclui 10 competências gerais, várias delas socioemocionais, baseadas em evidências de que habilidades como autorregulação, empatia e colaboração impactam diretamente o desempenho acadêmico e a saúde mental dos alunos. Fundamentadas em Goleman (inteligência emocional) e pesquisas do CASEL.',
        dica: 'Mencione as 10 competências gerais da BNCC em entrevistas pedagógicas — demonstra domínio do documento curricular nacional obrigatório.',
      },
      {
        id: 'ped3',
        pergunta: 'Como o pedagogo deve agir diante de um aluno com suspeita de violência doméstica?',
        opcoes: [
          'Investigar os fatos diretamente com a família antes de qualquer encaminhamento externo',
          'Manter sigilo para não expor a criança e aguardar confirmação antes de agir',
          'Comunicar imediatamente à direção da escola e ao Conselho Tutelar — notificação é obrigação legal independente de confirmação',
          'Encaminhar diretamente à polícia sem comunicar a direção escolar',
        ],
        correta: 2,
        explicacao: 'O ECA (Art. 56) e a Lei 13.010/2014 (Lei Menino Bernardo) obrigam professores e pedagogos a comunicar suspeita ou confirmação de violência ao Conselho Tutelar. Não é facultativo e não depende de certeza — suspeita já obriga notificação. A escola deve ter protocolo claro para esses casos.',
        dica: 'ECA Art. 56: "os dirigentes de estabelecimentos de ensino fundamental comunicarão ao Conselho Tutelar os casos de..." — cite o artigo para demonstrar domínio legal.',
      },
      {
        id: 'ped4',
        pergunta: 'O que é avaliação formativa e como difere da somativa?',
        opcoes: [
          'Formativa é a prova final do semestre; somativa é a prova parcial',
          'São sinônimos — ambas verificam o aprendizado ao final de um conteúdo',
          'Formativa acompanha o processo de aprendizagem ao longo do tempo para ajustar o ensino; somativa verifica o resultado final para certificação ou nota',
          'Formativa é exclusiva do ensino superior; somativa é usada apenas na educação básica',
        ],
        correta: 2,
        explicacao: 'Avaliação formativa (processual) — ocorre durante o processo, tem função diagnóstica e orienta o planejamento do professor. Exemplo: observação, portfólio, autoavaliação. Somativa — ocorre ao final de um período, verifica o nível de aprendizado para fins de progressão ou certificação. Bloom distingue claramente as duas funções.',
        dica: 'Luckesi, Hoffmann e Perrenoud são os principais teóricos da avaliação citados em entrevistas pedagógicas brasileiras.',
      },
      {
        id: 'ped5',
        pergunta: 'O que é o PPP (Projeto Político-Pedagógico) e quem deve construí-lo?',
        opcoes: [
          'É um documento burocrático elaborado apenas pela direção e entregue à Secretaria de Educação',
          'É o planejamento de aulas elaborado individualmente por cada professor no início do ano',
          'É o documento identitário da escola que define sua intencionalidade educativa — deve ser construído coletivamente com participação de professores, famílias, alunos e comunidade',
          'É um formulário de avaliação institucional preenchido pelo MEC a cada 3 anos',
        ],
        correta: 2,
        explicacao: 'O PPP (também chamado de Proposta Pedagógica) é previsto na LDB (Lei 9.394/96, Art. 12-13) e deve expressar a identidade e os valores da escola. Sua construção coletiva — gestão democrática — é princípio constitucional (CF Art. 206). Um PPP construído apenas pela direção sem participação da comunidade perde legitimidade e efetividade.',
        dica: 'LDB 9.394/96 é a lei central da educação brasileira. Conhecer os artigos principais (12, 13, 14, 26, 36) é essencial para qualquer entrevista pedagógica.',
      },
    ],
  },
  {
    id: 'gerencia',
    nome: 'Gerência',
    icone: 'briefcase-outline',
    emoji: '📋',
    gradient: ['#1F2937', '#4B5563'],
    desc: 'Gestão de projetos, metas e equipes',
    perguntas: [
      {
        id: 'ger1',
        pergunta: 'Qual a diferença entre gestão de projetos ágil (Scrum) e cascata (Waterfall)?',
        opcoes: [
          'Scrum é para projetos de TI; Waterfall é exclusivo para projetos de construção civil',
          'Waterfall entrega em ciclos curtos; Scrum entrega todo o projeto de uma vez no final',
          'Scrum divide o trabalho em sprints curtos com entregas incrementais e adaptação contínua; Waterfall segue fases sequenciais fixas com entrega única ao final',
          'São o mesmo método com nomes diferentes usados em países distintos',
        ],
        correta: 2,
        explicacao: 'Waterfall (cascata): fases sequenciais e rígidas (requisitos → design → desenvolvimento → teste → entrega). Ideal quando o escopo é estável. Scrum: ciclos iterativos (sprints de 1-4 semanas) com entrega incremental e adaptação constante ao feedback. Ideal para projetos com requisitos que evoluem. A escolha depende da estabilidade do escopo, não do setor.',
        dica: 'Além de Scrum, conheça Kanban (fluxo contínuo), SAFe (ágil em escala) e PMBOK (guia de boas práticas waterfall). Entrevistas de gerência cobram qual usar em qual contexto.',
      },
      {
        id: 'ger2',
        pergunta: 'O que é a Matriz RACI e para que serve?',
        opcoes: [
          'É uma ferramenta financeira para calcular o Retorno sobre Investimento de projetos',
          'É um framework de contratação que classifica candidatos em 4 níveis de senioridade',
          'É uma ferramenta de definição de papéis: Responsável, Aprovador, Consultado e Informado — elimina ambiguidade sobre quem decide o quê',
          'É um método de avaliação de riscos que classifica impacto e probabilidade em 4 quadrantes',
        ],
        correta: 2,
        explicacao: 'A Matriz RACI (Responsible, Accountable, Consulted, Informed) define claramente responsabilidades por atividade. R = quem executa, A = quem aprova e responde pelo resultado, C = quem é consultado antes, I = quem é informado depois. Elimina o "achei que era você" — uma das maiores causas de falha em projetos.',
        dica: 'Em entrevistas de gestão, cite RACI ao falar sobre como evitar conflitos de responsabilidade. Demonstra maturidade em gestão de stakeholders.',
      },
      {
        id: 'ger3',
        pergunta: 'Como priorizar um backlog com múltiplas demandas de stakeholders diferentes?',
        opcoes: [
          'Dar prioridade sempre ao stakeholder hierarquicamente mais alto da organização',
          'Atender na ordem de chegada das solicitações para parecer justo e imparcial',
          'Usar critérios objetivos como impacto no negócio, esforço estimado, dependências e urgência — frameworks como MoSCoW ou RICE ajudam a tornar a decisão transparente',
          'Deixar a equipe de desenvolvimento decidir o que é mais fácil de implementar',
        ],
        correta: 2,
        explicacao: 'Priorização por hierarquia gera política; por ordem de chegada ignora valor. Frameworks como MoSCoW (Must/Should/Could/Won\'t) e RICE (Reach × Impact × Confidence ÷ Effort) criam critérios objetivos e transparentes. O gerente facilita a decisão com dados — não decide sozinho nem pela voz mais alta.',
        dica: 'Citar MoSCoW + RICE + stakeholder alignment em uma resposta sobre priorização demonstra repertório técnico avançado em gerência de produto/projetos.',
      },
      {
        id: 'ger4',
        pergunta: 'O que é o triângulo de ferro em gerência de projetos e qual sua implicação prática?',
        opcoes: [
          'É uma metáfora sobre conflito entre os três sócios de uma empresa em fase inicial',
          'É a relação entre escopo, prazo e custo — mudar um afeta os outros, e qualidade é o resultado do equilíbrio entre os três',
          'É um modelo de liderança com três estilos: autocrático, democrático e laissez-faire',
          'É uma ferramenta de análise de concorrentes com três dimensões: preço, qualidade e entrega',
        ],
        correta: 1,
        explicacao: 'O triângulo de ferro (ou tripla restrição) do PMBOK define que escopo, prazo e custo são interdependentes: reduzir prazo sem aumentar custo exige reduzir escopo. Qualidade não está nos vértices — é o resultado do equilíbrio entre os três. Entender isso ajuda a ter conversas honestas com stakeholders sobre trade-offs.',
        dica: 'Quando um stakeholder pedir "mais escopo, mesmo prazo, mesmo custo", explique o triângulo. Gerente que entende de restrições constrói credibilidade.',
      },
      {
        id: 'ger5',
        pergunta: 'Como conduzir uma reunião de retrospectiva eficaz em um time ágil?',
        opcoes: [
          'Listar os culpados pelos problemas do sprint para que não se repitam',
          'Apresentar apenas os sucessos para manter a motivação e evitar conflitos',
          'Criar ambiente seguro para discutir o que foi bem, o que melhorar e definir ações concretas com dono e prazo',
          'Deixar apenas o gerente falar para otimizar o tempo da reunião',
        ],
        correta: 2,
        explicacao: 'A retrospectiva eficaz (formato clássico: Start/Stop/Continue ou 4Ls) requer segurança psicológica — sem isso ninguém fala o que realmente pensa. O produto da retro não é a discussão, são as ações: específicas, com responsável definido e prazo. Retro sem ação vira ritual vazio que o time começa a odiar.',
        dica: 'Cite segurança psicológica (Amy Edmondson) em entrevistas de gestão ágil. É o fator #1 de performance de times, segundo estudo do Google (Projeto Aristóteles).',
      },
    ],
  },
  {
    id: 'operacional',
    nome: 'Operacional',
    icone: 'cog-outline',
    emoji: '⚙️',
    gradient: ['#78350F', '#B45309'],
    desc: 'Processos, qualidade e eficiência',
    perguntas: [
      {
        id: 'op1',
        pergunta: 'O que é o ciclo PDCA e como aplicá-lo na melhoria de processos?',
        opcoes: [
          'É um sistema de avaliação de desempenho anual dividido em 4 notas',
          'É uma ferramenta financeira para projeção de custos operacionais em 4 trimestres',
          'É um ciclo de melhoria contínua: Plan (planejar), Do (executar), Check (verificar) e Act (agir/padronizar) — aplicado repetidamente para eliminar causas de problemas',
          'É exclusivo para fábricas — não se aplica a processos de serviços ou administrativos',
        ],
        correta: 2,
        explicacao: 'O PDCA (Shewhart/Deming) é a base da melhoria contínua: Plan — identificar o problema e planejar a solução; Do — executar em pequena escala; Check — analisar os resultados vs. o esperado; Act — padronizar se funcionou ou reiniciar o ciclo. Funciona em qualquer setor: fábrica, hospital, TI, varejo.',
        dica: 'PDCA + DMAIC (Six Sigma) são as duas metodologias de melhoria contínua mais cobradas. DMAIC é mais rigoroso estatisticamente; PDCA é mais ágil e universal.',
      },
      {
        id: 'op2',
        pergunta: 'O que é o Diagrama de Ishikawa (espinha de peixe) e quando usar?',
        opcoes: [
          'É um gráfico de barras para comparar o desempenho de diferentes operadores',
          'É uma ferramenta de análise de causa raiz que organiza as causas de um problema em categorias (6Ms): Método, Mão de obra, Máquina, Material, Meio ambiente, Medição',
          'É um fluxograma que mapeia o processo produtivo do início ao fim',
          'É um indicador de qualidade que mede defeitos por milhão de oportunidades',
        ],
        correta: 1,
        explicacao: 'O Diagrama de Causa e Efeito (Ishikawa/espinha de peixe) é usado para análise de causa raiz de problemas. As 6Ms cobrem os principais vetores de falha em processos industriais. Em serviços adaptam-se para 4Ps (Políticas, Procedimentos, Pessoas, Planta) ou 4Ss. É usado ANTES de soluções — sem diagnóstico correto a solução ataca o sintoma.',
        dica: 'Use sempre com os "5 Porquês" — Ishikawa identifica categorias, os 5 Porquês aprofundam até a causa raiz real dentro de cada categoria.',
      },
      {
        id: 'op3',
        pergunta: 'O que é OEE (Overall Equipment Effectiveness) e o que indica?',
        opcoes: [
          'É o número de funcionários por equipamento — índice de dimensionamento de equipe',
          'É o custo de manutenção dividido pelo valor do equipamento — indica quando substituir',
          'É o indicador que combina Disponibilidade × Performance × Qualidade para medir a eficiência real de um equipamento em relação ao ideal',
          'É uma certificação de qualidade emitida pela ISO para equipamentos industriais',
        ],
        correta: 2,
        explicacao: 'OEE = Disponibilidade (o equipamento está disponível quando precisa?) × Performance (opera na velocidade ideal?) × Qualidade (produz sem defeitos?). OEE de 85% é considerado world class. Cada dimensão revela onde está a perda: paradas (disponibilidade), velocidade reduzida (performance) ou retrabalho (qualidade).',
        dica: 'OEE é a métrica rainha do TPM (Manutenção Produtiva Total). Citar OEE + as 6 Grandes Perdas demonstra conhecimento avançado em gestão de operações industriais.',
      },
      {
        id: 'op4',
        pergunta: 'Qual a diferença entre manutenção preventiva, preditiva e corretiva?',
        opcoes: [
          'São sinônimos com níveis de custo diferentes — corretiva é sempre mais cara que preventiva',
          'Preventiva é feita por técnicos internos; preditiva por consultores externos; corretiva pelo fabricante',
          'Preventiva é por intervalo de tempo fixo; preditiva é baseada em condição monitorada do equipamento; corretiva é após a falha ocorrer',
          'Preditiva é planejada; preventiva é emergencial; corretiva é programada',
        ],
        correta: 2,
        explicacao: 'Corretiva: age após a falha — mais barata de planejar, mais cara de executar (parada não programada). Preventiva: age em intervalos fixos (ex.: troca de óleo a cada 500h) — pode gerar intervenções desnecessárias. Preditiva: monitora condição real (vibração, temperatura, ultrassom) e intervém quando necessário — mais eficiente, exige tecnologia. Tendência: migrar de preventiva para preditiva com IoT.',
        dica: 'Acrescente RCM (Reliability Centered Maintenance) se quiser impressionar — é a metodologia que define qual estratégia usar para cada ativo com base no impacto da falha.',
      },
      {
        id: 'op5',
        pergunta: 'O que é Kaizen e como se diferencia de uma grande reestruturação operacional?',
        opcoes: [
          'Kaizen é uma reestruturação completa feita uma vez por ano com consultoria externa',
          'Kaizen e reestruturação são equivalentes — ambos visam melhorar os processos da empresa',
          'Kaizen é a filosofia de pequenas melhorias contínuas feitas por todos no dia a dia — acumula grandes resultados sem ruptura; reestruturação é mudança radical pontual',
          'Kaizen é exclusivo do setor automotivo japonês e não se aplica ao Brasil',
        ],
        correta: 2,
        explicacao: 'Kaizen (改善 = "mudança para melhor") é a filosofia Toyota de melhoria contínua incremental, feita por todos os colaboradores no cotidiano. Cada melhoria pequena, acumulada, gera transformação grande ao longo do tempo — sem o trauma de reestruturações abruptas. Valoriza o conhecimento do chão de fábrica: quem opera sabe onde melhorar.',
        dica: 'Kaizen + 5S + Kanban formam o tripé do Sistema Toyota de Produção (TPS), base do Lean Manufacturing. Conhecer os três demonstra visão sistêmica de operações.',
      },
    ],
  },
  {
    id: 'qualidade',
    nome: 'Qualidade',
    icone: 'check-decagram-outline',
    emoji: '✅',
    gradient: ['#064E3B', '#059669'],
    desc: 'ISO, Six Sigma, auditorias e melhoria contínua',
    perguntas: [
      {
        id: 'q1',
        pergunta: 'O que a norma ISO 9001:2015 exige como fundamento do sistema de gestão da qualidade?',
        opcoes: [
          'Que todos os processos sejam documentados em papel e assinados pelo diretor',
          'Que a empresa tenha um departamento exclusivo de qualidade com no mínimo 5 funcionários',
          'Abordagem por processos, pensamento baseado em risco e melhoria contínua orientada ao contexto da organização e necessidades das partes interessadas',
          'Certificação obrigatória a cada 6 meses com auditoria interna e externa simultânea',
        ],
        correta: 2,
        explicacao: 'A ISO 9001:2015 rompeu com o modelo burocrático de versões anteriores. Os três pilares são: abordagem por processos (enxergar a empresa como fluxo de entradas/saídas), pensamento baseado em risco (agir preventivamente, não só reativamente) e melhoria contínua. A alta direção tem papel central — qualidade não é mais só do departamento de qualidade.',
        dica: 'Diferencial em entrevistas: citar a estrutura de alto nível (Anexo SL/HLS) que alinha ISO 9001, 14001, 45001 — permite sistemas integrados de gestão (SIG).',
      },
      {
        id: 'q2',
        pergunta: 'O que é DPMO e como ele se relaciona com o nível Sigma de um processo?',
        opcoes: [
          'DPMO é o índice de satisfação do cliente; quanto maior o Sigma, menor a satisfação',
          'DPMO (Defeitos Por Milhão de Oportunidades) mede a taxa de falhas; 6 Sigma equivale a 3,4 DPMO — nível de excelência operacional',
          'DPMO é a sigla para Departamento de Processos e Melhoria Operacional',
          'DPMO mede somente defeitos de fabricação; não se aplica a processos de serviços',
        ],
        correta: 1,
        explicacao: 'DPMO quantifica defeitos em escala comparável entre processos de tamanhos diferentes. A escala Sigma: 1σ ≈ 690.000 DPMO → 6σ ≈ 3,4 DPMO. Empresas de manufatura de alto padrão (aeroespacial, farmacêutica) buscam 6 Sigma. A maioria das empresas opera entre 3σ e 4σ (~6.000–67.000 DPMO). Six Sigma como metodologia usa DMAIC para reduzir variação.',
        dica: 'Fórmula: DPMO = (número de defeitos ÷ (oportunidades × unidades)) × 1.000.000. Em entrevistas, saiba calcular e interpretar — demonstra domínio estatístico.',
      },
      {
        id: 'q3',
        pergunta: 'Qual é a diferença entre controle estatístico de processo (CEP) e inspeção final?',
        opcoes: [
          'São equivalentes — CEP é apenas o nome técnico para inspeção realizada por computador',
          'Inspeção final é mais eficaz pois captura todos os defeitos antes de chegar ao cliente',
          'CEP monitora o processo em tempo real com cartas de controle para detectar variações antes que gerem defeitos; inspeção final detecta defeitos depois que já foram produzidos — é reativa e não previne retrabalho',
          'CEP é aplicável apenas em indústrias químicas; inspeção final serve para todos os setores',
        ],
        correta: 2,
        explicacao: 'A grande virada da qualidade moderna (Deming, Juran) foi sair da inspeção para o controle: CEP usa gráficos de controle (Shewhart) para monitorar médias e amplitudes em tempo real. Quando o processo sai dos limites de controle estatístico, age-se ANTES de gerar defeito. Inspeção final segrega refugo — útil, mas cara e tardia. Prevenção > detecção > correção.',
        dica: 'Tipos de carta de controle mais cobrados: X̄-R (variáveis contínuas), p-chart e c-chart (atributos — defeituosos e defeitos). Saber qual usar em cada situação é diferencial.',
      },
      {
        id: 'q4',
        pergunta: 'O que é um FMEA (Failure Mode and Effects Analysis) e quando aplicá-lo?',
        opcoes: [
          'É uma auditoria de qualidade realizada após o lançamento do produto para levantar reclamações',
          'É uma análise prospectiva que identifica modos de falha potenciais, suas causas, efeitos e calcula o RPN (Risk Priority Number) para priorizar ações preventivas — aplicado no projeto ou processo antes da produção',
          'É um relatório de não conformidade emitido pelo cliente após a entrega do produto',
          'É exclusivo para indústria automobilística e não se aplica a outros segmentos',
        ],
        correta: 1,
        explicacao: 'FMEA é a ferramenta de prevenção por excelência. Para cada modo de falha calcula-se RPN = Severidade × Ocorrência × Detectabilidade (cada de 1 a 10). RPN alto → ação prioritária. FMEA de Projeto (DFMEA) trata falhas de concepção; FMEA de Processo (PFMEA) trata falhas de manufatura/serviço. Obrigatório em IATF 16949 (automotivo), usado em aeroespacial, saúde, alimentos.',
        dica: 'Em entrevistas de qualidade, saber calcular RPN e explicar como priorizar ações (reduzir Severidade > Ocorrência > Detectabilidade) demonstra maturidade técnica.',
      },
      {
        id: 'q5',
        pergunta: 'Como conduzir uma auditoria interna de qualidade de forma eficaz?',
        opcoes: [
          'Focar em encontrar o maior número de não conformidades possível para demonstrar rigor ao auditor externo',
          'Avisar previamente apenas a área auditada para que se prepare — surpresa prejudica o processo',
          'Seguir um plano baseado em evidências objetivas, entrevistar colaboradores, verificar registros e processos in loco, registrar achados com base nos requisitos da norma — o objetivo é verificar conformidade e identificar oportunidades de melhoria, não punir',
          'Delegar inteiramente ao consultor externo para garantir imparcialidade',
        ],
        correta: 2,
        explicacao: 'Auditoria interna eficaz segue ISO 19011: planejamento (escopo, critérios, equipe), execução (entrevistas, observação, análise de documentos), registro de achados (conformidades, não conformidades, observações) e relatório. O auditor interno não é fiscal — é agente de melhoria. Não conformidade deve ter causa raiz identificada e ação corretiva com prazo.',
        dica: 'Diferença importante: não conformidade (requisito não atendido) vs. observação (potencial de melhoria) vs. oportunidade de melhoria. Saber distinguir demonstra precisão técnica em entrevistas de qualidade.',
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   SCORES / BADGES
═══════════════════════════════════════════════════════════════ */
const getBadge = (pct) => {
  if (pct === 100) return { label: 'Mestre!', emoji: '🏆', cor: '#F59E0B', bg: '#FFFBEB' };
  if (pct >= 80)  return { label: 'Expert',   emoji: '🥇', cor: '#059669', bg: '#F0FDF4' };
  if (pct >= 60)  return { label: 'Avançado', emoji: '🎯', cor: '#3B82F6', bg: '#EFF6FF' };
  if (pct >= 40)  return { label: 'Em evolução', emoji: '📈', cor: '#8B5CF6', bg: '#F5F3FF' };
  return               { label: 'Iniciante',  emoji: '💪', cor: '#DC2626', bg: '#FEF2F2' };
};

/* ═══════════════════════════════════════════════════════════════
   COMPONENTE
═══════════════════════════════════════════════════════════════ */
export default function QuizEntrevista({ navigation }) {
  const [etapa, setEtapa]                 = useState('home');    // home | quiz | resultado
  const [catSelecionada, setCat]          = useState(null);
  const [perguntaIdx, setIdx]             = useState(0);
  const [respostaSelecionada, setResp]    = useState(null);      // índice escolhido
  const [mostrarFeedback, setFeedback]    = useState(false);
  const [acertos, setAcertos]             = useState([]);        // bool por pergunta
  const [busca, setBusca]                 = useState('');

  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  /* animação de transição entre perguntas */
  const animar = (cb) => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      cb();
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    });
  };

  /* pulso no acerto */
  const pulsarAcerto = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.04, duration: 120, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,    duration: 120, useNativeDriver: true }),
    ]).start();
  };

  /* shake no erro */
  const shakeErro = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 6,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,  duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const responder = (idx) => {
    if (mostrarFeedback) return;
    setResp(idx);
    setFeedback(true);
    const pergunta = catSelecionada.perguntas[perguntaIdx];
    if (idx === pergunta.correta) pulsarAcerto();
    else shakeErro();
  };

  const avancar = () => {
    const pergunta = catSelecionada.perguntas[perguntaIdx];
    const acertou  = respostaSelecionada === pergunta.correta;
    const novosAcertos = [...acertos, acertou];

    if (perguntaIdx < catSelecionada.perguntas.length - 1) {
      animar(() => {
        setAcertos(novosAcertos);
        setIdx(perguntaIdx + 1);
        setResp(null);
        setFeedback(false);
      });
    } else {
      animar(() => {
        setAcertos(novosAcertos);
        setEtapa('resultado');
      });
    }
  };

  const iniciarCategoria = (cat) => {
    animar(() => {
      setCat(cat);
      setIdx(0);
      setResp(null);
      setFeedback(false);
      setAcertos([]);
      setEtapa('quiz');
    });
  };

  const voltarHome = () => {
    animar(() => {
      setEtapa('home');
      setCat(null);
      setIdx(0);
      setResp(null);
      setFeedback(false);
      setAcertos([]);
    });
  };

  const normalize = (s) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/gi, '').toLowerCase();

  const catsFiltradas = CATEGORIAS.filter(c =>
    busca.trim() === '' ||
    normalize(c.nome).includes(normalize(busca)) ||
    normalize(c.desc).includes(normalize(busca))
  );

  const totalPerguntas = CATEGORIAS.reduce((s, c) => s + c.perguntas.length, 0);

  /* ══════════════════════════════════════════════════
     HOME
  ══════════════════════════════════════════════════ */
  if (etapa === 'home') return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>

      {/* ── HEADER FIXO ── */}
      <LinearGradient
        colors={['#0F172A', '#1E3A8A', '#3730A3']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={s.header}
      >
        <View style={[s.blob, { width: 180, height: 180, top: -70, right: -50 }]} />
        <View style={[s.blob, { width: 90, height: 90, bottom: -30, left: -20 }]} />
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={s.headerBackBtn}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.headerTitle}>Simulador de Entrevistas</Text>
            <Text style={s.headerSub}>Quiz interativo · {totalPerguntas} perguntas · {CATEGORIAS.length} áreas</Text>
          </View>
          <View style={s.headerIconBox}>
            <Text style={{ fontSize: 22 }}>🎯</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Busca */}
        <View style={s.searchWrap}>
          <View style={s.searchBox}>
            <MaterialCommunityIcons name="magnify" size={20} color="#94A3B8" />
            <TextInput
              style={s.searchInput}
              placeholder="Buscar área..."
              placeholderTextColor="#94A3B8"
              value={busca}
              onChangeText={setBusca}
            />
            {busca.length > 0 && (
              <TouchableOpacity onPress={() => setBusca('')}>
                <MaterialCommunityIcons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Cards de categoria */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Escolha uma área para o quiz</Text>
          {catsFiltradas.map((cat, i) => (
            <Animatable.View key={cat.id} animation="fadeInUp" delay={180 + i * 55}>
              <TouchableOpacity onPress={() => iniciarCategoria(cat)} activeOpacity={0.87} style={s.catCard}>
                <LinearGradient colors={cat.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.catLeft}>
                  <Text style={{ fontSize: 24 }}>{cat.emoji}</Text>
                </LinearGradient>
                <View style={s.catInfo}>
                  <Text style={s.catNome}>{cat.nome}</Text>
                  <Text style={s.catDesc}>{cat.desc}</Text>
                  <View style={s.catBadge}>
                    <MaterialCommunityIcons name="help-circle-outline" size={11} color="#94A3B8" />
                    <Text style={s.catBadgeTxt}>{cat.perguntas.length} questões</Text>
                    <View style={s.dotSep} />
                    <MaterialCommunityIcons name="lightning-bolt" size={11} color="#94A3B8" />
                    <Text style={s.catBadgeTxt}>múltipla escolha</Text>
                  </View>
                </View>
                <LinearGradient colors={cat.gradient} style={s.catArrow}>
                  <MaterialCommunityIcons name="play" size={14} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </Animatable.View>
          ))}

          {catsFiltradas.length === 0 && (
            <View style={s.emptyState}>
              <Text style={{ fontSize: 36 }}>🔍</Text>
              <Text style={s.emptyTxt}>Nenhuma área para "{busca}"</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  /* ══════════════════════════════════════════════════
     QUIZ
  ══════════════════════════════════════════════════ */
  if (etapa === 'quiz' && catSelecionada) {
    const pergunta = catSelecionada.perguntas[perguntaIdx];
    const total    = catSelecionada.perguntas.length;
    const progPct  = perguntaIdx / total;
    const acertosAte = acertos.filter(Boolean).length;

    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>

        {/* ── HEADER FIXO QUIZ ── */}
        <LinearGradient
          colors={catSelecionada.gradient}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={s.header}
        >
          <View style={[s.blob, { width: 160, height: 160, top: -60, right: -40 }]} />
          <View style={s.headerRow}>
            <TouchableOpacity onPress={voltarHome} activeOpacity={0.8} style={s.headerBackBtn}>
              <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.headerTitle}>{catSelecionada.nome}</Text>
              <View style={s.headerProgRow}>
                <View style={s.headerProgTrack}>
                  <Animated.View style={[s.headerProgBar, { width: `${progPct * 100}%` }]} />
                </View>
                <Text style={s.headerProgTxt}>{perguntaIdx + 1}/{total}</Text>
              </View>
            </View>
            <View style={s.headerScoreChip}>
              <MaterialCommunityIcons name="check-bold" size={12} color="#059669" />
              <Text style={s.headerScoreTxt}>{acertosAte}</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={s.quizScroll} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            {/* Pergunta */}
            <Animated.View style={{ transform: [{ translateX: shakeAnim }, { scale: scaleAnim }] }}>
              <LinearGradient colors={catSelecionada.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.perguntaCard}>
                <View style={[s.blob, { width: 150, height: 150, top: -50, right: -40 }]} />
                <View style={s.perguntaTop}>
                  <Text style={{ fontSize: 26 }}>{catSelecionada.emoji}</Text>
                  <View style={s.pergNumBox}>
                    <Text style={s.pergNumTxt}>{perguntaIdx + 1}</Text>
                  </View>
                </View>
                <Text style={s.perguntaTxt}>{pergunta.pergunta}</Text>
                {!mostrarFeedback && (
                  <View style={s.pergHint}>
                    <MaterialCommunityIcons name="cursor-default-click-outline" size={13} color="rgba(255,255,255,0.7)" />
                    <Text style={s.pergHintTxt}>Escolha a melhor resposta</Text>
                  </View>
                )}
              </LinearGradient>
            </Animated.View>

            {/* Opções */}
            <View style={s.opcoesWrap}>
              {pergunta.opcoes.map((opcao, idx) => {
                const isSelected = respostaSelecionada === idx;
                const isCerta    = idx === pergunta.correta;
                const showCerta  = mostrarFeedback && isCerta;
                const showErrada = mostrarFeedback && isSelected && !isCerta;

                const bgColor = showCerta  ? '#F0FDF4'
                              : showErrada ? '#FEF2F2'
                              : isSelected ? '#EFF6FF'
                              : '#fff';

                const borderColor = showCerta  ? '#16A34A'
                                  : showErrada ? '#DC2626'
                                  : isSelected ? catSelecionada.gradient[0]
                                  : '#E2E8F0';

                const icon = showCerta  ? 'check-circle'
                           : showErrada ? 'close-circle'
                           : 'radiobox-blank';

                const iconColor = showCerta  ? '#16A34A'
                                : showErrada ? '#DC2626'
                                : isSelected ? catSelecionada.gradient[0]
                                : '#CBD5E1';

                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => responder(idx)}
                    activeOpacity={mostrarFeedback ? 1 : 0.8}
                    disabled={mostrarFeedback}
                    style={[s.opcaoCard, { backgroundColor: bgColor, borderColor }]}
                  >
                    {showCerta && <LinearGradient colors={['#16A34A11', '#16A34A05']} style={StyleSheet.absoluteFill} />}
                    {showErrada && <LinearGradient colors={['#DC262611', '#DC262605']} style={StyleSheet.absoluteFill} />}
                    <MaterialCommunityIcons name={icon} size={20} color={iconColor} style={{ marginTop: 1, flexShrink: 0 }} />
                    <Text style={[s.opcaoTxt, showCerta && { color: '#15803D', fontWeight: '700' }, showErrada && { color: '#B91C1C', fontWeight: '700' }]}>
                      {opcao}
                    </Text>
                    {showCerta && (
                      <Animatable.View animation="bounceIn" duration={400}>
                        <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
                      </Animatable.View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Feedback */}
            {mostrarFeedback && (
              <Animatable.View animation="fadeInUp" duration={350} style={[
                s.feedbackBox,
                { borderColor: respostaSelecionada === pergunta.correta ? '#16A34A44' : '#DC262644',
                  backgroundColor: respostaSelecionada === pergunta.correta ? '#F0FDF4' : '#FEF2F2' }
              ]}>
                <View style={s.feedbackHeader}>
                  <LinearGradient
                    colors={respostaSelecionada === pergunta.correta ? ['#059669', '#34D399'] : ['#DC2626', '#F87171']}
                    style={s.feedbackIconBox}
                  >
                    <MaterialCommunityIcons
                      name={respostaSelecionada === pergunta.correta ? 'check-bold' : 'close-thick'}
                      size={14} color="#fff"
                    />
                  </LinearGradient>
                  <Text style={[s.feedbackLabel, { color: respostaSelecionada === pergunta.correta ? '#15803D' : '#B91C1C' }]}>
                    {respostaSelecionada === pergunta.correta ? 'Correto! 🎉' : 'Quase lá! 💡'}
                  </Text>
                </View>
                <Text style={[s.feedbackTxt, { color: respostaSelecionada === pergunta.correta ? '#166534' : '#991B1B' }]}>
                  {pergunta.explicacao}
                </Text>
                <View style={s.feedbackDicaRow}>
                  <MaterialCommunityIcons name="lightbulb-on-outline" size={14} color={respostaSelecionada === pergunta.correta ? '#059669' : '#DC2626'} />
                  <Text style={[s.feedbackDicaTxt, { color: respostaSelecionada === pergunta.correta ? '#166534' : '#991B1B' }]}>
                    {pergunta.dica}
                  </Text>
                </View>

                <TouchableOpacity onPress={avancar} activeOpacity={0.88} style={s.avancarOuter}>
                  <LinearGradient colors={catSelecionada.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.avancarBtn}>
                    <Text style={s.avancarTxt}>
                      {perguntaIdx < catSelecionada.perguntas.length - 1 ? 'Próxima pergunta' : 'Ver resultado'}
                    </Text>
                    <MaterialCommunityIcons name={perguntaIdx < catSelecionada.perguntas.length - 1 ? 'arrow-right' : 'flag-checkered'} size={18} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>
            )}

          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* ══════════════════════════════════════════════════
     RESULTADO
  ══════════════════════════════════════════════════ */
  if (etapa === 'resultado' && catSelecionada) {
    const total    = catSelecionada.perguntas.length;
    const certas   = acertos.filter(Boolean).length;
    const pct      = Math.round((certas / total) * 100);
    const badge    = getBadge(pct);

    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>

        {/* ── HEADER FIXO RESULTADO ── */}
        <LinearGradient
          colors={catSelecionada.gradient}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={s.header}
        >
          <View style={[s.blob, { width: 160, height: 160, top: -60, right: -40 }]} />
          <View style={s.headerRow}>
            <TouchableOpacity onPress={voltarHome} activeOpacity={0.8} style={s.headerBackBtn}>
              <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.headerTitle}>{catSelecionada.nome}</Text>
              <Text style={s.headerSub}>Resultado · {certas}/{total} acertos</Text>
            </View>
            <View style={s.headerIconBox}>
              <Text style={{ fontSize: 20 }}>{badge.emoji}</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>

          {/* Score principal */}
          <Animatable.View animation="fadeInUp" delay={200} style={s.card}>
            <View style={s.scoreWrap}>
              <View style={[s.scoreCircle, { borderColor: catSelecionada.gradient[0] }]}>
                <Text style={[s.scorePct, { color: catSelecionada.gradient[0] }]}>{pct}%</Text>
                <Text style={s.scoreSub}>{certas}/{total} certas</Text>
              </View>
              <View style={s.scoreInfo}>
                <Text style={s.scoreInfoTitle}>{
                  pct === 100 ? 'Perfeito! Você domina esse tema.' :
                  pct >= 80  ? 'Excelente! Está muito bem preparado.' :
                  pct >= 60  ? 'Bom resultado! Continue praticando.' :
                  pct >= 40  ? 'Em progresso. Foque nos erros.' :
                               'Esse tema merece mais atenção.'
                }</Text>
                <Text style={s.scoreInfoSub}>Revise as explicações das questões que errou para memorizar melhor.</Text>
              </View>
            </View>
          </Animatable.View>

          {/* Gabarito */}
          <Animatable.View animation="fadeInUp" delay={300} style={s.card}>
            <View style={s.cardHeader}>
              <LinearGradient colors={catSelecionada.gradient} style={s.cardIconBox}>
                <MaterialCommunityIcons name="format-list-checks" size={14} color="#fff" />
              </LinearGradient>
              <Text style={s.cardTitle}>Gabarito completo</Text>
            </View>

            {catSelecionada.perguntas.map((perg, i) => {
              const acertou = acertos[i];
              return (
                <Animatable.View key={perg.id} animation="fadeInLeft" delay={350 + i * 60} style={[s.gabRow, { backgroundColor: acertou ? '#F0FDF4' : '#FEF2F2' }]}>
                  <View style={[s.gabNumBox, { backgroundColor: acertou ? '#16A34A' : '#DC2626' }]}>
                    <Text style={s.gabNum}>{i + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.gabPergunta} numberOfLines={2}>{perg.pergunta}</Text>
                    <Text style={[s.gabStatus, { color: acertou ? '#16A34A' : '#DC2626' }]}>
                      {acertou ? '✓ Acertou' : `✗ Errou — correta: "${perg.opcoes[perg.correta].substring(0, 60)}..."`}
                    </Text>
                  </View>
                </Animatable.View>
              );
            })}
          </Animatable.View>

          {/* Dica final */}
          <Animatable.View animation="fadeInUp" delay={500} style={s.card}>
            <View style={s.cardHeader}>
              <LinearGradient colors={catSelecionada.gradient} style={s.cardIconBox}>
                <MaterialCommunityIcons name="rocket-launch" size={14} color="#fff" />
              </LinearGradient>
              <Text style={s.cardTitle}>
                {pct >= 80 ? 'Próximo nível' : 'Como melhorar'}
              </Text>
            </View>
            <Text style={s.dicaFinalTxt}>
              {pct === 100
                ? `Incrível! Você acertou tudo em ${catSelecionada.nome}. Tente outra área para ampliar seu repertório.`
                : pct >= 80
                ? `Quase perfeito! Revise as ${total - certas} questão(ões) que errou e você estará pronto para qualquer entrevista nessa área.`
                : pct >= 60
                ? `Bom começo! Você acertou ${certas} de ${total}. Releia as explicações das que errou — elas são o seu caminho para a nota máxima.`
                : `Ainda há espaço para crescer. Releia as explicações com calma, anote as dicas e refaça o quiz. A repetição é o segredo do aprendizado.`
              }
            </Text>
          </Animatable.View>

          {/* Ações */}
          <Animatable.View animation="fadeInUp" delay={600} style={s.actionsWrap}>
            <TouchableOpacity onPress={() => iniciarCategoria(catSelecionada)} activeOpacity={0.88} style={s.ctaOuter}>
              <LinearGradient colors={catSelecionada.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.ctaBtn}>
                <MaterialCommunityIcons name="refresh" size={18} color="#fff" />
                <Text style={s.ctaTxt}>Refazer este quiz</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={voltarHome} activeOpacity={0.8} style={s.secBtn}>
              <MaterialCommunityIcons name="view-grid" size={16} color="#475569" />
              <Text style={s.secBtnTxt}>Escolher outra área</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={s.terBtn}>
              <Text style={s.terBtnTxt}>Voltar ao início</Text>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

/* ═══════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════ */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  blob: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.07)' },

  /* ── HEADER FIXO (igual SelecionarTemplate) ── */
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  headerRow:     { flexDirection: 'row', alignItems: 'center' },
  headerBackBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle:   { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 0.2 },
  headerSub:     { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 3, fontWeight: '500' },
  headerIconBox: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4 },

  /* barra de progresso no header do quiz */
  headerProgRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  headerProgTrack:{ flex: 1, height: 5, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3, overflow: 'hidden' },
  headerProgBar:  { height: 5, backgroundColor: '#fff', borderRadius: 3 },
  headerProgTxt:  { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', minWidth: 28 },

  /* chip de acertos no header */
  headerScoreChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 20, elevation: 2 },
  headerScoreTxt:  { fontSize: 13, fontWeight: '900', color: '#059669' },

  /* BUSCA */
  searchWrap: { paddingHorizontal: 16, paddingTop: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#E2E8F0', elevation: 1 },
  searchInput: { flex: 1, fontSize: 14, color: '#1E293B', fontWeight: '500' },

  /* CATEGORIAS */
  section: { paddingHorizontal: 16, paddingTop: 18 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#1E293B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.7 },
  catCard: { backgroundColor: '#fff', borderRadius: 18, marginBottom: 10, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
  catLeft: { width: 64, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center' },
  catInfo: { flex: 1, paddingHorizontal: 14, paddingVertical: 12 },
  catNome: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginBottom: 2 },
  catDesc: { fontSize: 12, color: '#64748B', lineHeight: 16, marginBottom: 5 },
  catBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  catBadgeTxt: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  dotSep: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#CBD5E1', marginHorizontal: 2 },
  catArrow: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12, flexShrink: 0 },
  emptyState: { alignItems: 'center', paddingVertical: 36, gap: 10 },
  emptyTxt: { fontSize: 14, color: '#94A3B8', fontWeight: '600' },

  quizScroll: { padding: 16, paddingBottom: 48 },

  /* PERGUNTA */
  perguntaCard: { borderRadius: 22, padding: 20, marginBottom: 14, overflow: 'hidden' },
  perguntaTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  pergNumBox: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
  pergNumTxt: { color: '#fff', fontSize: 14, fontWeight: '900' },
  perguntaTxt: { color: '#fff', fontSize: 17, fontWeight: '900', lineHeight: 25, marginBottom: 12 },
  pergHint: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start' },
  pergHintTxt: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600' },

  /* OPÇÕES */
  opcoesWrap: { gap: 10, marginBottom: 10 },
  opcaoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 2, overflow: 'hidden', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  opcaoTxt: { flex: 1, fontSize: 14, color: '#334155', lineHeight: 21, fontWeight: '500' },

  /* FEEDBACK */
  feedbackBox: { borderRadius: 20, padding: 18, borderWidth: 1.5, marginTop: 4 },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  feedbackIconBox: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  feedbackLabel: { fontSize: 15, fontWeight: '900' },
  feedbackTxt: { fontSize: 14, lineHeight: 22, marginBottom: 12 },
  feedbackDicaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 10, padding: 10, marginBottom: 16 },
  feedbackDicaTxt: { flex: 1, fontSize: 12, lineHeight: 18, fontStyle: 'italic' },
  avancarOuter: { borderRadius: 14, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6 },
  avancarBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15 },
  avancarTxt: { color: '#fff', fontSize: 15, fontWeight: '900' },

  /* CARDS */
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 18, marginHorizontal: 16, marginTop: 14, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  cardIconBox: { width: 30, height: 30, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B' },

  /* SCORE */
  scoreWrap: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  scoreCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', flexShrink: 0 },
  scorePct: { fontSize: 26, fontWeight: '900' },
  scoreSub: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 2 },
  scoreInfo: { flex: 1 },
  scoreInfoTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 6, lineHeight: 20 },
  scoreInfoSub: { fontSize: 12, color: '#64748B', lineHeight: 18 },

  /* GABARITO */
  gabRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 14, marginBottom: 8 },
  gabNumBox: { width: 26, height: 26, borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  gabNum: { color: '#fff', fontSize: 12, fontWeight: '900' },
  gabPergunta: { fontSize: 13, fontWeight: '700', color: '#1E293B', lineHeight: 18, marginBottom: 3 },
  gabStatus: { fontSize: 12, fontWeight: '600', lineHeight: 16 },

  dicaFinalTxt: { fontSize: 14, color: '#475569', lineHeight: 22 },

  /* AÇÕES */
  actionsWrap: { paddingHorizontal: 16, paddingTop: 14, gap: 10 },
  ctaOuter: { borderRadius: 16, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 8 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 17 },
  ctaTxt: { color: '#fff', fontSize: 15, fontWeight: '900' },
  secBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, backgroundColor: '#F1F5F9' },
  secBtnTxt: { fontSize: 14, fontWeight: '700', color: '#475569' },
  terBtn: { alignItems: 'center', paddingVertical: 8 },
  terBtnTxt: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
});
