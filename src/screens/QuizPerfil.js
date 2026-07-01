import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, View, ScrollView, TouchableOpacity,
  Dimensions, Animated, Modal, FlatList,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const STORAGE_KEY = '@quiz_historico';

// ─── BANCO DE 30 PERGUNTAS (10 categorias) ────────────────────────────────────
const BANCO_PERGUNTAS = [
  {id:1,  cat:'Estilo', variacao:1, pergunta:'Como você prefere resolver problemas complexos?', opcoes:[
    {texto:'Analisando dados e encontrando padrões',    icone:'chart-line',            peso:{tech:3,criativo:0,lideranca:1,pessoas:0,negocios:1,operacoes:2}},
    {texto:'Criando soluções criativas e inovadoras',   icone:'lightbulb-on-outline',  peso:{tech:1,criativo:3,lideranca:1,pessoas:0,negocios:1,operacoes:0}},
    {texto:'Coordenando a equipe para agir juntos',     icone:'account-group-outline', peso:{tech:0,criativo:0,lideranca:3,pessoas:2,negocios:2,operacoes:1}},
    {texto:'Conversando para entender todos os lados',  icone:'chat-outline',          peso:{tech:0,criativo:1,lideranca:2,pessoas:3,negocios:2,operacoes:0}},
  ]},
  {id:2,  cat:'Estilo', variacao:2, pergunta:'Qual palavra melhor descreve seu jeito de trabalhar?', opcoes:[
    {texto:'Sistemático — processo antes de ação',      icone:'sitemap',               peso:{tech:3,criativo:0,lideranca:1,pessoas:0,negocios:0,operacoes:3}},
    {texto:'Experimental — tento, erro e aprendo',      icone:'flask-outline',         peso:{tech:2,criativo:3,lideranca:0,pessoas:0,negocios:1,operacoes:0}},
    {texto:'Orientado — metas claras e foco total',     icone:'target',                peso:{tech:0,criativo:0,lideranca:3,pessoas:0,negocios:3,operacoes:1}},
    {texto:'Colaborativo — junto sempre funciona mais', icone:'human-greeting-variant',peso:{tech:0,criativo:1,lideranca:2,pessoas:3,negocios:1,operacoes:1}},
  ]},
  {id:3,  cat:'Estilo', variacao:3, pergunta:'Quando tem uma semana livre, você provavelmente:', opcoes:[
    {texto:'Aprende uma nova linguagem ou ferramenta',  icone:'code-braces',           peso:{tech:3,criativo:1,lideranca:0,pessoas:0,negocios:0,operacoes:1}},
    {texto:'Cria algo — desenho, vídeo, música, escrita',icone:'palette-outline',      peso:{tech:0,criativo:3,lideranca:0,pessoas:0,negocios:0,operacoes:0}},
    {texto:'Planeja um projeto ou negócio novo',        icone:'briefcase-outline',     peso:{tech:1,criativo:1,lideranca:3,pessoas:0,negocios:3,operacoes:1}},
    {texto:'Conecta com pessoas e fortalece relações',  icone:'account-heart-outline', peso:{tech:0,criativo:1,lideranca:1,pessoas:3,negocios:1,operacoes:0}},
  ]},
  {id:4,  cat:'Motivação', variacao:1, pergunta:'O que mais te motiva profissionalmente?', opcoes:[
    {texto:'Construir sistemas e automatizar processos',icone:'cog-outline',            peso:{tech:3,criativo:1,lideranca:0,pessoas:0,negocios:0,operacoes:2}},
    {texto:'Ver meu trabalho ganhar vida visualmente',  icone:'palette-outline',        peso:{tech:1,criativo:3,lideranca:0,pessoas:0,negocios:1,operacoes:0}},
    {texto:'Alcançar metas e superar recordes',         icone:'trophy-outline',         peso:{tech:0,criativo:0,lideranca:2,pessoas:0,negocios:3,operacoes:1}},
    {texto:'Fazer diferença real na vida das pessoas',  icone:'heart-outline',          peso:{tech:0,criativo:1,lideranca:1,pessoas:3,negocios:0,operacoes:0}},
  ]},
  {id:5,  cat:'Motivação', variacao:2, pergunta:'O que te faz sentir que o dia valeu a pena?', opcoes:[
    {texto:'Resolvi um problema difícil com elegância', icone:'puzzle-outline',         peso:{tech:3,criativo:1,lideranca:0,pessoas:0,negocios:0,operacoes:2}},
    {texto:'Criei algo bonito e original',              icone:'star-shooting',          peso:{tech:0,criativo:3,lideranca:0,pessoas:0,negocios:0,operacoes:0}},
    {texto:'Bati ou superei uma meta importante',       icone:'flag-checkered',         peso:{tech:0,criativo:0,lideranca:2,pessoas:0,negocios:3,operacoes:2}},
    {texto:'Ajudei alguém a crescer ou superar algo',   icone:'hand-heart-outline',     peso:{tech:0,criativo:0,lideranca:1,pessoas:3,negocios:0,operacoes:0}},
  ]},
  {id:6,  cat:'Ambiente', variacao:1, pergunta:'Qual ambiente de trabalho é o seu ideal?', opcoes:[
    {texto:'Home office com foco e autonomia total',    icone:'home-outline',           peso:{tech:3,criativo:2,lideranca:0,pessoas:0,negocios:1,operacoes:0}},
    {texto:'Estúdio criativo e colaborativo',           icone:'brush-outline',          peso:{tech:0,criativo:3,lideranca:1,pessoas:2,negocios:0,operacoes:0}},
    {texto:'Escritório dinâmico cheio de movimento',    icone:'office-building-outline',peso:{tech:0,criativo:0,lideranca:3,pessoas:2,negocios:3,operacoes:1}},
    {texto:'Campo, fábrica ou operação presencial',     icone:'truck-outline',          peso:{tech:0,criativo:0,lideranca:1,pessoas:1,negocios:1,operacoes:3}},
  ]},
  {id:7,  cat:'Ambiente', variacao:2, pergunta:'Como você prefere receber feedback?', opcoes:[
    {texto:'Métricas e dados claros de desempenho',     icone:'chart-bar',              peso:{tech:3,criativo:0,lideranca:1,pessoas:0,negocios:2,operacoes:3}},
    {texto:'Avaliação qualitativa do meu trabalho',     icone:'comment-text-outline',   peso:{tech:0,criativo:3,lideranca:0,pessoas:1,negocios:1,operacoes:0}},
    {texto:'1:1 com o líder, direto ao ponto',          icone:'account-voice',          peso:{tech:1,criativo:0,lideranca:3,pessoas:1,negocios:2,operacoes:1}},
    {texto:'Conversa aberta com todo o time',           icone:'forum-outline',          peso:{tech:0,criativo:1,lideranca:2,pessoas:3,negocios:0,operacoes:0}},
  ]},
  {id:8,  cat:'Habilidade', variacao:1, pergunta:'Qual habilidade mais define você?', opcoes:[
    {texto:'Raciocínio lógico e matemático',            icone:'calculator-variant-outline',peso:{tech:3,criativo:0,lideranca:0,pessoas:0,negocios:1,operacoes:2}},
    {texto:'Senso estético e criatividade',             icone:'star-four-points-outline',  peso:{tech:1,criativo:3,lideranca:0,pessoas:0,negocios:1,operacoes:0}},
    {texto:'Comunicação e poder de persuasão',          icone:'microphone-outline',         peso:{tech:0,criativo:1,lideranca:2,pessoas:2,negocios:3,operacoes:0}},
    {texto:'Empatia profunda e escuta ativa',           icone:'ear-hearing',                peso:{tech:0,criativo:1,lideranca:1,pessoas:3,negocios:0,operacoes:1}},
  ]},
  {id:9,  cat:'Habilidade', variacao:2, pergunta:'Seus colegas pedem sua ajuda com:', opcoes:[
    {texto:'Tecnologia, sistemas ou automação',         icone:'laptop',                 peso:{tech:3,criativo:0,lideranca:0,pessoas:0,negocios:0,operacoes:2}},
    {texto:'Design, apresentação ou visual',            icone:'image-edit-outline',     peso:{tech:0,criativo:3,lideranca:0,pessoas:0,negocios:1,operacoes:0}},
    {texto:'Decisões difíceis e visão estratégica',     icone:'chess-queen',            peso:{tech:1,criativo:0,lideranca:3,pessoas:0,negocios:3,operacoes:1}},
    {texto:'Resolver conflitos e escutar angústias',    icone:'scale-balance',          peso:{tech:0,criativo:0,lideranca:1,pessoas:3,negocios:0,operacoes:0}},
  ]},
  {id:10, cat:'Grupo', variacao:1, pergunta:'Em projetos em grupo, você costuma ser:', opcoes:[
    {texto:'O especialista técnico que resolve',        icone:'code-braces',            peso:{tech:3,criativo:1,lideranca:0,pessoas:0,negocios:0,operacoes:1}},
    {texto:'O criativo que traz ideias novas',          icone:'head-lightbulb-outline', peso:{tech:1,criativo:3,lideranca:1,pessoas:0,negocios:1,operacoes:0}},
    {texto:'O líder que organiza e decide',             icone:'flag-outline',           peso:{tech:0,criativo:0,lideranca:3,pessoas:1,negocios:2,operacoes:2}},
    {texto:'O mediador que mantém harmonia',            icone:'handshake-outline',      peso:{tech:0,criativo:0,lideranca:2,pessoas:3,negocios:1,operacoes:0}},
  ]},
  {id:11, cat:'Grupo', variacao:2, pergunta:'Numa reunião importante, você geralmente:', opcoes:[
    {texto:'Traz dados para embasar as decisões',       icone:'chart-scatter-plot',     peso:{tech:3,criativo:0,lideranca:1,pessoas:0,negocios:2,operacoes:2}},
    {texto:'Propõe ideias criativas e fora do padrão',  icone:'lightbulb-on-outline',   peso:{tech:0,criativo:3,lideranca:1,pessoas:0,negocios:1,operacoes:0}},
    {texto:'Conduz a discussão e toma as decisões',     icone:'gavel',                  peso:{tech:0,criativo:0,lideranca:3,pessoas:0,negocios:3,operacoes:1}},
    {texto:'Garante que todos sejam ouvidos',           icone:'account-group',          peso:{tech:0,criativo:1,lideranca:2,pessoas:3,negocios:0,operacoes:0}},
  ]},
  {id:12, cat:'Pressão', variacao:1, pergunta:'Diante de um prazo apertado, você:', opcoes:[
    {texto:'Otimiza e automatiza o que der tempo',      icone:'lightning-bolt',         peso:{tech:3,criativo:0,lideranca:1,pessoas:0,negocios:0,operacoes:2}},
    {texto:'Prioriza o que vai ter mais impacto visual',icone:'format-paint',           peso:{tech:0,criativo:3,lideranca:0,pessoas:0,negocios:1,operacoes:0}},
    {texto:'Delega, organiza e mantém todos focados',   icone:'human-capacity-increase',peso:{tech:0,criativo:0,lideranca:3,pessoas:1,negocios:2,operacoes:2}},
    {texto:'Conversa para reavaliar escopo',            icone:'forum-outline',          peso:{tech:0,criativo:1,lideranca:2,pessoas:3,negocios:1,operacoes:0}},
  ]},
  {id:13, cat:'Pressão', variacao:2, pergunta:'Como você toma decisões importantes?', opcoes:[
    {texto:'Com base em dados, métricas e evidências',  icone:'chart-bar',              peso:{tech:3,criativo:0,lideranca:2,pessoas:0,negocios:2,operacoes:3}},
    {texto:'Pela intuição e senso estético',            icone:'weather-lightning',      peso:{tech:0,criativo:3,lideranca:0,pessoas:1,negocios:1,operacoes:0}},
    {texto:'Consultando especialistas e referências',   icone:'book-account-outline',   peso:{tech:1,criativo:1,lideranca:2,pessoas:2,negocios:2,operacoes:1}},
    {texto:'Ouvindo as pessoas envolvidas',             icone:'chat-processing-outline',peso:{tech:0,criativo:0,lideranca:2,pessoas:3,negocios:1,operacoes:1}},
  ]},
  {id:14, cat:'Reconhecimento', variacao:1, pergunta:'Qual tipo de reconhecimento mais te valoriza?', opcoes:[
    {texto:'Minha solução técnica adotada em escala',   icone:'cloud-upload-outline',   peso:{tech:3,criativo:0,lideranca:1,pessoas:0,negocios:0,operacoes:1}},
    {texto:'Meu trabalho publicado e muito elogiado',   icone:'star-outline',           peso:{tech:0,criativo:3,lideranca:0,pessoas:1,negocios:1,operacoes:0}},
    {texto:'Promoção ou bônus por resultado',           icone:'medal-outline',          peso:{tech:0,criativo:0,lideranca:2,pessoas:0,negocios:3,operacoes:1}},
    {texto:'Feedback positivo de quem ajudei',          icone:'thumb-up-outline',       peso:{tech:0,criativo:1,lideranca:1,pessoas:3,negocios:0,operacoes:0}},
  ]},
  {id:15, cat:'Aprendizado', variacao:1, pergunta:'Como você aprende melhor?', opcoes:[
    {texto:'Documentações e experimentação prática',    icone:'book-open-outline',      peso:{tech:3,criativo:1,lideranca:0,pessoas:0,negocios:0,operacoes:1}},
    {texto:'Referências visuais e projetos reais',      icone:'eye-outline',            peso:{tech:1,criativo:3,lideranca:0,pessoas:1,negocios:1,operacoes:0}},
    {texto:'Cursos, mentores e certificações',          icone:'school-outline',         peso:{tech:1,criativo:0,lideranca:2,pessoas:1,negocios:3,operacoes:1}},
    {texto:'Tentativa e erro no mundo real',            icone:'repeat-variant',         peso:{tech:1,criativo:1,lideranca:1,pessoas:2,negocios:1,operacoes:3}},
  ]},
  {id:16, cat:'Aprendizado', variacao:2, pergunta:'Que desafio faz você crescer mais?', opcoes:[
    {texto:'Um problema técnico nunca visto antes',     icone:'robot-outline',          peso:{tech:3,criativo:1,lideranca:0,pessoas:0,negocios:0,operacoes:1}},
    {texto:'Um brief criativo do zero, sem restrições', icone:'creation',               peso:{tech:0,criativo:3,lideranca:0,pessoas:0,negocios:0,operacoes:0}},
    {texto:'Liderar um time em território desconhecido',icone:'map-marker-path',        peso:{tech:0,criativo:0,lideranca:3,pessoas:1,negocios:2,operacoes:2}},
    {texto:'Ajudar alguém a superar uma crise',         icone:'lifebuoy',               peso:{tech:0,criativo:1,lideranca:1,pessoas:3,negocios:0,operacoes:0}},
  ]},
  {id:17, cat:'Ritmo', variacao:1, pergunta:'Qual ritmo de trabalho combina mais com você?', opcoes:[
    {texto:'Projetos longos com foco e profundidade',   icone:'timer-sand',             peso:{tech:3,criativo:2,lideranca:0,pessoas:0,negocios:0,operacoes:1}},
    {texto:'Vários projetos criativos ao mesmo tempo',  icone:'view-grid-outline',      peso:{tech:0,criativo:3,lideranca:1,pessoas:1,negocios:1,operacoes:0}},
    {texto:'Metas semanais e ritmo acelerado',          icone:'speedometer',            peso:{tech:0,criativo:0,lideranca:2,pessoas:0,negocios:3,operacoes:1}},
    {texto:'Rotina estável com foco em pessoas e processos',icone:'calendar-check',    peso:{tech:0,criativo:0,lideranca:1,pessoas:2,negocios:0,operacoes:3}},
  ]},
  {id:18, cat:'Ritmo', variacao:2, pergunta:'Como você lida com mudanças repentinas de plano?', opcoes:[
    {texto:'Analiso impacto e redesenho o sistema',     icone:'cog-refresh-outline',    peso:{tech:3,criativo:0,lideranca:1,pessoas:0,negocios:0,operacoes:2}},
    {texto:'Abraço — mudança gera novas ideias',        icone:'sync',                   peso:{tech:1,criativo:3,lideranca:0,pessoas:0,negocios:1,operacoes:0}},
    {texto:'Reorganizo prioridades e comunico ao time', icone:'clipboard-edit',         peso:{tech:0,criativo:0,lideranca:3,pessoas:1,negocios:2,operacoes:2}},
    {texto:'Converso para alinhar expectativas',        icone:'account-multiple-check', peso:{tech:0,criativo:0,lideranca:2,pessoas:3,negocios:1,operacoes:1}},
  ]},
  {id:19, cat:'Liderança', variacao:1, pergunta:'Qual estilo de liderança mais te representa?', opcoes:[
    {texto:'Técnico — lidero pelo conhecimento',        icone:'brain',                  peso:{tech:3,criativo:0,lideranca:1,pessoas:0,negocios:0,operacoes:2}},
    {texto:'Inspirador — lidero pelas ideias e visão',  icone:'bullseye-arrow',         peso:{tech:0,criativo:3,lideranca:2,pessoas:1,negocios:2,operacoes:0}},
    {texto:'Estratégico — lidero pelos resultados',     icone:'chess-queen',            peso:{tech:1,criativo:0,lideranca:3,pessoas:0,negocios:3,operacoes:2}},
    {texto:'Servant leader — sirvo e desenvolvo',       icone:'account-star-outline',   peso:{tech:0,criativo:0,lideranca:2,pessoas:3,negocios:1,operacoes:1}},
  ]},
  {id:20, cat:'Liderança', variacao:2, pergunta:'Quando você tem uma ideia nova, o que faz?', opcoes:[
    {texto:'Prototipo e testo rapidamente',             icone:'flask-outline',          peso:{tech:3,criativo:2,lideranca:0,pessoas:0,negocios:1,operacoes:2}},
    {texto:'Desenvolvo visualmente e apresento',        icone:'presentation',           peso:{tech:0,criativo:3,lideranca:1,pessoas:1,negocios:2,operacoes:0}},
    {texto:'Monto um plano de ação e executo',          icone:'clipboard-edit',         peso:{tech:1,criativo:0,lideranca:3,pessoas:0,negocios:3,operacoes:2}},
    {texto:'Compartilho com o time e construo junto',   icone:'account-group',          peso:{tech:0,criativo:1,lideranca:2,pessoas:3,negocios:1,operacoes:0}},
  ]},
  {id:21, cat:'Propósito', variacao:1, pergunta:'Qual legado você quer deixar na carreira?', opcoes:[
    {texto:'Criar tecnologias que transformam o mundo', icone:'earth',                  peso:{tech:3,criativo:1,lideranca:1,pessoas:0,negocios:0,operacoes:0}},
    {texto:'Obras criativas que emocionam gerações',    icone:'palette',                peso:{tech:0,criativo:3,lideranca:0,pessoas:1,negocios:0,operacoes:0}},
    {texto:'Construir empresas ou equipes de alta performance',icone:'office-building', peso:{tech:0,criativo:0,lideranca:3,pessoas:1,negocios:3,operacoes:1}},
    {texto:'Ajudar pessoas a terem mais saúde e bem-estar',icone:'hand-heart-outline', peso:{tech:0,criativo:0,lideranca:1,pessoas:3,negocios:0,operacoes:0}},
  ]},
  {id:22, cat:'Propósito', variacao:2, pergunta:'Em qual projeto você se jogaria de cabeça?', opcoes:[
    {texto:'Desenvolver um app ou sistema do zero',     icone:'code-tags',              peso:{tech:3,criativo:1,lideranca:0,pessoas:0,negocios:0,operacoes:1}},
    {texto:'Criar uma campanha visual ou marca icônica',icone:'brush-variant',          peso:{tech:0,criativo:3,lideranca:0,pessoas:0,negocios:1,operacoes:0}},
    {texto:'Liderar uma startup ou reestruturar empresa',icone:'domain',                peso:{tech:0,criativo:1,lideranca:3,pessoas:1,negocios:3,operacoes:1}},
    {texto:'Montar um programa social ou de saúde',     icone:'hospital-building',      peso:{tech:0,criativo:0,lideranca:1,pessoas:3,negocios:0,operacoes:1}},
  ]},
  {id:23, cat:'Dados', variacao:1, pergunta:'Como você se sente com números e planilhas?', opcoes:[
    {texto:'Adoro — são ferramentas de análise e decisão',icone:'table-large',          peso:{tech:3,criativo:0,lideranca:1,pessoas:0,negocios:2,operacoes:2}},
    {texto:'Uso quando necessário, prefiro criar',      icone:'pencil-ruler',           peso:{tech:1,criativo:3,lideranca:0,pessoas:0,negocios:1,operacoes:0}},
    {texto:'São importantes para medir metas',          icone:'finance',                peso:{tech:1,criativo:0,lideranca:2,pessoas:0,negocios:3,operacoes:2}},
    {texto:'Prefiro focar nas pessoas, não nos números',icone:'account-multiple',       peso:{tech:0,criativo:1,lideranca:1,pessoas:3,negocios:0,operacoes:0}},
  ]},
  {id:24, cat:'Dados', variacao:2, pergunta:'Sua maior força ao apresentar resultados:', opcoes:[
    {texto:'Transformo dados complexos em insights claros',icone:'chart-areaspline',    peso:{tech:3,criativo:1,lideranca:1,pessoas:0,negocios:2,operacoes:2}},
    {texto:'Crio apresentações visualmente impactantes',icone:'monitor-screenshot',     peso:{tech:0,criativo:3,lideranca:0,pessoas:0,negocios:1,operacoes:0}},
    {texto:'Argumento com fatos e persuado a decisão',  icone:'vote-outline',           peso:{tech:1,criativo:0,lideranca:3,pessoas:0,negocios:3,operacoes:1}},
    {texto:'Contextualizo o impacto humano dos números',icone:'account-heart-outline',  peso:{tech:0,criativo:1,lideranca:1,pessoas:3,negocios:0,operacoes:0}},
  ]},
  {id:25, cat:'Conflito', variacao:1, pergunta:'Quando há conflito no trabalho, você costuma:', opcoes:[
    {texto:'Buscar solução técnica que elimine o problema',icone:'wrench-outline',      peso:{tech:3,criativo:0,lideranca:1,pessoas:0,negocios:0,operacoes:2}},
    {texto:'Propor uma abordagem diferente e criativa', icone:'directions-fork',        peso:{tech:0,criativo:3,lideranca:1,pessoas:1,negocios:1,operacoes:0}},
    {texto:'Tomar a frente e resolver com firmeza',     icone:'shield-account-outline', peso:{tech:0,criativo:0,lideranca:3,pessoas:1,negocios:2,operacoes:1}},
    {texto:'Mediar o diálogo e alinhar as partes',      icone:'scale-balance',          peso:{tech:0,criativo:0,lideranca:2,pessoas:3,negocios:1,operacoes:0}},
  ]},
  {id:26, cat:'Conflito', variacao:2, pergunta:'Qual frase mais combina com você?', opcoes:[
    {texto:'"Preciso entender como funciona por dentro"',icone:'magnify',               peso:{tech:3,criativo:1,lideranca:0,pessoas:0,negocios:0,operacoes:2}},
    {texto:'"Quero que seja bonito E funcional"',        icone:'auto-fix',              peso:{tech:1,criativo:3,lideranca:0,pessoas:0,negocios:1,operacoes:0}},
    {texto:'"Vou fazer acontecer, custe o que custar"', icone:'rocket-launch-outline',  peso:{tech:0,criativo:0,lideranca:3,pessoas:0,negocios:3,operacoes:2}},
    {texto:'"O que o cliente realmente precisa?"',      icone:'account-question-outline',peso:{tech:0,criativo:1,lideranca:1,pessoas:3,negocios:1,operacoes:0}},
  ]},
  {id:27, cat:'Energia', variacao:1, pergunta:'O que te dá mais energia no trabalho?', opcoes:[
    {texto:'Resolver um bug difícil ou otimizar sistema',icone:'bug-check-outline',     peso:{tech:3,criativo:0,lideranca:0,pessoas:0,negocios:0,operacoes:2}},
    {texto:'Ter uma ideia e transformá-la em algo real', icone:'creation',              peso:{tech:1,criativo:3,lideranca:1,pessoas:0,negocios:1,operacoes:0}},
    {texto:'Fechar uma venda ou superar a concorrência', icone:'podium-gold',           peso:{tech:0,criativo:0,lideranca:2,pessoas:0,negocios:3,operacoes:1}},
    {texto:'Ver alguém crescer por causa da minha ajuda',icone:'human-greeting-variant',peso:{tech:0,criativo:1,lideranca:1,pessoas:3,negocios:0,operacoes:0}},
  ]},
  {id:28, cat:'Energia', variacao:2, pergunta:'Sua semana ideal de trabalho teria:', opcoes:[
    {texto:'Horas de foco profundo sem interrupções',   icone:'headphones',             peso:{tech:3,criativo:2,lideranca:0,pessoas:0,negocios:0,operacoes:1}},
    {texto:'Espaço para criar, experimentar e errar',   icone:'brush-outline',          peso:{tech:1,criativo:3,lideranca:0,pessoas:0,negocios:0,operacoes:0}},
    {texto:'Reuniões estratégicas e decisões relevantes',icone:'calendar-clock',        peso:{tech:0,criativo:0,lideranca:3,pessoas:1,negocios:3,operacoes:1}},
    {texto:'Muito contato humano e conexões verdadeiras',icone:'account-multiple-plus', peso:{tech:0,criativo:0,lideranca:1,pessoas:3,negocios:1,operacoes:0}},
  ]},
  {id:29, cat:'Identidade', variacao:1, pergunta:'Qual frase define sua identidade profissional?', opcoes:[
    {texto:'"Sou a pessoa que resolve o que ninguém consegue"',icone:'key-variant',     peso:{tech:3,criativo:1,lideranca:1,pessoas:0,negocios:0,operacoes:2}},
    {texto:'"Sou a pessoa que cria o que ninguém imaginou"',   icone:'palette-swatch-outline',peso:{tech:0,criativo:3,lideranca:0,pessoas:0,negocios:1,operacoes:0}},
    {texto:'"Sou a pessoa que faz o time chegar lá"',          icone:'trophy',          peso:{tech:0,criativo:0,lideranca:3,pessoas:1,negocios:3,operacoes:2}},
    {texto:'"Sou a pessoa em quem todos podem confiar"',       icone:'shield-check-outline',peso:{tech:0,criativo:0,lideranca:1,pessoas:3,negocios:0,operacoes:1}},
  ]},
  {id:30, cat:'Identidade', variacao:2, pergunta:'Seu super-poder profissional seria:', opcoes:[
    {texto:'Ver padrões e resolver qualquer sistema',   icone:'atom-variant',           peso:{tech:3,criativo:1,lideranca:0,pessoas:0,negocios:1,operacoes:2}},
    {texto:'Transformar qualquer ideia em realidade',   icone:'auto-fix',               peso:{tech:1,criativo:3,lideranca:0,pessoas:0,negocios:1,operacoes:0}},
    {texto:'Inspirar e mover qualquer pessoa ou grupo', icone:'lightning-bolt-circle',  peso:{tech:0,criativo:1,lideranca:3,pessoas:2,negocios:3,operacoes:1}},
    {texto:'Sentir exatamente o que as pessoas precisam',icone:'heart-pulse',           peso:{tech:0,criativo:0,lideranca:1,pessoas:3,negocios:0,operacoes:0}},
  ]},
];

