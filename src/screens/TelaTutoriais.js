import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  ScrollView, StyleSheet, View, TouchableOpacity,
  Dimensions, Animated, Easing,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

/* ─────────────────────────────────────────────────────────────
   CONTEÚDO MULTILÍNGUE COMPLETO
   ───────────────────────────────────────────────────────────── */
const CONTENT = {
  'pt-BR': {
    heroTitle: 'Guia Completo de Currículo',
    heroSub: 'Aprenda passo a passo como criar um currículo que abre portas',
    progressLabel: 'Seu progresso',
    quickTips: [
      { icon: 'lightning-bolt',         color: '#4F46E5', title: '30 segundos', desc: 'Tempo médio que um recrutador gasta no currículo' },
      { icon: 'target',                 color: '#059669', title: 'Personalize', desc: 'Adapte o currículo para cada vaga' },
      { icon: 'file-document-outline',  color: '#DC2626', title: '1 página',    desc: 'Ideal para até 5 anos de experiência' },
      { icon: 'spellcheck',             color: '#D97706', title: 'Sem erros',   desc: 'Revise gramática e dados de contato' },
    ],
    modules: [
      {
        id: 'dados',
        icon: 'account-circle',
        color: '#4F46E5',
        gradient: ['#4F46E5', '#818CF8'],
        title: 'Dados Pessoais',
        subtitle: 'A primeira impressão começa aqui',
        intro: 'Os dados pessoais são a porta de entrada do seu currículo. Mantenha apenas o essencial e garanta que todas as informações estejam corretas.',
        tips: [
          { icon: 'check-circle', text: 'Use um e-mail profissional (ex: nome.sobrenome@gmail.com)' },
          { icon: 'check-circle', text: 'Inclua o LinkedIn atualizado com foto e resumo' },
          { icon: 'check-circle', text: 'Informe cidade e estado — não precisa colocar endereço completo' },
          { icon: 'check-circle', text: 'Coloque um portfólio ou GitHub se for da área de tech/design' },
          { icon: 'alert-circle', text: 'Evite: foto inadequada, estado civil, RG ou CPF' },
        ],
        example: {
          label: 'Exemplo de e-mail profissional',
          good: 'maria.silva@gmail.com',
          bad: 'gatinha_mary99@hotmail.com',
        },
        checks: [
          { id: 'dados1', text: 'E-mail profissional configurado' },
          { id: 'dados2', text: 'Telefone com DDD atualizado' },
          { id: 'dados3', text: 'LinkedIn adicionado' },
          { id: 'dados4', text: 'Cidade e estado informados' },
        ],
      },
      {
        id: 'resumo',
        icon: 'text-account',
        color: '#059669',
        gradient: ['#059669', '#34D399'],
        title: 'Resumo Profissional',
        subtitle: 'Seu pitch em 4 linhas',
        intro: 'O resumo profissional é o espaço para você se vender em poucas palavras. Escreva na 3ª pessoa, seja objetivo e destaque seus diferenciais.',
        tips: [
          { icon: 'check-circle', text: 'Máximo de 4 a 5 linhas — seja direto ao ponto' },
          { icon: 'check-circle', text: 'Mencione sua área, anos de experiência e especialidade' },
          { icon: 'check-circle', text: 'Inclua uma conquista marcante com número (ex: +30% de vendas)' },
          { icon: 'check-circle', text: 'Use palavras-chave da vaga que está aplicando' },
          { icon: 'alert-circle', text: 'Evite: "sou uma pessoa proativa e comunicativa" — muito genérico' },
        ],
        example: {
          label: 'Exemplo de resumo profissional',
          good: 'Desenvolvedor front-end com 3 anos de experiência em React e TypeScript. Atuei em projetos para +50 mil usuários e reduzi o tempo de carregamento em 40%.',
          bad: 'Sou uma pessoa dedicada, proativa, que gosta de trabalhar em equipe e está em busca de novos desafios.',
        },
        checks: [
          { id: 'res1', text: 'Máximo de 5 linhas' },
          { id: 'res2', text: 'Contém conquista com número' },
          { id: 'res3', text: 'Sem clichês genéricos' },
          { id: 'res4', text: 'Palavras-chave da área incluídas' },
        ],
      },
      {
        id: 'experiencia',
        icon: 'briefcase',
        color: '#DC2626',
        gradient: ['#DC2626', '#FB7185'],
        title: 'Experiência Profissional',
        subtitle: 'Transforme tarefas em resultados',
        intro: 'A seção de experiências é a mais lida pelos recrutadores. Use verbos de ação no passado e foque em resultados mensuráveis, não apenas em responsabilidades.',
        tips: [
          { icon: 'check-circle', text: 'Comece cada atividade com verbo de ação (Desenvolvi, Gerenciei, Implementei)' },
          { icon: 'check-circle', text: 'Quantifique resultados sempre que possível (%, R$, nº de pessoas)' },
          { icon: 'check-circle', text: 'Liste da experiência mais recente para a mais antiga' },
          { icon: 'check-circle', text: 'Para quem está no primeiro emprego: inclua estágios, freelances e voluntariados' },
          { icon: 'alert-circle', text: 'Evite: listar o que você deveria fazer, não o que você fez' },
        ],
        example: {
          label: 'Como transformar tarefas em resultados',
          good: 'Desenvolvi campanha de marketing digital que gerou R$ 120 mil em vendas em 3 meses.',
          bad: 'Responsável pela criação de campanhas de marketing.',
        },
        checks: [
          { id: 'exp1', text: 'Verbos de ação em cada item' },
          { id: 'exp2', text: 'Resultados quantificados' },
          { id: 'exp3', text: 'Ordem cronológica inversa' },
          { id: 'exp4', text: 'Período com mês e ano' },
        ],
      },
      {
        id: 'formacao',
        icon: 'school',
        color: '#D97706',
        gradient: ['#D97706', '#FCD34D'],
        title: 'Formação Acadêmica',
        subtitle: 'Mostre sua base de conhecimento',
        intro: 'A formação acadêmica valida sua base técnica. Inclua graduações, cursos técnicos e especializações. Recém-formados podem destacar projetos e trabalhos de conclusão.',
        tips: [
          { icon: 'check-circle', text: 'Inclua o nome completo do curso e da instituição' },
          { icon: 'check-circle', text: 'Informe o ano de conclusão (ou "Em andamento - previsão 2025")' },
          { icon: 'check-circle', text: 'Recém-formado? Destaque TCC, projetos práticos e disciplinas relevantes' },
          { icon: 'check-circle', text: 'Cursos rápidos (menos de 40h) vão na seção de Certificações' },
          { icon: 'alert-circle', text: 'Evite: listar o ensino médio se já tiver graduação' },
        ],
        checks: [
          { id: 'form1', text: 'Curso e instituição completos' },
          { id: 'form2', text: 'Ano de conclusão informado' },
          { id: 'form3', text: 'Ordem cronológica inversa' },
        ],
      },
      {
        id: 'habilidades',
        icon: 'star',
        color: '#7C3AED',
        gradient: ['#7C3AED', '#C4B5FD'],
        title: 'Habilidades',
        subtitle: 'Hard skills e Soft skills',
        intro: 'Divida suas habilidades em técnicas (hard skills) e comportamentais (soft skills). Seja específico — "Excel avançado" é melhor que apenas "Excel".',
        tips: [
          { icon: 'check-circle', text: 'Hard skills: ferramentas, linguagens, softwares e técnicas' },
          { icon: 'check-circle', text: 'Soft skills: comunicação, liderança, resolução de problemas' },
          { icon: 'check-circle', text: 'Liste de 5 a 10 habilidades relevantes para a vaga' },
          { icon: 'check-circle', text: 'Seja honesto — você pode ser testado em entrevista' },
          { icon: 'alert-circle', text: 'Evite: "Pacote Office" — especifique "Excel avançado, PowerPoint"' },
        ],
        hardExamples: ['React Native', 'Python', 'SQL', 'Figma', 'Excel avançado', 'Google Analytics'],
        softExamples: ['Liderança', 'Comunicação', 'Pensamento crítico', 'Adaptabilidade', 'Trabalho em equipe'],
        checks: [
          { id: 'skill1', text: '5 a 10 habilidades técnicas listadas' },
          { id: 'skill2', text: 'Habilidades comportamentais incluídas' },
          { id: 'skill3', text: 'Nível de idiomas especificado' },
        ],
      },
      {
        id: 'erros',
        icon: 'alert-circle',
        color: '#EF4444',
        gradient: ['#EF4444', '#FCA5A5'],
        title: 'Erros que Reprovam',
        subtitle: 'Checklist final antes de enviar',
        intro: 'Pequenos erros podem custar uma entrevista. Antes de enviar seu currículo, revise cada item desta lista.',
        errors: [
          { icon: 'close-circle', color: '#EF4444', text: 'Erros de português ou gramática' },
          { icon: 'close-circle', color: '#EF4444', text: 'E-mail ou telefone incorretos' },
          { icon: 'close-circle', color: '#EF4444', text: 'Foto inadequada ou sem foto quando exigida' },
          { icon: 'close-circle', color: '#EF4444', text: 'Currículo genérico para todas as vagas' },
          { icon: 'close-circle', color: '#EF4444', text: 'Informações falsas ou exageradas' },
          { icon: 'close-circle', color: '#EF4444', text: 'Layout confuso, fontes muito variadas' },
          { icon: 'close-circle', color: '#EF4444', text: 'Sem palavras-chave da área ou da vaga' },
          { icon: 'close-circle', color: '#EF4444', text: 'Data de atualização muito antiga' },
        ],
        checks: [
          { id: 'err1', text: 'Revisado ortografia e gramática' },
          { id: 'err2', text: 'Dados de contato conferidos' },
          { id: 'err3', text: 'Layout limpo e organizado' },
          { id: 'err4', text: 'Personalizado para a vaga' },
          { id: 'err5', text: 'Sem informações falsas' },
        ],
      },
    ],
  },

  en: {
    heroTitle: 'Complete Resume Guide',
    heroSub: 'Learn step by step how to create a resume that opens doors',
    progressLabel: 'Your progress',
    quickTips: [
      { icon: 'lightning-bolt',        color: '#4F46E5', title: '30 seconds',  desc: 'Average time a recruiter spends on a resume' },
      { icon: 'target',                color: '#059669', title: 'Customize',   desc: 'Tailor your resume for each job' },
      { icon: 'file-document-outline', color: '#DC2626', title: '1 page',      desc: 'Ideal for up to 5 years of experience' },
      { icon: 'spellcheck',            color: '#D97706', title: 'No errors',   desc: 'Review grammar and contact details' },
    ],
    modules: [
      {
        id: 'dados', icon: 'account-circle', color: '#4F46E5', gradient: ['#4F46E5','#818CF8'],
        title: 'Personal Information', subtitle: 'First impressions start here',
        intro: 'Your personal details are the entry point of your resume. Keep only the essentials and make sure everything is accurate.',
        tips: [
          { icon: 'check-circle', text: 'Use a professional email (e.g. firstname.lastname@gmail.com)' },
          { icon: 'check-circle', text: 'Include an updated LinkedIn with a photo and summary' },
          { icon: 'check-circle', text: 'Add city and state — full address is not necessary' },
          { icon: 'check-circle', text: 'Add a portfolio or GitHub if you are in tech/design' },
          { icon: 'alert-circle', text: 'Avoid: inappropriate photo, marital status, ID numbers' },
        ],
        example: { label: 'Professional email example', good: 'john.smith@gmail.com', bad: 'cool_johnny99@hotmail.com' },
        checks: [
          { id: 'dados1', text: 'Professional email set up' },
          { id: 'dados2', text: 'Phone with area code updated' },
          { id: 'dados3', text: 'LinkedIn added' },
          { id: 'dados4', text: 'City and state filled in' },
        ],
      },
      {
        id: 'resumo', icon: 'text-account', color: '#059669', gradient: ['#059669','#34D399'],
        title: 'Professional Summary', subtitle: 'Your pitch in 4 lines',
        intro: 'The professional summary is your space to sell yourself in a few words. Be objective and highlight your differentiators.',
        tips: [
          { icon: 'check-circle', text: 'Maximum 4 to 5 lines — be direct' },
          { icon: 'check-circle', text: 'Mention your field, years of experience and specialty' },
          { icon: 'check-circle', text: 'Include a notable achievement with a number (e.g. +30% sales)' },
          { icon: 'check-circle', text: 'Use keywords from the job posting' },
          { icon: 'alert-circle', text: 'Avoid: "I am a proactive and communicative person" — too generic' },
        ],
        example: {
          label: 'Professional summary example',
          good: 'Front-end developer with 3 years of experience in React and TypeScript. Worked on projects for 50k+ users and reduced load time by 40%.',
          bad: 'I am a dedicated person who likes to work in a team and is looking for new challenges.',
        },
        checks: [
          { id: 'res1', text: 'Maximum 5 lines' },
          { id: 'res2', text: 'Contains achievement with a number' },
          { id: 'res3', text: 'No generic clichés' },
          { id: 'res4', text: 'Industry keywords included' },
        ],
      },
      {
        id: 'experiencia', icon: 'briefcase', color: '#DC2626', gradient: ['#DC2626','#FB7185'],
        title: 'Work Experience', subtitle: 'Turn tasks into results',
        intro: 'Work experience is the most-read section. Use action verbs in the past tense and focus on measurable results, not just responsibilities.',
        tips: [
          { icon: 'check-circle', text: 'Start each item with an action verb (Developed, Managed, Implemented)' },
          { icon: 'check-circle', text: 'Quantify results whenever possible (%, $, number of people)' },
          { icon: 'check-circle', text: 'List from most recent to oldest' },
          { icon: 'check-circle', text: 'First job? Include internships, freelance, and volunteer work' },
          { icon: 'alert-circle', text: 'Avoid: listing what you were supposed to do, not what you did' },
        ],
        example: {
          label: 'How to turn tasks into results',
          good: 'Developed a digital marketing campaign that generated $24k in sales in 3 months.',
          bad: 'Responsible for creating marketing campaigns.',
        },
        checks: [
          { id: 'exp1', text: 'Action verbs on each item' },
          { id: 'exp2', text: 'Quantified results' },
          { id: 'exp3', text: 'Reverse chronological order' },
          { id: 'exp4', text: 'Period with month and year' },
        ],
      },
      {
        id: 'formacao', icon: 'school', color: '#D97706', gradient: ['#D97706','#FCD34D'],
        title: 'Education', subtitle: 'Show your knowledge base',
        intro: 'Education validates your technical foundation. Include degrees, technical courses, and specializations.',
        tips: [
          { icon: 'check-circle', text: 'Include the full name of the course and institution' },
          { icon: 'check-circle', text: 'State graduation year (or "In progress – expected 2025")' },
          { icon: 'check-circle', text: 'Recent grad? Highlight thesis, practical projects, and relevant subjects' },
          { icon: 'check-circle', text: 'Short courses (<40h) go under Certifications' },
          { icon: 'alert-circle', text: 'Avoid: listing high school if you already have a degree' },
        ],
        checks: [
          { id: 'form1', text: 'Full course and institution name' },
          { id: 'form2', text: 'Graduation year filled in' },
          { id: 'form3', text: 'Reverse chronological order' },
        ],
      },
      {
        id: 'habilidades', icon: 'star', color: '#7C3AED', gradient: ['#7C3AED','#C4B5FD'],
        title: 'Skills', subtitle: 'Hard skills & Soft skills',
        intro: 'Divide your skills into technical (hard skills) and behavioral (soft skills). Be specific — "Advanced Excel" is better than just "Excel".',
        tips: [
          { icon: 'check-circle', text: 'Hard skills: tools, languages, software and techniques' },
          { icon: 'check-circle', text: 'Soft skills: communication, leadership, problem solving' },
          { icon: 'check-circle', text: 'List 5 to 10 skills relevant to the job' },
          { icon: 'check-circle', text: 'Be honest — you may be tested in the interview' },
          { icon: 'alert-circle', text: 'Avoid: "MS Office" — specify "Advanced Excel, PowerPoint"' },
        ],
        hardExamples: ['React Native', 'Python', 'SQL', 'Figma', 'Advanced Excel', 'Google Analytics'],
        softExamples: ['Leadership', 'Communication', 'Critical thinking', 'Adaptability', 'Teamwork'],
        checks: [
          { id: 'skill1', text: '5 to 10 technical skills listed' },
          { id: 'skill2', text: 'Behavioral skills included' },
          { id: 'skill3', text: 'Language levels specified' },
        ],
      },
      {
        id: 'erros', icon: 'alert-circle', color: '#EF4444', gradient: ['#EF4444','#FCA5A5'],
        title: 'Resume Killers', subtitle: 'Final checklist before sending',
        intro: 'Small mistakes can cost you an interview. Before sending, review each item on this list.',
        errors: [
          { icon: 'close-circle', color: '#EF4444', text: 'Grammar or spelling errors' },
          { icon: 'close-circle', color: '#EF4444', text: 'Wrong email or phone number' },
          { icon: 'close-circle', color: '#EF4444', text: 'Inappropriate photo or missing when required' },
          { icon: 'close-circle', color: '#EF4444', text: 'Generic resume for all jobs' },
          { icon: 'close-circle', color: '#EF4444', text: 'False or exaggerated information' },
          { icon: 'close-circle', color: '#EF4444', text: 'Cluttered layout, too many fonts' },
          { icon: 'close-circle', color: '#EF4444', text: 'Missing keywords for the field or job' },
          { icon: 'close-circle', color: '#EF4444', text: 'Very outdated last update date' },
        ],
        checks: [
          { id: 'err1', text: 'Spelling and grammar reviewed' },
          { id: 'err2', text: 'Contact details verified' },
          { id: 'err3', text: 'Clean and organized layout' },
          { id: 'err4', text: 'Tailored to the job posting' },
          { id: 'err5', text: 'No false information' },
        ],
      },
    ],
  },

  es: {
    heroTitle: 'Guía Completa de Currículum',
    heroSub: 'Aprende paso a paso a crear un currículum que abre puertas',
    progressLabel: 'Tu progreso',
    quickTips: [
      { icon: 'lightning-bolt',        color: '#4F46E5', title: '30 segundos', desc: 'Tiempo promedio que un reclutador dedica al currículum' },
      { icon: 'target',                color: '#059669', title: 'Personaliza', desc: 'Adapta el currículum a cada puesto' },
      { icon: 'file-document-outline', color: '#DC2626', title: '1 página',    desc: 'Ideal para hasta 5 años de experiencia' },
      { icon: 'spellcheck',            color: '#D97706', title: 'Sin errores', desc: 'Revisa gramática y datos de contacto' },
    ],
    modules: [
      {
        id: 'dados', icon: 'account-circle', color: '#4F46E5', gradient: ['#4F46E5','#818CF8'],
        title: 'Datos Personales', subtitle: 'La primera impresión empieza aquí',
        intro: 'Los datos personales son la puerta de entrada de tu currículum. Mantén solo lo esencial y asegúrate de que todo sea correcto.',
        tips: [
          { icon: 'check-circle', text: 'Usa un correo profesional (ej: nombre.apellido@gmail.com)' },
          { icon: 'check-circle', text: 'Incluye LinkedIn actualizado con foto y resumen' },
          { icon: 'check-circle', text: 'Pon ciudad y país — no necesitas dirección completa' },
          { icon: 'check-circle', text: 'Agrega portafolio o GitHub si eres de tech/diseño' },
          { icon: 'alert-circle', text: 'Evita: foto inadecuada, estado civil, DNI o número de seguridad social' },
        ],
        example: { label: 'Ejemplo de correo profesional', good: 'maria.garcia@gmail.com', bad: 'gatita_mary99@hotmail.com' },
        checks: [
          { id: 'dados1', text: 'Correo profesional configurado' },
          { id: 'dados2', text: 'Teléfono actualizado' },
          { id: 'dados3', text: 'LinkedIn agregado' },
          { id: 'dados4', text: 'Ciudad y país informados' },
        ],
      },
      {
        id: 'resumo', icon: 'text-account', color: '#059669', gradient: ['#059669','#34D399'],
        title: 'Resumen Profesional', subtitle: 'Tu pitch en 4 líneas',
        intro: 'El resumen profesional es tu espacio para venderte en pocas palabras. Sé objetivo y destaca tus diferenciadores.',
        tips: [
          { icon: 'check-circle', text: 'Máximo 4 a 5 líneas — sé directo' },
          { icon: 'check-circle', text: 'Menciona tu área, años de experiencia y especialidad' },
          { icon: 'check-circle', text: 'Incluye un logro notable con número (ej: +30% en ventas)' },
          { icon: 'check-circle', text: 'Usa palabras clave del puesto al que aplicas' },
          { icon: 'alert-circle', text: 'Evita: "Soy una persona proactiva y comunicativa" — muy genérico' },
        ],
        example: {
          label: 'Ejemplo de resumen profesional',
          good: 'Desarrollador front-end con 3 años de experiencia en React y TypeScript. Trabajé en proyectos para +50 mil usuarios y reduje el tiempo de carga un 40%.',
          bad: 'Soy una persona dedicada que busca nuevos desafíos y le gusta trabajar en equipo.',
        },
        checks: [
          { id: 'res1', text: 'Máximo 5 líneas' },
          { id: 'res2', text: 'Contiene logro con número' },
          { id: 'res3', text: 'Sin clichés genéricos' },
          { id: 'res4', text: 'Palabras clave del área incluidas' },
        ],
      },
      {
        id: 'experiencia', icon: 'briefcase', color: '#DC2626', gradient: ['#DC2626','#FB7185'],
        title: 'Experiencia Profesional', subtitle: 'Convierte tareas en resultados',
        intro: 'La sección de experiencia es la más leída. Usa verbos de acción en pasado y enfócate en resultados medibles, no solo en responsabilidades.',
        tips: [
          { icon: 'check-circle', text: 'Empieza cada actividad con un verbo (Desarrollé, Gestioné, Implementé)' },
          { icon: 'check-circle', text: 'Cuantifica resultados siempre que sea posible (%, $, nº personas)' },
          { icon: 'check-circle', text: 'Lista del más reciente al más antiguo' },
          { icon: 'check-circle', text: '¿Primer empleo? Incluye prácticas, freelances y voluntariados' },
          { icon: 'alert-circle', text: 'Evita: listar lo que debías hacer, no lo que hiciste' },
        ],
        example: {
          label: 'Cómo convertir tareas en resultados',
          good: 'Desarrollé campaña de marketing digital que generó $24k en ventas en 3 meses.',
          bad: 'Responsable de la creación de campañas de marketing.',
        },
        checks: [
          { id: 'exp1', text: 'Verbos de acción en cada ítem' },
          { id: 'exp2', text: 'Resultados cuantificados' },
          { id: 'exp3', text: 'Orden cronológico inverso' },
          { id: 'exp4', text: 'Período con mes y año' },
        ],
      },
      {
        id: 'formacao', icon: 'school', color: '#D97706', gradient: ['#D97706','#FCD34D'],
        title: 'Formación Académica', subtitle: 'Muestra tu base de conocimiento',
        intro: 'La formación académica valida tu base técnica. Incluye títulos, cursos técnicos y especializaciones.',
        tips: [
          { icon: 'check-circle', text: 'Incluye el nombre completo del curso y la institución' },
          { icon: 'check-circle', text: 'Indica el año de graduación (o "En curso – previsión 2025")' },
          { icon: 'check-circle', text: '¿Recién graduado? Destaca TFG, proyectos prácticos y materias relevantes' },
          { icon: 'check-circle', text: 'Cursos cortos (<40h) van en la sección de Certificaciones' },
          { icon: 'alert-circle', text: 'Evita: listar secundaria si ya tienes título universitario' },
        ],
        checks: [
          { id: 'form1', text: 'Curso e institución completos' },
          { id: 'form2', text: 'Año de graduación informado' },
          { id: 'form3', text: 'Orden cronológico inverso' },
        ],
      },
      {
        id: 'habilidades', icon: 'star', color: '#7C3AED', gradient: ['#7C3AED','#C4B5FD'],
        title: 'Habilidades', subtitle: 'Hard skills y Soft skills',
        intro: 'Divide tus habilidades en técnicas (hard skills) y conductuales (soft skills). Sé específico — "Excel avanzado" es mejor que solo "Excel".',
        tips: [
          { icon: 'check-circle', text: 'Hard skills: herramientas, lenguajes, software y técnicas' },
          { icon: 'check-circle', text: 'Soft skills: comunicación, liderazgo, resolución de problemas' },
          { icon: 'check-circle', text: 'Lista de 5 a 10 habilidades relevantes para el puesto' },
          { icon: 'check-circle', text: 'Sé honesto — pueden evaluarte en la entrevista' },
          { icon: 'alert-circle', text: 'Evita: "Paquete Office" — especifica "Excel avanzado, PowerPoint"' },
        ],
        hardExamples: ['React Native', 'Python', 'SQL', 'Figma', 'Excel avanzado', 'Google Analytics'],
        softExamples: ['Liderazgo', 'Comunicación', 'Pensamiento crítico', 'Adaptabilidad', 'Trabajo en equipo'],
        checks: [
          { id: 'skill1', text: '5 a 10 habilidades técnicas listadas' },
          { id: 'skill2', text: 'Habilidades conductuales incluidas' },
          { id: 'skill3', text: 'Niveles de idioma especificados' },
        ],
      },
      {
        id: 'erros', icon: 'alert-circle', color: '#EF4444', gradient: ['#EF4444','#FCA5A5'],
        title: 'Errores que Reprobán', subtitle: 'Lista final antes de enviar',
        intro: 'Pequeños errores pueden costarte una entrevista. Antes de enviar, revisa cada ítem de esta lista.',
        errors: [
          { icon: 'close-circle', color: '#EF4444', text: 'Errores de gramática u ortografía' },
          { icon: 'close-circle', color: '#EF4444', text: 'Correo o teléfono incorrectos' },
          { icon: 'close-circle', color: '#EF4444', text: 'Foto inadecuada o faltante cuando se exige' },
          { icon: 'close-circle', color: '#EF4444', text: 'Currículum genérico para todos los puestos' },
          { icon: 'close-circle', color: '#EF4444', text: 'Información falsa o exagerada' },
          { icon: 'close-circle', color: '#EF4444', text: 'Diseño confuso, demasiadas fuentes' },
          { icon: 'close-circle', color: '#EF4444', text: 'Sin palabras clave del área o del puesto' },
          { icon: 'close-circle', color: '#EF4444', text: 'Fecha de actualización muy antigua' },
        ],
        checks: [
          { id: 'err1', text: 'Ortografía y gramática revisadas' },
          { id: 'err2', text: 'Datos de contacto verificados' },
          { id: 'err3', text: 'Diseño limpio y organizado' },
          { id: 'err4', text: 'Personalizado para el puesto' },
          { id: 'err5', text: 'Sin información falsa' },
        ],
      },
    ],
  },
};

