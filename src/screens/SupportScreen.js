import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  StyleSheet, ScrollView, View, TouchableOpacity,
  Animated, Easing, Dimensions, Linking, Platform,
} from 'react-native';
import { Text, useTheme, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as Clipboard from 'expo-clipboard';
import { UserPreferencesContext } from '../context/UserPreferencesContext';

const { width } = Dimensions.get('window');
const SUPPORT_EMAIL = 'cinehd.ee@gmail.com';

/* ── partícula flutuante ── */
function Particle({ size, color, x, y, duration, delay }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const ty = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -16] });
  const op = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.12, 0.4, 0.12] });
  return (
    <Animated.View style={{
      position: 'absolute', left: x, top: y,
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: color, opacity: op,
      transform: [{ translateY: ty }],
    }} />
  );
}

/* ── canal de contato ── */
function ContactChannel({ icon, gradient, title, subtitle, onPress, delay }) {
  return (
    <Animatable.View animation="fadeInUp" duration={450} delay={delay}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={ch.wrap}>
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ch.icon}>
          <MaterialCommunityIcons name={icon} size={24} color="#fff" />
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={ch.title}>{title}</Text>
          <Text style={ch.subtitle}>{subtitle}</Text>
        </View>
        <MaterialCommunityIcons name="arrow-right" size={18} color="#94A3B8" />
      </TouchableOpacity>
    </Animatable.View>
  );
}