// ─── PERFIS ───────────────────────────────────────────────────────────────────
const PERFIS = {
  tech: {
    nome:'Tecnologia & Dados', icone:'laptop', emoji:'💻',
    gradient:['#1E3A8A','#3B82F6'], bgLight:'#EFF6FF', corAccent:'#1D4ED8',
    tagline:'Você constrói o futuro com lógica e código',
    desc:'Você pensa de forma lógica e analítica. Adora resolver problemas complexos com código, algoritmos ou dados — e sente profunda satisfação ao ver sistemas funcionando com elegância e eficiência.',
    pontos:['Raciocínio analítico e lógico muito apurado','Alta capacidade de abstração e decomposição','Conforto com ambiguidade e aprendizado contínuo','Precisão e atenção aos detalhes técnicos'],
    areas:[
      {nome:'Desenvolvimento de Software', icone:'code-braces',          cor:'#1D4ED8'},
      {nome:'Ciência e Análise de Dados',  icone:'chart-scatter-plot',   cor:'#2563EB'},
      {nome:'Engenharia de Infraestrutura',icone:'server',               cor:'#3B82F6'},
      {nome:'Segurança da Informação',     icone:'shield-lock-outline',  cor:'#60A5FA'},
      {nome:'Inteligência Artificial',     icone:'robot-outline',        cor:'#1D4ED8'},
      {nome:'Product Manager Técnico',     icone:'view-dashboard-outline',cor:'#2563EB'},
    ],
    dica:'Destaque projetos com links (GitHub, portfólio), linguagens dominadas e certificações (AWS, Google Cloud). Use o template "Clássico" ou "Compacto".',
    salario:'R$ 4.000 – R$ 30.000+', mercado:'Alta demanda global', crescimento:95,
    softSkills:['Pensamento sistêmico','Curiosidade intelectual','Autonomia','Foco profundo'],
    insightCombinado:{
      criativo:'Tech + Criativo = UX Engineer, Game Developer ou Creative Technologist',
      lideranca:'Tech + Liderança = CTO, Engineering Manager ou Head of Product',
      pessoas:'Tech + Pessoas = People Analytics, UX Researcher ou DevRel',
      negocios:'Tech + Negócios = Product Manager, SaaS Founder ou Growth Hacker',
      operacoes:'Tech + Operações = DevOps, Engenheiro de Processos ou Data Ops',
    },
  },
  criativo: {
    nome:'Criativo & Design', icone:'palette', emoji:'🎨',
    gradient:['#5B21B6','#A78BFA'], bgLight:'#F5F3FF', corAccent:'#7C3AED',
    tagline:'Você transforma ideias em experiências que marcam',
    desc:'Sua sensibilidade estética e capacidade de comunicar visualmente são diferenciais raros. Onde outros veem um problema, você vê uma oportunidade de criar algo único e memorável.',
    pontos:['Visão estética aguçada e habilidade de storytelling','Capacidade de traduzir conceitos abstratos em visual','Abertura a feedback e iteração rápida','Sensibilidade para tendências e comportamento do usuário'],
    areas:[
      {nome:'Design Gráfico e Visual',    icone:'vector-bezier',         cor:'#7C3AED'},
      {nome:'UX/UI e Design de Produto',  icone:'palette-outline',       cor:'#8B5CF6'},
      {nome:'Marketing de Conteúdo',      icone:'bullhorn-outline',      cor:'#A78BFA'},
      {nome:'Publicidade e Branding',     icone:'television-play',       cor:'#7C3AED'},
      {nome:'Direção de Arte e Vídeo',    icone:'camera-outline',        cor:'#6D28D9'},
      {nome:'Fotografia e Criação Visual',icone:'image-multiple-outline',cor:'#8B5CF6'},
    ],
    dica:'Seu currículo é sua vitrine — use o template "Bold" ou "Criativo" e inclua link para portfólio. Mostre projetos reais e resultados de campanhas.',
    salario:'R$ 3.000 – R$ 20.000+', mercado:'Crescimento digital acelerado', crescimento:80,
    softSkills:['Criatividade','Resiliência ao feedback','Observação','Storytelling'],
    insightCombinado:{
      tech:'Criativo + Tech = UX Designer, Creative Developer ou Motion Engineer',
      lideranca:'Criativo + Liderança = Creative Director, CDO ou Brand Strategist',
      pessoas:'Criativo + Pessoas = Comunicador Social, Educador ou Art Therapist',
      negocios:'Criativo + Negócios = Brand Manager, CMO ou Empreendedor Digital',
      operacoes:'Criativo + Operações = Produtor de Eventos, Designer Industrial ou Gestor de Produção',
    },
  },
  lideranca: {
    nome:'Liderança & Gestão', icone:'account-tie', emoji:'🚀',
    gradient:['#064E3B','#10B981'], bgLight:'#F0FDFA', corAccent:'#0F766E',
    tagline:'Você move pessoas e transforma organizações',
    desc:'Você naturalmente inspira times, toma decisões estratégicas sob pressão e enxerga o todo enquanto cuida dos detalhes. Nasceu para orquestrar projetos e criar organizações de alta performance.',
    pontos:['Visão estratégica e capacidade decisória sob pressão','Inteligência emocional para liderar times diversos','Habilidade de alinhar pessoas a objetivos comuns','Resiliência e clareza em momentos de crise'],
    areas:[
      {nome:'Gestão de Projetos (PMP/Agile)',icone:'calendar-check',          cor:'#0F766E'},
      {nome:'Administração e Diretoria',    icone:'domain',                   cor:'#14B8A6'},
      {nome:'Consultoria Estratégica',      icone:'chart-timeline-variant',   cor:'#0D9488'},
      {nome:'Gestão de Produtos Digitais',  icone:'view-dashboard',           cor:'#0F766E'},
      {nome:'Empreendedorismo e Startups',  icone:'rocket-launch-outline',    cor:'#14B8A6'},
      {nome:'C-Level e Gestão Executiva',   icone:'crown-outline',            cor:'#0D9488'},
    ],
    dica:'Quantifique impacto sempre: "liderança de 20 pessoas", "redução de custos em 30%". Use o template "Timeline" para mostrar evolução e "Corporativo" para cargos executivos.',
    salario:'R$ 6.000 – R$ 50.000+', mercado:'Sempre valorizado', crescimento:87,
    softSkills:['Visão estratégica','Decisão sob pressão','Inspiração','Accountability'],
    insightCombinado:{
      tech:'Liderança + Tech = CTO, Tech Lead ou Engineering Manager',
      criativo:'Liderança + Criativo = Creative Director, Head of Brand ou CDO',
      pessoas:'Liderança + Pessoas = CHRO, People Partner ou Diretor de RH',
      negocios:'Liderança + Negócios = CEO, COO ou Business Unit Director',
      operacoes:'Liderança + Operações = COO, Diretor Industrial ou Head of Ops',
    },
  },
  pessoas: {
    nome:'Pessoas & Saúde', icone:'heart-pulse', emoji:'💙',
    gradient:['#9D174D','#F472B6'], bgLight:'#FFF1F2', corAccent:'#BE185D',
    tagline:'Você cuida, escuta e transforma vidas',
    desc:'Sua empatia e habilidade de conexão humana são excepcionais. Você encontra profundo significado em cuidar e transformar a vida das pessoas. Você floresce em ambientes onde o impacto humano é direto e visível.',
    pontos:['Empatia genuína e inteligência emocional elevada','Capacidade de escuta ativa e presença acolhedora','Habilidade de criar vínculos de confiança profundos','Paciência e consistência no desenvolvimento humano'],
    areas:[
      {nome:'Psicologia e Terapia',        icone:'brain',                 cor:'#BE185D'},
      {nome:'Recursos Humanos e People',   icone:'account-multiple',      cor:'#E11D48'},
      {nome:'Educação e Docência',         icone:'school-outline',        cor:'#F43F5E'},
      {nome:'Saúde e Bem-estar',           icone:'medical-bag',           cor:'#BE185D'},
      {nome:'Assistência Social',          icone:'hand-heart-outline',    cor:'#E11D48'},
      {nome:'Coaching e Desenvolvimento',  icone:'account-star-outline',  cor:'#F472B6'},
    ],
    dica:'Destaque soft skills com exemplos concretos e experiências de atendimento ou treinamento. O template "Elegante" transmite cuidado e profissionalismo.',
    salario:'R$ 2.500 – R$ 18.000+', mercado:'Demanda crescente em saúde mental', crescimento:73,
    softSkills:['Empatia','Escuta ativa','Paciência','Cuidado genuíno'],
    insightCombinado:{
      tech:'Pessoas + Tech = UX Researcher, People Analytics ou EdTech Specialist',
      criativo:'Pessoas + Criativo = Art Therapist, Comunicador Social ou Professor',
      lideranca:'Pessoas + Liderança = CHRO, Head of People ou Diretor de RH',
      negocios:'Pessoas + Negócios = Customer Success, Account Manager ou HR BizPartner',
      operacoes:'Pessoas + Operações = Coordenador de Treinamento ou Gestor de Facilities',
    },
  },
  negocios: {
    nome:'Negócios & Vendas', icone:'briefcase', emoji:'💰',
    gradient:['#92400E','#F59E0B'], bgLight:'#FFFBEB', corAccent:'#D97706',
    tagline:'Você encontra oportunidades onde outros veem obstáculos',
    desc:'Você tem espírito empreendedor nato, adora negociar e encontra oportunidades onde outros veem obstáculos. Resultados concretos, metas ousadas e crescimento contínuo são o que te move.',
    pontos:['Orientação agressiva a resultados e metas','Habilidade de networking e relacionamento comercial','Visão de oportunidade e apetite pelo risco calculado','Resiliência em ciclos de venda e negociação'],
    areas:[
      {nome:'Vendas e Business Development',icone:'handshake',            cor:'#D97706'},
      {nome:'Finanças e Investimentos',     icone:'finance',              cor:'#F59E0B'},
      {nome:'Marketing e Growth Hacking',   icone:'trending-up',          cor:'#D97706'},
      {nome:'Empreendedorismo e Startups',  icone:'store-outline',        cor:'#F59E0B'},
      {nome:'Consultoria de Negócios',      icone:'briefcase-outline',    cor:'#B45309'},
      {nome:'Comércio Exterior e Trade',    icone:'earth',                cor:'#D97706'},
    ],
    dica:'Números são tudo: receita gerada, deals fechados, crescimento de carteira. Use KPIs sempre. O template "Timeline" mostra sua evolução comercial de forma impactante.',
    salario:'R$ 3.000 – R$ 40.000+ (com comissão)', mercado:'Alta demanda em todo setor', crescimento:88,
    softSkills:['Persuasão','Resiliência','Networking','Orientação a resultados'],
    insightCombinado:{
      tech:'Negócios + Tech = Product Manager, SaaS Sales Engineer ou Fintech Founder',
      criativo:'Negócios + Criativo = Brand Manager, CMO ou Growth Marketer',
      lideranca:'Negócios + Liderança = CEO, VP of Sales ou Business Unit Director',
      pessoas:'Negócios + Pessoas = Customer Success, Account Manager ou HR BizPartner',
      operacoes:'Negócios + Operações = Supply Chain Manager, Procurement ou Trade Ops',
    },
  },
  operacoes: {
    nome:'Operações & Logística', icone:'truck-fast-outline', emoji:'⚙️',
    gradient:['#0C4A6E','#38BDF8'], bgLight:'#F0F9FF', corAccent:'#0369A1',
    tagline:'Você garante que tudo chegue no lugar certo, na hora certa',
    desc:'Você garante que tudo funcione no tempo certo e no lugar certo. Sua organização, precisão e capacidade de gerir processos complexos são fundamentais. Você é quem mantém a máquina girando.',
    pontos:['Organização sistêmica e visão integrada de processos','Resiliência e eficiência operacional sob pressão','Capacidade de coordenar múltiplos recursos e prazos','Foco em melhoria contínua e eliminação de desperdícios'],
    areas:[
      {nome:'Logística e Supply Chain',    icone:'truck-delivery-outline',cor:'#0369A1'},
      {nome:'Produção e Qualidade',        icone:'factory',               cor:'#0284C7'},
      {nome:'Compras e Procurement',       icone:'cart-outline',          cor:'#0369A1'},
      {nome:'Planejamento e Controle',     icone:'clipboard-list-outline',cor:'#0284C7'},
      {nome:'Gestão de Facilities',        icone:'office-building-cog',   cor:'#0369A1'},
      {nome:'Lean e Melhoria Contínua',    icone:'recycle',               cor:'#38BDF8'},
    ],
    dica:'Evidencie KPIs: redução de custo de frete, melhoria de SLA, otimização de estoque. O template "Compacto" organiza muita informação com máxima clareza.',
    salario:'R$ 3.500 – R$ 22.000+', mercado:'Essencial em todo setor', crescimento:76,
    softSkills:['Organização','Precisão','Resiliência operacional','Visão de processo'],
    insightCombinado:{
      tech:'Operações + Tech = DevOps, Data Ops ou Industrial IoT Engineer',
      criativo:'Operações + Criativo = Produtor de Eventos, Designer Industrial ou Gestor de Produção',
      lideranca:'Operações + Liderança = COO, Diretor Industrial ou Head of Supply Chain',
      pessoas:'Operações + Pessoas = Gestor de Treinamento, EHS ou Facilities Manager',
      negocios:'Operações + Negócios = Supply Chain Director, Procurement Manager ou Trade Ops',
    },
  },
};