/* ─────────────────────────────────────────────────────────────
   COMPONENTES
   ───────────────────────────────────────────────────────────── */

function QuickTipCard({ item, theme }) {
  return (
    <View style={[qt.card, { backgroundColor: theme.colors.surface, borderColor: item.color + '25' }]}>
      <LinearGradient colors={[item.color, item.color + 'BB']} start={{ x:0,y:0 }} end={{ x:1,y:1 }} style={qt.icon}>
        <MaterialCommunityIcons name={item.icon} size={18} color="#fff" />
      </LinearGradient>
      <Text style={[qt.title, { color: item.color }]}>{item.title}</Text>
      <Text style={[qt.desc, { color: theme.colors.onSurfaceVariant }]}>{item.desc}</Text>
    </View>
  );
}

function ExampleBox({ example, color, theme }) {
  if (!example) return null;
  return (
    <View style={[ex.wrap, { borderColor: color + '30' }]}>
      <Text style={[ex.label, { color: theme.colors.onSurfaceVariant }]}>{example.label}</Text>
      <View style={[ex.good, { backgroundColor: '#05966914', borderColor: '#05966944' }]}>
        <MaterialCommunityIcons name="thumb-up" size={14} color="#059669" />
        <Text style={[ex.goodText, { color: '#059669' }]}>{example.good}</Text>
      </View>
      <View style={[ex.bad, { backgroundColor: '#EF444414', borderColor: '#EF444444' }]}>
        <MaterialCommunityIcons name="thumb-down" size={14} color="#EF4444" />
        <Text style={[ex.badText, { color: '#EF4444' }]}>{example.bad}</Text>
      </View>
    </View>
  );
}

