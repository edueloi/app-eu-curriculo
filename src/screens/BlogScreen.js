import React, { useContext, useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

/* ─────────────────────────────────────────────────────────────
   TODAS AS DICAS — 3 idiomas, 6 categorias, 3 dicas cada
   ───────────────────────────────────────────────────────────── */
export const TIPS_DATA = {
  'pt-BR': {
    heroTitle: 'Dicas de Carreira',
    heroSub: 'Conteúdo prático para você se destacar no mercado',
    categories: [
      {
        key: 'curriculo',
        icon: 'file-document-edit',
        gradient: ['#4F46E5', '#818CF8'],
        label: 'Currículo',
        desc: 'Como criar um currículo que chama atenção',
        tips: [
          {
            id: 'cv1',
            title: 'A Regra das 6 Segundos',
            tag: 'Currículo',
            readTime: '3 min',
            summary: 'Recrutadores levam apenas 6 segundos para decidir se continuam lendo seu currículo.',
            sections: [
              {
                heading: 'Por que 6 segundos?',
                body: 'Recrutadores recebem dezenas de currículos por vaga. A primeira leitura é um escaneamento visual rápido — eles buscam cargo atual, empresa, formação e habilidades-chave. Se o layout confunde ou as informações não aparecem rápido, o currículo vai para o descarte.',
              },
              {
                heading: 'O que garantir no topo do currículo',
                bullets: [
                  'Nome em destaque — fonte grande, primeira coisa que os olhos veem',
                  'Cargo/título profissional logo abaixo do nome',
                  'E-mail e telefone atualizados e visíveis',
                  'LinkedIn com URL curta (linkedin.com/in/seunome)',
                ],
              },
              {
                heading: 'Dicas de layout para passar no teste dos 6 segundos',
                bullets: [
                  'Use seções bem separadas com títulos em negrito',
                  'Espaço em branco é seu aliado — não preencha tudo',
                  'Fonte legível: Calibri, Arial ou Lato, tamanho 10-12',
                  'Evite tabelas e caixas de texto — sistemas ATS não leem',
                ],
              },
              {
                heading: 'Teste rápido',
                body: 'Imprima seu currículo, defina um timer de 6 segundos e peça para alguém dizer o que conseguiu ler. Se a pessoa não conseguiu identificar seu cargo e área, é hora de reformular.',
              },
            ],
          },
          {
            id: 'cv2',
            title: 'ATS: Como Passar pelo Robô Selecionador',
            tag: 'Currículo',
            readTime: '4 min',
            summary: 'Mais de 75% das grandes empresas usam sistemas ATS para filtrar currículos antes de um humano ler.',
            sections: [
              {
                heading: 'O que é ATS?',
                body: 'Applicant Tracking System (ATS) é um software que lê, classifica e filtra currículos automaticamente. Ele busca palavras-chave da descrição da vaga. Se o seu currículo não tiver essas palavras, ele é descartado antes de chegar a um recrutador.',
              },
              {
                heading: 'Como otimizar para ATS',
                bullets: [
                  'Copie palavras-chave da descrição da vaga e use no currículo',
                  'Use o título exato da vaga como seu título profissional',
                  'Evite tabelas, colunas, cabeçalhos e rodapés — ATS não lê',
                  'Salve em .docx ou .pdf sem formatação complexa',
                  'Escreva por extenso siglas: "JavaScript" não "JS"',
                ],
              },
              {
                heading: 'Erros que eliminam no ATS',
                bullets: [
                  'Texto dentro de imagens ou gráficos',
                  'Informações importantes no cabeçalho/rodapé',
                  'Fontes incomuns que o sistema não reconhece',
                  'Currículo em formato .jpg ou imagem',
                ],
              },
              {
                heading: 'Ferramenta gratuita',
                body: 'Use o Jobscan.co para comparar seu currículo com a descrição de uma vaga e ver o percentual de compatibilidade com o ATS. Busque acima de 70% de match.',
              },
            ],
          },
          {
            id: 'cv3',
            title: 'Quantifique Tudo: A Fórmula dos Resultados',
            tag: 'Currículo',
            readTime: '3 min',
            summary: 'Currículos com números têm 40% mais chances de gerar entrevista. Aprenda a transformar tarefas em conquistas.',
            sections: [
              {
                heading: 'A fórmula CAR',
                body: 'Use a fórmula CAR para descrever experiências: Contexto (onde/quando), Ação (o que você fez), Resultado (o que gerou com números). Exemplo: "Liderei migração do sistema legado (contexto) para cloud AWS (ação), reduzindo custos operacionais em 35% (resultado)".',
              },
              {
                heading: 'O que quantificar',
                bullets: [
                  'Percentual de crescimento: "aumentei vendas em 28%"',
                  'Volume: "gerenciei equipe de 12 pessoas"',
                  'Tempo: "reduzi prazo de entrega de 5 para 2 dias"',
                  'Dinheiro: "economizei R$ 80 mil em contratos"',
                  'Escala: "atendi +500 clientes por mês"',
                ],
              },
              {
                heading: 'E se não tiver números exatos?',
                body: 'Use aproximações honestas: "aproximadamente", "mais de", "cerca de". Estimativas razoáveis são aceitas. O importante é dar dimensão do impacto. "Reduzi significativamente os custos" não diz nada — "reduzi custos em cerca de 20%" diz tudo.',
              },
            ],
          },
        ],
      },
      {
        key: 'entrevista',
        icon: 'account-tie',
        gradient: ['#059669', '#34D399'],
        label: 'Entrevista',
        desc: 'Se prepare para arrasar na entrevista',
        tips: [
          {
            id: 'en1',
            title: 'Como Responder "Me Fale Sobre Você"',
            tag: 'Entrevista',
            readTime: '4 min',
            summary: 'Essa é a pergunta mais comum e a mais mal respondida. Aprenda a estrutura certa.',
            sections: [
              {
                heading: 'A estrutura Present–Past–Future',
                body: 'A melhor resposta segue a estrutura PPF: Presente (quem você é hoje e o que faz), Passado (de onde você veio e conquistas relevantes), Futuro (por que essa empresa e essa vaga). Duração ideal: 90 a 120 segundos.',
              },
              {
                heading: 'Exemplo de resposta',
                body: '"Hoje sou analista de marketing com foco em performance digital, especializado em campanhas de mídia paga. Nos últimos 4 anos trabalhei em agências, onde gerenciei orçamentos acima de R$ 500 mil e entreguei ROI médio de 3x. Agora busco um ambiente mais estratégico como o de vocês para desenvolver campanhas de marca além da performance."',
              },
              {
                heading: 'O que evitar',
                bullets: [
                  'Contar a vida pessoal do começo ao fim',
                  'Repetir o currículo palavra por palavra',
                  'Responder em mais de 3 minutos',
                  'Falar mal de emprego anterior',
                ],
              },
            ],
          },
          {
            id: 'en2',
            title: 'Perguntas Comportamentais com o Método STAR',
            tag: 'Entrevista',
            readTime: '4 min',
            summary: 'Empresas grandes usam entrevistas por competências. O método STAR é sua arma secreta.',
            sections: [
              {
                heading: 'O que é o método STAR?',
                body: 'STAR = Situação, Tarefa, Ação, Resultado. É a estrutura ideal para responder perguntas como "Me dê um exemplo de quando você resolveu um conflito" ou "Conte sobre um projeto desafiador".',
              },
              {
                heading: 'Exemplo de resposta STAR',
                bullets: [
                  'S — Situação: "Trabalhava em um projeto com prazo apertado e um colega travou uma entrega"',
                  'T — Tarefa: "Eu era responsável pela entrega final e precisava garantir o prazo"',
                  'A — Ação: "Conversei com o colega para entender o bloqueio e redistribuí tarefas"',
                  'R — Resultado: "Entregamos 1 dia antes do prazo e o cliente aprovou sem revisões"',
                ],
              },
              {
                heading: 'Perguntas frequentes para praticar',
                bullets: [
                  'Me conte sobre um erro que você cometeu e o que aprendeu',
                  'Como você lida com pressão e prazos curtos?',
                  'Dê um exemplo de quando você precisou persuadir alguém',
                  'Como você age quando discorda do seu gestor?',
                ],
              },
            ],
          },
          {
            id: 'en3',
            title: '10 Perguntas para Fazer ao Recrutador',
            tag: 'Entrevista',
            readTime: '3 min',
            summary: 'Fazer boas perguntas ao final mostra preparo e interesse. Veja as melhores.',
            sections: [
              {
                heading: 'Por que perguntar é importante?',
                body: 'A entrevista é uma via de mão dupla. Perguntar demonstra que você pesquisou a empresa, está genuinamente interessado e pensa estrategicamente. Candidatos que não perguntam nada parecem passivos.',
              },
              {
                heading: 'As 10 melhores perguntas',
                bullets: [
                  'Como é o dia a dia de quem ocupa essa posição?',
                  'Quais são os maiores desafios de quem entra nessa função?',
                  'Como a equipe mede sucesso nos primeiros 90 dias?',
                  'Como é a cultura de feedback na empresa?',
                  'Quais são as perspectivas de crescimento para essa posição?',
                  'Como a empresa apoia o desenvolvimento profissional?',
                  'Qual é o maior desafio que a equipe enfrenta hoje?',
                  'O que você gosta de trabalhar aqui? (para o gestor)',
                  'Quais são os próximos passos do processo seletivo?',
                  'Existe alguma dúvida sobre meu perfil que posso esclarecer?',
                ],
              },
            ],
          },
        ],
      },
      {
        key: 'linkedin',
        icon: 'linkedin',
        gradient: ['#0A66C2', '#004182'],
        label: 'LinkedIn',
        desc: 'Seja encontrado pelos recrutadores certos',
        tips: [
          {
            id: 'li1',
            title: 'Perfil do LinkedIn que Atrai Recrutadores',
            tag: 'LinkedIn',
            readTime: '5 min',
            summary: 'Um perfil completo tem 40x mais chances de receber oportunidades. Veja o checklist definitivo.',
            sections: [
              {
                heading: 'Foto e banner',
                bullets: [
                  'Foto profissional — fundo neutro, rosto visível, sem selfie de balada',
                  'Banner personalizado com sua área ou mensagem profissional',
                  'Foto aumenta visualizações do perfil em 21x',
                ],
              },
              {
                heading: 'Título profissional',
                body: 'Não coloque apenas o cargo. Use palavras-chave: "Desenvolvedor React Native | Mobile | Apps iOS & Android". Recrutadores buscam por essas palavras.',
              },
              {
                heading: 'Resumo (About)',
                body: 'Escreva em primeira pessoa, máximo 3 parágrafos. Inclua: quem você é, o que faz de melhor, o que busca. Termine com uma chamada para ação: "Entre em contato pelo LinkedIn ou pelo e-mail abaixo".',
              },
              {
                heading: 'Checklist de perfil completo',
                bullets: [
                  'Foto profissional + banner',
                  'Título otimizado com palavras-chave',
                  'Resumo em primeira pessoa',
                  'Experiências com resultados quantificados',
                  'Formação completa',
                  '5+ habilidades validadas por conexões',
                  '"Open to Work" ativado (visível para recrutadores)',
                ],
              },
            ],
          },
          {
            id: 'li2',
            title: 'Como Usar o LinkedIn para Networking',
            tag: 'LinkedIn',
            readTime: '4 min',
            summary: 'Mais de 80% das vagas são preenchidas por indicação. Networking estratégico é essencial.',
            sections: [
              {
                heading: 'Com quem se conectar',
                bullets: [
                  'Profissionais da sua área de interesse',
                  'Recrutadores das empresas que deseja trabalhar',
                  'Pessoas de empresas que você admira',
                  'Colegas de faculdade e ex-colegas de trabalho',
                ],
              },
              {
                heading: 'Mensagem de conexão que funciona',
                body: '"Olá [Nome], sou [sua área] e admiro muito o trabalho da [empresa]. Gostaria de me conectar para acompanhar suas publicações e eventualmente trocar experiências sobre [assunto em comum]. Abraços!"',
              },
              {
                heading: 'Como manter o networking ativo',
                bullets: [
                  'Comente em publicações de pessoas que admira — com conteúdo, não só "ótimo post"',
                  'Compartilhe artigos relevantes da sua área com opinião própria',
                  'Parabenize conexões por conquistas e promoções',
                  'Publique pelo menos 1x por semana sobre sua área',
                ],
              },
            ],
          },
          {
            id: 'li3',
            title: 'Abordagem Direta: Como Falar com Recrutadores',
            tag: 'LinkedIn',
            readTime: '3 min',
            summary: 'Abordar recrutadores no LinkedIn aumenta muito suas chances. Veja como fazer certo.',
            sections: [
              {
                heading: 'Quando abordar',
                body: 'Aborde quando a empresa tem vagas abertas na sua área, quando você tem uma conexão em comum ou quando admira muito o trabalho da empresa. Não aborde aleatoriamente pedindo "qualquer vaga".',
              },
              {
                heading: 'Mensagem que funciona',
                body: '"Olá [Nome], vi que a [empresa] está com vaga de [cargo] aberta. Tenho [X anos] de experiência em [área] e já entreguei [resultado relevante]. Estou bastante interessado na oportunidade — seria possível trocar 10 minutos sobre o processo? Fico à disposição!"',
              },
              {
                heading: 'O que evitar',
                bullets: [
                  'Mensagens genéricas copiadas e coladas para dezenas de recrutadores',
                  'Pedir favores imediatamente sem se apresentar',
                  'Enviar currículo sem autorização na primeira mensagem',
                  'Pressionar por resposta rápida',
                ],
              },
            ],
          },
        ],
      },
      {
        key: 'carreira',
        icon: 'trending-up',
        gradient: ['#DC2626', '#FB7185'],
        label: 'Carreira',
        desc: 'Crescimento profissional e estratégia',
        tips: [
          {
            id: 'ca1',
            title: 'Como Pedir Aumento de Salário',
            tag: 'Carreira',
            readTime: '5 min',
            summary: 'Profissionais que negociam ativamente ganham em média 7-10% mais. Veja como se preparar.',
            sections: [
              {
                heading: 'Quando pedir',
                bullets: [
                  'Após entregar um projeto importante com resultado mensurável',
                  'Na revisão anual de desempenho',
                  'Quando assumiu mais responsabilidades sem aumento proporcional',
                  'Quando tem uma oferta de outra empresa (use com cuidado)',
                ],
              },
              {
                heading: 'Como se preparar',
                body: 'Pesquise a faixa salarial da sua posição no mercado (Glassdoor, Vagas, LinkedIn Salary). Liste suas conquistas dos últimos 6-12 meses com números. Defina o valor que quer pedir e o mínimo aceitável.',
              },
              {
                heading: 'Script para a conversa',
                body: '"Gostaria de conversar sobre minha remuneração. Nos últimos [período] entrego [resultados]. Pesquisei o mercado e a faixa para minha posição e experiência é de [valor]. Gostaria de ajustar meu salário para [valor] — o que você acha?"',
              },
              {
                heading: 'Se a resposta for não',
                bullets: [
                  'Pergunte: "O que precisaria acontecer para que isso fosse possível?"',
                  'Defina um prazo concreto para a revisão',
                  'Se não houver perspectiva real, considere o mercado',
                ],
              },
            ],
          },
          {
            id: 'ca2',
            title: 'Mudar de Área: Como Fazer a Transição',
            tag: 'Carreira',
            readTime: '5 min',
            summary: 'Mudar de área é possível em qualquer idade. Com a estratégia certa, fica muito mais fácil.',
            sections: [
              {
                heading: 'Identifique habilidades transferíveis',
                body: 'Antes de tudo, mapeie o que você já sabe que tem valor na nova área. Gestão de projetos, comunicação, análise de dados, atendimento ao cliente — essas habilidades valem em qualquer segmento.',
              },
              {
                heading: 'Como preencher as lacunas',
                bullets: [
                  'Faça cursos rápidos e certificações da nova área',
                  'Construa um projeto pessoal ou voluntário para ganhar experiência',
                  'Conecte-se com profissionais da área para entender o mercado',
                  'Considere um estágio ou CLT júnior para entrar pela porta da frente',
                ],
              },
              {
                heading: 'Como posicionar no currículo',
                body: 'Não esconda a transição — seja transparente. No resumo profissional, explique a mudança de forma positiva: "Profissional de [área anterior] em transição para [nova área], trazendo [habilidades transferíveis]".',
              },
            ],
          },
          {
            id: 'ca3',
            title: 'Trabalho Remoto: Como se Destacar',
            tag: 'Carreira',
            readTime: '4 min',
            summary: 'No remoto, visibilidade é tudo. Quem não aparece, não cresce.',
            sections: [
              {
                heading: 'Comunicação proativa',
                bullets: [
                  'Atualize seu gestor regularmente sem esperar ser perguntado',
                  'Resuma entregas em mensagens curtas e objetivas',
                  'Esteja disponível nos horários combinados — não suma',
                  'Prefira chamadas de vídeo a textos para assuntos importantes',
                ],
              },
              {
                heading: 'Visibilidade estratégica',
                body: 'Compartilhe conquistas em reuniões de equipe. Faça perguntas inteligentes em todas-mãos. Ofereça ajuda em projetos além da sua função. No remoto, quem não aparece, não cresce.',
              },
              {
                heading: 'Ambiente e produtividade',
                bullets: [
                  'Tenha um espaço fixo de trabalho, mesmo que pequeno',
                  'Câmera ligada nas reuniões — cria conexão e presença',
                  'Defina horários de trabalho e respeite-os para evitar burnout',
                  'Use ferramentas de gestão de tarefas: Notion, Trello ou Asana',
                ],
              },
            ],
          },
        ],
      },
      {
        key: 'primeiroemprego',
        icon: 'school',
        gradient: ['#D97706', '#FCD34D'],
        label: 'Primeiro Emprego',
        desc: 'Dicas para quem está entrando no mercado',
        tips: [
          {
            id: 'pe1',
            title: 'Currículo Sem Experiência: O Que Colocar',
            tag: 'Primeiro Emprego',
            readTime: '4 min',
            summary: 'Todo profissional começou do zero. Aprenda a montar um currículo competitivo sem experiência formal.',
            sections: [
              {
                heading: 'O que valorizar no currículo',
                bullets: [
                  'Trabalhos voluntários e projetos comunitários',
                  'Projetos acadêmicos, TCC, iniciações científicas',
                  'Cursos online, certificações e bootcamps',
                  'Atividades extracurriculares: atlética, grêmio, empresa júnior',
                  'Freelas e trabalhos informais com resultados descritos',
                ],
              },
              {
                heading: 'Resumo profissional para iniciantes',
                body: '"Estudante de [curso] com interesse em [área]. Desenvolvi habilidades em [habilidade 1] e [habilidade 2] por meio de [projeto/curso]. Busco minha primeira oportunidade para aplicar meu conhecimento e crescer profissionalmente."',
              },
              {
                heading: 'Habilidades que compensam a falta de experiência',
                bullets: [
                  'Inglês fluente ou avançado — um diferencial enorme',
                  'Conhecimento em ferramentas digitais: Excel, Figma, Python',
                  'Certificações reconhecidas: Google, AWS, Meta, HubSpot',
                  'Capacidade de aprender rápido — mostre com exemplos',
                ],
              },
            ],
          },
          {
            id: 'pe2',
            title: 'Estágio vs. Jovem Aprendiz vs. CLT: Qual Escolher?',
            tag: 'Primeiro Emprego',
            readTime: '4 min',
            summary: 'Cada modalidade tem regras, direitos e vantagens diferentes. Conheça antes de assinar.',
            sections: [
              {
                heading: 'Estágio',
                bullets: [
                  'Para estudantes de ensino médio, técnico ou superior',
                  'Carga: até 6h/dia para superior, 4h para ensino médio',
                  'Direitos: bolsa, vale-transporte, seguro de vida, férias de 30 dias a cada 12 meses',
                  'Objetivo: aprendizado, não substitui funcionário',
                ],
              },
              {
                heading: 'Jovem Aprendiz',
                bullets: [
                  'Para jovens de 14 a 24 anos (pessoa com deficiência sem limite de idade)',
                  'Direitos CLT completos: FGTS, férias, 13º, vale-transporte',
                  'Jornada máxima: 6h/dia',
                  'Inclui curso profissionalizante obrigatório',
                ],
              },
              {
                heading: 'CLT Júnior (efetivo)',
                bullets: [
                  'Todos os direitos trabalhistas completos',
                  'Salário fixo + benefícios',
                  'Maior exigência de habilidades e responsabilidade',
                  'Melhor para quem já tem alguma base ou certificação',
                ],
              },
            ],
          },
          {
            id: 'pe3',
            title: 'Os Primeiros 90 Dias no Trabalho',
            tag: 'Primeiro Emprego',
            readTime: '4 min',
            summary: 'A primeira impressão determina sua trajetória. Veja como arrasar nos primeiros 3 meses.',
            sections: [
              {
                heading: 'Primeiros 30 dias: observe e aprenda',
                bullets: [
                  'Observe como as coisas funcionam antes de propor mudanças',
                  'Aprenda os nomes e funções de todos da equipe',
                  'Entenda as prioridades do gestor e da empresa',
                  'Faça perguntas — é esperado que você não saiba tudo',
                ],
              },
              {
                heading: 'Dias 31 a 60: comece a entregar',
                bullets: [
                  'Entregue tarefas antes do prazo sempre que possível',
                  'Proponha uma melhoria pequena baseada no que observou',
                  'Peça feedback do seu gestor proativamente',
                ],
              },
              {
                heading: 'Dias 61 a 90: mostre valor',
                bullets: [
                  'Finalize um projeto visível para a equipe',
                  'Construa relacionamentos além da sua equipe direta',
                  'Peça uma reunião 1:1 com seu gestor para alinhar expectativas',
                  'Documente suas conquistas dos primeiros 90 dias',
                ],
              },
            ],
          },
        ],
      },
      {
        key: 'softskills',
        icon: 'heart-circle',
        gradient: ['#7C3AED', '#C4B5FD'],
        label: 'Soft Skills',
        desc: 'Habilidades que fazem a diferença',
        tips: [
          {
            id: 'ss1',
            title: 'Inteligência Emocional no Trabalho',
            tag: 'Soft Skills',
            readTime: '4 min',
            summary: 'IE é o fator que mais diferencia líderes de sucesso. Aprenda a desenvolver a sua.',
            sections: [
              {
                heading: 'Os 5 pilares da IE',
                bullets: [
                  'Autoconhecimento — reconhecer suas emoções e gatilhos',
                  'Autorregulação — controlar reações impulsivas',
                  'Motivação — manter foco mesmo diante de obstáculos',
                  'Empatia — entender o ponto de vista do outro',
                  'Habilidades sociais — construir relacionamentos saudáveis',
                ],
              },
              {
                heading: 'Como desenvolver IE no dia a dia',
                bullets: [
                  'Pause antes de responder em situações de conflito',
                  'Pratique ouvir sem interromper — escuta ativa',
                  'Escreva um diário de emoções: o que senti e por quê',
                  'Peça feedback honesto de pessoas próximas',
                ],
              },
              {
                heading: 'IE na entrevista',
                body: 'Recrutadores avaliam IE por meio de perguntas como "Como você lida com críticas?" ou "Me fale de um conflito que você resolveu". Prepare respostas com exemplos reais usando o método STAR.',
              },
            ],
          },
          {
            id: 'ss2',
            title: 'Comunicação Assertiva: Fale Sem Agredir',
            tag: 'Soft Skills',
            readTime: '3 min',
            summary: 'Comunicação assertiva é diferente de ser agressivo ou passivo. É o equilíbrio que todos querem no time.',
            sections: [
              {
                heading: 'O que é assertividade?',
                body: 'Assertividade é expressar suas opiniões, necessidades e limites de forma clara e respeitosa, sem agressividade (passivo-agressivo) nem submissão (passivo). É dizer "não" quando necessário, e "sim" com convicção.',
              },
              {
                heading: 'Técnica do "Eu" em vez de "Você"',
                bullets: [
                  'Em vez de: "Você sempre interrompe as minhas apresentações"',
                  'Diga: "Quando sou interrompido durante uma apresentação, fico desconcentrado e prefiro terminar antes de discutir"',
                  'Foco no seu sentimento, não na culpa do outro',
                ],
              },
              {
                heading: 'Assertividade no trabalho',
                bullets: [
                  'Discordar com respeito: "Entendo seu ponto, mas vejo de outra forma porque..."',
                  'Pedir prazo realista: "Conseguiria entregar isso na sexta — tudo bem?"',
                  'Dar feedback: descreva o comportamento, o impacto e proponha mudança',
                ],
              },
            ],
          },
          {
            id: 'ss3',
            title: 'Gestão do Tempo: Métodos que Funcionam',
            tag: 'Soft Skills',
            readTime: '4 min',
            summary: 'Produtividade não é fazer mais coisas — é fazer as coisas certas no momento certo.',
            sections: [
              {
                heading: 'Método Pomodoro',
                body: '25 minutos de foco total + 5 minutos de pausa = 1 pomodoro. A cada 4 pomodoros, descanse 20-30 minutos. Ideal para tarefas que exigem concentração profunda. Use um timer simples no celular.',
              },
              {
                heading: 'Matriz de Eisenhower',
                bullets: [
                  'Urgente + Importante: faça agora',
                  'Importante + Não urgente: agende',
                  'Urgente + Não importante: delegue',
                  'Não urgente + Não importante: elimine',
                ],
              },
              {
                heading: 'Regra dos 2 minutos',
                body: 'Se uma tarefa leva menos de 2 minutos, faça agora. Responder um e-mail, confirmar reunião, registrar um dado — não adie. Acumular microtarefas gera muito mais carga mental do que fazê-las na hora.',
              },
            ],
          },
        ],
      },
    ],
  },

  en: {
    heroTitle: 'Career Tips',
    heroSub: 'Practical content to help you stand out in the market',
    categories: [
      {
        key: 'curriculo', icon: 'file-document-edit', gradient: ['#4F46E5','#818CF8'], label: 'Resume', desc: 'How to create a resume that gets noticed',
        tips: [
          {
            id: 'cv1', title: 'The 6-Second Rule', tag: 'Resume', readTime: '3 min',
            summary: 'Recruiters take only 6 seconds to decide whether to keep reading your resume.',
            sections: [
              { heading: 'Why 6 seconds?', body: 'Recruiters receive dozens of resumes per job. The first read is a quick visual scan — they look for current role, company, education and key skills. If the layout is confusing or information is hard to find, the resume gets discarded.' },
              { heading: 'What to ensure at the top', bullets: ['Name in bold, large font — first thing eyes see', 'Job title right below your name', 'Updated email and phone number', 'LinkedIn with short URL'] },
              { heading: 'Layout tips to pass the 6-second test', bullets: ['Use well-separated sections with bold headings', 'White space is your ally — don\'t fill everything', 'Readable font: Calibri, Arial or Lato, size 10-12', 'Avoid tables and text boxes — ATS systems can\'t read them'] },
            ],
          },
          {
            id: 'cv2', title: 'ATS: How to Beat the Robot Screener', tag: 'Resume', readTime: '4 min',
            summary: 'Over 75% of large companies use ATS software to filter resumes before a human reads them.',
            sections: [
              { heading: 'What is ATS?', body: 'Applicant Tracking System is software that automatically reads, sorts, and filters resumes. It looks for keywords from the job description. If your resume lacks those keywords, it\'s discarded before reaching a recruiter.' },
              { heading: 'How to optimize for ATS', bullets: ['Copy keywords from the job description and use them', 'Use the exact job title as your professional title', 'Avoid tables, columns, headers and footers', 'Save as .docx or clean .pdf', 'Write acronyms in full: "JavaScript" not "JS"'] },
              { heading: 'Mistakes that get eliminated by ATS', bullets: ['Text inside images or charts', 'Important info in headers/footers', 'Unusual fonts the system doesn\'t recognize', 'Resume in .jpg or image format'] },
            ],
          },
          {
            id: 'cv3', title: 'Quantify Everything: The Results Formula', tag: 'Resume', readTime: '3 min',
            summary: 'Resumes with numbers are 40% more likely to generate an interview.',
            sections: [
              { heading: 'The CAR formula', body: 'Use the CAR formula: Context (where/when), Action (what you did), Result (what it generated, with numbers). Example: "Led migration of legacy system to AWS cloud, reducing operational costs by 35%".' },
              { heading: 'What to quantify', bullets: ['Growth percentage: "increased sales by 28%"', 'Volume: "managed a team of 12 people"', 'Time: "reduced delivery time from 5 to 2 days"', 'Money: "saved $20k in contracts"', 'Scale: "served 500+ customers per month"'] },
              { heading: 'What if you don\'t have exact numbers?', body: 'Use honest approximations: "approximately", "more than", "around". Reasonable estimates are accepted. "Significantly reduced costs" says nothing — "reduced costs by about 20%" says everything.' },
            ],
          },
        ],
      },
      {
        key: 'entrevista', icon: 'account-tie', gradient: ['#059669','#34D399'], label: 'Interview', desc: 'Get ready to ace the interview',
        tips: [
          {
            id: 'en1', title: 'How to Answer "Tell Me About Yourself"', tag: 'Interview', readTime: '4 min',
            summary: 'This is the most common and most poorly answered question. Learn the right structure.',
            sections: [
              { heading: 'The Present–Past–Future structure', body: 'The best answer follows PPF: Present (who you are and what you do), Past (where you came from and relevant achievements), Future (why this company and this role). Ideal duration: 90 to 120 seconds.' },
              { heading: 'Example answer', body: '"Today I\'m a marketing analyst focused on digital performance, specialized in paid media campaigns. Over the past 4 years I\'ve worked in agencies managing budgets over $100k and delivering an average ROI of 3x. I\'m now looking for a more strategic environment like yours to develop brand campaigns beyond performance."' },
              { heading: 'What to avoid', bullets: ['Telling your whole life story from the beginning', 'Repeating the resume word for word', 'Answering in more than 3 minutes', 'Speaking negatively about a previous employer'] },
            ],
          },
          {
            id: 'en2', title: 'Behavioral Questions with the STAR Method', tag: 'Interview', readTime: '4 min',
            summary: 'Large companies use competency-based interviews. The STAR method is your secret weapon.',
            sections: [
              { heading: 'What is the STAR method?', body: 'STAR = Situation, Task, Action, Result. It\'s the ideal structure for questions like "Give me an example of when you resolved a conflict" or "Tell me about a challenging project".' },
              { heading: 'STAR answer example', bullets: ['S — Situation: "I was on a project with a tight deadline and a teammate was blocking a delivery"', 'T — Task: "I was responsible for the final delivery and needed to ensure the deadline"', 'A — Action: "I talked with my colleague to understand the issue and redistributed tasks"', 'R — Result: "We delivered 1 day ahead of schedule and the client approved without revisions"'] },
              { heading: 'Common questions to practice', bullets: ['Tell me about a mistake you made and what you learned', 'How do you handle pressure and tight deadlines?', 'Give an example of when you had to persuade someone', 'How do you act when you disagree with your manager?'] },
            ],
          },
          {
            id: 'en3', title: '10 Questions to Ask the Recruiter', tag: 'Interview', readTime: '3 min',
            summary: 'Asking good questions at the end shows preparation and genuine interest.',
            sections: [
              { heading: 'Why asking is important', body: 'An interview is a two-way street. Asking shows you researched the company, are genuinely interested, and think strategically. Candidates who ask nothing come across as passive.' },
              { heading: 'The 10 best questions', bullets: ['What does a typical day look like in this role?', 'What are the biggest challenges for someone coming into this position?', 'How does the team measure success in the first 90 days?', 'What is the feedback culture like here?', 'What are the growth prospects for this position?', 'How does the company support professional development?', 'What is the biggest challenge the team faces today?', 'What do you enjoy most about working here?', 'What are the next steps in the hiring process?', 'Is there anything about my background you\'d like me to clarify?'] },
            ],
          },
        ],
      },
      {
        key: 'linkedin', icon: 'linkedin', gradient: ['#0A66C2','#004182'], label: 'LinkedIn', desc: 'Get found by the right recruiters',
        tips: [
          {
            id: 'li1', title: 'A LinkedIn Profile That Attracts Recruiters', tag: 'LinkedIn', readTime: '5 min',
            summary: 'A complete profile is 40x more likely to receive opportunities.',
            sections: [
              { heading: 'Photo and banner', bullets: ['Professional photo — neutral background, visible face, no party selfie', 'Custom banner with your field or professional message', 'Photo increases profile views by 21x'] },
              { heading: 'Professional headline', body: 'Don\'t just put your job title. Use keywords: "React Native Developer | Mobile | iOS & Android Apps". Recruiters search for these words.' },
              { heading: 'Summary (About)', body: 'Write in first person, max 3 paragraphs. Include: who you are, what you do best, what you\'re looking for. End with a CTA: "Feel free to reach out via LinkedIn or the email below".' },
              { heading: 'Complete profile checklist', bullets: ['Professional photo + banner', 'Keyword-optimized headline', 'First-person summary', 'Experiences with quantified results', 'Complete education', '5+ skills endorsed by connections', '"Open to Work" enabled'] },
            ],
          },
          {
            id: 'li2', title: 'How to Use LinkedIn for Networking', tag: 'LinkedIn', readTime: '4 min',
            summary: 'Over 80% of jobs are filled through referrals. Strategic networking is essential.',
            sections: [
              { heading: 'Who to connect with', bullets: ['Professionals in your field of interest', 'Recruiters from companies you want to work for', 'People from companies you admire', 'College and former work colleagues'] },
              { heading: 'Connection message that works', body: '"Hi [Name], I\'m a [your field] professional and I really admire [company]\'s work. I\'d love to connect to follow your posts and possibly exchange ideas about [common topic]. Thanks!"' },
              { heading: 'How to keep networking active', bullets: ['Comment on posts from people you admire — with substance, not just "great post"', 'Share relevant articles with your own opinion', 'Congratulate connections on achievements and promotions', 'Post at least once a week about your field'] },
            ],
          },
          {
            id: 'li3', title: 'Direct Outreach: How to Message Recruiters', tag: 'LinkedIn', readTime: '3 min',
            summary: 'Reaching out to recruiters on LinkedIn significantly increases your chances.',
            sections: [
              { heading: 'When to reach out', body: 'Reach out when the company has open positions in your area, when you have a mutual connection, or when you greatly admire the company\'s work. Don\'t reach out randomly asking for "any job".' },
              { heading: 'Message that works', body: '"Hi [Name], I saw that [company] has an opening for [role]. I have [X years] of experience in [field] and have delivered [relevant result]. I\'m very interested in the opportunity — would it be possible to chat for 10 minutes? I\'m available at your convenience!"' },
              { heading: 'What to avoid', bullets: ['Generic copy-pasted messages to dozens of recruiters', 'Asking for favors immediately without introducing yourself', 'Sending your resume without permission in the first message', 'Pressuring for a quick response'] },
            ],
          },
        ],
      },
      {
        key: 'carreira', icon: 'trending-up', gradient: ['#DC2626','#FB7185'], label: 'Career', desc: 'Career growth and strategy',
        tips: [
          {
            id: 'ca1', title: 'How to Ask for a Raise', tag: 'Career', readTime: '5 min',
            summary: 'Professionals who negotiate actively earn on average 7-10% more.',
            sections: [
              { heading: 'When to ask', bullets: ['After delivering an important project with measurable results', 'At the annual performance review', 'When you have taken on more responsibilities without proportional pay increase', 'When you have an offer from another company (use carefully)'] },
              { heading: 'How to prepare', body: 'Research the salary range for your position (Glassdoor, LinkedIn Salary). List your achievements from the last 6-12 months with numbers. Define the amount you want and your minimum acceptable.' },
              { heading: 'Script for the conversation', body: '"I\'d like to discuss my compensation. Over the past [period] I\'ve delivered [results]. I\'ve researched the market and the range for my role and experience is [amount]. I\'d like to adjust my salary to [amount] — what do you think?"' },
            ],
          },
          {
            id: 'ca2', title: 'Changing Fields: How to Make the Transition', tag: 'Career', readTime: '5 min',
            summary: 'Changing fields is possible at any age. With the right strategy, it gets much easier.',
            sections: [
              { heading: 'Identify transferable skills', body: 'First, map what you already know that has value in the new field. Project management, communication, data analysis, customer service — these skills are valuable in any industry.' },
              { heading: 'How to fill the gaps', bullets: ['Take short courses and certifications in the new field', 'Build a personal or volunteer project to gain experience', 'Connect with professionals in the field to understand the market', 'Consider a junior position or internship to enter from the front door'] },
              { heading: 'How to position it on your resume', body: 'Don\'t hide the transition — be transparent. In the professional summary, explain the change positively: "Professional from [previous field] transitioning to [new field], bringing [transferable skills]".' },
            ],
          },
          {
            id: 'ca3', title: 'Remote Work: How to Stand Out', tag: 'Career', readTime: '4 min',
            summary: 'In remote work, visibility is everything. If you don\'t show up, you don\'t grow.',
            sections: [
              { heading: 'Proactive communication', bullets: ['Update your manager regularly without waiting to be asked', 'Summarize deliveries in short, objective messages', 'Be available during agreed hours — don\'t disappear', 'Prefer video calls over texts for important matters'] },
              { heading: 'Strategic visibility', body: 'Share achievements in team meetings. Ask smart questions in all-hands. Offer help on projects beyond your role. In remote work, those who don\'t show up, don\'t grow.' },
              { heading: 'Environment and productivity', bullets: ['Have a fixed workspace, even if small', 'Camera on in meetings — builds connection and presence', 'Set work hours and respect them to avoid burnout', 'Use task management tools: Notion, Trello or Asana'] },
            ],
          },
        ],
      },
      {
        key: 'primeiroemprego', icon: 'school', gradient: ['#D97706','#FCD34D'], label: 'First Job', desc: 'Tips for those entering the market',
        tips: [
          {
            id: 'pe1', title: 'Resume With No Experience: What to Include', tag: 'First Job', readTime: '4 min',
            summary: 'Every professional started from zero. Learn to build a competitive resume without formal experience.',
            sections: [
              { heading: 'What to highlight', bullets: ['Volunteer work and community projects', 'Academic projects, thesis, scientific initiation', 'Online courses, certifications and bootcamps', 'Extracurricular activities: student organizations, junior enterprise', 'Freelance and informal work with results described'] },
              { heading: 'Professional summary for beginners', body: '"[Field] student with interest in [area]. I developed skills in [skill 1] and [skill 2] through [project/course]. I\'m looking for my first opportunity to apply my knowledge and grow professionally."' },
              { heading: 'Skills that compensate for lack of experience', bullets: ['Fluent English — a huge differentiator', 'Digital tool knowledge: Excel, Figma, Python', 'Recognized certifications: Google, AWS, Meta, HubSpot', 'Ability to learn quickly — show it with examples'] },
            ],
          },
          {
            id: 'pe2', title: 'The First 90 Days on the Job', tag: 'First Job', readTime: '4 min',
            summary: 'First impressions determine your trajectory. Learn how to crush the first 3 months.',
            sections: [
              { heading: 'First 30 days: observe and learn', bullets: ['Observe how things work before proposing changes', 'Learn everyone\'s names and roles on the team', 'Understand your manager\'s and the company\'s priorities', 'Ask questions — it\'s expected that you don\'t know everything'] },
              { heading: 'Days 31 to 60: start delivering', bullets: ['Deliver tasks ahead of schedule whenever possible', 'Propose a small improvement based on what you observed', 'Proactively ask your manager for feedback'] },
              { heading: 'Days 61 to 90: show your value', bullets: ['Finish a project visible to the team', 'Build relationships beyond your direct team', 'Request a 1:1 with your manager to align expectations', 'Document your achievements from the first 90 days'] },
            ],
          },
          {
            id: 'pe3', title: 'Internship vs. Full-Time: What to Choose', tag: 'First Job', readTime: '4 min',
            summary: 'Each modality has different rules, rights and advantages. Know before signing.',
            sections: [
              { heading: 'Internship', bullets: ['For students in high school, technical or higher education', 'Hours: up to 6h/day for college, 4h for high school', 'Benefits: stipend, transport voucher, life insurance, 30 days vacation per year', 'Purpose: learning, not replacing employees'] },
              { heading: 'Full-time (CLT/entry-level)', bullets: ['All labor rights included', 'Fixed salary + benefits', 'Higher skill and responsibility requirements', 'Best for those with some background or certification'] },
            ],
          },
        ],
      },
      {
        key: 'softskills', icon: 'heart-circle', gradient: ['#7C3AED','#C4B5FD'], label: 'Soft Skills', desc: 'Skills that make the difference',
        tips: [
          {
            id: 'ss1', title: 'Emotional Intelligence at Work', tag: 'Soft Skills', readTime: '4 min',
            summary: 'EI is the factor that most differentiates successful leaders.',
            sections: [
              { heading: 'The 5 pillars of EI', bullets: ['Self-awareness — recognizing your emotions and triggers', 'Self-regulation — controlling impulsive reactions', 'Motivation — staying focused despite obstacles', 'Empathy — understanding others\' perspectives', 'Social skills — building healthy relationships'] },
              { heading: 'How to develop EI daily', bullets: ['Pause before responding in conflict situations', 'Practice listening without interrupting — active listening', 'Keep an emotion journal: what I felt and why', 'Ask for honest feedback from people close to you'] },
            ],
          },
          {
            id: 'ss2', title: 'Assertive Communication: Speak Without Aggression', tag: 'Soft Skills', readTime: '3 min',
            summary: 'Assertive communication is different from being aggressive or passive. It\'s the balance everyone wants on the team.',
            sections: [
              { heading: 'What is assertiveness?', body: 'Assertiveness is expressing your opinions, needs and limits clearly and respectfully, without aggression or submission. It\'s saying "no" when necessary, and "yes" with conviction.' },
              { heading: '"I" statements instead of "You"', bullets: ['Instead of: "You always interrupt my presentations"', 'Say: "When I\'m interrupted during a presentation, I lose focus and I\'d prefer to finish before discussing"', 'Focus on your feeling, not the other person\'s fault'] },
            ],
          },
          {
            id: 'ss3', title: 'Time Management: Methods That Work', tag: 'Soft Skills', readTime: '4 min',
            summary: 'Productivity isn\'t doing more things — it\'s doing the right things at the right time.',
            sections: [
              { heading: 'Pomodoro Technique', body: '25 minutes of full focus + 5 minutes break = 1 pomodoro. After 4 pomodoros, take a 20-30 minute break. Ideal for tasks requiring deep concentration.' },
              { heading: 'Eisenhower Matrix', bullets: ['Urgent + Important: do now', 'Important + Not urgent: schedule', 'Urgent + Not important: delegate', 'Not urgent + Not important: eliminate'] },
              { heading: '2-minute rule', body: 'If a task takes less than 2 minutes, do it now. Accumulating micro-tasks creates far more mental load than doing them immediately.' },
            ],
          },
        ],
      },
    ],
  },
};
// espanhol = cópia estrutural do PT com textos adaptados (usa pt-BR como fallback)
TIPS_DATA['es'] = TIPS_DATA['pt-BR'];

/* ─────────────────────────────────────────────────────────────
   TELA PRINCIPAL
   ───────────────────────────────────────────────────────────── */
const CAT_ALL_LABELS = { 'pt-BR': 'Todos', en: 'All', es: 'Todos' };

export default function BlogScreen({ navigation }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { language } = useContext(UserPreferencesContext);
  const lang = TIPS_DATA[language] ? language : 'pt-BR';
  const data = TIPS_DATA[lang];

  const [activeCat, setActiveCat] = useState('all');

  const allCats = [
    { key: 'all', label: CAT_ALL_LABELS[lang], icon: 'view-grid', gradient: [theme.colors.primary, theme.colors.secondary] },
    ...data.categories.map(c => ({ key: c.key, label: c.label, icon: c.icon, gradient: c.gradient })),
  ];

  const visibleCats = activeCat === 'all' ? data.categories : data.categories.filter(c => c.key === activeCat);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>

        {/* ── header fixo branco ── */}
        <View style={[s.fixedHeader, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.outlineVariant }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.navBtn}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
            {lang === 'en' ? 'Career Tips' : lang === 'es' ? 'Consejos de Carrera' : 'Dicas de Carreira'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>

          {/* ══ HERO ══ */}
          <Animatable.View animation="fadeInDown" duration={500}>
            <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} start={{ x:0,y:0 }} end={{ x:1,y:1 }} style={s.hero}>
              <View style={s.hb1} /><View style={s.hb2} />
              <MaterialCommunityIcons name="lightbulb-on" size={38} color="rgba(255,255,255,0.25)" style={{ marginBottom: 8 }} />
              <Text style={s.heroTitle}>{data.heroTitle}</Text>
              <Text style={s.heroSub}>{data.heroSub}</Text>
              <View style={s.heroBadge}>
                <MaterialCommunityIcons name="bookmark-multiple" size={13} color="#fff" />
                <Text style={s.heroBadgeTxt}>
                  {`${data.categories.reduce((a, c) => a + c.tips.length, 0)} dicas`}
                </Text>
              </View>
            </LinearGradient>
          </Animatable.View>

        {/* ══ FILTRO CATEGORIAS ══ */}
        <Animatable.View animation="fadeInUp" duration={400} delay={100}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 14, gap: 10 }}>
            {allCats.map(cat => {
              const active = activeCat === cat.key;
              return (
                <TouchableOpacity key={cat.key} onPress={() => setActiveCat(cat.key)} activeOpacity={0.8}>
                  {active ? (
                    <LinearGradient colors={cat.gradient} start={{ x:0,y:0 }} end={{ x:1,y:0 }} style={s.catBtnActive}>
                      <MaterialCommunityIcons name={cat.icon} size={14} color="#fff" />
                      <Text style={[s.catLabel, { color: '#fff' }]}>{cat.label}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={[s.catBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
                      <MaterialCommunityIcons name={cat.icon} size={14} color={theme.colors.onSurfaceVariant} />
                      <Text style={[s.catLabel, { color: theme.colors.onSurfaceVariant }]}>{cat.label}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animatable.View>

        {/* ══ SEÇÕES POR CATEGORIA ══ */}
        <View style={{ paddingHorizontal: 16, gap: 28 }}>
          {visibleCats.map((cat, ci) => (
            <Animatable.View key={cat.key} animation="fadeInUp" duration={450} delay={ci * 60}>
              {/* label da categoria */}
              <View style={s.catHeader}>
                <LinearGradient colors={cat.gradient} style={s.catHeaderIcon}>
                  <MaterialCommunityIcons name={cat.icon} size={16} color="#fff" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={[s.catHeaderLabel, { color: theme.colors.onSurface }]}>{cat.label}</Text>
                  <Text style={[s.catHeaderDesc, { color: theme.colors.onSurfaceVariant }]}>{cat.desc}</Text>
                </View>
              </View>

              {/* cards de dicas */}
              <View style={{ gap: 12 }}>
                {cat.tips.map((tip, ti) => (
                  <TouchableOpacity
                    key={tip.id}
                    onPress={() => navigation.navigate('ArtigoScreen', { tipId: tip.id, catKey: cat.key, lang })}
                    activeOpacity={0.88}
                  >
                    <Animatable.View animation="fadeInUp" duration={400} delay={ti * 60} style={[s.tipCard, { backgroundColor: theme.colors.surface, borderColor: cat.gradient[0] + '28' }]}>
                      <LinearGradient colors={cat.gradient} start={{ x:0,y:0 }} end={{ x:0,y:1 }} style={s.tipStripe} />
                      <View style={s.tipBody}>
                        <View style={s.tipTop}>
                          <View style={[s.tipTag, { backgroundColor: cat.gradient[0] + '18' }]}>
                            <Text style={[s.tipTagTxt, { color: cat.gradient[0] }]}>{tip.tag}</Text>
                          </View>
                          <View style={s.tipMeta}>
                            <MaterialCommunityIcons name="clock-outline" size={12} color={theme.colors.onSurfaceVariant} />
                            <Text style={[s.tipMetaTxt, { color: theme.colors.onSurfaceVariant }]}>{tip.readTime}</Text>
                          </View>
                        </View>
                        <Text style={[s.tipTitle, { color: theme.colors.onSurface }]}>{tip.title}</Text>
                        <Text style={[s.tipSummary, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>{tip.summary}</Text>
                        <View style={[s.tipFooter, { borderTopColor: theme.colors.outlineVariant }]}>
                          <Text style={[s.tipRead, { color: cat.gradient[0] }]}>
                            {lang === 'en' ? 'Read tip' : lang === 'es' ? 'Leer consejo' : 'Ler dica'}
                          </Text>
                          <MaterialCommunityIcons name="arrow-right" size={16} color={cat.gradient[0]} />
                        </View>
                      </View>
                    </Animatable.View>
                  </TouchableOpacity>
                ))}
              </View>
            </Animatable.View>
          ))}
        </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  fixedHeader:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, gap: 12 },
  navBtn:       { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  headerTitle:  { flex: 1, fontSize: 17, fontWeight: '800' },
  hero:        { paddingTop: 20, paddingBottom: 26, paddingHorizontal: 22, overflow: 'hidden' },
  hb1:         { position:'absolute', width:200, height:200, borderRadius:100, backgroundColor:'rgba(255,255,255,0.07)', top:-70, right:-50 },
  hb2:         { position:'absolute', width:80,  height:80,  borderRadius:40,  backgroundColor:'rgba(255,255,255,0.07)', bottom:-20, left:10 },
  backBtn:     { width:38, height:38, borderRadius:11, backgroundColor:'rgba(255,255,255,0.2)', justifyContent:'center', alignItems:'center' },
  navBar:      { position:'absolute', top:0, left:0, right:0, zIndex:100, flexDirection:'row', justifyContent:'space-between', paddingHorizontal:16, paddingBottom:10 },
  heroTitle:   { color:'#fff', fontSize:24, fontWeight:'900', letterSpacing:0.2 },
  heroSub:     { color:'rgba(255,255,255,0.85)', fontSize:14, marginTop:6, lineHeight:20 },
  heroBadge:   { flexDirection:'row', alignItems:'center', gap:6, marginTop:14, backgroundColor:'rgba(255,255,255,0.2)', alignSelf:'flex-start', paddingVertical:6, paddingHorizontal:14, borderRadius:20 },
  heroBadgeTxt:{ color:'#fff', fontSize:12, fontWeight:'700' },

  catBtnActive:{ flexDirection:'row', alignItems:'center', gap:6, paddingVertical:9, paddingHorizontal:16, borderRadius:22 },
  catBtn:      { flexDirection:'row', alignItems:'center', gap:6, paddingVertical:9, paddingHorizontal:16, borderRadius:22, borderWidth:1.5 },
  catLabel:    { fontSize:13, fontWeight:'700' },

  catHeader:     { flexDirection:'row', alignItems:'center', gap:12, marginBottom:14 },
  catHeaderIcon: { width:38, height:38, borderRadius:12, justifyContent:'center', alignItems:'center' },
  catHeaderLabel:{ fontSize:17, fontWeight:'900' },
  catHeaderDesc: { fontSize:12, marginTop:1 },

  tipCard:  { flexDirection:'row', borderRadius:18, borderWidth:1.5, overflow:'hidden', elevation:3, shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.07, shadowRadius:8 },
  tipStripe:{ width:5 },
  tipBody:  { flex:1, padding:14 },
  tipTop:   { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:8 },
  tipTag:   { paddingVertical:3, paddingHorizontal:10, borderRadius:12 },
  tipTagTxt:{ fontSize:11, fontWeight:'800' },
  tipMeta:  { flexDirection:'row', alignItems:'center', gap:4 },
  tipMetaTxt:{ fontSize:11 },
  tipTitle: { fontSize:15, fontWeight:'800', lineHeight:22, marginBottom:6 },
  tipSummary:{ fontSize:13, lineHeight:19 },
  tipFooter:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:12, paddingTop:10, borderTopWidth:1 },
  tipRead:  { fontSize:13, fontWeight:'800' },
});
