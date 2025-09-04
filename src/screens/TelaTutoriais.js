// src/screens/TelaTutoriais.js
import React, { useState } from "react";
import { ScrollView, StyleSheet, Linking } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  useTheme,
  List,
  Button,
  Checkbox,
  Divider,
} from "react-native-paper";

export default function TelaTutoriais() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const abrirLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Erro ao abrir link", err)
    );
  };

  // Checklists interativos
  const [checked, setChecked] = useState({});
  const toggleCheck = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
      <Title style={styles.title}>📚 Tutoriais & Guias</Title>

      {/* INTRO */}
      <Card style={styles.card}>
        <Card.Content>
          <Paragraph style={styles.paragraph}>
            Bem-vindo à área de aprendizado! Aqui você encontra dicas práticas,
            guias passo a passo e recomendações para criar um currículo
            profissional de alto impacto.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* MÓDULO 1 */}
      <List.Section>
        <List.Accordion
          title="1. Resumo Profissional"
          description="Sua introdução em poucas linhas"
          left={(props) => <List.Icon {...props} icon="account-badge" />}
        >
          <Card style={styles.innerCard}>
            <Card.Content>
              <Paragraph style={styles.sectionText}>
                O resumo deve ser um trailer do seu currículo: direto e impactante.
              </Paragraph>
              <Divider style={{ marginVertical: 8 }} />
              <List.Item
                title="Escreva em 3 a 5 linhas"
                left={() => (
                  <Checkbox
                    status={checked["resumo1"] ? "checked" : "unchecked"}
                    onPress={() => toggleCheck("resumo1")}
                  />
                )}
              />
              <List.Item
                title="Inclua conquistas reais"
                left={() => (
                  <Checkbox
                    status={checked["resumo2"] ? "checked" : "unchecked"}
                    onPress={() => toggleCheck("resumo2")}
                  />
                )}
              />
              <List.Item
                title="Use palavras-chave da sua área"
                left={() => (
                  <Checkbox
                    status={checked["resumo3"] ? "checked" : "unchecked"}
                    onPress={() => toggleCheck("resumo3")}
                  />
                )}
              />
              <List.Item
                title="Evite frases vagas como 'proativo' ou 'dinâmico' sem contexto"
                left={() => (
                  <Checkbox
                    status={checked["resumo4"] ? "checked" : "unchecked"}
                    onPress={() => toggleCheck("resumo4")}
                  />
                )}
              />
              <Button
                mode="outlined"
                icon="youtube"
                style={styles.button}
                onPress={() =>
                  abrirLink(
                    "https://www.youtube.com/results?search_query=resumo+curriculo"
                  )
                }
              >
                Assistir Tutorial no YouTube
              </Button>
            </Card.Content>
          </Card>
        </List.Accordion>

        {/* MÓDULO 2 */}
        <List.Accordion
          title="2. Experiências Profissionais"
          description="Como descrever cargos e resultados"
          left={(props) => <List.Icon {...props} icon="briefcase" />}
        >
          <Card style={styles.innerCard}>
            <Card.Content>
              <Paragraph style={styles.sectionText}>
                Destaque resultados alcançados, não apenas responsabilidades.
              </Paragraph>
              <Divider style={{ marginVertical: 8 }} />
              <Paragraph style={styles.tip}>
                ✔ Prefira: "Aumentei as vendas em 20% em 6 meses."
              </Paragraph>
              <Paragraph style={styles.tip}>
                ❌ Evite: "Responsável por vendas."
              </Paragraph>
              <Paragraph style={styles.tip}>
                ✔ Formate períodos corretamente: "Jan/2020 – Dez/2022"
              </Paragraph>
              <Button
                mode="outlined"
                icon="open-in-new"
                style={styles.button}
                onPress={() =>
                  abrirLink(
                    "https://rockcontent.com/br/blog/como-descrever-experiencias-curriculo/"
                  )
                }
              >
                Ler Guia Completo
              </Button>
            </Card.Content>
          </Card>
        </List.Accordion>

        {/* MÓDULO 3 */}
        <List.Accordion
          title="3. Habilidades e Competências"
          description="Equilibre Hard Skills e Soft Skills"
          left={(props) => <List.Icon {...props} icon="star" />}
        >
          <Card style={styles.innerCard}>
            <Card.Content>
              <Paragraph style={styles.sectionText}>
                Liste habilidades técnicas e comportamentais.
              </Paragraph>
              <Divider style={{ marginVertical: 8 }} />
              <Paragraph>🔹 Hard Skills: React, Excel, Inglês</Paragraph>
              <Paragraph>🔹 Soft Skills: Comunicação, Liderança, Trabalho em Equipe</Paragraph>
              <Paragraph style={styles.tip}>
                ✔ Mantenha equilíbrio: 50% técnicas, 50% comportamentais
              </Paragraph>
            </Card.Content>
          </Card>
        </List.Accordion>

        {/* MÓDULO 4 */}
        <List.Accordion
          title="4. Formação Acadêmica"
          description="Como organizar seus estudos"
          left={(props) => <List.Icon {...props} icon="school" />}
        >
          <Card style={styles.innerCard}>
            <Card.Content>
              <Paragraph style={styles.sectionText}>
                Inclua apenas formações relevantes para a vaga.
              </Paragraph>
              <Paragraph>
                ✔ Graduação, pós, cursos técnicos e certificações
              </Paragraph>
              <Paragraph>
                ✔ Cursos online de peso (Coursera, Udemy, Alura, etc.)
              </Paragraph>
              <Paragraph>
                ❌ Não é necessário listar ensino fundamental/médio (exceto se
                for sua formação máxima).
              </Paragraph>
            </Card.Content>
          </Card>
        </List.Accordion>

        {/* MÓDULO 5 */}
        <List.Accordion
          title="5. Erros Comuns a Evitar"
          description="Revise antes de enviar!"
          left={(props) => <List.Icon {...props} icon="alert-circle" />}
        >
          <Card style={styles.innerCard}>
            <Card.Content>
              <Paragraph style={styles.tip}>❌ Erros de português</Paragraph>
              <Paragraph style={styles.tip}>❌ Informações falsas ou exageradas</Paragraph>
              <Paragraph style={styles.tip}>
                ❌ Currículo com mais de 2 páginas (na maioria dos casos)
              </Paragraph>
              <Paragraph style={styles.tip}>❌ Usar e-mail pouco profissional</Paragraph>
              <Paragraph style={styles.tip}>❌ Fotos inadequadas ou de baixa qualidade</Paragraph>
            </Card.Content>
          </Card>
        </List.Accordion>

        {/* MÓDULO 6 - NOVO */}
        <List.Accordion
          title="6. Design e Layout"
          description="Organização visual também conta"
          left={(props) => <List.Icon {...props} icon="palette" />}
        >
          <Card style={styles.innerCard}>
            <Card.Content>
              <Paragraph style={styles.sectionText}>
                A estética influencia a primeira impressão do recrutador.
              </Paragraph>
              <Paragraph>✔ Prefira fontes legíveis (Arial, Poppins, Roboto)</Paragraph>
              <Paragraph>✔ Use cores com contraste moderado</Paragraph>
              <Paragraph>✔ Espaçamento adequado entre seções</Paragraph>
            </Card.Content>
          </Card>
        </List.Accordion>

        {/* MÓDULO 7 - NOVO */}
        <List.Accordion
          title="7. Links e Portfólio"
          description="Mostre seus trabalhos na prática"
          left={(props) => <List.Icon {...props} icon="link" />}
        >
          <Card style={styles.innerCard}>
            <Card.Content>
              <Paragraph style={styles.sectionText}>
                Inclua links apenas se forem profissionais e relevantes.
              </Paragraph>
              <Paragraph>✔ LinkedIn atualizado</Paragraph>
              <Paragraph>✔ Portfólio online ou GitHub</Paragraph>
              <Paragraph>❌ Evite links pessoais irrelevantes (Facebook, TikTok pessoal)</Paragraph>
            </Card.Content>
          </Card>
        </List.Accordion>
      </List.Section>
    </ScrollView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 100, // evita cortar no final
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 16,
      textAlign: "center",
      color: theme.colors.primary,
    },
    card: {
      marginBottom: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
    },
    innerCard: {
      margin: 8,
      backgroundColor: theme.colors.surfaceVariant || "#f9f9f9",
      borderRadius: 8,
      paddingBottom: 8,
    },
    paragraph: {
      marginBottom: 8,
      fontSize: 15,
      color: theme.colors.onSurfaceVariant,
    },
    sectionText: {
      fontWeight: "600",
      marginBottom: 6,
      fontSize: 14,
    },
    button: {
      marginTop: 12,
    },
    tip: {
      marginBottom: 6,
      fontSize: 14,
    },
  });
