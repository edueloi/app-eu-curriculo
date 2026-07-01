import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { translations } from '../i18n/translations';

// 1. IMPORTAÇÃO ATUALIZADA: Importando todos os 8 templates
import {
  templateClassic,
  templateCreative,
  templateCorporate,
  templateElegant,
  templateMinimalist,
  templateInverted,
  templateSplit,
  templateDark,
  templateTimeline,
  templateSideRight,
  templateBold,
  templateCompact,
} from "../utils/pdfTemplates";

// Função para adicionar um registo ao histórico (mantida como está)
const adicionarAoHistorico = async (curriculo, templateId) => {
  const novoRegistro = {
    id: Date.now(),
    nome: `${curriculo.dadosPessoais.nome.split(' ')[0]}_${templateId}.pdf`,
    data: new Date().toISOString(),
    curriculo: curriculo,
    templateId: templateId,
  };

  try {
    const historicoAtual = await AsyncStorage.getItem('historico_pdfs');
    const lista = historicoAtual ? JSON.parse(historicoAtual) : [];
    lista.unshift(novoRegistro); 
    await AsyncStorage.setItem('historico_pdfs', JSON.stringify(lista));
    console.log("✅ Histórico de exportação salvo com sucesso!");
  } catch (e) {
    console.error("❌ Erro ao salvar no histórico:", e);
  }
};

// tradução baseada no idioma do currículo
const makeTForCurriculo = (curriculo) => (key) => {
  if (!key) return '';
  const keys = key.split('.');
  let result = translations[curriculo?.idiomaCurriculo] ?? translations['pt-BR'];
  for (const k of keys) { result = result?.[k]; if (result === undefined) return key; }
  return result || key;
};

// 2. FUNÇÃO PRINCIPAL ATUALIZADA: Agora aceita cor e conhece todos os templates
export async function gerarPDF(curriculo, templateId = "classic", corPrimaria, t) {
  const tCurriculo = makeTForCurriculo(curriculo);
  try {
    let htmlContent = "";

    // Switch atualizado com todos os 8 templates e passando a cor primária
    switch (templateId) {
      case "creative":
        htmlContent = templateCreative(curriculo, corPrimaria, tCurriculo);
        break;
      case "corporate":
        htmlContent = templateCorporate(curriculo, corPrimaria, tCurriculo);
        break;
      case "elegant":
        htmlContent = templateElegant(curriculo, corPrimaria, tCurriculo);
        break;
      case "minimalist":
        htmlContent = templateMinimalist(curriculo, corPrimaria, tCurriculo);
        break;
      case "inverted":
        htmlContent = templateInverted(curriculo, corPrimaria, tCurriculo);
        break;
      case "split":
        htmlContent = templateSplit(curriculo, corPrimaria, tCurriculo);
        break;
      case "dark":
        htmlContent = templateDark(curriculo, corPrimaria, tCurriculo);
        break;
      case "timeline":
        htmlContent = templateTimeline(curriculo, corPrimaria, tCurriculo);
        break;
      case "sideright":
        htmlContent = templateSideRight(curriculo, corPrimaria, tCurriculo);
        break;
      case "bold":
        htmlContent = templateBold(curriculo, corPrimaria, tCurriculo);
        break;
      case "compact":
        htmlContent = templateCompact(curriculo, corPrimaria, tCurriculo);
        break;
      default: // 'classic'
        htmlContent = templateClassic(curriculo, corPrimaria, tCurriculo);
    }

    const nomeUsuario = curriculo.dadosPessoais?.nome || "Curriculo";
    // Tira os acentos e ajusta espaços para evitar problemas no nome do arquivo
    const cleanName = nomeUsuario.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_");
    const fileName = `${cleanName}_${templateId}.pdf`;

    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });
    
    const newUri = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.moveAsync({
      from: uri,
      to: newUri,
    });

    await adicionarAoHistorico(curriculo, templateId);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(newUri, { UTI: '.pdf', mimeType: 'application/pdf', dialogTitle: fileName });
    } else {
      alert(`📄 PDF gerado com sucesso! Disponível em: ${newUri}`);
    }
  } catch (error) {
    console.log("❌ Erro ao gerar PDF:", error);
  }
}