const PERFIS_KEYS = Object.keys(PERFIS);
const PERFIL_LABELS = {tech:'Tecnologia',criativo:'Criativo',lideranca:'Liderança',pessoas:'Pessoas',negocios:'Negócios',operacoes:'Operações'};

// ─── SELECIONA 20 PERGUNTAS EMBARALHADAS ──────────────────────────────────────
function selecionarPerguntas() {
  const porCat = {};
  BANCO_PERGUNTAS.forEach(p => {
    if (!porCat[p.cat]) porCat[p.cat] = [];
    porCat[p.cat].push(p);
  });
  const selecionadas = [];
  // 1 pergunta por categoria (variação aleatória)
  Object.values(porCat).forEach(lista => {
    const idx = Math.floor(Math.random() * lista.length);
    selecionadas.push(lista[idx]);
  });
  // completa até 20 com extras
  const restantes = BANCO_PERGUNTAS.filter(p => !selecionadas.find(s => s.id === p.id));
  while (selecionadas.length < 20 && restantes.length > 0) {
    const idx = Math.floor(Math.random() * restantes.length);
    selecionadas.push(...restantes.splice(idx, 1));
  }
  // embaralha ordem
  for (let i = selecionadas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selecionadas[i], selecionadas[j]] = [selecionadas[j], selecionadas[i]];
  }
  return selecionadas;
}