/* ── FAQ item ── */
function FaqItem({ icon, question, answer, accent, index }) {
  const [open, setOpen] = useState(false);
  const rot = useRef(new Animated.Value(0)).current;
  const height = useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  const toggle = () => {
    const toOpen = !open;
    setOpen(toOpen);
    Animated.parallel([
      Animated.timing(rot, { toValue: toOpen ? 1 : 0, duration: 260, useNativeDriver: true }),
      Animated.timing(height, { toValue: toOpen ? 1 : 0, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
  };

  const rotate = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <Animatable.View animation="fadeInUp" duration={400} delay={index * 70}>
      <View style={[faq.wrap, { backgroundColor: theme.colors.surface, borderColor: open ? accent + '40' : theme.colors.outlineVariant }]}>
        {/* barra colorida lateral */}
        <LinearGradient colors={[accent, accent + 'AA']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={faq.stripe} />

        <TouchableOpacity onPress={toggle} activeOpacity={0.75} style={faq.header}>
          <View style={[faq.iconWrap, { backgroundColor: accent + '18' }]}>
            <MaterialCommunityIcons name={icon} size={18} color={accent} />
          </View>
          <Text style={[faq.question, { color: theme.colors.onSurface }]}>{question}</Text>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <MaterialCommunityIcons name="chevron-down" size={20} color={accent} />
          </Animated.View>
        </TouchableOpacity>

        <Animated.View style={{
          maxHeight: height.interpolate({ inputRange: [0, 1], outputRange: [0, 300] }),
          overflow: 'hidden',
        }}>
          <View style={[faq.body, { borderTopColor: theme.colors.outlineVariant }]}>
            <Text style={[faq.answer, { color: theme.colors.onSurfaceVariant }]}>{answer}</Text>
          </View>
        </Animated.View>
      </View>
    </Animatable.View>
  );
}

/* ── TELA PRINCIPAL ── */
export default function SupportScreen() {
  const theme = useTheme();
  const { t, language } = useContext(UserPreferencesContext);
  const [snack, setSnack] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');

  const copyEmail = async () => {
    await Clipboard.setStringAsync(SUPPORT_EMAIL);
    setSnackMsg(language === 'en' ? 'Email copied!' : language === 'es' ? '¡Email copiado!' : 'E-mail copiado!');
    setSnack(true);
  };

  const openEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      language === 'en' ? 'App Feedback' : language === 'es' ? 'Comentario de la App' : 'Feedback do App'
    )}`);
  };

  // FAQ data inline (8 perguntas por idioma)
  const FAQ = {
    'pt-BR': [
      { q: 'Como criar um currículo?',              a: "No menu, vá em 'Criar Novo Currículo', preencha seus dados e, ao terminar, acesse 'Meus Currículos' para exportar em PDF.",                                                                                       icon: 'file-document-edit-outline',  accent: '#4F46E5' },
      { q: 'Onde ficam meus currículos?',            a: "Acesse 'Meus Currículos' no menu lateral para visualizar, editar e gerir todos os seus currículos salvos.",                                                                                                         icon: 'folder-multiple-outline',     accent: '#059669' },
      { q: 'Preciso de internet?',                   a: "Não! O app funciona 100% offline. Apenas o envio de e-mail para suporte precisa de conexão.",                                                                                                                        icon: 'wifi-off',                    accent: '#0891B2' },
      { q: 'Meus dados estão seguros?',              a: "Sim. Todos os dados ficam guardados apenas no seu dispositivo e nunca são enviados para servidores externos, garantindo sua total privacidade.",                                                                     icon: 'shield-check-outline',        accent: '#7C3AED' },
      { q: 'Posso perder meus dados?',               a: "Sim — como os dados ficam apenas no seu dispositivo, desinstalar o app apaga tudo. Exporte seus PDFs regularmente como backup!",                                                                                    icon: 'alert-circle-outline',        accent: '#DC2626' },
      { q: 'Como evitar perder currículos?',         a: "Exporte sempre seus currículos em PDF e salve num local seguro: Google Drive, e-mail ou armazenamento na nuvem.",                                                                                                   icon: 'cloud-upload-outline',        accent: '#D97706' },
      { q: 'Devo colocar foto no currículo?',        a: "Depende da área e cultura da empresa. Em áreas criativas ou de atendimento, uma foto profissional pode ser um diferencial. Em áreas tradicionais, geralmente não é necessário.",                                    icon: 'account-box-outline',         accent: '#BE185D' },
      { q: 'Posso editar após exportar PDF?',        a: "O PDF não pode ser editado diretamente. Volte ao app, edite o currículo em 'Meus Currículos' e exporte uma nova versão atualizada.",                                                                               icon: 'file-edit-outline',           accent: '#0891B2' },
    ],
    'en': [
      { q: 'How do I create a resume?',             a: "In the menu, go to 'Create New Resume', fill in your details, then go to 'My Resumes' to export as a PDF.",                                                                                                         icon: 'file-document-edit-outline',  accent: '#4F46E5' },
      { q: 'Where are my resumes saved?',           a: "Access 'My Resumes' in the side menu to view, edit, and manage all your saved resumes.",                                                                                                                             icon: 'folder-multiple-outline',     accent: '#059669' },
      { q: 'Do I need internet?',                   a: "No! The app works 100% offline. Only sending a support email requires a connection.",                                                                                                                                 icon: 'wifi-off',                    accent: '#0891B2' },
      { q: 'Is my data secure?',                    a: "Yes. All data is stored only on your device and is never sent to external servers, ensuring your complete privacy.",                                                                                                  icon: 'shield-check-outline',        accent: '#7C3AED' },
      { q: 'Can I lose my data?',                   a: "Yes — since data is only on your device, uninstalling the app deletes everything. Export your PDFs regularly as backups!",                                                                                          icon: 'alert-circle-outline',        accent: '#DC2626' },
      { q: 'How to avoid losing resumes?',          a: "Always export your resumes as PDFs and save them in a safe place: Google Drive, email, or cloud storage.",                                                                                                          icon: 'cloud-upload-outline',        accent: '#D97706' },
      { q: 'Should I add a photo?',                 a: "It depends on the field and company culture. For creative or customer-facing roles, a professional photo can be a plus. For traditional fields, it is usually not required.",                                        icon: 'account-box-outline',         accent: '#BE185D' },
      { q: 'Can I edit after exporting PDF?',       a: "The PDF cannot be edited directly. Return to the app, edit the resume in 'My Resumes', and export a new updated version.",                                                                                          icon: 'file-edit-outline',           accent: '#0891B2' },
    ],
    'es': [
      { q: '¿Cómo creo un currículum?',             a: "En el menú, ve a 'Crear Nuevo Currículum', completa tus datos y, al finalizar, ve a 'Mis Currículums' para exportar como PDF.",                                                                                     icon: 'file-document-edit-outline',  accent: '#4F46E5' },
      { q: '¿Dónde están mis currículums?',         a: "Accede a 'Mis Currículums' en el menú lateral para ver, editar y gestionar todos tus currículums guardados.",                                                                                                        icon: 'folder-multiple-outline',     accent: '#059669' },
      { q: '¿Necesito internet?',                   a: "¡No! La app funciona 100% sin conexión. Solo el envío de un correo electrónico de soporte requiere conexión.",                                                                                                       icon: 'wifi-off',                    accent: '#0891B2' },
      { q: '¿Están seguros mis datos?',             a: "Sí. Todos los datos se guardan únicamente en tu dispositivo y nunca se envían a servidores externos, garantizando tu privacidad total.",                                                                             icon: 'shield-check-outline',        accent: '#7C3AED' },
      { q: '¿Puedo perder mis datos?',              a: "Sí — como los datos están solo en tu dispositivo, desinstalar la app borra todo. ¡Exporta tus PDFs regularmente como respaldo!",                                                                                    icon: 'alert-circle-outline',        accent: '#DC2626' },
      { q: '¿Cómo evitar perder currículums?',      a: "Exporta siempre tus currículums en PDF y guárdalos en un lugar seguro: Google Drive, correo electrónico o almacenamiento en la nube.",                                                                              icon: 'cloud-upload-outline',        accent: '#D97706' },
      { q: '¿Debo poner foto en el currículum?',    a: "Depende del campo y la cultura empresarial. Para áreas creativas o de atención al cliente, una foto profesional puede ser un diferenciador positivo. En campos tradicionales, generalmente no es necesario.",       icon: 'account-box-outline',         accent: '#BE185D' },
      { q: '¿Puedo editar después de exportar PDF?',a: "El PDF no se puede editar directamente. Vuelve a la app, edita el currículum en 'Mis Currículums' y exporta una nueva versión actualizada.",                                                                        icon: 'file-edit-outline',           accent: '#0891B2' },
    ],
  };

  const lang = FAQ[language] ? language : 'pt-BR';
  const faqs = FAQ[lang];

  const HERO_TEXT = {
    'pt-BR': { title: 'Suporte & Contato', sub: 'Estamos aqui para ajudar você!' },
    'en':    { title: 'Support & Contact', sub: 'We are here to help you!' },
    'es':    { title: 'Soporte & Contacto', sub: '¡Estamos aquí para ayudarte!' },
  };
  const CHANNEL_TEXT = {
    'pt-BR': {
      title1: 'Enviar E-mail',     sub1: SUPPORT_EMAIL,
      title2: 'Copiar E-mail',     sub2: 'Copie o endereço',
      sectionFaq: 'Perguntas Frequentes',
      sectionContact: 'Fale Conosco',
      contactDesc: 'Encontrou um problema ou tem uma sugestão? Adoro ouvir feedbacks!',
    },
    'en': {
      title1: 'Send Email',        sub1: SUPPORT_EMAIL,
      title2: 'Copy Email',        sub2: 'Copy the address',
      sectionFaq: 'Frequently Asked Questions',
      sectionContact: 'Get in Touch',
      contactDesc: 'Found an issue or have a suggestion? I love hearing feedback!',
    },
    'es': {
      title1: 'Enviar Correo',     sub1: SUPPORT_EMAIL,
      title2: 'Copiar Correo',     sub2: 'Copia la dirección',
      sectionFaq: 'Preguntas Frecuentes',
      sectionContact: 'Contáctanos',
      contactDesc: '¿Encontraste un problema o tienes una sugerencia? ¡Me encanta recibir comentarios!',
    },
  };

  const h  = HERO_TEXT[lang];
  const ch2 = CHANNEL_TEXT[lang];

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ paddingBottom: 56 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ══ HERO ══ */}
        <Animatable.View animation="fadeIn" duration={600}>
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={s.hero}
          >
            <Particle size={120} color="#fff" x={-35}      y={-25}  duration={3600} delay={0}    />
            <Particle size={70}  color="#fff" x={width-80} y={5}    duration={2900} delay={700}  />
            <Particle size={45}  color="#fff" x={width*.6} y={130}  duration={3100} delay={1200} />
            <Particle size={28}  color="#fff" x={50}       y={155}  duration={2700} delay={300}  />

            <Animatable.View animation="bounceIn" duration={900} delay={200} style={s.logoWrap}>
              <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']} style={s.logoOuter}>
                <View style={s.logoInner}>
                  <MaterialCommunityIcons name="headset" size={44} color="#fff" />
                </View>
              </LinearGradient>
              <Animatable.View animation="pulse" iterationCount="infinite" duration={2000} style={s.logoRing} />
            </Animatable.View>

            <Animatable.View animation="fadeInUp" duration={600} delay={400} style={{ alignItems: 'center' }}>
              <Text style={s.heroTitle}>{h.title}</Text>
              <Text style={s.heroSub}>{h.sub}</Text>
            </Animatable.View>

            {/* badges de garantia */}
            <Animatable.View animation="fadeInUp" duration={500} delay={600} style={s.badgeRow}>
              {[
                { icon: 'clock-fast', label: language === 'en' ? 'Fast' : language === 'es' ? 'Rápido' : 'Rápido' },
                { icon: 'lock-outline', label: language === 'en' ? 'Private' : language === 'es' ? 'Privado' : 'Privado' },
                { icon: 'heart-outline', label: language === 'en' ? 'Free' : language === 'es' ? 'Gratis' : 'Grátis' },
              ].map((b, i) => (
                <View key={i} style={s.badge}>
                  <MaterialCommunityIcons name={b.icon} size={14} color="#fff" />
                  <Text style={s.badgeTxt}>{b.label}</Text>
                </View>
              ))}
            </Animatable.View>
          </LinearGradient>
        </Animatable.View>

        <View style={{ padding: 16, gap: 20 }}>

          {/* ══ FALE CONOSCO ══ */}
          <Animatable.View animation="fadeInUp" duration={500} delay={200}>
            <View style={[s.sectionHeader, { borderColor: theme.colors.outlineVariant }]}>
              <LinearGradient colors={['#4F46E5', '#7C3AED']} style={s.sectionIcon}>
                <MaterialCommunityIcons name="message-text" size={18} color="#fff" />
              </LinearGradient>
              <Text style={[s.sectionTitle, { color: theme.colors.onSurface }]}>{ch2.sectionContact}</Text>
            </View>

            <View style={[s.contactCard, { backgroundColor: theme.colors.surface, borderColor: '#4F46E5' + '28' }]}>
              <LinearGradient colors={['#4F46E5', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={s.cardStripe} />
              <View style={{ padding: 16, gap: 14 }}>
                <Text style={[s.contactDesc, { color: theme.colors.onSurfaceVariant }]}>{ch2.contactDesc}</Text>

                <ContactChannel
                  icon="email-fast-outline"
                  gradient={['#4F46E5', '#818CF8']}
                  title={ch2.title1}
                  subtitle={ch2.sub1}
                  onPress={openEmail}
                  delay={250}
                />
                <ContactChannel
                  icon="content-copy"
                  gradient={['#7C3AED', '#C4B5FD']}
                  title={ch2.title2}
                  subtitle={ch2.sub2}
                  onPress={copyEmail}
                  delay={330}
                />

                {/* email em destaque */}
                <Animatable.View animation="fadeInUp" duration={400} delay={410}>
                  <LinearGradient
                    colors={['#4F46E5', '#7C3AED']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={s.emailBanner}
                  >
                    <View style={s.emailBannerHb} />
                    <MaterialCommunityIcons name="email-outline" size={22} color="rgba(255,255,255,0.85)" />
                    <Text style={s.emailBannerTxt}>{SUPPORT_EMAIL}</Text>
                  </LinearGradient>
                </Animatable.View>
              </View>
            </View>
          </Animatable.View>

          {/* ══ FAQ ══ */}
          <Animatable.View animation="fadeInUp" duration={500} delay={400}>
            <View style={[s.sectionHeader, { borderColor: theme.colors.outlineVariant }]}>
              <LinearGradient colors={['#059669', '#34D399']} style={s.sectionIcon}>
                <MaterialCommunityIcons name="frequently-asked-questions" size={18} color="#fff" />
              </LinearGradient>
              <Text style={[s.sectionTitle, { color: theme.colors.onSurface }]}>{ch2.sectionFaq}</Text>
            </View>

            <View style={{ gap: 10 }}>
              {faqs.map((item, i) => (
                <FaqItem
                  key={i}
                  index={i}
                  icon={item.icon}
                  question={item.q}
                  answer={item.a}
                  accent={item.accent}
                />
              ))}
            </View>
          </Animatable.View>

          {/* ══ CARD FINAL ══ */}
          <Animatable.View animation="fadeInUp" duration={500} delay={600}>
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={s.footerCard}
            >
              <View style={s.footerHb} />
              <Animatable.View animation="pulse" iterationCount="infinite" duration={2200}>
                <MaterialCommunityIcons name="hand-heart-outline" size={40} color="rgba(255,255,255,0.9)" />
              </Animatable.View>
              <Text style={s.footerTitle}>
                {language === 'en' ? 'We value your feedback!' : language === 'es' ? '¡Valoramos tu opinión!' : 'Sua opinião importa!'}
              </Text>
              <Text style={s.footerBody}>
                {language === 'en'
                  ? 'Every suggestion helps us improve the app for everyone. Thank you!'
                  : language === 'es'
                  ? 'Cada sugerencia nos ayuda a mejorar la app para todos. ¡Gracias!'
                  : 'Cada sugestão nos ajuda a melhorar o app para todos. Obrigado!'}
              </Text>
            </LinearGradient>
          </Animatable.View>

        </View>
      </ScrollView>

      <Snackbar
        visible={snack}
        onDismiss={() => setSnack(false)}
        duration={3000}
        action={{ label: 'OK', onPress: () => setSnack(false) }}
      >
        {snackMsg}
      </Snackbar>
    </>
  );
}

/* ─── styles ─── */
const s = StyleSheet.create({
  hero:         { paddingTop: Platform.OS === 'ios' ? 54 : 44, paddingBottom: 32, alignItems: 'center', overflow: 'hidden', paddingHorizontal: 20 },
  logoWrap:     { position: 'relative', marginBottom: 20, alignItems: 'center', justifyContent: 'center' },
  logoOuter:    { width: 104, height: 104, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  logoInner:    { width: 82,  height: 82,  borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  logoRing:     { position: 'absolute', width: 120, height: 120, borderRadius: 36, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  heroTitle:    { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 0.3, textAlign: 'center' },
  heroSub:      { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 6, textAlign: 'center' },
  badgeRow:     { flexDirection: 'row', gap: 10, marginTop: 20 },
  badge:        { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.18)', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  badgeTxt:     { color: '#fff', fontSize: 12, fontWeight: '700' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 14, borderBottomWidth: 1, marginBottom: 14 },
  sectionIcon:   { width: 36, height: 36, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  sectionTitle:  { fontSize: 17, fontWeight: '900' },

  contactCard:  { flexDirection: 'row', borderRadius: 20, borderWidth: 1.5, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 8 },
  cardStripe:   { width: 5 },
  contactDesc:  { fontSize: 14, lineHeight: 22 },

  emailBanner:    { borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, overflow: 'hidden' },
  emailBannerHb:  { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.1)', right: -15, top: -20 },
  emailBannerTxt: { color: '#fff', fontSize: 13, fontWeight: '900', flex: 1 },

  footerCard:  { borderRadius: 24, padding: 24, alignItems: 'center', overflow: 'hidden', elevation: 5 },
  footerHb:    { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.07)', top: -60, right: -50 },
  footerTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 12, marginBottom: 8, textAlign: 'center' },
  footerBody:  { color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 22, textAlign: 'center' },
});

const ch = StyleSheet.create({
  wrap:     { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 16, backgroundColor: 'transparent' },
  icon:     { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 5, flexShrink: 0 },
  title:    { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  subtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
});

const faq = StyleSheet.create({
  wrap:     { borderRadius: 18, borderWidth: 1.5, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 5 },
  stripe:   { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  header:   { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingLeft: 18 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  question: { flex: 1, fontSize: 14, fontWeight: '800', lineHeight: 20 },
  body:     { paddingHorizontal: 18, paddingBottom: 16, paddingTop: 12, borderTopWidth: 1 },
  answer:   { fontSize: 13, lineHeight: 21 },
});
