import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// 2. FUNÇÃO PRINCIPAL ATUALIZADA: Agora aceita cor e conhece todos os templates
export async function gerarPDF(curriculo, templateId = "classic", corPrimaria, t) {
  try {
    let htmlContent = "";

    // Switch atualizado com todos os 8 templates e passando a cor primária
    switch (templateId) {
      case "creative":
        htmlContent = templateCreative(curriculo, corPrimaria, t);
        break;
      case "corporate":
        htmlContent = templateCorporate(curriculo, corPrimaria, t);
        break;
      case "elegant":
        htmlContent = templateElegant(curriculo, corPrimaria, t);
        break;
      case "minimalist":
        htmlContent = templateMinimalist(curriculo, corPrimaria, t);
        break;
      case "inverted":
        htmlContent = templateInverted(curriculo, corPrimaria, t);
        break;
      case "split":
        htmlContent = templateSplit(curriculo, corPrimaria, t);
        break;
      case "dark":
        htmlContent = templateDark(curriculo, corPrimaria, t);
        break;
      default: // 'classic'
        htmlContent = templateClassic(curriculo, corPrimaria, t);
    }

    const nomeUsuario = curriculo.dadosPessoais?.nome || "Curriculo";
    const fileName = `${nomeUsuario.replace(/\s+/g, "_")}_${templateId}.pdf`;

    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    await adicionarAoHistorico(curriculo, templateId);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { dialogTitle: fileName });
    } else {
      alert(`📄 PDF gerado com sucesso! Disponível em: ${uri}`);
    }
  } catch (error) {
    console.log("❌ Erro ao gerar PDF:", error);
  }
}