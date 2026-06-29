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
    stats: { users: '950M+', countries: '200+', jobs: '15M+' },
    statsLabels: { users: 'Usuários', countries: 'Países', jobs: 'Vagas' },
    content: {
      'pt-BR': {
        name: 'LinkedIn',
        desc: 'A maior rede profissional do mundo. Ideal para networking, candidaturas e visibilidade de carreira.',
        tips: [
          'Otimize seu perfil com foto profissional e resumo completo',
          'Ative "Open to Work" para aparecer para recrutadores',
          'Conecte-se com pessoas da sua área e interaja com posts',
          'Peça recomendações a ex-colegas e gestores',
        ],
        tag: 'Rede Profissional Global',
      },
      en: {
        name: 'LinkedIn',
        desc: 'The world\'s largest professional network. Ideal for networking, job applications and career visibility.',
        tips: [
          'Optimize your profile with a professional photo and full summary',
          'Enable "Open to Work" to appear to recruiters',
          'Connect with people in your field and engage with posts',
          'Ask former colleagues and managers for recommendations',
        ],
        tag: 'Global Professional Network',
      },
      es: {
        name: 'LinkedIn',
        desc: 'La mayor red profesional del mundo. Ideal para networking, candidaturas y visibilidad de carrera.',
        tips: [
          'Optimiza tu perfil con foto profesional y resumen completo',
          'Activa "Open to Work" para aparecer ante reclutadores',
          'Conéctate con personas de tu área e interactúa con publicaciones',
          'Pide recomendaciones a ex-colegas y managers',
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
    stats: { users: '350M+', countries: '60+', jobs: '250M+' },
    statsLabels: { users: 'Visitantes/mês', countries: 'Países', jobs: 'Vagas publicadas' },
    content: {
      'pt-BR': {
        name: 'Indeed',
        desc: 'Motor de busca de empregos com o maior volume de vagas do mundo. Agrega vagas de centenas de sites.',
        tips: [
          'Use palavras-chave específicas da sua profissão na busca',
          'Cadastre seu currículo para candidatura com 1 clique',
          'Ative alertas de emprego para receber vagas no e-mail',
          'Avalie empresas antes de se candidatar',
        ],
        tag: 'Maior Buscador de Vagas',
      },
      en: {
        name: 'Indeed',
        desc: 'The world\'s largest job search engine. Aggregates listings from hundreds of sites.',
        tips: [
          'Use specific keywords for your profession in the search',
          'Upload your resume for 1-click applications',
          'Set up job alerts to receive openings by email',
          'Read company reviews before applying',
        ],
        tag: 'Largest Job Search Engine',
      },
      es: {
        name: 'Indeed',
        desc: 'El motor de búsqueda de empleo con mayor volumen de ofertas del mundo.',
        tips: [
          'Usa palabras clave específicas de tu profesión',
          'Sube tu currículum para postulaciones con 1 clic',
          'Activa alertas de empleo por correo',
          'Lee reseñas de empresas antes de postularte',
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
    stats: { users: '67M+', countries: '190+', jobs: '10M+' },
    statsLabels: { users: 'Usuários/mês', countries: 'Países', jobs: 'Vagas' },
    content: {
      'pt-BR': {
        name: 'Glassdoor',
        desc: 'Vagas + avaliações reais de funcionários sobre salário, cultura e processos seletivos das empresas.',
        tips: [
          'Leia avaliações de funcionários antes de se candidatar',
          'Consulte faixas salariais antes da entrevista',
          'Veja perguntas comuns feitas em entrevistas da empresa',
          'Avalie empresas onde trabalhou para ajudar outros profissionais',
        ],
        tag: 'Avaliações + Salários',
      },
      en: {
        name: 'Glassdoor',
        desc: 'Jobs + real employee reviews about salaries, culture and hiring processes.',
        tips: [
          'Read employee reviews before applying',
          'Check salary ranges before your interview',
          'See common interview questions for each company',
          'Review companies you\'ve worked for to help others',
        ],
        tag: 'Reviews + Salaries',
      },
      es: {
        name: 'Glassdoor',
        desc: 'Ofertas + reseñas reales de empleados sobre salarios, cultura y procesos de selección.',
        tips: [
          'Lee reseñas de empleados antes de postularte',
          'Consulta rangos salariales antes de la entrevista',
          'Ve preguntas frecuentes de entrevistas de la empresa',
          'Evalúa empresas en las que trabajaste',
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
    stats: { users: '6M+', countries: '1', jobs: '50K+' },
    statsLabels: { users: 'Candidatos', countries: 'País', jobs: 'Vagas ativas' },
    content: {
      'pt-BR': {
        name: 'Vagas.com.br',
        desc: 'Uma das maiores plataformas de empregos do Brasil, com foco em vagas de nível médio a sênior.',
        tips: [
          'Cadastre um currículo detalhado para aumentar visibilidade',
          'Use filtros por área, cidade e tipo de contrato',
          'Candidate-se a múltiplas vagas na mesma área',
          'Acompanhe o status das candidaturas na plataforma',
        ],
        tag: '🇧🇷 Foco no Brasil',
      },
      en: {
        name: 'Vagas.com.br',
        desc: 'One of Brazil\'s largest job platforms, focused on mid to senior level positions.',
        tips: [
          'Register a detailed resume to increase visibility',
          'Use filters by area, city and contract type',
          'Apply to multiple openings in the same field',
          'Track application status on the platform',
        ],
        tag: '🇧🇷 Brazil Focus',
      },
      es: {
        name: 'Vagas.com.br',
        desc: 'Una de las mayores plataformas de empleo de Brasil, con foco en niveles medio a senior.',
        tips: [
          'Registra un currículum detallado para aumentar visibilidad',
          'Usa filtros por área, ciudad y tipo de contrato',
          'Postúlate a múltiples ofertas en la misma área',
          'Consulta el estado de tus candidaturas',
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
    stats: { users: '23M+', countries: '1', jobs: '30K+' },
    statsLabels: { users: 'Cadastrados', countries: 'País', jobs: 'Vagas/mês' },
    content: {
      'pt-BR': {
        name: 'Catho',
        desc: 'Plataforma brasileira com grande volume de vagas e ferramentas de análise de currículo com IA.',
        tips: [
          'Use o recurso de análise de currículo por inteligência artificial',
          'Veja o percentual de compatibilidade com cada vaga',
          'Cadastre alertas para ser notificado de novas oportunidades',
          'Acesse cursos e dicas de carreira na plataforma',
        ],
        tag: '🇧🇷 IA para Currículo',
      },
      en: {
        name: 'Catho',
        desc: 'Brazilian platform with a high volume of jobs and AI-powered resume analysis tools.',
        tips: [
          'Use the AI resume analysis feature',
          'See your compatibility percentage with each job',
          'Set up alerts to be notified of new opportunities',
          'Access career courses and tips on the platform',
        ],
        tag: '🇧🇷 AI Resume Analysis',
      },
      es: {
        name: 'Catho',
        desc: 'Plataforma brasileña con gran volumen de ofertas y herramientas de análisis de currículum con IA.',
        tips: [
          'Usa el análisis de currículum con inteligencia artificial',
          'Ve el porcentaje de compatibilidad con cada oferta',
          'Configura alertas para nuevas oportunidades',
          'Accede a cursos y consejos de carrera',
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
    stats: { users: '4M+', countries: '3', jobs: '20K+' },
    statsLabels: { users: 'Usuários', countries: 'Países', jobs: 'Vagas ativas' },
    content: {
      'pt-BR': {
        name: 'InfoJobs',
        desc: 'Forte no Brasil, Espanha e Itália. Ótimo para quem busca oportunidades internacionais na Europa.',
        tips: [
          'Explore vagas internacionais especialmente na Europa',
          'Complete 100% do seu perfil para aparecer nos destaque',
          'Candidature-se com carta de apresentação personalizada',
          'Use a pesquisa avançada por salário e benefícios',
        ],
        tag: 'Brasil + Europa',
      },
      en: {
        name: 'InfoJobs',
        desc: 'Strong in Brazil, Spain and Italy. Great for those seeking international opportunities in Europe.',
        tips: [
          'Explore international jobs especially in Europe',
          'Complete 100% of your profile to appear in highlights',
          'Apply with a personalized cover letter',
          'Use advanced search by salary and benefits',
        ],
        tag: 'Brazil + Europe',
      },
      es: {
        name: 'InfoJobs',
        desc: 'Fuerte en Brasil, España e Italia. Excelente para oportunidades internacionales en Europa.',
        tips: [
          'Explora ofertas internacionales especialmente en Europa',
          'Completa el 100% de tu perfil para destacar',
          'Postúlate con carta de presentación personalizada',
          'Usa la búsqueda avanzada por salario y beneficios',
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
    stats: { users: '2M+', countries: '20+', jobs: '10K+' },
    statsLabels: { users: 'Freelancers', countries: 'Países', jobs: 'Projetos/mês' },
    content: {
      'pt-BR': {
        name: 'Workana',
        desc: 'Maior plataforma de freelance da América Latina. Ideal para profissionais de TI, design e marketing.',
        tips: [
          'Construa um portfólio sólido antes de se candidatar',
          'Comece com projetos menores para acumular avaliações',
          'Defina uma taxa horária competitiva para sua experiência',
          'Responda propostas rapidamente — velocidade importa',
        ],
        tag: 'Freelance América Latina',
      },
      en: {
        name: 'Workana',
        desc: 'Largest freelance platform in Latin America. Ideal for IT, design and marketing professionals.',
        tips: [
          'Build a solid portfolio before applying',
          'Start with smaller projects to accumulate reviews',
          'Set a competitive hourly rate for your experience level',
          'Reply to proposals quickly — speed matters',
        ],
        tag: 'Latin America Freelance',
      },
      es: {
        name: 'Workana',
        desc: 'La mayor plataforma de freelance de América Latina. Ideal para TI, diseño y marketing.',
        tips: [
          'Construye un portafolio sólido antes de postularte',
          'Empieza con proyectos pequeños para acumular reseñas',
          'Define una tarifa competitiva para tu experiencia',
          'Responde propuestas rápidamente — la velocidad importa',
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
    stats: { users: '15M+', countries: '1', jobs: '100K+' },
    statsLabels: { users: 'Candidatos', countries: 'País', jobs: 'Vagas/ano' },
    content: {
      'pt-BR': {
        name: 'Gupy',
        desc: 'Plataforma usada pelas maiores empresas do Brasil. Processo seletivo 100% online com testes e entrevistas.',
        tips: [
          'Cadastre-se diretamente nas empresas que deseja trabalhar',
          'Complete testes de perfil comportamental com atenção',
          'Acompanhe cada etapa do processo seletivo em tempo real',
          'Salve empresas favoritas para acompanhar novas vagas',
        ],
        tag: '🇧🇷 Grandes Empresas BR',
      },
      en: {
        name: 'Gupy',
        desc: 'Platform used by Brazil\'s largest companies. 100% online selection process with tests and interviews.',
        tips: [
          'Register directly with companies you want to work for',
          'Complete behavioral profile tests carefully',
          'Track each stage of the selection process in real time',
          'Save favorite companies to follow new openings',
        ],
        tag: '🇧🇷 Top Brazilian Companies',
      },
      es: {
        name: 'Gupy',
        desc: 'Plataforma utilizada por las mayores empresas de Brasil. Proceso selectivo 100% online.',
        tips: [
          'Regístrate directamente en las empresas deseadas',
          'Completa los tests de perfil conductual con atención',
          'Sigue cada etapa del proceso en tiempo real',
          'Guarda empresas favoritas para nuevas ofertas',
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
    stats: { users: '500K+', countries: '100+', jobs: '5K+' },
    statsLabels: { users: 'Usuários/mês', countries: 'Países', jobs: 'Vagas remotas' },
    content: {
      'pt-BR': {
        name: 'Remote.co',
        desc: 'Especializado em vagas 100% remotas ao redor do mundo. Ideal para quem quer trabalhar de qualquer lugar.',
        tips: [
          'Filtre por fuso horário para vagas compatíveis com o Brasil',
          'Destaque experiências com trabalho remoto no currículo',
          'Comprove habilidades de comunicação escrita e assíncrona',
          'Explore vagas em dólar ou euro para aumentar renda',
        ],
        tag: '100% Remoto Global',
      },
      en: {
        name: 'Remote.co',
        desc: 'Specialized in 100% remote jobs worldwide. Ideal for those who want to work from anywhere.',
        tips: [
          'Filter by time zone for jobs compatible with your location',
          'Highlight remote work experience in your resume',
          'Prove written and asynchronous communication skills',
          'Explore jobs paid in dollars or euros',
        ],
        tag: '100% Remote Global',
      },
      es: {
        name: 'Remote.co',
        desc: 'Especializado en empleos 100% remotos en todo el mundo.',
        tips: [
          'Filtra por zona horaria compatible con tu ubicación',
          'Destaca experiencias de trabajo remoto en tu currículum',
          'Demuestra habilidades de comunicación escrita',
          'Explora empleos pagados en dólares o euros',
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
    stats: { users: '1M+', countries: '1', jobs: '8K+' },
    statsLabels: { users: 'Freelancers', countries: 'País', jobs: 'Projetos/mês' },
    content: {
      'pt-BR': {
        name: '99Freelas',
        desc: 'Maior plataforma de freelancers do Brasil. Desde redação e design até programação e consultoria.',
        tips: [
          'Crie um perfil completo com portfólio e descrição detalhada',
          'Defina preços competitivos baseados no mercado brasileiro',
          'Responda briefings com propostas personalizadas',
          'Acumule avaliações positivas para subir no ranking',
        ],
        tag: '🇧🇷 Freelance Brasil',
      },
      en: {
        name: '99Freelas',
        desc: 'Brazil\'s largest freelancers platform — writing, design, programming and consulting.',
        tips: [
          'Create a full profile with portfolio and detailed description',
          'Set competitive prices based on the Brazilian market',
          'Reply to briefs with personalized proposals',
          'Accumulate positive reviews to rank higher',
        ],
        tag: '🇧🇷 Brazil Freelance',
      },
      es: {
        name: '99Freelas',
        desc: 'La mayor plataforma de freelancers de Brasil — escritura, diseño, programación y consultoría.',
        tips: [
          'Crea un perfil completo con portafolio y descripción detallada',
          'Establece precios competitivos para el mercado brasileño',
          'Responde briefings con propuestas personalizadas',
          'Acumula reseñas positivas para subir en el ranking',
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

/* ─── card de plataforma ─── */
function PlatformCard({ p, lang, theme }) {
  const [open, setOpen] = useState(false);
  const c = p.content[lang] || p.content['pt-BR'];

  const statKeys = Object.keys(p.stats);

  return (
    <Animatable.View animation="fadeInUp" duration={450} style={[s.card, { backgroundColor: theme.colors.surface, borderColor: p.gradient[0] + '30' }]}>
      {/* cabeçalho gradiente */}
      <LinearGradient colors={p.gradient} start={{ x:0,y:0 }} end={{ x:1,y:1 }} style={s.cardHead}>
        <View style={s.hb1} /><View style={s.hb2} />
        <View style={s.cardHeadRow}>
          <Text style={s.cardEmoji}>{p.emoji}</Text>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={s.cardName}>{c.name}</Text>
            <View style={s.tagRow}>
              <View style={s.tag}>
                <Text style={s.tagText}>{c.tag}</Text>
              </View>
            </View>
          </View>
          <Stars count={p.stars} />
        </View>

        {/* stats */}
        <View style={s.statsRow}>
          {statKeys.map(sk => (
            <View key={sk} style={s.statItem}>
              <Text style={s.statVal}>{p.stats[sk]}</Text>
              <Text style={s.statLabel}>{p.statsLabels[sk]}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* descrição */}
      <View style={s.cardBody}>
        <Text style={[s.desc, { color: theme.colors.onSurfaceVariant }]}>{c.desc}</Text>

        {/* dicas expansíveis */}
        <TouchableOpacity
          onPress={() => setOpen(o => !o)}
          activeOpacity={0.8}
          style={[s.tipsToggle, { backgroundColor: p.gradient[0] + '12', borderColor: p.gradient[0] + '30' }]}
        >
          <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color={p.gradient[0]} />
          <Text style={[s.tipsToggleText, { color: p.gradient[0] }]}>
            {open ? 'Ocultar dicas' : 'Ver dicas de uso'}
          </Text>
          <MaterialCommunityIcons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={p.gradient[0]} />
        </TouchableOpacity>

        {open && (
          <Animatable.View animation="fadeIn" duration={250} style={s.tipsList}>
            {c.tips.map((tip, i) => (
              <View key={i} style={s.tipRow}>
                <LinearGradient colors={p.gradient} style={s.tipDot}>
                  <Text style={s.tipNum}>{i + 1}</Text>
                </LinearGradient>
                <Text style={[s.tipText, { color: theme.colors.onSurface }]}>{tip}</Text>
              </View>
            ))}
          </Animatable.View>
        )}

        {/* botão acessar */}
        <TouchableOpacity
          onPress={() => Linking.openURL(p.url)}
          activeOpacity={0.88}
          style={{ borderRadius: 18, overflow: 'hidden', marginTop: 14 }}
        >
          <LinearGradient colors={p.gradient} start={{ x:0,y:0 }} end={{ x:1,y:0 }} style={s.accessBtn}>
            <MaterialCommunityIcons name="open-in-new" size={17} color="#fff" />
            <Text style={s.accessBtnText}>Acessar plataforma</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
}

/* ─── TELA PRINCIPAL ─── */
export default function SitesRecomendados({ navigation }) {
  const theme = useTheme();
  const { language } = useContext(UserPreferencesContext);
  const lang  = ['pt-BR','en','es'].includes(language) ? language : 'pt-BR';
  const hero  = HERO[lang] || HERO['pt-BR'];
  const cats  = CATS[lang] || CATS['pt-BR'];

  const [activeCat, setActiveCat] = useState('all');

  const filtered = activeCat === 'all'
    ? PLATFORMS
    : PLATFORMS.filter(p => p.category === activeCat);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ══ HERO ══ */}
        <Animatable.View animation="fadeInDown" duration={500}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x:0,y:0 }} end={{ x:1,y:1 }}
            style={s.hero}
          >
            <View style={s.heroHb1} /><View style={s.heroHb2} />
            <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>
            <MaterialCommunityIcons name="briefcase-search" size={40} color="rgba(255,255,255,0.25)" style={{ marginBottom: 10 }} />
            <Text style={s.heroTitle}>{hero.title}</Text>
            <Text style={s.heroSub}>{hero.sub}</Text>
            <View style={s.heroBadge}>
              <MaterialCommunityIcons name="check-decagram" size={14} color="#fff" />
              <Text style={s.heroBadgeText}>{`${PLATFORMS.length} plataformas selecionadas`}</Text>
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
  );
}

/* ─── styles ─── */
const s = StyleSheet.create({
  hero:      { paddingTop: Platform.OS === 'ios' ? 54 : 44, paddingBottom: 28, paddingHorizontal: 22, overflow: 'hidden' },
  heroHb1:   { position:'absolute', width:200, height:200, borderRadius:100, backgroundColor:'rgba(255,255,255,0.07)', top:-70, right:-50 },
  heroHb2:   { position:'absolute', width:90,  height:90,  borderRadius:45,  backgroundColor:'rgba(255,255,255,0.07)', bottom:-20, left:10 },
  backBtn:   { width:38, height:38, borderRadius:11, backgroundColor:'rgba(255,255,255,0.2)', justifyContent:'center', alignItems:'center', marginBottom:14 },
  heroTitle: { color:'#fff', fontSize:24, fontWeight:'900', letterSpacing:0.2 },
  heroSub:   { color:'rgba(255,255,255,0.85)', fontSize:14, marginTop:6, lineHeight:20 },
  heroBadge: { flexDirection:'row', alignItems:'center', gap:6, marginTop:14, backgroundColor:'rgba(255,255,255,0.2)', alignSelf:'flex-start', paddingVertical:6, paddingHorizontal:14, borderRadius:20 },
  heroBadgeText: { color:'#fff', fontSize:12, fontWeight:'700' },

  catBtn:   { flexDirection:'row', alignItems:'center', gap:6, paddingVertical:9, paddingHorizontal:16, borderRadius:22, borderWidth:1.5 },
  catLabel: { fontSize:13 },

  card:    { borderRadius:22, borderWidth:1.5, overflow:'hidden', elevation:4, shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.09, shadowRadius:10 },
  cardHead:{ padding:18, overflow:'hidden' },
  hb1:     { position:'absolute', width:130, height:130, borderRadius:65, backgroundColor:'rgba(255,255,255,0.08)', top:-50, right:-30 },
  hb2:     { position:'absolute', width:60,  height:60,  borderRadius:30, backgroundColor:'rgba(255,255,255,0.08)', bottom:-15, left:10 },
  cardHeadRow: { flexDirection:'row', alignItems:'center' },
  cardEmoji:   { fontSize:38 },
  cardName:    { color:'#fff', fontSize:20, fontWeight:'900' },
  tagRow:  { flexDirection:'row', marginTop:4 },
  tag:     { backgroundColor:'rgba(255,255,255,0.22)', paddingVertical:3, paddingHorizontal:10, borderRadius:12 },
  tagText: { color:'#fff', fontSize:11, fontWeight:'700' },

  statsRow:  { flexDirection:'row', marginTop:16, gap:4 },
  statItem:  { flex:1, backgroundColor:'rgba(255,255,255,0.18)', borderRadius:12, padding:10, alignItems:'center' },
  statVal:   { color:'#fff', fontSize:15, fontWeight:'900' },
  statLabel: { color:'rgba(255,255,255,0.8)', fontSize:10, marginTop:2, textAlign:'center' },

  cardBody:  { padding:16 },
  desc:      { fontSize:14, lineHeight:21, marginBottom:12 },

  tipsToggle:     { flexDirection:'row', alignItems:'center', gap:8, padding:11, borderRadius:13, borderWidth:1 },
  tipsToggleText: { flex:1, fontSize:13, fontWeight:'700' },

  tipsList: { gap:10, marginTop:12 },
  tipRow:   { flexDirection:'row', alignItems:'flex-start', gap:10 },
  tipDot:   { width:24, height:24, borderRadius:8, justifyContent:'center', alignItems:'center', flexShrink:0 },
  tipNum:   { color:'#fff', fontSize:11, fontWeight:'900' },
  tipText:  { flex:1, fontSize:13, lineHeight:20 },

  accessBtn:     { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, paddingVertical:13 },
  accessBtnText: { color:'#fff', fontWeight:'800', fontSize:14 },
});