// ─── RADAR CHART ──────────────────────────────────────────────────────────────
function RadarChart({ scores, gradient }) {
  const size = width - 80;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 28;
  const keys = PERFIS_KEYS;
  const maxVal = Math.max(...Object.values(scores), 1);
  const step = (2 * Math.PI) / keys.length;

  const pts = keys.map((k, i) => {
    const angle = i * step - Math.PI / 2;
    const val = (scores[k] || 0) / maxVal;
    return {
      x: cx + r * val * Math.cos(angle),
      y: cy + r * val * Math.sin(angle),
      lx: cx + (r + 22) * Math.cos(angle),
      ly: cy + (r + 22) * Math.sin(angle),
      key: k,
    };
  });

  return (
    <View style={{width:size, height:size+40, alignSelf:'center', position:'relative', marginVertical:8}}>
      {/* grid rings */}
      {[0.25,0.5,0.75,1].map((f,i) => (
        <View key={i} style={{
          position:'absolute',
          width:r*2*f, height:r*2*f, borderRadius:r*f,
          borderWidth:1, borderColor:'rgba(0,0,0,0.06)',
          left:cx-r*f, top:cy-r*f,
        }}/>
      ))}
      {/* spokes */}
      {keys.map((k,i) => {
        const angle = i * step - Math.PI / 2;
        const ex = cx + r * Math.cos(angle);
        const ey = cy + r * Math.sin(angle);
        const dx = ex - cx, dy = ey - cy;
        const len = Math.sqrt(dx*dx+dy*dy);
        const deg = Math.atan2(dy,dx) * 180 / Math.PI;
        return (
          <View key={k} style={{
            position:'absolute', left:cx, top:cy-0.5,
            width:len, height:1,
            backgroundColor:'rgba(0,0,0,0.08)',
            transform:[{rotate:`${deg}deg`}],
            transformOrigin:'0 50%',
          }}/>
        );
      })}
      {/* polygon edges */}
      {pts.map((pt,i) => {
        const next = pts[(i+1)%pts.length];
        const dx = next.x-pt.x, dy = next.y-pt.y;
        const len = Math.sqrt(dx*dx+dy*dy);
        const deg = Math.atan2(dy,dx)*180/Math.PI;
        return (
          <View key={`e${i}`} style={{
            position:'absolute', left:pt.x, top:pt.y-1,
            width:len, height:2,
            backgroundColor: gradient[0]+'BB',
            transform:[{rotate:`${deg}deg`}],
            transformOrigin:'0 50%',
          }}/>
        );
      })}
      {/* dots */}
      {pts.map((pt,i) => (
        <View key={`d${i}`} style={{
          position:'absolute',
          width:10, height:10, borderRadius:5,
          backgroundColor:gradient[0],
          left:pt.x-5, top:pt.y-5,
          borderWidth:2, borderColor:'#fff',
        }}/>
      ))}
      {/* labels */}
      {pts.map((pt,i) => {
        const p = PERFIS[keys[i]];
        return (
          <View key={`l${i}`} style={{
            position:'absolute',
            left:pt.lx-28, top:pt.ly-16,
            width:56, alignItems:'center',
          }}>
            <Text style={{fontSize:13}}>{p.emoji}</Text>
            <Text style={{fontSize:7,fontWeight:'700',color:'#475569',textAlign:'center'}}>{PERFIL_LABELS[keys[i]]}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function QuizPerfil({ navigation }) {
  const [etapa, setEtapa] = useState('intro');
  const [perguntas, setPerguntas] = useState(() => selecionarPerguntas());
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [scores, setScores] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [modalHistorico, setModalHistorico] = useState(false);
  const [itemHistorico, setItemHistorico] = useState(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { carregarHistorico(); }, []);

  const carregarHistorico = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setHistorico(JSON.parse(data));
    } catch {}
  };

  const salvarNoHistorico = async (s, pergs) => {
    try {
      const perfilId = Object.keys(s).reduce((a, b) => s[a] >= s[b] ? a : b);
      const total = Object.values(s).reduce((a, b) => a + b, 0);
      const ranking = PERFIS_KEYS
        .map(k => ({key:k, score:s[k], pct: total>0 ? Math.round((s[k]/total)*100) : 0}))
        .sort((a,b) => b.score-a.score);
      const entrada = {
        id: Date.now().toString(),
        data: new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}),
        scores:s, perfilId, ranking,
        totalPerguntas: pergs.length,
      };
      const nova = [entrada, ...historico].slice(0, 10);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nova));
      setHistorico(nova);
    } catch {}
  };

  const animar = (cb) => {
    Animated.parallel([
      Animated.timing(fadeAnim,{toValue:0,duration:180,useNativeDriver:true}),
      Animated.timing(slideAnim,{toValue:-20,duration:180,useNativeDriver:true}),
    ]).start(() => {
      cb();
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim,{toValue:1,duration:220,useNativeDriver:true}),
        Animated.timing(slideAnim,{toValue:0,duration:220,useNativeDriver:true}),
      ]).start();
    });
  };

  const calcularScores = (lista) => {
    const s = {tech:0,criativo:0,lideranca:0,pessoas:0,negocios:0,operacoes:0};
    lista.forEach(p => Object.keys(s).forEach(k => { s[k] += p[k]||0; }));
    return s;
  };

  const responder = (opcao) => {
    setOpcaoSelecionada(opcao);
    setTimeout(() => {
      const novas = [...respostas, opcao.peso];
      if (perguntaAtual < perguntas.length - 1) {
        animar(() => { setRespostas(novas); setPerguntaAtual(perguntaAtual+1); setOpcaoSelecionada(null); });
      } else {
        const s = calcularScores(novas);
        salvarNoHistorico(s, perguntas);
        animar(() => { setScores(s); setEtapa('resultado'); });
      }
    }, 280);
  };

  const reiniciar = () => {
    animar(() => {
      setEtapa('intro'); setPerguntaAtual(0); setRespostas([]);
      setOpcaoSelecionada(null); setScores(null);
      setPerguntas(selecionarPerguntas());
    });
  };

  // ── MODAL HISTÓRICO ──────────────────────────────────────────────────────────
  const ModalHistorico = () => (
    <Modal visible={modalHistorico} animationType="slide" onRequestClose={() => { setModalHistorico(false); setItemHistorico(null); }}>
      <SafeAreaView style={[s.safe,{backgroundColor:'#F8FAFC'}]} edges={['top','bottom']}>
        <View style={s.modalHeader}>
          <TouchableOpacity onPress={() => { setModalHistorico(false); setItemHistorico(null); }} style={s.quizBack}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#1E293B" />
          </TouchableOpacity>
          <Text style={s.modalTitle}>{itemHistorico ? 'Análise anterior' : 'Histórico de resultados'}</Text>
          {itemHistorico && (
            <TouchableOpacity onPress={() => setItemHistorico(null)} style={s.quizBack}>
              <MaterialCommunityIcons name="format-list-bulleted" size={20} color="#7C3AED" />
            </TouchableOpacity>
          )}
        </View>

        {itemHistorico ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:40}}>
            {(() => {
              const p = PERFIS[itemHistorico.perfilId];
              const maxScore = Math.max(...Object.values(itemHistorico.scores));
              return (
                <>
                  <LinearGradient colors={p.gradient} style={s.histDetalheHero}>
                    <Text style={{fontSize:48}}>{p.emoji}</Text>
                    <Text style={s.histDetalhePerfil}>{p.nome}</Text>
                    <Text style={s.histDetalheData}>{itemHistorico.data}</Text>
                  </LinearGradient>
                  <View style={[s.card,{marginTop:16}]}>
                    <View style={s.cardHeader}>
                      <LinearGradient colors={p.gradient} style={s.cardIconBox}>
                        <MaterialCommunityIcons name="radar" size={14} color="#fff" />
                      </LinearGradient>
                      <Text style={s.cardTitle}>Radar de competências</Text>
                    </View>
                    <RadarChart scores={itemHistorico.scores} gradient={p.gradient} />
                  </View>
                  <View style={[s.card,{marginTop:12}]}>
                    <View style={s.cardHeader}>
                      <LinearGradient colors={p.gradient} style={s.cardIconBox}>
                        <MaterialCommunityIcons name="chart-bar" size={14} color="#fff" />
                      </LinearGradient>
                      <Text style={s.cardTitle}>Distribuição de perfis</Text>
                    </View>
                    {itemHistorico.ranking.map((item,i) => {
                      const pf = PERFIS[item.key];
                      const barPct = maxScore>0 ? (item.score/maxScore)*100 : 0;
                      return (
                        <View key={item.key} style={s.barRow}>
                          <View style={s.barLabelWrap}>
                            <Text style={s.barEmoji}>{pf.emoji}</Text>
                            <Text style={[s.barLabelTxt, i===0&&{color:pf.gradient[0],fontWeight:'800'}]}>{PERFIL_LABELS[item.key]}</Text>
                          </View>
                          <View style={s.barTrack}>
                            <View style={[s.barFill,{width:`${Math.max(barPct,4)}%`,overflow:'hidden'}]}>
                              <LinearGradient colors={pf.gradient} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill}/>
                            </View>
                          </View>
                          <Text style={[s.barPct,{color:i===0?pf.gradient[0]:'#94A3B8'}]}>{item.pct}%</Text>
                        </View>
                      );
                    })}
                  </View>
                </>
              );
            })()}
          </ScrollView>
        ) : historico.length === 0 ? (
          <View style={s.emptyHistorico}>
            <Text style={{fontSize:48}}>📊</Text>
            <Text style={s.emptyTitle}>Nenhuma análise salva</Text>
            <Text style={s.emptyDesc}>Faça o quiz para ver seu resultado aqui</Text>
          </View>
        ) : (
          <FlatList
            data={historico}
            keyExtractor={item => item.id}
            contentContainerStyle={{padding:16, gap:12}}
            renderItem={({item, index}) => {
              const p = PERFIS[item.perfilId];
              return (
                <TouchableOpacity onPress={() => setItemHistorico(item)} activeOpacity={0.85}>
                  <LinearGradient colors={[p.gradient[0]+'18',p.gradient[1]+'08']} style={s.histCard}>
                    <View style={[s.histIconBox,{backgroundColor:p.gradient[0]+'22'}]}>
                      <Text style={{fontSize:28}}>{p.emoji}</Text>
                    </View>
                    <View style={{flex:1}}>
                      <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                        <Text style={[s.histPerfilNome,{color:p.gradient[0]}]}>{p.nome}</Text>
                        {index===0 && (
                          <View style={[s.histBadge,{backgroundColor:p.gradient[0]}]}>
                            <Text style={s.histBadgeTxt}>Última</Text>
                          </View>
                        )}
                      </View>
                      <Text style={s.histData}>{item.data}</Text>
                      <View style={{flexDirection:'row',gap:6,marginTop:6,flexWrap:'wrap'}}>
                        {item.ranking.slice(0,3).map(r => (
                          <View key={r.key} style={[s.histRankBadge,{backgroundColor:PERFIS[r.key].gradient[0]+'22'}]}>
                            <Text style={{fontSize:10}}>{PERFIS[r.key].emoji}</Text>
                            <Text style={[s.histRankTxt,{color:PERFIS[r.key].gradient[0]}]}>{r.pct}%</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={p.gradient[0]}/>
                  </LinearGradient>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </SafeAreaView>
    </Modal>
  );

  // ── INTRO ────────────────────────────────────────────────────────────────────
  if (etapa === 'intro') return (
    <SafeAreaView style={s.safe} edges={['top','bottom']}>
      <ModalHistorico/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:36}}>
        <LinearGradient colors={['#1E1B4B','#4F46E5','#7C3AED','#BE185D']} start={{x:0,y:0}} end={{x:1,y:1}} style={s.introHero}>
          <View style={[s.blob,{width:240,height:240,top:-90,right:-70}]}/>
          <View style={[s.blob,{width:140,height:140,bottom:-40,left:-30}]}/>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.introBack} hitSlop={{top:12,bottom:12,left:12,right:12}}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#fff"/>
          </TouchableOpacity>
          {historico.length > 0 && (
            <TouchableOpacity onPress={() => setModalHistorico(true)} style={s.introHistBtn}>
              <MaterialCommunityIcons name="history" size={16} color="#fff"/>
              <Text style={s.introHistTxt}>{historico.length}</Text>
            </TouchableOpacity>
          )}
          <Animatable.View animation="zoomIn" duration={700} delay={100} style={s.heroIconBox}>
            <Text style={{fontSize:52}}>🧠</Text>
          </Animatable.View>
          <Animatable.Text animation="fadeInUp" delay={200} style={s.heroTitle}>Quiz de Perfil{'\n'}Profissional</Animatable.Text>
          <Animatable.Text animation="fadeInUp" delay={350} style={s.heroSub}>
            Descubra qual área de carreira combina{'\n'}com a sua personalidade e jeito de ser
          </Animatable.Text>
          <Animatable.View animation="fadeInUp" delay={500} style={s.featRow}>
            {[{icone:'clock-fast',txt:'~8 min'},{icone:'help-circle-outline',txt:'20 perguntas'},{icone:'star-shooting',txt:'6 perfis'}].map((f,i) => (
              <View key={i} style={s.featPill}>
                <MaterialCommunityIcons name={f.icone} size={17} color="rgba(255,255,255,0.95)"/>
                <Text style={s.featTxt}>{f.txt}</Text>
              </View>
            ))}
          </Animatable.View>
        </LinearGradient>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Perfis que você pode descobrir</Text>
          <View style={s.perfisGrid}>
            {PERFIS_KEYS.map((key,i) => {
              const p = PERFIS[key];
              return (
                <Animatable.View key={key} animation="zoomIn" delay={300+i*80} style={{width:(width-48)/2}}>
                  <LinearGradient colors={p.gradient} style={s.perfilChip}>
                    <Text style={{fontSize:20}}>{p.emoji}</Text>
                    <View style={{flex:1}}>
                      <Text style={s.perfilChipTxt} numberOfLines={1}>{p.nome}</Text>
                      <Text style={s.perfilChipTagline} numberOfLines={1}>{p.tagline.split(' ').slice(0,4).join(' ')}…</Text>
                    </View>
                  </LinearGradient>
                </Animatable.View>
              );
            })}
          </View>
        </View>

        {historico.length > 0 && (
          <Animatable.View animation="fadeInUp" delay={700} style={[s.card,{marginTop:16}]}>
            <View style={s.cardHeader}>
              <LinearGradient colors={['#4F46E5','#7C3AED']} style={s.cardIconBox}>
                <MaterialCommunityIcons name="history" size={14} color="#fff"/>
              </LinearGradient>
              <View style={{flex:1}}>
                <Text style={s.cardTitle}>Último resultado</Text>
                <Text style={s.chartSub}>{historico[0].data}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalHistorico(true)} style={s.verTodosBtn}>
                <Text style={s.verTodosTxt}>Ver todos ({historico.length})</Text>
              </TouchableOpacity>
            </View>
            {(() => {
              const p = PERFIS[historico[0].perfilId];
              return (
                <LinearGradient colors={[p.gradient[0]+'18',p.gradient[1]+'08']} style={s.ultResultBox}>
                  <Text style={{fontSize:32}}>{p.emoji}</Text>
                  <View style={{flex:1}}>
                    <Text style={[s.ultResultNome,{color:p.gradient[0]}]}>{p.nome}</Text>
                    <Text style={s.ultResultDesc} numberOfLines={2}>{p.tagline}</Text>
                  </View>
                </LinearGradient>
              );
            })()}
          </Animatable.View>
        )}

        <Animatable.View animation="fadeInUp" delay={800} style={s.startWrap}>
          <TouchableOpacity onPress={() => animar(() => setEtapa('quiz'))} activeOpacity={0.88} style={s.startOuter}>
            <LinearGradient colors={['#4F46E5','#7C3AED']} start={{x:0,y:0}} end={{x:1,y:0}} style={s.startBtn}>
              <MaterialCommunityIcons name="play-circle" size={22} color="#fff"/>
              <Text style={s.startBtnTxt}>Começar o Quiz</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={s.startNote}>Sem cadastro · Rápido e gratuito · 20 questões</Text>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );

  // ── RESULTADO ────────────────────────────────────────────────────────────────
  if (etapa === 'resultado') {
    const perfilId = Object.keys(scores).reduce((a,b) => scores[a]>=scores[b]?a:b);
    const perfil = PERFIS[perfilId];
    const maxScore = Math.max(...Object.values(scores));
    const totalScore = Object.values(scores).reduce((a,b)=>a+b,0);
    const ranking = PERFIS_KEYS
      .map(k=>({key:k,score:scores[k],pct:totalScore>0?Math.round((scores[k]/totalScore)*100):0,...PERFIS[k]}))
      .sort((a,b)=>b.score-a.score);
    const secundario = ranking[1];
    const dominancia = totalScore>0 ? Math.round((scores[perfilId]/totalScore)*100) : 0;
    const equilibrado = dominancia < 28;

    return (
      <SafeAreaView style={s.safe} edges={['top','bottom']}>
        <ModalHistorico/>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:52}}>

          <Animatable.View animation="fadeInDown" duration={600}>
            <LinearGradient colors={perfil.gradient} start={{x:0,y:0}} end={{x:1,y:1}} style={s.resultHero}>
              <View style={[s.blob,{width:240,height:240,top:-80,right:-60}]}/>
              <View style={[s.blob,{width:110,height:110,bottom:-20,left:-20}]}/>
              <Animatable.View animation="bounceIn" delay={200} duration={800} style={s.resultIconBox}>
                <Text style={{fontSize:50}}>{perfil.emoji}</Text>
              </Animatable.View>
              <Text style={s.resultLabel}>Seu perfil dominante é</Text>
              <Text style={s.resultNome}>{perfil.nome}</Text>
              <Text style={s.resultTagline}>{perfil.tagline}</Text>
              <View style={s.resultBadgeRow}>
                <View style={s.resultBadge}><MaterialCommunityIcons name="trending-up" size={12} color="#fff"/><Text style={s.resultBadgeTxt}>{perfil.mercado}</Text></View>
                <View style={s.resultBadge}><MaterialCommunityIcons name="cash" size={12} color="#fff"/><Text style={s.resultBadgeTxt}>{perfil.salario}</Text></View>
                <View style={s.resultBadge}><MaterialCommunityIcons name="percent" size={12} color="#fff"/><Text style={s.resultBadgeTxt}>{dominancia}% dom.</Text></View>
              </View>
            </LinearGradient>
          </Animatable.View>

          {equilibrado && (
            <Animatable.View animation="fadeInUp" delay={200} style={[s.card,{backgroundColor:'#FFF7ED',borderLeftWidth:4,borderLeftColor:'#F59E0B',marginTop:14}]}>
              <View style={{flexDirection:'row',gap:10,alignItems:'flex-start'}}>
                <MaterialCommunityIcons name="star-four-points" size={18} color="#D97706"/>
                <View style={{flex:1}}>
                  <Text style={{fontSize:13,fontWeight:'800',color:'#92400E',marginBottom:4}}>Perfil multidimensional raro!</Text>
                  <Text style={{fontSize:12,lineHeight:17,color:'#B45309'}}>
                    Você tem pontuação bem distribuída entre as áreas. Isso indica adaptabilidade e versatilidade profissional acima da média — um diferencial muito valioso no mercado.
                  </Text>
                </View>
              </View>
            </Animatable.View>
          )}

          {/* RADAR */}
          <Animatable.View animation="fadeInUp" delay={250} style={s.card}>
            <View style={s.cardHeader}>
              <LinearGradient colors={perfil.gradient} style={s.cardIconBox}>
                <MaterialCommunityIcons name="radar" size={14} color="#fff"/>
              </LinearGradient>
              <View style={{flex:1}}>
                <Text style={s.cardTitle}>Radar de competências</Text>
                <Text style={s.chartSub}>Visão 360° do seu perfil profissional</Text>
              </View>
            </View>
            <RadarChart scores={scores} gradient={perfil.gradient}/>
          </Animatable.View>

          {/* BARRAS */}
          <Animatable.View animation="fadeInUp" delay={300} style={s.card}>
            <View style={s.cardHeader}>
              <LinearGradient colors={perfil.gradient} style={s.cardIconBox}>
                <MaterialCommunityIcons name="chart-bar" size={14} color="#fff"/>
              </LinearGradient>
              <View style={{flex:1}}>
                <Text style={s.cardTitle}>Mapa de Competências</Text>
                <Text style={s.chartSub}>Distribuição relativa entre os 6 perfis</Text>
              </View>
            </View>
            {ranking.map((item,i) => {
              const barPct = maxScore>0 ? (item.score/maxScore)*100 : 0;
              const isPrimary = i===0;
              return (
                <Animatable.View key={item.key} animation="fadeInLeft" delay={350+i*70} style={s.barRow}>
                  <View style={s.barLabelWrap}>
                    <Text style={s.barEmoji}>{item.emoji}</Text>
                    <Text style={[s.barLabelTxt,isPrimary&&{color:item.gradient[0],fontWeight:'800'}]}>{PERFIL_LABELS[item.key]}</Text>
                    {isPrimary && <LinearGradient colors={item.gradient} style={s.topBadge}><Text style={s.topBadgeTxt}>1º</Text></LinearGradient>}
                  </View>
                  <View style={s.barTrack}>
                    <Animatable.View animation="slideInLeft" delay={450+i*70} style={[s.barFill,{width:`${Math.max(barPct,4)}%`,overflow:'hidden'}]}>
                      <LinearGradient colors={item.gradient} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill}/>
                    </Animatable.View>
                  </View>
                  <Text style={[s.barPct,{color:isPrimary?item.gradient[0]:'#94A3B8'}]}>{item.pct}%</Text>
                </Animatable.View>
              );
            })}
            <View style={s.chartNote}>
              <MaterialCommunityIcons name="information-outline" size={13} color="#94A3B8"/>
              <Text style={s.chartNoteTxt}>Baseado nas suas {perguntas.length} respostas</Text>
            </View>
          </Animatable.View>

          {/* PERFIL SECUNDÁRIO */}
          {secundario && (
            <Animatable.View animation="fadeInUp" delay={400} style={s.card}>
              <View style={s.cardHeader}>
                <LinearGradient colors={secundario.gradient} style={s.cardIconBox}>
                  <MaterialCommunityIcons name="layers-triple-outline" size={14} color="#fff"/>
                </LinearGradient>
                <View style={{flex:1}}>
                  <Text style={s.cardTitle}>Perfil secundário forte</Text>
                  <Text style={s.chartSub}>{secundario.pct}% da sua pontuação</Text>
                </View>
              </View>
              <LinearGradient colors={[secundario.gradient[0]+'15',secundario.gradient[1]+'08']} style={s.secondaryBox}>
                <Text style={{fontSize:28}}>{secundario.emoji}</Text>
                <View style={{flex:1}}>
                  <Text style={[s.secondaryNome,{color:secundario.gradient[0]}]}>{secundario.nome}</Text>
                  <Text style={s.secondaryDesc}>{secundario.tagline}</Text>
                </View>
              </LinearGradient>
              {perfil.insightCombinado[secundario.key] && (
                <View style={[s.insightBox,{backgroundColor:perfil.bgLight,borderColor:perfil.gradient[0]+'33'}]}>
                  <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color={perfil.corAccent}/>
                  <Text style={[s.insightTxt,{color:perfil.corAccent}]}>{perfil.insightCombinado[secundario.key]}</Text>
                </View>
              )}
            </Animatable.View>
          )}

          {/* QUEM É VOCÊ */}
          <Animatable.View animation="fadeInUp" delay={450} style={s.card}>
            <View style={s.cardHeader}>
              <LinearGradient colors={perfil.gradient} style={s.cardIconBox}>
                <MaterialCommunityIcons name="account-outline" size={14} color="#fff"/>
              </LinearGradient>
              <Text style={s.cardTitle}>Quem é você profissionalmente</Text>
            </View>
            <Text style={s.cardBody}>{perfil.desc}</Text>
            <View style={{height:1,backgroundColor:'#F1F5F9',marginVertical:14}}/>
            <Text style={[s.cardSubsection,{color:perfil.corAccent}]}>Seus pontos fortes</Text>
            {perfil.pontos.map((pt,i) => (
              <Animatable.View key={i} animation="fadeInLeft" delay={550+i*80} style={s.pontoRow}>
                <LinearGradient colors={perfil.gradient} style={s.pontoDot}/>
                <Text style={s.pontoTxt}>{pt}</Text>
              </Animatable.View>
            ))}
          </Animatable.View>

          {/* SOFT SKILLS */}
          <Animatable.View animation="fadeInUp" delay={500} style={s.card}>
            <View style={s.cardHeader}>
              <LinearGradient colors={perfil.gradient} style={s.cardIconBox}>
                <MaterialCommunityIcons name="emoticon-happy-outline" size={14} color="#fff"/>
              </LinearGradient>
              <Text style={s.cardTitle}>Suas soft skills naturais</Text>
            </View>
            <View style={s.softGrid}>
              {perfil.softSkills.map((sk,i) => (
                <Animatable.View key={i} animation="zoomIn" delay={600+i*80}>
                  <LinearGradient colors={[perfil.gradient[0]+'22',perfil.gradient[1]+'11']} style={[s.softChip,{borderColor:perfil.gradient[0]+'44'}]}>
                    <Text style={[s.softChipTxt,{color:perfil.gradient[0]}]}>{sk}</Text>
                  </LinearGradient>
                </Animatable.View>
              ))}
            </View>
          </Animatable.View>

          {/* CARREIRAS */}
          <Animatable.View animation="fadeInUp" delay={550} style={s.card}>
            <View style={s.cardHeader}>
              <LinearGradient colors={perfil.gradient} style={s.cardIconBox}>
                <MaterialCommunityIcons name="briefcase-outline" size={14} color="#fff"/>
              </LinearGradient>
              <Text style={s.cardTitle}>Carreiras que combinam com você</Text>
            </View>
            <View style={s.areasGrid}>
              {perfil.areas.map((area,i) => (
                <Animatable.View key={i} animation="zoomIn" delay={650+i*60} style={s.areaChip}>
                  <View style={[s.areaChipInner,{borderColor:area.cor+'33',backgroundColor:area.cor+'0D'}]}>
                    <MaterialCommunityIcons name={area.icone} size={22} color={area.cor}/>
                    <Text style={[s.areaChipTxt,{color:area.cor}]}>{area.nome}</Text>
                  </View>
                </Animatable.View>
              ))}
            </View>
          </Animatable.View>

          {/* MERCADO */}
          <Animatable.View animation="fadeInUp" delay={600} style={s.card}>
            <View style={s.cardHeader}>
              <LinearGradient colors={perfil.gradient} style={s.cardIconBox}>
                <MaterialCommunityIcons name="chart-line-variant" size={14} color="#fff"/>
              </LinearGradient>
              <Text style={s.cardTitle}>Perspectiva de mercado</Text>
            </View>
            <Text style={s.mercadoLabel}>Aquecimento do setor</Text>
            <View style={[s.mercadoTrack,{marginVertical:6}]}>
              <Animatable.View animation="slideInLeft" delay={700} style={[s.mercadoBar,{width:`${perfil.crescimento}%`,overflow:'hidden'}]}>
                <LinearGradient colors={perfil.gradient} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill}/>
              </Animatable.View>
            </View>
            <Text style={[s.mercadoPct,{color:perfil.corAccent}]}>{perfil.crescimento}%</Text>
            <View style={[s.mercadoBadges,{marginTop:12}]}>
              <View style={[s.mercadoBadge,{backgroundColor:perfil.corAccent+'15'}]}>
                <MaterialCommunityIcons name="trending-up" size={14} color={perfil.corAccent}/>
                <Text style={[s.mercadoBadgeTxt,{color:perfil.corAccent}]}>{perfil.mercado}</Text>
              </View>
              <View style={[s.mercadoBadge,{backgroundColor:'#0596691A'}]}>
                <MaterialCommunityIcons name="cash-multiple" size={14} color="#059669"/>
                <Text style={[s.mercadoBadgeTxt,{color:'#059669'}]}>{perfil.salario}</Text>
              </View>
            </View>
          </Animatable.View>

          {/* DICA */}
          <Animatable.View animation="fadeInUp" delay={650} style={[s.card,{backgroundColor:perfil.bgLight}]}>
            <View style={s.cardHeader}>
              <LinearGradient colors={perfil.gradient} style={s.cardIconBox}>
                <MaterialCommunityIcons name="lightbulb-outline" size={14} color="#fff"/>
              </LinearGradient>
              <Text style={s.cardTitle}>Dica para o seu currículo</Text>
            </View>
            <Text style={s.dicaTxt}>{perfil.dica}</Text>
          </Animatable.View>

          {/* AÇÕES */}
          <Animatable.View animation="fadeInUp" delay={700} style={s.resultActions}>
            <TouchableOpacity onPress={() => navigation.navigate('CriarCurrículo')} activeOpacity={0.88} style={s.ctaOuter}>
              <LinearGradient colors={perfil.gradient} start={{x:0,y:0}} end={{x:1,y:0}} style={s.ctaBtn}>
                <MaterialCommunityIcons name="file-plus-outline" size={20} color="#fff"/>
                <Text style={s.ctaBtnTxt}>Criar currículo para este perfil</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalHistorico(true)} activeOpacity={0.8} style={[s.refazBtn,{backgroundColor:'#EDE9FE'}]}>
              <MaterialCommunityIcons name="history" size={17} color="#7C3AED"/>
              <Text style={[s.refazTxt,{color:'#7C3AED'}]}>Ver histórico ({historico.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={reiniciar} activeOpacity={0.8} style={s.refazBtn}>
              <MaterialCommunityIcons name="refresh" size={17} color="#64748B"/>
              <Text style={s.refazTxt}>Refazer o quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={s.voltarBtn}>
              <Text style={s.voltarTxt}>Voltar ao início</Text>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── QUIZ ─────────────────────────────────────────────────────────────────────
  const pergunta = perguntas[perguntaAtual];
  const progresso = perguntaAtual / perguntas.length;

  return (
    <SafeAreaView style={s.safe} edges={['top','bottom']}>
      <View style={s.quizHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.quizBack} hitSlop={{top:12,bottom:12,left:12,right:12}}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#1E293B"/>
        </TouchableOpacity>
        <View style={s.progressArea}>
          <View style={s.progressTopRow}>
            <Text style={s.progressLabel}>Pergunta {perguntaAtual+1} de {perguntas.length}</Text>
            <Text style={s.progressCat}>{pergunta.cat}</Text>
          </View>
          <View style={s.progressTrack}>
            <View style={[s.progressBar,{width:`${progresso*100}%`}]}>
              <LinearGradient colors={['#7C3AED','#3B82F6']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFill}/>
            </View>
          </View>
        </View>
        <Text style={s.progressPct}>{Math.round(progresso*100)}%</Text>
      </View>

      <ScrollView contentContainerStyle={s.quizScroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{opacity:fadeAnim,transform:[{translateY:slideAnim}]}}>
          <View style={s.questionBox}>
            <LinearGradient colors={['#7C3AED','#3B82F6']} style={s.questionNumBadge}>
              <Text style={s.questionNumTxt}>{perguntaAtual+1}</Text>
            </LinearGradient>
            <Text style={s.questionText}>{pergunta.pergunta}</Text>
          </View>
          <View style={s.opcoesGrid}>
            {pergunta.opcoes.map((opcao,idx) => {
              const sel = opcaoSelecionada === opcao;
              return (
                <TouchableOpacity key={idx} style={[s.opcaoCard,sel&&s.opcaoCardSel]} onPress={() => responder(opcao)} activeOpacity={0.8}>
                  {sel && <LinearGradient colors={['rgba(124,58,237,0.1)','rgba(59,130,246,0.04)']} style={StyleSheet.absoluteFill}/>}
                  <View style={[s.opcaoIconBox,sel&&s.opcaoIconBoxSel]}>
                    <MaterialCommunityIcons name={opcao.icone} size={24} color={sel?'#fff':'#7C3AED'}/>
                  </View>
                  <Text style={[s.opcaoText,sel&&s.opcaoTextSel]}>{opcao.texto}</Text>
                  {sel && <View style={s.checkMark}><MaterialCommunityIcons name="check" size={13} color="#fff"/></View>}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#F8FAFC'},
  introHero:{paddingTop:60,paddingBottom:44,paddingHorizontal:24,alignItems:'center',overflow:'hidden'},
  blob:{position:'absolute',borderRadius:999,backgroundColor:'rgba(255,255,255,0.08)'},
  introBack:{position:'absolute',top:16,left:16,zIndex:10,width:38,height:38,borderRadius:12,backgroundColor:'rgba(255,255,255,0.2)',justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'rgba(255,255,255,0.25)'},
  introHistBtn:{position:'absolute',top:16,right:16,zIndex:10,flexDirection:'row',alignItems:'center',gap:4,backgroundColor:'rgba(255,255,255,0.2)',paddingVertical:7,paddingHorizontal:10,borderRadius:12,borderWidth:1,borderColor:'rgba(255,255,255,0.25)'},
  introHistTxt:{color:'#fff',fontSize:12,fontWeight:'800'},
  heroIconBox:{width:100,height:100,borderRadius:28,backgroundColor:'rgba(255,255,255,0.18)',justifyContent:'center',alignItems:'center',borderWidth:2,borderColor:'rgba(255,255,255,0.3)',marginBottom:22},
  heroTitle:{color:'#fff',fontSize:28,fontWeight:'900',textAlign:'center',lineHeight:34,marginBottom:12},
  heroSub:{color:'rgba(255,255,255,0.8)',fontSize:14,textAlign:'center',lineHeight:20,marginBottom:28},
  featRow:{flexDirection:'row',gap:10},
  featPill:{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'rgba(255,255,255,0.15)',paddingVertical:7,paddingHorizontal:11,borderRadius:20,borderWidth:1,borderColor:'rgba(255,255,255,0.2)'},
  featTxt:{color:'#fff',fontSize:12,fontWeight:'700'},
  section:{paddingHorizontal:16,paddingTop:22},
  sectionTitle:{fontSize:14,fontWeight:'800',color:'#1E293B',marginBottom:14},
  perfisGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},
  perfilChip:{flexDirection:'row',alignItems:'center',gap:8,paddingVertical:10,paddingHorizontal:12,borderRadius:14,elevation:2,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.12,shadowRadius:4},
  perfilChipTxt:{color:'#fff',fontSize:11,fontWeight:'800'},
  perfilChipTagline:{color:'rgba(255,255,255,0.7)',fontSize:9,fontWeight:'500',marginTop:1},
  verTodosBtn:{paddingVertical:4,paddingHorizontal:8,backgroundColor:'#EDE9FE',borderRadius:8},
  verTodosTxt:{fontSize:11,fontWeight:'700',color:'#7C3AED'},
  ultResultBox:{flexDirection:'row',alignItems:'center',gap:14,padding:14,borderRadius:14,borderWidth:1,borderColor:'#E2E8F0'},
  ultResultNome:{fontSize:15,fontWeight:'800',marginBottom:3},
  ultResultDesc:{fontSize:11,color:'#64748B',lineHeight:15},
  startWrap:{paddingHorizontal:16,paddingTop:26,alignItems:'center'},
  startOuter:{width:'100%',borderRadius:18,overflow:'hidden',elevation:6,shadowColor:'#4F46E5',shadowOffset:{width:0,height:6},shadowOpacity:0.3,shadowRadius:10},
  startBtn:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,paddingVertical:18},
  startBtnTxt:{color:'#fff',fontSize:17,fontWeight:'900'},
  startNote:{marginTop:12,color:'#94A3B8',fontSize:12,fontWeight:'500',textAlign:'center'},
  quizHeader:{flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:16,paddingVertical:12,backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#E2E8F0'},
  quizBack:{width:38,height:38,borderRadius:11,backgroundColor:'#F1F5F9',justifyContent:'center',alignItems:'center'},
  progressArea:{flex:1},
  progressTopRow:{flexDirection:'row',justifyContent:'space-between',marginBottom:6},
  progressLabel:{fontSize:11,fontWeight:'700',color:'#64748B'},
  progressCat:{fontSize:10,fontWeight:'600',color:'#7C3AED'},
  progressTrack:{height:6,backgroundColor:'#E2E8F0',borderRadius:3,overflow:'hidden'},
  progressBar:{height:6,borderRadius:3,overflow:'hidden'},
  progressPct:{fontSize:13,fontWeight:'900',color:'#7C3AED',minWidth:34,textAlign:'right'},
  quizScroll:{padding:16,paddingBottom:40},
  questionBox:{backgroundColor:'#fff',borderRadius:20,padding:20,marginBottom:16,elevation:3,shadowColor:'#7C3AED',shadowOffset:{width:0,height:4},shadowOpacity:0.1,shadowRadius:10},
  questionNumBadge:{width:36,height:36,borderRadius:10,justifyContent:'center',alignItems:'center',marginBottom:12},
  questionNumTxt:{color:'#fff',fontSize:16,fontWeight:'900'},
  questionText:{fontSize:17,fontWeight:'800',color:'#1E293B',lineHeight:24},
  opcoesGrid:{gap:10},
  opcaoCard:{backgroundColor:'#fff',borderRadius:16,paddingVertical:14,paddingHorizontal:14,flexDirection:'row',alignItems:'center',gap:12,borderWidth:2,borderColor:'#E2E8F0',overflow:'hidden',elevation:1,shadowColor:'#000',shadowOffset:{width:0,height:1},shadowOpacity:0.05,shadowRadius:3},
  opcaoCardSel:{borderColor:'#7C3AED',elevation:4,shadowColor:'#7C3AED',shadowOpacity:0.18},
  opcaoIconBox:{width:48,height:48,borderRadius:14,backgroundColor:'#EDE9FE',justifyContent:'center',alignItems:'center',flexShrink:0},
  opcaoIconBoxSel:{backgroundColor:'#7C3AED'},
  opcaoText:{flex:1,fontSize:13,fontWeight:'600',color:'#334155',lineHeight:18},
  opcaoTextSel:{color:'#4C1D95',fontWeight:'800'},
  checkMark:{width:22,height:22,borderRadius:11,backgroundColor:'#7C3AED',justifyContent:'center',alignItems:'center',flexShrink:0},
  resultHero:{paddingTop:52,paddingBottom:36,paddingHorizontal:24,alignItems:'center',overflow:'hidden'},
  resultIconBox:{width:96,height:96,borderRadius:26,backgroundColor:'rgba(255,255,255,0.2)',justifyContent:'center',alignItems:'center',borderWidth:2,borderColor:'rgba(255,255,255,0.35)',marginBottom:14},
  resultLabel:{color:'rgba(255,255,255,0.72)',fontSize:13,fontWeight:'600',marginBottom:6},
  resultNome:{color:'#fff',fontSize:24,fontWeight:'900',textAlign:'center',lineHeight:30,marginBottom:6},
  resultTagline:{color:'rgba(255,255,255,0.75)',fontSize:13,textAlign:'center',fontStyle:'italic',marginBottom:16,lineHeight:18},
  resultBadgeRow:{flexDirection:'row',gap:8,flexWrap:'wrap',justifyContent:'center'},
  resultBadge:{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'rgba(255,255,255,0.2)',paddingVertical:6,paddingHorizontal:10,borderRadius:20,borderWidth:1,borderColor:'rgba(255,255,255,0.25)'},
  resultBadgeTxt:{color:'#fff',fontSize:11,fontWeight:'700'},
  card:{backgroundColor:'#fff',borderRadius:20,padding:18,marginHorizontal:16,marginTop:14,elevation:2,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.07,shadowRadius:6},
  cardHeader:{flexDirection:'row',alignItems:'center',gap:10,marginBottom:12},
  cardIconBox:{width:30,height:30,borderRadius:8,justifyContent:'center',alignItems:'center'},
  cardTitle:{fontSize:14,fontWeight:'800',color:'#1E293B',flex:1},
  cardBody:{fontSize:14,lineHeight:21,color:'#475569'},
  cardSubsection:{fontSize:12,fontWeight:'800',letterSpacing:0.5,marginBottom:10},
  chartSub:{fontSize:11,color:'#94A3B8',marginTop:2},
  barRow:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:10},
  barLabelWrap:{width:90,flexDirection:'row',alignItems:'center',gap:4,flexShrink:0},
  barEmoji:{fontSize:14},
  barLabelTxt:{fontSize:10,fontWeight:'600',color:'#64748B',flexShrink:1},
  topBadge:{paddingHorizontal:4,paddingVertical:1,borderRadius:4},
  topBadgeTxt:{color:'#fff',fontSize:8,fontWeight:'900'},
  barTrack:{flex:1,height:9,backgroundColor:'#F1F5F9',borderRadius:5,overflow:'hidden'},
  barFill:{height:9,borderRadius:5},
  barPct:{fontSize:11,fontWeight:'800',minWidth:28,textAlign:'right'},
  chartNote:{flexDirection:'row',alignItems:'center',gap:5,marginTop:8,paddingTop:10,borderTopWidth:1,borderTopColor:'#F1F5F9'},
  chartNoteTxt:{fontSize:11,color:'#94A3B8'},
  secondaryBox:{flexDirection:'row',alignItems:'center',gap:14,padding:14,borderRadius:14,borderWidth:1,borderColor:'#E2E8F0'},
  secondaryNome:{fontSize:14,fontWeight:'800',marginBottom:4},
  secondaryDesc:{fontSize:12,lineHeight:17,color:'#64748B'},
  insightBox:{flexDirection:'row',alignItems:'flex-start',gap:8,padding:12,borderRadius:12,borderWidth:1,marginTop:12},
  insightTxt:{flex:1,fontSize:12,fontWeight:'700',lineHeight:17},
  pontoRow:{flexDirection:'row',alignItems:'flex-start',gap:10,marginBottom:8},
  pontoDot:{width:8,height:8,borderRadius:4,marginTop:5,flexShrink:0},
  pontoTxt:{flex:1,fontSize:13,lineHeight:19,color:'#334155',fontWeight:'600'},
  softGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},
  softChip:{paddingVertical:8,paddingHorizontal:14,borderRadius:20,borderWidth:1},
  softChipTxt:{fontSize:13,fontWeight:'700'},
  areasGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},
  areaChip:{width:(width-80)/2},
  areaChipInner:{padding:12,borderRadius:12,alignItems:'center',gap:6,borderWidth:1},
  areaChipTxt:{fontSize:11,fontWeight:'700',textAlign:'center',lineHeight:15},
  mercadoLabel:{fontSize:12,fontWeight:'700',color:'#64748B'},
  mercadoTrack:{height:10,backgroundColor:'#F1F5F9',borderRadius:5,overflow:'hidden'},
  mercadoBar:{height:10,borderRadius:5},
  mercadoPct:{fontSize:13,fontWeight:'900',textAlign:'right'},
  mercadoBadges:{flexDirection:'row',gap:10,flexWrap:'wrap'},
  mercadoBadge:{flexDirection:'row',alignItems:'center',gap:6,paddingVertical:8,paddingHorizontal:12,borderRadius:10},
  mercadoBadgeTxt:{fontSize:12,fontWeight:'700'},
  dicaTxt:{fontSize:14,lineHeight:21,color:'#475569',fontStyle:'italic'},
  resultActions:{paddingHorizontal:16,paddingTop:18,gap:10},
  ctaOuter:{borderRadius:16,overflow:'hidden',elevation:4,shadowColor:'#000',shadowOffset:{width:0,height:3},shadowOpacity:0.12,shadowRadius:6},
  ctaBtn:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,paddingVertical:17},
  ctaBtnTxt:{color:'#fff',fontSize:15,fontWeight:'900'},
  refazBtn:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,paddingVertical:14,borderRadius:14,backgroundColor:'#F1F5F9'},
  refazTxt:{fontSize:14,fontWeight:'700',color:'#64748B'},
  voltarBtn:{alignItems:'center',paddingVertical:8},
  voltarTxt:{fontSize:13,color:'#94A3B8',fontWeight:'600'},
  modalHeader:{flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:16,paddingVertical:12,backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#E2E8F0'},
  modalTitle:{flex:1,fontSize:15,fontWeight:'800',color:'#1E293B'},
  emptyHistorico:{flex:1,alignItems:'center',justifyContent:'center',paddingTop:80,gap:12},
  emptyTitle:{fontSize:16,fontWeight:'800',color:'#1E293B'},
  emptyDesc:{fontSize:13,color:'#94A3B8'},
  histCard:{flexDirection:'row',alignItems:'center',gap:14,padding:16,borderRadius:18,borderWidth:1,borderColor:'#E2E8F0'},
  histIconBox:{width:60,height:60,borderRadius:18,justifyContent:'center',alignItems:'center',flexShrink:0},
  histPerfilNome:{fontSize:14,fontWeight:'800'},
  histData:{fontSize:11,color:'#94A3B8',marginTop:2},
  histBadge:{paddingHorizontal:6,paddingVertical:2,borderRadius:6},
  histBadgeTxt:{color:'#fff',fontSize:9,fontWeight:'800'},
  histRankBadge:{flexDirection:'row',alignItems:'center',gap:3,paddingHorizontal:6,paddingVertical:3,borderRadius:8},
  histRankTxt:{fontSize:10,fontWeight:'700'},
  histDetalheHero:{paddingVertical:32,alignItems:'center',gap:8},
  histDetalhePerfil:{fontSize:20,fontWeight:'900',color:'#fff'},
  histDetalheData:{fontSize:12,color:'rgba(255,255,255,0.7)'},
});
