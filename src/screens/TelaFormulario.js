import React, { useState, useContext, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  TextInput,
  Button,
  Card,
  List,
  Avatar,
  Checkbox,
  Divider,
  useTheme,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import CustomDropDown from "../components/CustomDropDown";

// ESTRUTURA ATUALIZADA COM A NOVA SEÇÃO
const ESTRUTURA_INICIAL = {
  nomeInterno: "",
  fotoUri: null,
  fotoBase64: null,
  lastUpdated: null,
  dadosPessoais: {
    nome: "",
    endereco: "",
    telefone: "",
    email: "",
    linkedin: "",
    site: "",
    estado: "",
    cidade: "",
  },
  resumoProfissional: "",
  objetivoProfissional: "",
  formacao: [{ nivel: "", curso: "", instituicao: "", anoConclusao: null }],
  experiencias: [
    {
      cargo: "",
      empresa: "",
      dataInicio: null,
      dataFim: null,
      atual: false,
      atividades: "",
    },
  ],
  certificacoes: [{ nome: "", instituicao: "", anoConclusao: null }], // NOVA SEÇÃO
  habilidades: [{ habilidade: "" }], // SEÇÃO ATUALIZADA
  idiomas: [{ idioma: "", nivel: "" }],
};

export default function TelaFormulario({ navigation, route }) {
  const { t } = useContext(UserPreferencesContext);
  const theme = useTheme();
  const [curriculo, setCurriculo] = useState(ESTRUTURA_INICIAL);
  const [secaoAberta, setSecaoAberta] = useState("dadosPessoais");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerField, setDatePickerField] = useState({
    secao: "",
    index: 0,
    campo: "",
  });

  const indexEdicao = route.params?.index ?? null;

  useFocusEffect(
    useCallback(() => {
      const curriculoParaEditar = route.params?.curriculo;
      const objetivoSelecionado = route.params?.objetivoSelecionado;
      
      if (curriculoParaEditar) {
        const curriculoCarregado = { ...ESTRUTURA_INICIAL, ...curriculoParaEditar };
        if (!curriculoCarregado.certificacoes) {
          curriculoCarregado.certificacoes = ESTRUTURA_INICIAL.certificacoes;
        }
        setCurriculo(curriculoCarregado);
      } else {
        setCurriculo(ESTRUTURA_INICIAL);
      }
      
      if (objetivoSelecionado) {
        setCurriculo(prev => ({ ...prev, objetivoProfissional: objetivoSelecionado }));
        navigation.setParams({ objetivoSelecionado: null });
      }
      
    }, [route.params?.curriculo, route.params?.objetivoSelecionado])
  );

  const handleAccordionPress = (secao) =>
    setSecaoAberta(secaoAberta === secao ? null : secao);

  const handleInputChange = (secao, campo, valor, index = null) => {
    setCurriculo((prev) => {
      if (secao === null) {
        return { ...prev, [campo]: valor };
      }
      if (index !== null) {
        const novaLista = JSON.parse(JSON.stringify(prev[secao] || []));
        novaLista[index] = { ...novaLista[index], [campo]: valor };
        return { ...prev, [secao]: novaLista };
      }
      if (typeof prev[secao] === "object" && prev[secao] !== null) {
        return { ...prev, [secao]: { ...prev[secao], [campo]: valor } };
      }
      return { ...prev, [secao]: valor };
    });
  };

  const adicionarItem = (secao) => {
    const itemNovo = Object.keys(ESTRUTURA_INICIAL[secao][0]).reduce(
      (acc, key) => {
        acc[key] = key.startsWith("data") ? null : key === "atual" ? false : "";
        return acc;
      },
      {}
    );
    setCurriculo((prev) => ({
      ...prev,
      [secao]: [...(prev[secao] || []), itemNovo],
    }));
  };

  const removerItem = (secao, index) => {
    setCurriculo((prev) => ({
      ...prev,
      [secao]: prev[secao].filter((_, i) => i !== index),
    }));
  };

  const openDatePicker = (secao, index, campo) => {
    setDatePickerField({ secao, index, campo });
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const { secao, index, campo } = datePickerField;
      handleInputChange(secao, campo, selectedDate.toISOString(), index);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const escolherDaGaleria = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled) {
      setCurriculo((prev) => ({ ...prev, fotoUri: result.assets[0].uri }));
    }
  };

  const tirarFotoCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled) {
      setCurriculo((prev) => ({ ...prev, fotoUri: result.assets[0].uri }));
    }
  };

  const salvarCurriculo = async () => {
    try {
      const curriculoParaSalvar = { ...curriculo };
      curriculoParaSalvar.lastUpdated = new Date().toISOString();

      if (curriculo.fotoUri && curriculo.fotoUri.startsWith("file://")) {
        const base64 = await FileSystem.readAsStringAsync(curriculo.fotoUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        curriculoParaSalvar.fotoBase64 = `data:image/jpeg;base64,${base64}`;
      }
      const data = await AsyncStorage.getItem("curriculos");
      let lista = data ? JSON.parse(data) : [];
      if (indexEdicao !== null) {
        lista[indexEdicao] = curriculoParaSalvar;
      } else {
        lista.push(curriculoParaSalvar);
      }
      await AsyncStorage.setItem("curriculos", JSON.stringify(lista));
      navigation.navigate("MeusCurriculos");
    } catch (e) {
      console.error("Erro ao salvar currículo", e);
    }
  };

  const educationLevels = Object.entries(t("educationLevels")).map(([value, label]) => ({ label, value }));
  const statesList = Object.entries(t("states")).map(([value, label]) => ({ label, value }));
  const languageLevels = Object.entries(t("languageLevels")).map(([value, label]) => ({ label, value }));

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {showDatePicker && (<DateTimePicker value={new Date()} mode="date" display="default" onChange={onDateChange} />)}

      <Card style={styles.cardHeader}>
        <Card.Content style={styles.headerContent}>
          <TouchableOpacity onPress={escolherDaGaleria}>
            {curriculo.fotoUri ? (
              <Image source={{ uri: curriculo.fotoUri }} style={styles.profileImage} />
            ) : (
              <Avatar.Icon size={90} icon="account-circle" style={styles.headerIcon} />
            )}
          </TouchableOpacity>
          <TextInput
            label={t('internalResumeName')}
            value={curriculo.nomeInterno}
            onChangeText={(text) => handleInputChange(null, "nomeInterno", text)}
            mode="outlined"
            style={[styles.input, { marginTop: 16 }]}
          />
          <Divider style={{ marginVertical: 12, width: '90%' }} />
          <View style={styles.headerButtons}>
            <Button mode="outlined" icon="image" onPress={escolherDaGaleria}>
              {t("gallery")}
            </Button>
            <Button mode="outlined" icon="camera" onPress={tirarFotoCamera}>
              {t("camera")}
            </Button>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.formSection}>
        <Card style={styles.card}>
          <List.Accordion title={t("personalData")} left={(props) => <List.Icon {...props} icon="account" />} expanded={secaoAberta === "dadosPessoais"} onPress={() => handleAccordionPress("dadosPessoais")}>
            <View style={styles.accordionContent}>
              <TextInput label={t("name")} placeholder={t("placeholders.fullName")} value={curriculo.dadosPessoais.nome} onChangeText={(text) => handleInputChange("dadosPessoais", "nome", text)} mode="outlined" style={styles.input} />
              <TextInput label={t("email")} placeholder="seu.email@exemplo.com" value={curriculo.dadosPessoais.email} onChangeText={(text) => handleInputChange("dadosPessoais", "email", text)} mode="outlined" style={styles.input} />
              <TextInput label={t("phone")} placeholder="(11) 99999-8888" value={curriculo.dadosPessoais.telefone} onChangeText={(text) => handleInputChange("dadosPessoais", "telefone", text)} mode="outlined" style={styles.input} />
              <CustomDropDown label={t("state")} value={curriculo.dadosPessoais.estado} setValue={(val) => handleInputChange("dadosPessoais", "estado", val)} list={statesList} />
              <TextInput label={t("city")} placeholder="São Paulo" value={curriculo.dadosPessoais.cidade} onChangeText={(text) => handleInputChange("dadosPessoais", "cidade", text)} mode="outlined" style={styles.input} />
              <TextInput label={t("linkedin")} placeholder="linkedin.com/in/seu-perfil" value={curriculo.dadosPessoais.linkedin} onChangeText={(text) => handleInputChange("dadosPessoais", "linkedin", text)} mode="outlined" style={styles.input} />
              <TextInput label={t("portfolio")} placeholder="github.com/seu-usuario" value={curriculo.dadosPessoais.site} onChangeText={(text) => handleInputChange("dadosPessoais", "site", text)} mode="outlined" style={styles.input} />
            </View>
          </List.Accordion>
        </Card>

        <Card style={styles.card}>
          <List.Accordion title={t("resumeSummary")} left={(props) => <List.Icon {...props} icon="text-account" />} expanded={secaoAberta === "resumo"} onPress={() => handleAccordionPress("resumo")}>
            <View style={styles.accordionContent}>
              <TextInput label={t("summary")} value={curriculo.resumoProfissional} onChangeText={(text) => handleInputChange("resumoProfissional", null, text)} mode="outlined" style={styles.input} multiline numberOfLines={4} />
              <TextInput label={t("objective")} value={curriculo.objetivoProfissional} onChangeText={(text) => handleInputChange("objetivoProfissional", null, text)} mode="outlined" style={styles.input} multiline numberOfLines={3} />
              <Button icon="lightbulb-on-outline" mode="contained-tonal" style={{ marginTop: 10 }} onPress={() => navigation.navigate("ExemplosObjetivo", { onSelect: (texto) => handleInputChange("objetivoProfissional", null, texto) })}>{t("getExamples")}</Button>
            </View>
          </List.Accordion>
        </Card>

        <Card style={styles.card}>
          <List.Accordion title={t("education")} left={(props) => <List.Icon {...props} icon="school" />} expanded={secaoAberta === "formacao"} onPress={() => handleAccordionPress("formacao")}>
            <View style={styles.accordionContent}>
              {(curriculo.formacao || []).map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <CustomDropDown label={t("educationLevel")} value={item.nivel} setValue={(val) => handleInputChange("formacao", "nivel", val, index)} list={educationLevels} />
                  <TextInput label={t("course")} placeholder={t("placeholders.course")} value={item.curso} onChangeText={(text) => handleInputChange("formacao", "curso", text, index)} mode="outlined" style={styles.input} />
                  <TextInput label={t("institution")} placeholder="Nome da Universidade" value={item.instituicao} onChangeText={(text) => handleInputChange("formacao", "instituicao", text, index)} mode="outlined" style={styles.input} />
                  <TouchableOpacity onPress={() => openDatePicker('formacao', index, 'anoConclusao')}>
                    <TextInput label={t("yearConclusion")} value={formatDate(item.anoConclusao)} mode="outlined" style={styles.input} editable={false} right={<TextInput.Icon icon="calendar" />} />
                  </TouchableOpacity>
                  <Button icon="delete" textColor="#E53935" onPress={() => removerItem("formacao", index)} style={styles.deleteButton}>{t("remove")}</Button>
                </View>
              ))}
              <Button icon="plus-circle" mode="contained-tonal" style={{ marginTop: 10 }} onPress={() => adicionarItem("formacao")}>{t("addEducation")}</Button>
            </View>
          </List.Accordion>
        </Card>

        <Card style={styles.card}>
          <List.Accordion title={t("professionalExperience")} left={(props) => <List.Icon {...props} icon="briefcase" />} expanded={secaoAberta === "experiencias"} onPress={() => handleAccordionPress("experiencias")}>
            <View style={styles.accordionContent}>
              {(curriculo.experiencias || []).map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <TextInput label={t("position")} placeholder={t("placeholders.position")} value={item.cargo} onChangeText={(text) => handleInputChange("experiencias", "cargo", text, index)} mode="outlined" style={styles.input} />
                  <TextInput label={t("company")} placeholder="Nome da Empresa" value={item.empresa} onChangeText={(text) => handleInputChange("experiencias", "empresa", text, index)} mode="outlined" style={styles.input} />
                  <View style={styles.dateRow}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => openDatePicker('experiencias', index, 'dataInicio')}>
                      <TextInput label={t("startDate")} value={formatDate(item.dataInicio)} mode="outlined" style={styles.input} editable={false} right={<TextInput.Icon icon="calendar" />} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1 }} disabled={item.atual} onPress={() => openDatePicker('experiencias', index, 'dataFim')}>
                      <TextInput label={t("endDate")} value={formatDate(item.dataFim)} mode="outlined" style={styles.input} editable={false} disabled={item.atual} right={<TextInput.Icon icon="calendar" />} />
                    </TouchableOpacity>
                  </View>
                  <Checkbox.Item label={t("currentJob")} status={item.atual ? 'checked' : 'unchecked'} onPress={() => { const isChecked = !item.atual; handleInputChange('experiencias', 'atual', isChecked, index); if (isChecked) { handleInputChange('experiencias', 'dataFim', null, index); } }} position="leading" labelStyle={{ textAlign: 'left' }} style={styles.checkbox} />
                  <TextInput label={t("activities")} multiline numberOfLines={4} value={item.atividades} onChangeText={(text) => handleInputChange("experiencias", "atividades", text, index)} mode="outlined" style={styles.input} />
                  <Button icon="delete" textColor="#E53935" onPress={() => removerItem("experiencias", index)} style={styles.deleteButton}>{t("remove")}</Button>
                </View>
              ))}
              <Button icon="plus-circle" mode="contained-tonal" style={{ marginTop: 10 }} onPress={() => adicionarItem("experiencias")}>{t("addExperience")}</Button>
            </View>
          </List.Accordion>
        </Card>

        <Card style={styles.card}>
          <List.Accordion title={t("coursesCertifications")} left={(props) => <List.Icon {...props} icon="certificate" />} expanded={secaoAberta === "certificacoes"} onPress={() => handleAccordionPress("certificacoes")}>
            <View style={styles.accordionContent}>
              {(curriculo.certificacoes || []).map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <TextInput label={t("courseName")} placeholder={t("placeholders.courseName")} value={item.nome} onChangeText={(text) => handleInputChange("certificacoes", "nome", text, index)} mode="outlined" style={styles.input} />
                  <TextInput label={t("issuingOrganization")} placeholder={t("placeholders.issuingOrganization")} value={item.instituicao} onChangeText={(text) => handleInputChange("certificacoes", "instituicao", text, index)} mode="outlined" style={styles.input} />
                  <TouchableOpacity onPress={() => openDatePicker('certificacoes', index, 'anoConclusao')}>
                    <TextInput label={t("yearConclusion")} value={formatDate(item.anoConclusao)} mode="outlined" style={styles.input} editable={false} right={<TextInput.Icon icon="calendar" />} />
                  </TouchableOpacity>
                  <Button icon="delete" textColor="#E53935" onPress={() => removerItem("certificacoes", index)} style={styles.deleteButton}>{t("remove")}</Button>
                </View>
              ))}
              <Button icon="plus-circle" mode="contained-tonal" style={{ marginTop: 10 }} onPress={() => adicionarItem("certificacoes")}>{t("addCourse")}</Button>
            </View>
          </List.Accordion>
        </Card>

        <Card style={styles.card}>
          <List.Accordion title={t("competencies")} left={(props) => <List.Icon {...props} icon="star-settings" />} expanded={secaoAberta === "habilidades"} onPress={() => handleAccordionPress("habilidades")}>
            <View style={styles.accordionContent}>
              {(curriculo.habilidades || []).map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <TextInput label={t("skill")} placeholder={t("placeholders.skill")} value={item.habilidade} onChangeText={(text) => handleInputChange("habilidades", "habilidade", text, index)} mode="outlined" style={styles.input} />
                  <Button icon="delete" textColor="#E53935" onPress={() => removerItem("habilidades", index)} style={styles.deleteButton}>{t("remove")}</Button>
                </View>
              ))}
              <Button icon="plus-circle" mode="contained-tonal" style={{ marginTop: 10 }} onPress={() => adicionarItem("habilidades")}>{t("addSkill")}</Button>
            </View>
          </List.Accordion>
        </Card>

        <Card style={styles.card}>
          <List.Accordion title={t("languages")} left={(props) => <List.Icon {...props} icon="translate" />} expanded={secaoAberta === "idiomas"} onPress={() => handleAccordionPress("idiomas")}>
            <View style={styles.accordionContent}>
              {(curriculo.idiomas || []).map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <TextInput label={t("language")} placeholder="Ex: Inglês" value={item.idioma} onChangeText={(text) => handleInputChange("idiomas", "idioma", text, index)} mode="outlined" style={styles.input} />
                  <CustomDropDown label={t("languageLevel")} value={item.nivel} setValue={(val) => handleInputChange("idiomas", "nivel", val, index)} list={languageLevels} />
                  <Button icon="delete" textColor="#E53935" onPress={() => removerItem("idiomas", index)} style={styles.deleteButton}>{t("remove")}</Button>
                </View>
              ))}
              <Button icon="plus-circle" mode="contained-tonal" style={{ marginTop: 10 }} onPress={() => adicionarItem("idiomas")}>{t("addLanguage")}</Button>
            </View>
          </List.Accordion>
        </Card>
      </View>

      <Button icon="content-save-all" mode="contained" style={styles.saveButton} onPress={salvarCurriculo}>
        {indexEdicao !== null ? t("saveChanges") : t("saveResume")}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, paddingBottom: 100, backgroundColor: "#F9FAFB" },
  formSection: { display: "flex", gap: 12 },
  cardHeader: { borderRadius: 16, backgroundColor: "#fff", elevation: 4, marginBottom: 16 },
  headerContent: { alignItems: "center", padding: 16, gap: 8 },
  headerIcon: { backgroundColor: "#E3F2FD" },
  headerButtons: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
  card: { borderRadius: 16, backgroundColor: "#fff", elevation: 2 },
  accordionContent: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8, gap: 10 },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    backgroundColor: '#FAFAFA'
  },
  input: { backgroundColor: "transparent", width: "100%" },
  dateRow: { flexDirection: 'row', gap: 12 },
  checkbox: { marginLeft: -8, marginTop: -4 },
  deleteButton: { alignSelf: 'flex-end', marginTop: 4 },
  saveButton: { marginTop: 24, padding: 10, borderRadius: 30, alignSelf: "center", width: "80%" },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
});