function SkillChips({ items, color }) {
  if (!items?.length) return null;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 6 }}>
      {items.map((s, i) => (
        <View key={i} style={{ backgroundColor: color + '15', borderRadius: 20, paddingVertical: 5, paddingHorizontal: 12, borderWidth: 1, borderColor: color + '30' }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color }}>{s}</Text>
        </View>
      ))}
    </View>
  );
}

function CheckItem({ id, text, checked, onToggle, color }) {
  const scale = useRef(new Animated.Value(1)).current;
  const tap = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1,    duration: 120, useNativeDriver: true }),
    ]).start();
    onToggle(id);
  };
  return (
    <TouchableOpacity onPress={tap} activeOpacity={0.8}>
      <Animated.View style={[ci.row, { transform: [{ scale }] }]}>
        <View style={[ci.box, { backgroundColor: checked ? color : 'transparent', borderColor: checked ? color : '#CBD5E1' }]}>
          {checked && <MaterialCommunityIcons name="check" size={12} color="#fff" />}
        </View>
        <Text style={[ci.text, { textDecorationLine: checked ? 'line-through' : 'none', opacity: checked ? 0.5 : 1, color: '#334155' }]}>{text}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function ModuleCard({ mod, checked, onToggle, theme }) {
  const [open, setOpen] = useState(false);
  const anim  = useRef(new Animated.Value(0)).current;
  const chevR = anim.interpolate({ inputRange:[0,1], outputRange:['0deg','180deg'] });

  const toggle = () => {
    Animated.timing(anim, { toValue: open ? 0 : 1, duration: 250, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
    setOpen(p => !p);
  };

  const total   = mod.checks.length;
  const done    = mod.checks.filter(c => checked[c.id]).length;
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Animatable.View animation="fadeInUp" duration={500} style={[mc.card, { backgroundColor: theme.colors.surface, borderColor: mod.color + '28' }]}>
      {/* faixa lateral */}
      <LinearGradient colors={mod.gradient} start={{ x:0,y:0 }} end={{ x:0,y:1 }} style={mc.stripe} />

      <View style={{ flex: 1 }}>
        {/* cabeçalho */}
        <TouchableOpacity onPress={toggle} activeOpacity={0.8} style={mc.header}>
          <LinearGradient colors={mod.gradient} start={{ x:0,y:0 }} end={{ x:1,y:1 }} style={mc.iconBox}>
            <MaterialCommunityIcons name={mod.icon} size={20} color="#fff" />
          </LinearGradient>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[mc.title, { color: theme.colors.onSurface }]}>{mod.title}</Text>
            <Text style={[mc.sub, { color: theme.colors.onSurfaceVariant }]}>{mod.subtitle}</Text>
          </View>
          {/* badge de progresso */}
          <View style={[mc.badge, { backgroundColor: pct === 100 ? '#05966922' : mod.color + '18' }]}>
            <Text style={[mc.badgeText, { color: pct === 100 ? '#059669' : mod.color }]}>{`${done}/${total}`}</Text>
          </View>
          <Animated.View style={{ transform: [{ rotate: chevR }], marginLeft: 6 }}>
            <MaterialCommunityIcons name="chevron-down" size={20} color={theme.colors.onSurfaceVariant} />
          </Animated.View>
        </TouchableOpacity>

        {/* barra de progresso */}
        <View style={[mc.progressTrack, { backgroundColor: theme.colors.outlineVariant }]}>
          <LinearGradient colors={mod.gradient} start={{ x:0,y:0 }} end={{ x:1,y:0 }} style={[mc.progressFill, { width: `${pct}%` }]} />
        </View>

        {/* conteúdo expansível */}
        {open && (
          <Animatable.View animation="fadeIn" duration={300} style={mc.body}>
            {/* intro */}
            <Text style={[mc.intro, { color: theme.colors.onSurfaceVariant }]}>{mod.intro}</Text>

            {/* dicas */}
            <View style={[mc.section, { backgroundColor: mod.color + '08', borderColor: mod.color + '20' }]}>
              {mod.tips.map((tip, i) => (
                <View key={i} style={mc.tipRow}>
                  <MaterialCommunityIcons
                    name={tip.icon}
                    size={16}
                    color={tip.icon === 'alert-circle' ? '#EF4444' : mod.color}
                  />
                  <Text style={[mc.tipText, { color: tip.icon === 'alert-circle' ? '#EF4444' : theme.colors.onSurface }]}>{tip.text}</Text>
                </View>
              ))}
            </View>

            {/* exemplos de bom/mau */}
            {mod.example && <ExampleBox example={mod.example} color={mod.color} theme={theme} />}

            {/* chips de habilidades */}
            {mod.hardExamples && (
              <View style={{ marginBottom: 12 }}>
                <Text style={[mc.chipLabel, { color: theme.colors.onSurfaceVariant }]}>Hard skills</Text>
                <SkillChips items={mod.hardExamples} color={mod.color} />
                {mod.softExamples && (
                  <>
                    <Text style={[mc.chipLabel, { color: theme.colors.onSurfaceVariant, marginTop: 10 }]}>Soft skills</Text>
                    <SkillChips items={mod.softExamples} color="#BE185D" />
                  </>
                )}
              </View>
            )}

            {/* lista de erros */}
            {mod.errors && (
              <View style={[mc.errBox, { backgroundColor: '#EF444408', borderColor: '#EF444430' }]}>
                {mod.errors.map((e, i) => (
                  <View key={i} style={mc.errRow}>
                    <MaterialCommunityIcons name={e.icon} size={15} color={e.color} />
                    <Text style={[mc.errText, { color: theme.colors.onSurface }]}>{e.text}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* checklist */}
            <View style={[mc.checkSection, { borderTopColor: theme.colors.outlineVariant }]}>
              <Text style={[mc.checkTitle, { color: mod.color }]}>
                {pct === 100 ? '✓ Completo!' : 'Checklist'}
              </Text>
              {mod.checks.map(c => (
                <CheckItem key={c.id} id={c.id} text={c.text} checked={!!checked[c.id]} onToggle={onToggle} color={mod.color} />
              ))}
            </View>
          </Animatable.View>
        )}
      </View>
    </Animatable.View>
  );
}

/* ─────────────────────────────────────────────────────────────
   TELA PRINCIPAL
   ───────────────────────────────────────────────────────────── */
export default function TelaTutoriais() {
  const theme   = useTheme();
  const { language } = useContext(UserPreferencesContext);
  const lang    = CONTENT[language] || CONTENT['pt-BR'];

  const [checked, setChecked] = useState({});

  useEffect(() => {
    AsyncStorage.getItem('checklist_tutoriais').then(v => {
      if (v) setChecked(JSON.parse(v));
    });
  }, []);

  const onToggle = async (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    await AsyncStorage.setItem('checklist_tutoriais', JSON.stringify(next));
  };

  // progresso global
  const allChecks = lang.modules.flatMap(m => m.checks);
  const totalAll  = allChecks.length;
  const doneAll   = allChecks.filter(c => checked[c.id]).length;
  const pctAll    = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ══ HERO ══ */}
      <Animatable.View animation="fadeInDown" duration={550}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x:0,y:0 }} end={{ x:1,y:1 }}
          style={h.hero}
        >
          <View style={h.hb1} /><View style={h.hb2} />
          <MaterialCommunityIcons name="book-open-variant" size={36} color="rgba(255,255,255,0.25)" style={{ marginBottom: 10 }} />
          <Text style={h.title}>{lang.heroTitle}</Text>
          <Text style={h.sub}>{lang.heroSub}</Text>

          {/* progresso global */}
          <View style={h.progRow}>
            <Text style={h.progLabel}>{lang.progressLabel}</Text>
            <Text style={h.progPct}>{`${pctAll}%`}</Text>
          </View>
          <View style={h.progTrack}>
            <Animatable.View
              animation="slideInLeft" duration={800} delay={300}
              style={[h.progFill, { width: `${pctAll}%` }]}
            />
          </View>
        </LinearGradient>
      </Animatable.View>

      {/* ══ QUICK TIPS (scroll horizontal) ══ */}
      <Animatable.View animation="fadeInUp" duration={500} delay={150}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 12 }}>
          {lang.quickTips.map((tip, i) => (
            <QuickTipCard key={i} item={tip} theme={theme} />
          ))}
        </ScrollView>
      </Animatable.View>

      {/* ══ MÓDULOS ══ */}
      <View style={{ paddingHorizontal: 16, gap: 14 }}>
        {lang.modules.map((mod, i) => (
          <ModuleCard key={mod.id} mod={mod} checked={checked} onToggle={onToggle} theme={theme} />
        ))}
      </View>
    </ScrollView>
  );
}

