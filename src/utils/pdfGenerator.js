import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {
  templateBlackWhite,
  templateMarketing,
  templateBlueProfessional,
  templatePink,
} from "../utils/pdfTemplates";

export async function gerarPDF(curriculo, template = "blackWhite") {
  try {
    let htmlContent = "";

    switch (template) {
      case "marketing":
        htmlContent = templateMarketing(curriculo);
        break;
      case "blueProfessional":
        htmlContent = templateBlueProfessional(curriculo);
        break;
      case "pink":
        htmlContent = templatePink(curriculo);
        break;
      default:
        htmlContent = templateBlackWhite(curriculo);
    }

    const nomeUsuario = curriculo.dadosPessoais?.nome || "Curriculo";
    const fileName = `${nomeUsuario.replace(/\s+/g, "_")}_Curriculo.pdf`;

    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      fileName,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      alert(`📄 PDF gerado em: ${uri}`);
    }
  } catch (error) {
    console.log("❌ Erro ao gerar PDF:", error);
  }
}
