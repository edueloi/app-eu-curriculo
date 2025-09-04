import React, { useState, useEffect, useContext } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Image, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { TextInput, Button, Card, Title, List, Avatar, Checkbox } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker";
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import CustomDropDown from "../components/CustomDropDown";
import ExemplosObjetivo from "../screens/ExemplosObjetivo";

const ESTRUTURA_INICIAL = {
  nomeInterno: "",
  fotoUri: null,
  fotoBase64: null,
  dadosPessoais: { nome: "", endereco: "", telefone: "", email: "", linkedin: "", site: "", estado: "", cidade: "" },
  resumoProfissional: "",
  objetivoProfissional: "",
  formacao: [{ nivel: "", curso: "", instituicao: "", anoConclusao: null }],
  experiencias: [{ cargo: "", empresa: "", dataInicio: null, dataFim: null, atual: false, atividades: "" }],
  habilidades: [{ habilidade: "", nivel: "" }],
  idiomas: [{ idioma: "", nivel: "" }],
};

export default function TelaFormulario({ navigation, route }) {
  const { t } = useContext(UserPreferencesContext);
  const [curriculo, setCurriculo] = useState(ESTRUTURA_INICIAL);
  const [secaoAberta, setSecaoAberta] = useState("dadosPessoais");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerField, setDatePickerField] = useState({ secao: '', index: 0, campo: '' });

  const indexEdicao = route.params?.index ?? null;

  useEffect(() => {
    if (route.params?.curriculo) {
      const curriculoCarregado = route.params.curriculo;
      Object.keys(ESTRUTURA_INICIAL).forEach(secao => {
        if (!curriculoCarregado[secao]) {
          curriculoCarregado[secao] = ESTRUTURA_INICIAL[secao];
        }
      });
      setCurriculo(curriculoCarregado);
    }
  }, [route.params]);
  
  const handleAccordionPress = (secao) => setSecaoAberta(secaoAberta === secao ? null : secao);

  const handleInputChange = (secao, campo, valor, index = null) => {
    setCurriculo((prev) => {
      if (index !== null) {
        const novaLista = JSON.parse(JSON.stringify(prev[secao]));
        novaLista[index][campo] = valor;
        return { ...prev, [secao]: novaLista };
      }
      if (typeof prev[secao] === "object" && prev[secao] !== null) {
        return { ...prev, [secao]: { ...prev[secao], [campo]: valor } };
      }
      return { ...prev, [secao]: valor };
    });
  };

  const adicionarItem = (secao) => {
    const itemNovo = Object.keys(ESTRUTURA_INICIAL[secao][0]).reduce((acc, key) => {
      acc[key] = key.startsWith('data') ? null : (key === 'atual' ? false : '');
      return acc;
    }, {});
    setCurriculo((prev) => ({ ...prev, [secao]: [...(prev[secao] || []), itemNovo] }));
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
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const { secao, index, campo } = datePickerField;
      handleInputChange(secao, campo, selectedDate.toISOString(), index);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
      if (curriculo.fotoUri && curriculo.fotoUri.startsWith("file://")) {
        const base64 = await FileSystem.readAsStringAsync(curriculo.fotoUri, { encoding: FileSystem.EncodingType.Base64 });
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
      navigation.navigate("MeusCurrículos");
    } catch (e) {
      console.error("Erro ao salvar currículo", e);
    }
  };

  const educationLevels = Object.entries(t("educationLevels")).map(([value, label]) => ({ label, value }));
  const statesList = Object.entries(t("states")).map(([value, label]) => ({ label, value }));
  const skillLevels = Object.entries(t("skillLevels")).map(([value, label]) => ({ label, value }));
  const languageLevels = Object.entries(t("languageLevels")).map(([value, label]) => ({ label, value }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {showDatePicker && (<DateTimePicker value={new Date()} mode="date" display="default" onChange={onDateChange} />)}

      <Card style={styles.card}>
        <Card.Content style={styles.headerContent}>
          <TouchableOpacity onPress={escolherDaGaleria}>
            {curriculo.fotoUri ? (<Image source={{ uri: curriculo.fotoUri }} style={styles.profileImage} />) : (<Avatar.Icon size={80} icon="camera" style={styles.headerIcon} />)}
          </TouchableOpacity>
          <View style={styles.headerButtons}>
            <Button mode="outlined" icon="image" onPress={escolherDaGaleria} style={{ marginRight: 5 }}>{t("gallery")}</Button>
            <Button mode="outlined" icon="camera" onPress={tirarFotoCamera}>{t("camera")}</Button>
          </View>
          <Title style={styles.headerTitle}>{indexEdicao !== null ? t("saveChanges") : t("createResume")}</Title>
        </Card.Content>
      </Card>

      <List.Section style={styles.formSection}>
        <Card style={styles.card}>
          <List.Accordion title={t("personalData")} left={(props) => <List.Icon {...props} icon="account" />} expanded={secaoAberta === "dadosPessoais"} onPress={() => handleAccordionPress("dadosPessoais")}>
            <View style={styles.accordionContent}>
              <TextInput label={t("name")} value={curriculo.dadosPessoais.nome} onChangeText={(text) => handleInputChange("dadosPessoais", "nome", text)} mode="outlined" style={styles.input} />
              <TextInput label={t("email")} value={curriculo.dadosPessoais.email} onChangeText={(text) => handleInputChange("dadosPessoais", "email", text)} mode="outlined" style={styles.input} />
              <TextInput label={t("phone")} value={curriculo.dadosPessoais.telefone} onChangeText={(text) => handleInputChange("dadosPessoais", "telefone", text)} mode="outlined" style={styles.input} />
              <CustomDropDown label={t("state")} value={curriculo.dadosPessoais.estado} setValue={(val) => handleInputChange("dadosPessoais", "estado", val)} list={statesList} />
              <TextInput label={t("city")} value={curriculo.dadosPessoais.cidade} onChangeText={(text) => handleInputChange("dadosPessoais", "cidade", text)} mode="outlined" style={styles.input} />
              <TextInput label={t("linkedin")} value={curriculo.dadosPessoais.linkedin} onChangeText={(text) => handleInputChange("dadosPessoais", "linkedin", text)} mode="outlined" style={styles.input} />
              <TextInput label={t("portfolio")} value={curriculo.dadosPessoais.site} onChangeText={(text) => handleInputChange("dadosPessoais", "site", text)} mode="outlined" style={styles.input} />
            </View>
          </List.Accordion>
        </Card>
        
        <Card style={styles.card}>
            <List.Accordion title={t("resumeSummary")} left={(props) => <List.Icon {...props} icon="text-account" />} expanded={secaoAberta === "resumo"} onPress={() => handleAccordionPress("resumo")}>
                <View style={styles.accordionContent}>
                  <TextInput label={t("summary")} value={curriculo.resumoProfissional} onChangeText={(text) => handleInputChange("resumoProfissional", null, text)} mode="outlined" style={styles.input} multiline numberOfLines={4}/>
                  <TextInput label={t("objective")} value={curriculo.objetivoProfissional} onChangeText={(text) => handleInputChange("objetivoProfissional", null, text)} mode="outlined" style={styles.input} multiline numberOfLines={3}/>
                  <Button
                    mode="outlined"
                    icon="lightbulb"
                    onPress={() =>
                      navigation.navigate("ExemplosObjetivo", {
                        onSelect: (texto) =>
                          handleInputChange("objetivoProfissional", null, texto),
                      })
                    }
                  >
                    Adicionar Exemplo
                  </Button>
                </View>
            </List.Accordion>
        </Card>

        <Card style={styles.card}>
            <List.Accordion title={t("education")} left={(props) => <List.Icon {...props} icon="school" />} expanded={secaoAberta === "formacao"} onPress={() => handleAccordionPress("formacao")}>
                <View style={styles.accordionContent}>
                    {(curriculo.formacao || []).map((item, index) => (
                        <Card key={index} style={styles.itemCard}>
                            <Card.Content>
                                <CustomDropDown label={t("educationLevel")} value={item.nivel} setValue={(val) => handleInputChange("formacao", "nivel", val, index)} list={educationLevels} />
                                <TextInput label={t("course")} value={item.curso} onChangeText={(text) => handleInputChange("formacao", "curso", text, index)} mode="outlined" style={styles.input}/>
                                <TextInput label={t("institution")} value={item.instituicao} onChangeText={(text) => handleInputChange("formacao", "instituicao", text, index)} mode="outlined" style={styles.input}/>
                                <TouchableOpacity onPress={() => openDatePicker('formacao', index, 'anoConclusao')}>
                                  <TextInput label={t("yearConclusion")} value={formatDate(item.anoConclusao)} mode="outlined" style={styles.input} editable={false} right={<TextInput.Icon icon="calendar" />} />
                                </TouchableOpacity>
                            </Card.Content>
                            <Card.Actions style={styles.cardActions}>
                                <Button icon="delete" textColor="#E53935" onPress={() => removerItem("formacao", index)} style={styles.deleteButton}>{t("remove")}</Button>
                            </Card.Actions>
                        </Card>
                    ))}
                    <Button icon="plus-circle" mode="contained-tonal" onPress={() => adicionarItem("formacao")} style={{ marginTop: 16 }}>{t("addEducation")}</Button>
                </View>
            </List.Accordion>
        </Card>
        
        <Card style={styles.card}>
          <List.Accordion title={t("professionalExperience")} left={(props) => <List.Icon {...props} icon="briefcase" />} expanded={secaoAberta === "experiencias"} onPress={() => handleAccordionPress("experiencias")}>
            <View style={styles.accordionContent}>
              {(curriculo.experiencias || []).map((item, index) => (
                <Card key={index} style={styles.itemCard}>
                  <Card.Content>
                    <TextInput label={t("position")} value={item.cargo} onChangeText={(text) => handleInputChange("experiencias", "cargo", text, index)} mode="outlined" style={styles.input} />
                    <TextInput label={t("company")} value={item.empresa} onChangeText={(text) => handleInputChange("experiencias", "empresa", text, index)} mode="outlined" style={styles.input} />
                    <View style={styles.dateRow}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => openDatePicker('experiencias', index, 'dataInicio')}>
                            <TextInput label={t("startDate")} value={formatDate(item.dataInicio)} mode="outlined" style={styles.input} editable={false} right={<TextInput.Icon icon="calendar" />} />
                        </TouchableOpacity>
                        <View style={{ width: 12 }} />
                        <TouchableOpacity style={{ flex: 1 }} disabled={item.atual} onPress={() => openDatePicker('experiencias', index, 'dataFim')}>
                             <TextInput label={t("endDate")} value={formatDate(item.dataFim)} mode="outlined" style={styles.input} editable={false} disabled={item.atual} right={<TextInput.Icon icon="calendar" />} />
                        </TouchableOpacity>
                    </View>
                    <Checkbox.Item label={t("currentJob")} status={item.atual ? 'checked' : 'unchecked'} onPress={() => { const isChecked = !item.atual; handleInputChange('experiencias', 'atual', isChecked, index); if(isChecked) { handleInputChange('experiencias', 'dataFim', null, index); } }} position="leading" labelStyle={{ textAlign: 'left' }} style={styles.checkbox}/>
                    <TextInput label={t("activities")} value={item.atividades} onChangeText={(text) => handleInputChange("experiencias", "atividades", text, index)} mode="outlined" style={styles.input} multiline numberOfLines={4} />
                  </Card.Content>
                  <Card.Actions style={styles.cardActions}>
                      <Button icon="delete" textColor="#E53935" onPress={() => removerItem("experiencias", index)} style={styles.deleteButton}>{t("remove")}</Button>
                  </Card.Actions>
                </Card>
              ))}
              <Button icon="plus-circle" mode="contained-tonal" onPress={() => adicionarItem("experiencias")} style={{ marginTop: 16 }}>{t("addExperience")}</Button>
            </View>
          </List.Accordion>
        </Card>
        
        <Card style={styles.card}>
            <List.Accordion title={t("skills")} left={(props) => <List.Icon {...props} icon="star-settings" />} expanded={secaoAberta === "habilidades"} onPress={() => handleAccordionPress("habilidades")}>
                <View style={styles.accordionContent}>
                    {(curriculo.habilidades || []).map((item, index) => (
                         <Card key={index} style={styles.itemCard}>
                            <Card.Content>
                                <TextInput label={t("skill")} value={item.habilidade} onChangeText={(text) => handleInputChange("habilidades", "habilidade", text, index)} mode="outlined" style={styles.input}/>
                                <CustomDropDown label={t("skillLevel")} value={item.nivel} setValue={(val) => handleInputChange("habilidades", "nivel", val, index)} list={skillLevels} />
                            </Card.Content>
                            <Card.Actions style={styles.cardActions}>
                                <Button icon="delete" textColor="#E53935" onPress={() => removerItem("habilidades", index)} style={styles.deleteButton}>{t("remove")}</Button>
                            </Card.Actions>
                        </Card>
                    ))}
                    <Button icon="plus-circle" mode="contained-tonal" onPress={() => adicionarItem("habilidades")} style={{ marginTop: 16 }}>{t("addSkill")}</Button>
                </View>
            </List.Accordion>
        </Card>
        
        <Card style={styles.card}>
            <List.Accordion title={t("languages")} left={(props) => <List.Icon {...props} icon="translate" />} expanded={secaoAberta === "idiomas"} onPress={() => handleAccordionPress("idiomas")}>
                <View style={styles.accordionContent}>
                    {(curriculo.idiomas || []).map((item, index) => (
                         <Card key={index} style={styles.itemCard}>
                            <Card.Content>
                                <TextInput label={t("language")} value={item.idioma} onChangeText={(text) => handleInputChange("idiomas", "idioma", text, index)} mode="outlined" style={styles.input}/>
                                <CustomDropDown label={t("languageLevel")} value={item.nivel} setValue={(val) => handleInputChange("idiomas", "nivel", val, index)} list={languageLevels} />
                            </Card.Content>
                             <Card.Actions style={styles.cardActions}>
                                <Button icon="delete" textColor="#E53935" onPress={() => removerItem("idiomas", index)} style={styles.deleteButton}>{t("remove")}</Button>
                            </Card.Actions>
                        </Card>
                    ))}
                    <Button icon="plus-circle" mode="contained-tonal" onPress={() => adicionarItem("idiomas")} style={{ marginTop: 16 }}>{t("addLanguage")}</Button>
                </View>
            </List.Accordion>
        </Card>
      </List.Section>

      <Button icon="content-save-all" mode="contained" style={styles.saveButton} onPress={salvarCurriculo}>
        {indexEdicao !== null ? t("saveChanges") : t("saveResume")}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 8, paddingBottom: 100, backgroundColor: "#F0F4F8" },
  formSection: { display: "flex", gap: 12 },
  headerContent: { alignItems: "center", paddingVertical: 16 },
  headerIcon: { backgroundColor: "#6200ee", marginBottom: 10 },
  headerTitle: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 16, color: "#1A237E" },
  headerButtons: { flexDirection: "row", marginTop: 10 },
  card: { borderRadius: 12, backgroundColor: "#FFFFFF", elevation: 2 },
  accordionContent: { padding: 16, paddingTop: 0, display: "flex", gap: 4 },
  input: { backgroundColor: "transparent", marginTop: 8 },
  itemCard: { backgroundColor: "#FAFAFA", borderRadius: 8, marginTop: 8, borderWidth: 1, borderColor: '#E5E5E5' },
  cardActions: { justifyContent: 'flex-end', paddingTop: 0, paddingBottom: 8, paddingRight: 8 },
  saveButton: { marginTop: 24, padding: 8, borderRadius: 30 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  checkbox: { marginLeft: -10, marginTop: -4, paddingRight: 0 },
  deleteButton: {
    paddingHorizontal: 8,
    marginTop: 10,
  },
});