/* ─── StyleSheets ─── */
const h = StyleSheet.create({
  hero:      { paddingTop: 28, paddingBottom: 28, paddingHorizontal: 22, overflow: 'hidden' },
  hb1:       { position:'absolute', width:200, height:200, borderRadius:100, backgroundColor:'rgba(255,255,255,0.07)', top:-80, right:-60 },
  hb2:       { position:'absolute', width:80,  height:80,  borderRadius:40,  backgroundColor:'rgba(255,255,255,0.07)', bottom:-20, left:20 },
  title:     { color:'#fff', fontSize:22, fontWeight:'900', letterSpacing:0.2 },
  sub:       { color:'rgba(255,255,255,0.8)', fontSize:14, marginTop:6, lineHeight:20 },
  progRow:   { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:20, marginBottom:6 },
  progLabel: { color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:'700' },
  progPct:   { color:'#fff', fontSize:15, fontWeight:'900' },
  progTrack: { height:7, borderRadius:4, backgroundColor:'rgba(255,255,255,0.25)', overflow:'hidden' },
  progFill:  { height:7, borderRadius:4, backgroundColor:'#fff' },
});

const qt = StyleSheet.create({
  card:  { width: 130, borderRadius: 18, borderWidth: 1, padding: 14, gap: 8, elevation: 2, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.06, shadowRadius:4 },
  icon:  { width: 36, height: 36, borderRadius: 11, justifyContent:'center', alignItems:'center' },
  title: { fontSize: 14, fontWeight: '900' },
  desc:  { fontSize: 11, lineHeight: 15 },
});

