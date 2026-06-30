import React, { useContext, useState, useRef } from 'react';
import {
  StyleSheet, ScrollView, View, Linking, Dimensions,
  TouchableOpacity, Platform,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

/* ─────────────────────────────────────────────────────────────
   DADOS DAS PLATAFORMAS  (sem SVG externo — ícone emoji + color)
   ───────────────────────────────────────────────────────────── */
const PLATFORMS = [
  {
    key: 'linkedin',
    emoji: '💼',
    gradient: ['#0A66C2', '#004182'],
    url: 'https://www.linkedin.com/jobs',
    category: 'global',
    stars: 5,
    competition: 'alta',
    salary: 'R$ 3k–25k+',
    workTypes: ['CLT', 'PJ', 'Remoto', 'Híbrido'],
    bestFor: ['Analistas', 'Gestores', 'Devs', 'Marketing'],
    quickTip: 'Perfil 100% preenchido recebe 40x mais visualizações de recrutadores.',
    stats: { users: '950M+', countries: '200+', jobs: '15M+' },
    statsLabels: { users: 'Usuários', countries: 'Países', jobs: 'Vagas' },
    content: {
      'pt-BR': {
        name: 'LinkedIn',
        desc: 'A maior rede profissional do mundo. Ideal para networking, candidaturas e visibilidade de carreira em qualquer área.',
        tips: [
          { icon: 'camera-account', text: 'Adicione foto profissional — perfis com foto recebem 14x mais visualizações' },
          { icon: 'bullseye-arrow', text: 'Ative "Open to Work" para aparecer para recrutadores ativos na sua área' },
          { icon: 'handshake-outline', text: 'Conecte-se com pessoas da sua área e comente posts relevantes' },
          { icon: 'star-outline', text: 'Peça recomendações a ex-colegas e gestores para aumentar credibilidade' },
          { icon: 'bell-ring-outline', text: 'Configure alertas de vagas por palavra-chave, cidade e nível de experiência' },
        ],
        tag: 'Rede Profissional Global',
      },
      en: {
        name: 'LinkedIn',
        desc: 'The world\'s largest professional network. Ideal for networking, job applications and career visibility.',
        tips: [
          { icon: 'camera-account', text: 'Add a professional photo — profiles with photos get 14x more views' },
          { icon: 'bullseye-arrow', text: 'Enable "Open to Work" to appear to active recruiters in your field' },
          { icon: 'handshake-outline', text: 'Connect with people in your field and comment on relevant posts' },
          { icon: 'star-outline', text: 'Ask former colleagues and managers for recommendations' },
          { icon: 'bell-ring-outline', text: 'Set up job alerts by keyword, city and experience level' },
        ],
        tag: 'Global Professional Network',
      },
      es: {
        name: 'LinkedIn',
        desc: 'La mayor red profesional del mundo. Ideal para networking, candidaturas y visibilidad de carrera.',
        tips: [
          { icon: 'camera-account', text: 'Agrega foto profesional — perfiles con foto reciben 14x más vistas' },
          { icon: 'bullseye-arrow', text: 'Activa "Open to Work" para aparecer ante reclutadores activos' },
          { icon: 'handshake-outline', text: 'Conéctate con personas de tu área y comenta publicaciones relevantes' },
          { icon: 'star-outline', text: 'Pide recomendaciones a ex-colegas y managers' },
          { icon: 'bell-ring-outline', text: 'Configura alertas de empleo por palabras clave y ciudad' },
        ],
        tag: 'Red Profesional Global',
      },
    },
  },
  {
    key: 'indeed',
    emoji: '🔍',
    gradient: ['#2557A7', '#003A8C'],
    url: 'https://www.indeed.com',
    category: 'global',
    stars: 5,
    competition: 'alta',
    salary: 'R$ 1,5k–20k+',
    workTypes: ['CLT', 'PJ', 'Temporário', 'Remoto'],
    bestFor: ['Todas as áreas', 'Iniciantes', 'Sêniors'],
    quickTip: 'Currículos cadastrados no Indeed recebem candidaturas com apenas 1 clique.',
    stats: { users: '350M+', countries: '60+', jobs: '250M+' },
    statsLabels: { users: 'Visitantes/mês', countries: 'Países', jobs: 'Vagas publicadas' },
    content: {
      'pt-BR': {
        name: 'Indeed',
        desc: 'Maior motor de busca de empregos do mundo. Agrega vagas de centenas de sites em um só lugar.',
        tips: [
          { icon: 'magnify', text: 'Use aspas para buscas exatas: "desenvolvedor front-end" filtra resultados precisos' },
          { icon: 'file-account-outline', text: 'Cadastre seu currículo para candidatura com 1 clique em milhares de vagas' },
          { icon: 'bell-outline', text: 'Ative alertas de emprego para receber novas vagas diretamente no e-mail' },
          { icon: 'star-half-full', text: 'Leia avaliações de funcionários antes de se candidatar — nota média e cultura' },
          { icon: 'map-marker-outline', text: 'Filtre por distância máxima da sua casa para vagas presenciais' },
        ],
        tag: 'Maior Buscador de Vagas',
      },
      en: {
        name: 'Indeed',
        desc: 'The world\'s largest job search engine. Aggregates listings from hundreds of sites in one place.',
        tips: [
          { icon: 'magnify', text: 'Use quotes for exact searches: "front-end developer" filters precise results' },
          { icon: 'file-account-outline', text: 'Upload your resume for 1-click applications on thousands of jobs' },
          { icon: 'bell-outline', text: 'Set up job alerts to receive new openings directly by email' },
          { icon: 'star-half-full', text: 'Read employee reviews before applying — average rating and culture' },
          { icon: 'map-marker-outline', text: 'Filter by maximum distance from home for on-site jobs' },
        ],
        tag: 'Largest Job Search Engine',
      },
      es: {
        name: 'Indeed',
        desc: 'El mayor motor de búsqueda de empleo del mundo. Agrega ofertas de cientos de sitios.',
        tips: [
          { icon: 'magnify', text: 'Usa comillas para búsquedas exactas: "desarrollador front-end"' },
          { icon: 'file-account-outline', text: 'Sube tu currículum para postulaciones con 1 clic' },
          { icon: 'bell-outline', text: 'Activa alertas de empleo por correo electrónico' },
          { icon: 'star-half-full', text: 'Lee reseñas de empleados antes de postularte' },
          { icon: 'map-marker-outline', text: 'Filtra por distancia máxima de tu casa para trabajos presenciales' },
        ],
        tag: 'Mayor Buscador de Empleo',
      },
    },
  },
  {
    key: 'glassdoor',
    emoji: '🪟',
    gradient: ['#0CAA41', '#077A2E'],
    url: 'https://www.glassdoor.com',
    category: 'global',
    stars: 4,
    competition: 'media',
    salary: 'Consulte por cargo',
    workTypes: ['CLT', 'PJ', 'Remoto'],
    bestFor: ['Pesquisa Salarial', 'Devs', 'Analistas'],
    quickTip: 'Consulte o salário médio do cargo ANTES da entrevista e negocie com segurança.',
    stats: { users: '67M+', countries: '190+', jobs: '10M+' },
    statsLabels: { users: 'Usuários/mês', countries: 'Países', jobs: 'Vagas' },
    content: {
      'pt-BR': {
        name: 'Glassdoor',
        desc: 'Vagas + avaliações reais de funcionários sobre salário, cultura e processos seletivos — transparência total.',
        tips: [
          { icon: 'account-group-outline', text: 'Leia avaliações reais de funcionários sobre a empresa antes de aceitar uma oferta' },
          { icon: 'currency-usd', text: 'Consulte faixas salariais por cargo e cidade para negociar com confiança' },
          { icon: 'help-circle-outline', text: 'Veja perguntas feitas nas entrevistas dessa empresa — se prepare melhor' },
          { icon: 'thumb-up-outline', text: 'Avalie empresas onde trabalhou para ajudar outros profissionais' },
          { icon: 'chart-line', text: 'Acompanhe tendências de salários para saber se seu mercado está aquecido' },
        ],
        tag: 'Avaliações + Salários',
      },
      en: {
        name: 'Glassdoor',
        desc: 'Jobs + real employee reviews about salaries, culture and hiring processes — full transparency.',
        tips: [
          { icon: 'account-group-outline', text: 'Read real employee reviews about the company before accepting an offer' },
          { icon: 'currency-usd', text: 'Check salary ranges by role and city to negotiate with confidence' },
          { icon: 'help-circle-outline', text: 'See questions asked in this company\'s interviews — prepare better' },
          { icon: 'thumb-up-outline', text: 'Review companies you\'ve worked for to help other professionals' },
          { icon: 'chart-line', text: 'Follow salary trends to know if your market is heating up' },
        ],
        tag: 'Reviews + Salaries',
      },
      es: {
        name: 'Glassdoor',
        desc: 'Ofertas + reseñas reales de empleados sobre salarios, cultura y procesos de selección.',
        tips: [
          { icon: 'account-group-outline', text: 'Lee reseñas reales de empleados antes de aceptar una oferta' },
          { icon: 'currency-usd', text: 'Consulta rangos salariales por cargo y ciudad para negociar con confianza' },
          { icon: 'help-circle-outline', text: 'Ve preguntas de entrevistas de esa empresa — prepárate mejor' },
          { icon: 'thumb-up-outline', text: 'Evalúa empresas en las que trabajaste para ayudar a otros' },
          { icon: 'chart-line', text: 'Sigue tendencias de salarios para saber si tu mercado está en alza' },
        ],
        tag: 'Reseñas + Salarios',
      },
    },
  },
  {
    key: 'vagas',
    emoji: '🇧🇷',
    gradient: ['#009A44', '#007A35'],
    url: 'https://www.vagas.com.br',
    category: 'brasil',
    stars: 4,
    competition: 'media',
    salary: 'R$ 2k–18k',
    workTypes: ['CLT', 'PJ', 'Estágio'],
    bestFor: ['Pleno/Sênior', 'Gestores', 'Engenheiros'],
    quickTip: 'Foco em vagas de nível médio a sênior — perfeito para quem quer crescer na carreira.',
    stats: { users: '6M+', countries: '1', jobs: '50K+' },
    statsLabels: { users: 'Candidatos', countries: 'País', jobs: 'Vagas ativas' },
    content: {
      'pt-BR': {
        name: 'Vagas.com.br',
        desc: 'Uma das maiores plataformas de empregos do Brasil, com foco em vagas de nível médio a sênior.',
        tips: [
          { icon: 'file-document-edit-outline', text: 'Cadastre um currículo detalhado — mais completo = mais visibilidade para recrutadores' },
          { icon: 'filter-outline', text: 'Use filtros por área, cidade, regime (CLT/PJ) e faixa salarial' },
          { icon: 'send-outline', text: 'Candidate-se a múltiplas vagas na mesma área para aumentar chances' },
          { icon: 'eye-outline', text: 'Acompanhe o status das candidaturas — saiba quando seu currículo foi visualizado' },
          { icon: 'domain', text: 'Explore vagas por empresa — muitas grandes marcas brasileiras publicam aqui primeiro' },
        ],
        tag: '🇧🇷 Foco no Brasil',
      },
      en: {
        name: 'Vagas.com.br',
        desc: 'One of Brazil\'s largest job platforms, focused on mid to senior level positions.',
        tips: [
          { icon: 'file-document-edit-outline', text: 'Register a detailed resume — more complete = more recruiter visibility' },
          { icon: 'filter-outline', text: 'Use filters by area, city, contract type and salary range' },
          { icon: 'send-outline', text: 'Apply to multiple openings in the same field to increase chances' },
          { icon: 'eye-outline', text: 'Track application status — know when your resume was viewed' },
          { icon: 'domain', text: 'Browse by company — many major Brazilian brands post here first' },
        ],
        tag: '🇧🇷 Brazil Focus',
      },
      es: {
        name: 'Vagas.com.br',
        desc: 'Una de las mayores plataformas de empleo de Brasil, con foco en niveles medio a senior.',
        tips: [
          { icon: 'file-document-edit-outline', text: 'Registra un currículum detallado para mayor visibilidad ante reclutadores' },
          { icon: 'filter-outline', text: 'Usa filtros por área, ciudad, régimen y rango salarial' },
          { icon: 'send-outline', text: 'Postúlate a múltiples ofertas en la misma área para más chances' },
          { icon: 'eye-outline', text: 'Consulta el estado de tus candidaturas — sabe cuándo te vieron' },
          { icon: 'domain', text: 'Explora ofertas por empresa — grandes marcas brasileñas publican aquí primero' },
        ],
        tag: '🇧🇷 Foco en Brasil',
      },
    },
  },
  {
    key: 'catho',
    emoji: '🐱',
    gradient: ['#E63946', '#C1121F'],
    url: 'https://www.catho.com.br',
    category: 'brasil',
    stars: 4,
    competition: 'alta',
    salary: 'R$ 1,5k–15k',
    workTypes: ['CLT', 'PJ', 'Estágio', 'Temporário'],
    bestFor: ['Iniciantes', 'Operacional', 'Administrativo'],
    quickTip: 'A IA da Catho analisa seu currículo e mostra sua compatibilidade com cada vaga.',
    stats: { users: '23M+', countries: '1', jobs: '30K+' },
    statsLabels: { users: 'Cadastrados', countries: 'País', jobs: 'Vagas/mês' },
    content: {
      'pt-BR': {
        name: 'Catho',
        desc: 'Plataforma brasileira com grande volume de vagas e ferramentas de análise de currículo com IA — veja sua compatibilidade.',
        tips: [
          { icon: 'robot-outline', text: 'Use a análise de currículo com IA — ela aponta pontos a melhorar antes de candidatar' },
          { icon: 'percent', text: 'Veja o percentual de compatibilidade com cada vaga para focar onde tem mais chance' },
          { icon: 'bell-badge-outline', text: 'Cadastre alertas para ser notificado assim que novas vagas aparecerem' },
          { icon: 'school-outline', text: 'Acesse cursos gratuitos de carreira disponíveis na própria plataforma' },
          { icon: 'clipboard-text-outline', text: 'Mantenha seu currículo atualizado — perfis ativos recebem mais convites' },
        ],
        tag: '🇧🇷 IA para Currículo',
      },
      en: {
        name: 'Catho',
        desc: 'Brazilian platform with a high volume of jobs and AI-powered resume analysis — see your compatibility.',
        tips: [
          { icon: 'robot-outline', text: 'Use AI resume analysis — it shows areas to improve before applying' },
          { icon: 'percent', text: 'See your compatibility % with each job to focus where you have the best shot' },
          { icon: 'bell-badge-outline', text: 'Set up alerts to be notified as soon as new jobs appear' },
          { icon: 'school-outline', text: 'Access free career courses available on the platform' },
          { icon: 'clipboard-text-outline', text: 'Keep your resume updated — active profiles receive more invitations' },
        ],
        tag: '🇧🇷 AI Resume Analysis',
      },
      es: {
        name: 'Catho',
        desc: 'Plataforma brasileña con gran volumen de ofertas y análisis de currículum con IA.',
        tips: [
          { icon: 'robot-outline', text: 'Usa el análisis de currículum con IA para mejorar antes de postularte' },
          { icon: 'percent', text: 'Ve el porcentaje de compatibilidad con cada oferta para enfocarte mejor' },
          { icon: 'bell-badge-outline', text: 'Configura alertas para recibir nuevas ofertas al instante' },
          { icon: 'school-outline', text: 'Accede a cursos gratuitos de carrera en la plataforma' },
          { icon: 'clipboard-text-outline', text: 'Mantén tu currículum actualizado — perfiles activos reciben más invitaciones' },
        ],
        tag: '🇧🇷 IA para Currículum',
      },
    },
  },
  {
    key: 'infojobs',
    emoji: '🌐',
    gradient: ['#FF6B35', '#E84F1A'],
    url: 'https://www.infojobs.com.br',
    category: 'brasil',
    stars: 4,
    competition: 'baixa',
    salary: 'R$ 2k–20k',
    workTypes: ['CLT', 'PJ', 'Internacional'],
    bestFor: ['Bilíngues', 'TI', 'Engenharia'],
    quickTip: 'Única plataforma com vagas simultâneas no Brasil, Espanha e Itália.',
    stats: { users: '4M+', countries: '3', jobs: '20K+' },
    statsLabels: { users: 'Usuários', countries: 'Países', jobs: 'Vagas ativas' },
    content: {
      'pt-BR': {
        name: 'InfoJobs',
        desc: 'Forte no Brasil, Espanha e Itália. Ótimo para quem busca oportunidades internacionais na Europa com perfil bilíngue.',
        tips: [
          { icon: 'earth', text: 'Explore vagas internacionais — especialmente Espanha e Itália para profissionais bilíngues' },
          { icon: 'account-check-outline', text: 'Complete 100% do perfil — candidatos com perfil completo aparecem primeiro nos resultados' },
          { icon: 'email-edit-outline', text: 'Candidate-se com carta de apresentação personalizada para cada vaga' },
          { icon: 'cash-multiple', text: 'Use a pesquisa avançada por faixa salarial e benefícios específicos' },
          { icon: 'translate', text: 'Perfil em português e espanhol aumenta muito suas chances de vagas europeias' },
        ],
        tag: 'Brasil + Europa',
      },
      en: {
        name: 'InfoJobs',
        desc: 'Strong in Brazil, Spain and Italy. Great for bilingual professionals seeking European opportunities.',
        tips: [
          { icon: 'earth', text: 'Explore international jobs — especially Spain and Italy for bilingual professionals' },
          { icon: 'account-check-outline', text: 'Complete 100% of your profile — complete profiles appear first in results' },
          { icon: 'email-edit-outline', text: 'Apply with a personalized cover letter for each position' },
          { icon: 'cash-multiple', text: 'Use advanced search by salary range and specific benefits' },
          { icon: 'translate', text: 'Profile in English and Spanish greatly increases your chances for European roles' },
        ],
        tag: 'Brazil + Europe',
      },
      es: {
        name: 'InfoJobs',
        desc: 'Fuerte en Brasil, España e Italia. Ideal para profesionales bilingües que buscan oportunidades europeas.',
        tips: [
          { icon: 'earth', text: 'Explora ofertas internacionales — especialmente en España e Italia' },
          { icon: 'account-check-outline', text: 'Completa el 100% de tu perfil — apareces primero en los resultados' },
          { icon: 'email-edit-outline', text: 'Postúlate con carta de presentación personalizada' },
          { icon: 'cash-multiple', text: 'Usa la búsqueda avanzada por salario y beneficios específicos' },
          { icon: 'translate', text: 'Perfil en español aumenta mucho tus oportunidades europeas' },
        ],
        tag: 'Brasil + Europa',
      },
    },
  },
  {
    key: 'workana',
    emoji: '💻',
    gradient: ['#7C3AED', '#5B21B6'],
    url: 'https://www.workana.com',
    category: 'freelance',
    stars: 4,
    competition: 'media',
    salary: 'R$ 50–300/h',
    workTypes: ['Freelance', 'Por Projeto', 'Remoto'],
    bestFor: ['Devs', 'Designers', 'Marketing', 'Redação'],
    quickTip: 'Responder uma proposta em menos de 1h aumenta muito sua chance de ser contratado.',
    stats: { users: '2M+', countries: '20+', jobs: '10K+' },
    statsLabels: { users: 'Freelancers', countries: 'Países', jobs: 'Projetos/mês' },
    content: {
      'pt-BR': {
        name: 'Workana',
        desc: 'Maior plataforma de freelance da América Latina. Ideal para TI, design e marketing com pagamento seguro.',
        tips: [
          { icon: 'briefcase-outline', text: 'Construa um portfólio sólido com projetos anteriores antes de se candidatar' },
          { icon: 'trending-up', text: 'Comece com projetos menores para acumular avaliações e subir no ranking' },
          { icon: 'clock-fast', text: 'Responda propostas em menos de 1h — velocidade de resposta é fator de contratação' },
          { icon: 'currency-brl', text: 'Defina taxa horária competitiva — pesquise o que outros freelancers cobram na sua área' },
          { icon: 'shield-check-outline', text: 'O pagamento é garantido pelo sistema — o cliente paga antes, você recebe ao entregar' },
        ],
        tag: 'Freelance América Latina',
      },
      en: {
        name: 'Workana',
        desc: 'Largest freelance platform in Latin America. Ideal for IT, design and marketing with secure payment.',
        tips: [
          { icon: 'briefcase-outline', text: 'Build a solid portfolio with previous projects before applying' },
          { icon: 'trending-up', text: 'Start with smaller projects to accumulate reviews and climb the ranking' },
          { icon: 'clock-fast', text: 'Reply to proposals within 1h — response speed is a hiring factor' },
          { icon: 'currency-brl', text: 'Set a competitive hourly rate — research what other freelancers charge in your field' },
          { icon: 'shield-check-outline', text: 'Payment is guaranteed by the system — client pays first, you receive on delivery' },
        ],
        tag: 'Latin America Freelance',
      },
      es: {
        name: 'Workana',
        desc: 'La mayor plataforma de freelance de América Latina. Ideal para TI, diseño y marketing con pago seguro.',
        tips: [
          { icon: 'briefcase-outline', text: 'Construye un portafolio sólido con proyectos anteriores antes de postularte' },
          { icon: 'trending-up', text: 'Empieza con proyectos pequeños para acumular reseñas y subir en el ranking' },
          { icon: 'clock-fast', text: 'Responde propuestas en menos de 1h — la velocidad es un factor de contratación' },
          { icon: 'currency-brl', text: 'Define una tarifa competitiva — investiga lo que cobran otros en tu área' },
          { icon: 'shield-check-outline', text: 'El pago está garantizado — el cliente paga antes y tú recibes al entregar' },
        ],
        tag: 'Freelance América Latina',
      },
    },
  },
  {
    key: 'gupy',
    emoji: '🚀',
    gradient: ['#4F46E5', '#3730A3'],
    url: 'https://portal.gupy.io',
    category: 'brasil',
    stars: 5,
    competition: 'alta',
    salary: 'R$ 2k–30k+',
    workTypes: ['CLT', 'Estágio', 'Aprendiz'],
    bestFor: ['Universitários', 'Trainees', 'Sêniors'],
    quickTip: 'Natura, Magazine Luiza, Ambev e +5.000 empresas brasileiras usam exclusivamente a Gupy.',
    stats: { users: '15M+', countries: '1', jobs: '100K+' },
    statsLabels: { users: 'Candidatos', countries: 'País', jobs: 'Vagas/ano' },
    content: {
      'pt-BR': {
        name: 'Gupy',
        desc: 'Plataforma usada pelas maiores empresas do Brasil. Processo seletivo 100% online com testes e entrevistas digitais.',
        tips: [
          { icon: 'domain', text: 'Cadastre-se diretamente nas empresas dos seus sonhos — cada uma tem seu próprio portal' },
          { icon: 'brain', text: 'Complete os testes de perfil comportamental com calma — eles influenciam muito na seleção' },
          { icon: 'progress-check', text: 'Acompanhe cada etapa do processo em tempo real — você recebe notificações automáticas' },
          { icon: 'heart-outline', text: 'Salve empresas favoritas para ser notificado assim que abrirem novas vagas' },
          { icon: 'video-outline', text: 'Prepare-se para entrevistas em vídeo — muitas empresas usam formato assíncrono na Gupy' },
        ],
        tag: '🇧🇷 Grandes Empresas BR',
      },
      en: {
        name: 'Gupy',
        desc: 'Platform used by Brazil\'s largest companies. 100% online selection process with tests and digital interviews.',
        tips: [
          { icon: 'domain', text: 'Register directly with your dream companies — each has its own portal' },
          { icon: 'brain', text: 'Complete behavioral profile tests carefully — they strongly influence selection' },
          { icon: 'progress-check', text: 'Track each step in real time — you receive automatic notifications' },
          { icon: 'heart-outline', text: 'Save favorite companies to be notified when new openings appear' },
          { icon: 'video-outline', text: 'Prepare for video interviews — many companies use async format on Gupy' },
        ],
        tag: '🇧🇷 Top Brazilian Companies',
      },
      es: {
        name: 'Gupy',
        desc: 'Plataforma utilizada por las mayores empresas de Brasil. Proceso selectivo 100% online.',
        tips: [
          { icon: 'domain', text: 'Regístrate directamente en las empresas de tus sueños — cada una tiene su portal' },
          { icon: 'brain', text: 'Completa los tests de perfil conductual con calma — influyen mucho en la selección' },
          { icon: 'progress-check', text: 'Sigue cada etapa en tiempo real — recibes notificaciones automáticas' },
          { icon: 'heart-outline', text: 'Guarda empresas favoritas para nuevas ofertas' },
          { icon: 'video-outline', text: 'Prepárate para entrevistas en video — muchas empresas usan formato asíncrono' },
        ],
        tag: '🇧🇷 Grandes Empresas BR',
      },
    },
  },
  {
    key: 'remotejobs',
    emoji: '🌍',
    gradient: ['#059669', '#065F46'],
    url: 'https://remote.co/remote-jobs',
    category: 'remoto',
    stars: 4,
    competition: 'media',
    salary: 'USD 30k–120k/ano',
    workTypes: ['100% Remoto', 'Dólar/Euro', 'Full-time'],
    bestFor: ['Devs', 'Data Science', 'Customer Success'],
    quickTip: 'Vagas em dólar podem valer 5x mais que o equivalente em reais — vale a pena buscar.',
    stats: { users: '500K+', countries: '100+', jobs: '5K+' },
    statsLabels: { users: 'Usuários/mês', countries: 'Países', jobs: 'Vagas remotas' },
    content: {
      'pt-BR': {
        name: 'Remote.co',
        desc: 'Especializado em vagas 100% remotas ao redor do mundo. Perfeito para trabalhar de qualquer lugar em dólar ou euro.',
        tips: [
          { icon: 'clock-time-eight-outline', text: 'Filtre por fuso horário para encontrar vagas compatíveis com horário brasileiro' },
          { icon: 'home-city-outline', text: 'Destaque experiências com trabalho remoto, ferramentas como Slack e Notion no currículo' },
          { icon: 'message-text-outline', text: 'Comunicação escrita em inglês é essencial — pratique antes de candidatar' },
          { icon: 'cash-multiple', text: 'Vagas em dólar ou euro podem valer 5x mais que o salário em reais — vale o esforço' },
          { icon: 'flag-outline', text: 'Mencione que você é brasileiro — muitas empresas valorizam diversidade geográfica' },
        ],
        tag: '100% Remoto Global',
      },
      en: {
        name: 'Remote.co',
        desc: 'Specialized in 100% remote jobs worldwide. Perfect for working anywhere, paid in dollars or euros.',
        tips: [
          { icon: 'clock-time-eight-outline', text: 'Filter by time zone to find jobs compatible with your schedule' },
          { icon: 'home-city-outline', text: 'Highlight remote work experience and tools like Slack and Notion in your resume' },
          { icon: 'message-text-outline', text: 'Written English communication is essential — practice before applying' },
          { icon: 'cash-multiple', text: 'Dollar or euro jobs can be worth 5x more — worth the extra effort' },
          { icon: 'flag-outline', text: 'Mention your location — many companies value geographic diversity' },
        ],
        tag: '100% Remote Global',
      },
      es: {
        name: 'Remote.co',
        desc: 'Especializado en empleos 100% remotos en todo el mundo. Perfecto para trabajar desde cualquier lugar.',
        tips: [
          { icon: 'clock-time-eight-outline', text: 'Filtra por zona horaria compatible con tu ubicación' },
          { icon: 'home-city-outline', text: 'Destaca experiencias de trabajo remoto y herramientas como Slack y Notion' },
          { icon: 'message-text-outline', text: 'La comunicación escrita en inglés es esencial — practica antes de postularte' },
          { icon: 'cash-multiple', text: 'Empleos en dólares o euros pueden valer 5x más — vale el esfuerzo' },
          { icon: 'flag-outline', text: 'Menciona tu ubicación — muchas empresas valoran la diversidad geográfica' },
        ],
        tag: '100% Remoto Global',
      },
    },
  },
  {
    key: '99freelas',
    emoji: '🎯',
    gradient: ['#D97706', '#B45309'],
    url: 'https://www.99freelas.com.br',
    category: 'freelance',
    stars: 4,
    competition: 'baixa',
    salary: 'R$ 30–200/h',
    workTypes: ['Freelance', 'Por Projeto', 'Remoto'],
    bestFor: ['Redação', 'Design', 'Dev', 'Consultoria'],
    quickTip: 'Propostas personalizadas e detalhadas ganham de genéricas — mostre que você entendeu o projeto.',
    stats: { users: '1M+', countries: '1', jobs: '8K+' },
    statsLabels: { users: 'Freelancers', countries: 'País', jobs: 'Projetos/mês' },
    content: {
      'pt-BR': {
        name: '99Freelas',
        desc: 'Maior plataforma de freelancers do Brasil. Desde redação e design até programação, consultoria e jurídico.',
        tips: [
          { icon: 'card-account-details-outline', text: 'Crie um perfil completo com portfólio, descrição detalhada e especialidades' },
          { icon: 'tag-outline', text: 'Pesquise o que concorrentes cobram e defina preços competitivos para o mercado BR' },
          { icon: 'pencil-box-outline', text: 'Responda briefings com propostas personalizadas — mostre que leu e entendeu o projeto' },
          { icon: 'star-circle-outline', text: 'Acumule avaliações positivas — 5 projetos bem avaliados já abrem muitas portas' },
          { icon: 'repeat', text: 'Ofereça revisões gratuitas nos primeiros projetos para fidelizar clientes recorrentes' },
        ],
        tag: '🇧🇷 Freelance Brasil',
      },
      en: {
        name: '99Freelas',
        desc: 'Brazil\'s largest freelancers platform — writing, design, programming, consulting and legal work.',
        tips: [
          { icon: 'card-account-details-outline', text: 'Create a complete profile with portfolio, detailed description and specialties' },
          { icon: 'tag-outline', text: 'Research what competitors charge and set competitive prices for the Brazilian market' },
          { icon: 'pencil-box-outline', text: 'Reply to briefs with personalized proposals — show you read and understood the project' },
          { icon: 'star-circle-outline', text: 'Accumulate positive reviews — 5 well-reviewed projects already opens many doors' },
          { icon: 'repeat', text: 'Offer free revisions on first projects to build recurring clients' },
        ],
        tag: '🇧🇷 Brazil Freelance',
      },
      es: {
        name: '99Freelas',
        desc: 'La mayor plataforma de freelancers de Brasil — escritura, diseño, programación, consultoría y derecho.',
        tips: [
          { icon: 'card-account-details-outline', text: 'Crea un perfil completo con portafolio, descripción detallada y especialidades' },
          { icon: 'tag-outline', text: 'Investiga qué cobran competidores y define precios competitivos' },
          { icon: 'pencil-box-outline', text: 'Responde briefings con propuestas personalizadas — muestra que entendiste el proyecto' },
          { icon: 'star-circle-outline', text: 'Acumula reseñas positivas — 5 proyectos bien evaluados abren muchas puertas' },
          { icon: 'repeat', text: 'Ofrece revisiones gratuitas en primeros proyectos para fidelizar clientes recurrentes' },
        ],
        tag: '🇧🇷 Freelance Brasil',
      },
    },
  },
];

/* ─── categorias ─── */
const CATS = {
  'pt-BR': [
    { key: 'all',      label: 'Todos',      icon: 'view-grid' },
    { key: 'global',   label: 'Global',     icon: 'earth' },
    { key: 'brasil',   label: 'Brasil',     icon: 'flag' },
    { key: 'freelance',label: 'Freelance',  icon: 'laptop' },
    { key: 'remoto',   label: 'Remoto',     icon: 'home-city' },
  ],
  en: [
    { key: 'all',      label: 'All',        icon: 'view-grid' },
    { key: 'global',   label: 'Global',     icon: 'earth' },
    { key: 'brasil',   label: 'Brazil',     icon: 'flag' },
    { key: 'freelance',label: 'Freelance',  icon: 'laptop' },
    { key: 'remoto',   label: 'Remote',     icon: 'home-city' },
  ],
  es: [
    { key: 'all',      label: 'Todos',      icon: 'view-grid' },
    { key: 'global',   label: 'Global',     icon: 'earth' },
    { key: 'brasil',   label: 'Brasil',     icon: 'flag' },
    { key: 'freelance',label: 'Freelance',  icon: 'laptop' },
    { key: 'remoto',   label: 'Remoto',     icon: 'home-city' },
  ],
};

const HERO = {
  'pt-BR': { title: 'Plataformas que Contratam', sub: 'Os melhores sites para encontrar sua próxima oportunidade' },
  en:      { title: 'Top Hiring Platforms',       sub: 'The best sites to find your next opportunity' },
  es:      { title: 'Plataformas que Contratan',  sub: 'Los mejores sitios para encontrar tu próxima oportunidad' },
};

/* ─── stars ─── */
function Stars({ count }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <MaterialCommunityIcons key={i} name={i <= count ? 'star' : 'star-outline'} size={13} color="#FCD34D" />
      ))}
    </View>
  );
}