const mc = StyleSheet.create({
  card:    { flexDirection:'row', borderRadius:20, borderWidth:1.5, overflow:'hidden', elevation:3, shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.07, shadowRadius:8 },
  stripe:  { width: 5 },
  header:  { flexDirection:'row', alignItems:'center', padding:16 },
  iconBox: { width:42, height:42, borderRadius:13, justifyContent:'center', alignItems:'center', flexShrink:0 },
  title:   { fontSize:16, fontWeight:'800' },
  sub:     { fontSize:12, marginTop:2 },
  badge:   { borderRadius:20, paddingVertical:4, paddingHorizontal:10 },
  badgeText: { fontSize:12, fontWeight:'800' },
  progressTrack: { height:4, marginHorizontal:16, borderRadius:2, overflow:'hidden' },
  progressFill:  { height:4, borderRadius:2 },
  body:    { paddingHorizontal:16, paddingBottom:16, paddingTop:8 },
  intro:   { fontSize:14, lineHeight:22, marginBottom:14 },
  section: { borderRadius:14, borderWidth:1, padding:12, gap:10, marginBottom:14 },
  tipRow:  { flexDirection:'row', alignItems:'flex-start', gap:8 },
  tipText: { flex:1, fontSize:13, lineHeight:20 },
  chipLabel: { fontSize:12, fontWeight:'700', marginBottom:4 },
  errBox:  { borderRadius:14, borderWidth:1, padding:12, gap:9, marginBottom:14 },
  errRow:  { flexDirection:'row', alignItems:'center', gap:8 },
  errText: { flex:1, fontSize:13, lineHeight:19 },
  checkSection: { borderTopWidth:1, paddingTop:14, gap:4 },
  checkTitle:   { fontSize:13, fontWeight:'800', marginBottom:8 },
});

const ci = StyleSheet.create({
  row:  { flexDirection:'row', alignItems:'center', gap:10, paddingVertical:8 },
  box:  { width:22, height:22, borderRadius:7, borderWidth:2, justifyContent:'center', alignItems:'center', flexShrink:0 },
  text: { flex:1, fontSize:13, lineHeight:20, color:'#334155' },
});

const ex = StyleSheet.create({
  wrap:     { borderRadius:14, borderWidth:1, padding:12, marginBottom:14, gap:10 },
  label:    { fontSize:12, fontWeight:'700', marginBottom:2 },
  good:     { flexDirection:'row', alignItems:'flex-start', gap:8, padding:10, borderRadius:10, borderWidth:1 },
  bad:      { flexDirection:'row', alignItems:'flex-start', gap:8, padding:10, borderRadius:10, borderWidth:1 },
  goodText: { flex:1, fontSize:13, lineHeight:19, fontWeight:'600' },
  badText:  { flex:1, fontSize:13, lineHeight:19, fontWeight:'600' },
});