const COMPETITION_CONFIG = {
  alta:  { label: 'Alta concorrência',  color: '#EF4444', icon: 'fire' },
  media: { label: 'Média concorrência', color: '#F59E0B', icon: 'signal-cellular-2' },
  baixa: { label: 'Baixa concorrência', color: '#10B981', icon: 'leaf' },
};

/* ─── card de plataforma ─── */
function PlatformCard({ p, lang, theme }) {
  const [open, setOpen] = useState(false);
  const { t } = useContext(UserPreferencesContext);
  const c = p.content[lang] || p.content['pt-BR'];
  const statKeys = Object.keys(p.stats);
  const comp = COMPETITION_CONFIG[p.competition] || COMPETITION_CONFIG.media;

  return (
    <Animatable.View animation="fadeInUp" duration={450} style={[s.card, { backgroundColor: theme.colors.surface, borderColor: p.gradient[0] + '25' }]}>

      {/* ── cabeçalho gradiente ── */}
      <LinearGradient colors={p.gradient} start={{ x:0,y:0 }} end={{ x:1,y:1 }} style={s.cardHead}>
        <View style={s.hb1} /><View style={s.hb2} />

        {/* linha: emoji + nome + tag + stars */}
        <View style={s.cardHeadRow}>
          <View style={s.emojiBox}>
            <Text style={s.cardEmoji}>{p.emoji}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.cardName}>{c.name}</Text>
            <View style={s.tagRow}>
              <View style={s.tag}>
                <Text style={s.tagText}>{c.tag}</Text>
              </View>
            </View>
          </View>
          <Stars count={p.stars} />
        </View>

        {/* stats numéricos */}
        <View style={s.statsRow}>
          {statKeys.map(sk => (
            <View key={sk} style={s.statItem}>
              <Text style={s.statVal}>{p.stats[sk]}</Text>
              <Text style={s.statLabel}>{p.statsLabels[sk]}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* ── corpo do card ── */}
      <View style={s.cardBody}>

        {/* badges: concorrência + tipos de trabalho */}
        <View style={s.badgesRow}>
          <View style={[s.compBadge, { backgroundColor: comp.color + '18', borderColor: comp.color + '40' }]}>
            <MaterialCommunityIcons name={comp.icon} size={12} color={comp.color} />
            <Text style={[s.compBadgeText, { color: comp.color }]}>{comp.label}</Text>
          </View>
          <View style={{ flex: 1 }} />
          {p.workTypes.slice(0,2).map((wt, i) => (
            <View key={i} style={[s.wtBadge, { backgroundColor: p.gradient[0] + '12', borderColor: p.gradient[0] + '30' }]}>
              <Text style={[s.wtBadgeText, { color: p.gradient[0] }]}>{wt}</Text>
            </View>
          ))}
        </View>

        {/* salário médio */}
        <View style={[s.salaryRow, { backgroundColor: theme.colors.surfaceVariant || '#F8FAFC', borderColor: theme.colors.outlineVariant }]}>
          <MaterialCommunityIcons name="cash-multiple" size={16} color={p.gradient[0]} />
          <Text style={[s.salaryLabel, { color: theme.colors.onSurfaceVariant }]}>Faixa salarial</Text>
          <Text style={[s.salaryVal, { color: p.gradient[0] }]}>{p.salary}</Text>
        </View>

        {/* descrição */}
        <Text style={[s.desc, { color: theme.colors.onSurfaceVariant }]}>{c.desc}</Text>

        {/* melhor para: chips */}
        <View style={s.bestForRow}>
          <MaterialCommunityIcons name="account-star-outline" size={14} color={theme.colors.onSurfaceVariant} />
          <Text style={[s.bestForLabel, { color: theme.colors.onSurfaceVariant }]}>Melhor para:</Text>
          {p.bestFor.map((bf, i) => (
            <View key={i} style={[s.bestForChip, { backgroundColor: p.gradient[0] + '15' }]}>
              <Text style={[s.bestForChipText, { color: p.gradient[0] }]}>{bf}</Text>
            </View>
          ))}
        </View>

        {/* dica rápida destaque */}
        <View style={[s.quickTipBox, { backgroundColor: p.gradient[0] + '10', borderLeftColor: p.gradient[0] }]}>
          <MaterialCommunityIcons name="lightning-bolt" size={15} color={p.gradient[0]} />
          <Text style={[s.quickTipText, { color: theme.colors.onSurface }]}>{p.quickTip}</Text>
        </View>

        {/* dicas expansíveis */}
        <TouchableOpacity
          onPress={() => setOpen(o => !o)}
          activeOpacity={0.8}
          style={[s.tipsToggle, { backgroundColor: p.gradient[0] + '10', borderColor: p.gradient[0] + '25' }]}
        >
          <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color={p.gradient[0]} />
          <Text style={[s.tipsToggleText, { color: p.gradient[0] }]}>
            {open ? (lang === 'en' ? 'Hide tips' : 'Ocultar dicas') : (lang === 'en' ? `${c.tips.length} tips to get hired` : `${c.tips.length} dicas para ser contratado`)}
          </Text>
          <MaterialCommunityIcons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={p.gradient[0]} />
        </TouchableOpacity>

        {open && (
          <Animatable.View animation="fadeIn" duration={250} style={s.tipsList}>
            {c.tips.map((tip, i) => (
              <View key={i} style={[s.tipRow, { backgroundColor: theme.colors.background || '#FAFAFA' }]}>
                <LinearGradient colors={p.gradient} style={s.tipDot}>
                  <MaterialCommunityIcons name={tip.icon} size={13} color="#fff" />
                </LinearGradient>
                <Text style={[s.tipText, { color: theme.colors.onSurface }]}>{tip.text}</Text>
              </View>
            ))}
          </Animatable.View>
        )}

        {/* botão acessar */}
        <TouchableOpacity
          onPress={() => Linking.openURL(p.url)}
          activeOpacity={0.88}
          style={{ borderRadius: 16, overflow: 'hidden', marginTop: 14 }}
        >
          <LinearGradient colors={p.gradient} start={{ x:0,y:0 }} end={{ x:1,y:0 }} style={s.accessBtn}>
            <MaterialCommunityIcons name="open-in-new" size={17} color="#fff" />
            <Text style={s.accessBtnText}>{t('accessSite')}</Text>
            <MaterialCommunityIcons name="chevron-right" size={18} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
}

/* ─── TELA PRINCIPAL ─── */
export default function SitesRecomendados({ navigation }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { language } = useContext(UserPreferencesContext);
  const lang  = ['pt-BR','en','es'].includes(language) ? language : 'pt-BR';
  const hero  = HERO[lang] || HERO['pt-BR'];
  const cats  = CATS[lang] || CATS['pt-BR'];

  const [activeCat, setActiveCat] = useState('all');

  const filtered = activeCat === 'all'
    ? PLATFORMS
    : PLATFORMS.filter(p => p.category === activeCat);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>

        {/* ── header fixo branco ── */}
        <View style={[s.fixedHeader, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.outlineVariant }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.navBtn}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
            {lang === 'en' ? 'Job Boards' : lang === 'es' ? 'Bolsas de Trabajo' : 'Encontrar Vagas'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          {/* ══ HERO ══ */}
          <Animatable.View animation="fadeInDown" duration={500}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              start={{ x:0,y:0 }} end={{ x:1,y:1 }}
              style={s.hero}
            >
              <View style={s.heroHb1} /><View style={s.heroHb2} />

              {/* ícone + texto alinhados à esquerda */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <View style={s.heroIconBox}>
                  <MaterialCommunityIcons name="briefcase-search" size={30} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.heroTitle}>{hero.title}</Text>
                  <Text style={s.heroSub}>{hero.sub}</Text>
                </View>
              </View>

              {/* stats row */}
              <View style={s.heroStats}>
                <View style={s.heroStat}>
                  <Text style={s.heroStatVal}>{PLATFORMS.length}</Text>
                  <Text style={s.heroStatLabel}>{lang === 'en' ? 'Platforms' : 'Plataformas'}</Text>
                </View>
                <View style={s.heroStatDiv} />
                <View style={s.heroStat}>
                  <Text style={s.heroStatVal}>{'5'}</Text>
                  <Text style={s.heroStatLabel}>{lang === 'en' ? 'Categories' : 'Categorias'}</Text>
                </View>
                <View style={s.heroStatDiv} />
                <View style={s.heroStat}>
                  <Text style={s.heroStatVal}>{'100%'}</Text>
                  <Text style={s.heroStatLabel}>{lang === 'en' ? 'Free' : 'Gratuito'}</Text>
                </View>
              </View>
            </LinearGradient>
          </Animatable.View>

        {/* ══ FILTROS DE CATEGORIA ══ */}
        <Animatable.View animation="fadeInUp" duration={400} delay={100}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 14, gap: 10 }}
          >
            {cats.map(cat => {
              const active = activeCat === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  onPress={() => setActiveCat(cat.key)}
                  activeOpacity={0.8}
                  style={[s.catBtn,
                    active
                      ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                      : { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }
                  ]}
                >
                  <MaterialCommunityIcons name={cat.icon} size={15} color={active ? '#fff' : theme.colors.onSurfaceVariant} />
                  <Text style={[s.catLabel, { color: active ? '#fff' : theme.colors.onSurfaceVariant, fontWeight: active ? '800' : '600' }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animatable.View>

        {/* ══ CARDS ══ */}
        <View style={{ paddingHorizontal: 16, gap: 16 }}>
          {filtered.map((p, i) => (
            <PlatformCard key={p.key} p={p} lang={lang} theme={theme} />
          ))}
        </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ─── styles ─── */
const s = StyleSheet.create({
  fixedHeader:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, gap: 12 },
  navBtn:       { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  headerTitle:  { flex: 1, fontSize: 17, fontWeight: '800' },
  hero:      { paddingTop: 20, paddingBottom: 28, paddingHorizontal: 22, overflow: 'hidden' },
  heroHb1:      { position:'absolute', width:200, height:200, borderRadius:100, backgroundColor:'rgba(255,255,255,0.07)', top:-70, right:-50 },
  heroHb2:      { position:'absolute', width:90,  height:90,  borderRadius:45,  backgroundColor:'rgba(255,255,255,0.07)', bottom:-20, left:10 },
  heroIconBox:  { width:56, height:56, borderRadius:18, backgroundColor:'rgba(255,255,255,0.2)', justifyContent:'center', alignItems:'center', borderWidth:1.5, borderColor:'rgba(255,255,255,0.3)' },
  heroTitle:    { color:'#fff', fontSize:20, fontWeight:'900', letterSpacing:0.2 },
  heroSub:      { color:'rgba(255,255,255,0.8)', fontSize:13, marginTop:3, lineHeight:19 },
  heroStats:    { flexDirection:'row', alignItems:'center', backgroundColor:'rgba(255,255,255,0.15)', borderRadius:16, paddingVertical:12, paddingHorizontal:8, borderWidth:1, borderColor:'rgba(255,255,255,0.2)' },
  heroStat:     { flex:1, alignItems:'center' },
  heroStatVal:  { color:'#fff', fontSize:18, fontWeight:'900' },
  heroStatLabel:{ color:'rgba(255,255,255,0.7)', fontSize:10, marginTop:2, fontWeight:'600' },
  heroStatDiv:  { width:1, height:28, backgroundColor:'rgba(255,255,255,0.25)' },

  catBtn:   { flexDirection:'row', alignItems:'center', gap:6, paddingVertical:9, paddingHorizontal:16, borderRadius:22, borderWidth:1.5 },
  catLabel: { fontSize:13 },

  card:    { borderRadius:22, borderWidth:1.5, overflow:'hidden', elevation:5, shadowColor:'#000', shadowOffset:{width:0,height:5}, shadowOpacity:0.10, shadowRadius:12 },
  cardHead:{ padding:18, overflow:'hidden' },
  hb1:     { position:'absolute', width:140, height:140, borderRadius:70, backgroundColor:'rgba(255,255,255,0.09)', top:-55, right:-35 },
  hb2:     { position:'absolute', width:70,  height:70,  borderRadius:35, backgroundColor:'rgba(255,255,255,0.07)', bottom:-20, left:10 },
  cardHeadRow: { flexDirection:'row', alignItems:'center' },
  emojiBox:    { width:52, height:52, borderRadius:16, backgroundColor:'rgba(255,255,255,0.2)', justifyContent:'center', alignItems:'center', borderWidth:1.5, borderColor:'rgba(255,255,255,0.3)' },
  cardEmoji:   { fontSize:28 },
  cardName:    { color:'#fff', fontSize:20, fontWeight:'900' },
  tagRow:  { flexDirection:'row', marginTop:4 },
  tag:     { backgroundColor:'rgba(255,255,255,0.22)', paddingVertical:3, paddingHorizontal:10, borderRadius:12 },
  tagText: { color:'#fff', fontSize:11, fontWeight:'700' },

  statsRow:  { flexDirection:'row', marginTop:14, gap:4 },
  statItem:  { flex:1, backgroundColor:'rgba(255,255,255,0.18)', borderRadius:12, padding:9, alignItems:'center' },
  statVal:   { color:'#fff', fontSize:14, fontWeight:'900' },
  statLabel: { color:'rgba(255,255,255,0.8)', fontSize:9, marginTop:2, textAlign:'center', fontWeight:'600' },

  cardBody:  { padding:16, gap:10 },
  desc:      { fontSize:13.5, lineHeight:20, marginBottom:0 },

  /* badges row */
  badgesRow:     { flexDirection:'row', alignItems:'center', gap:6, flexWrap:'wrap' },
  compBadge:     { flexDirection:'row', alignItems:'center', gap:4, paddingVertical:4, paddingHorizontal:9, borderRadius:10, borderWidth:1 },
  compBadgeText: { fontSize:11, fontWeight:'700' },
  wtBadge:       { paddingVertical:4, paddingHorizontal:9, borderRadius:10, borderWidth:1 },
  wtBadgeText:   { fontSize:11, fontWeight:'700' },

  /* faixa salarial */
  salaryRow:   { flexDirection:'row', alignItems:'center', gap:8, paddingVertical:10, paddingHorizontal:12, borderRadius:13, borderWidth:1 },
  salaryLabel: { fontSize:12, fontWeight:'600', flex:1 },
  salaryVal:   { fontSize:13, fontWeight:'900' },

  /* melhor para */
  bestForRow:     { flexDirection:'row', alignItems:'center', gap:6, flexWrap:'wrap' },
  bestForLabel:   { fontSize:12, fontWeight:'600', marginRight:2 },
  bestForChip:    { paddingVertical:3, paddingHorizontal:9, borderRadius:10 },
  bestForChipText:{ fontSize:11, fontWeight:'700' },

  /* dica rápida */
  quickTipBox:  { flexDirection:'row', alignItems:'flex-start', gap:8, padding:11, borderRadius:12, borderLeftWidth:3 },
  quickTipText: { flex:1, fontSize:12.5, lineHeight:18, fontWeight:'600' },

  tipsToggle:     { flexDirection:'row', alignItems:'center', gap:8, padding:11, borderRadius:13, borderWidth:1 },
  tipsToggleText: { flex:1, fontSize:13, fontWeight:'700' },

  tipsList: { gap:8, marginTop:2 },
  tipRow:   { flexDirection:'row', alignItems:'flex-start', gap:10, padding:10, borderRadius:12 },
  tipDot:   { width:28, height:28, borderRadius:9, justifyContent:'center', alignItems:'center', flexShrink:0 },
  tipNum:   { color:'#fff', fontSize:11, fontWeight:'900' },
  tipText:  { flex:1, fontSize:13, lineHeight:19 },

  accessBtn:     { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, paddingVertical:14 },
  accessBtnText: { color:'#fff', fontWeight:'800', fontSize:14, flex:1, textAlign:'center' },
});
