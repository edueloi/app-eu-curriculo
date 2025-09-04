import React from 'react';
import { FAB } from 'react-native-paper';
import { StyleSheet, ScrollView } from 'react-native';
import { 
  Button, Title, Paragraph, Card, Avatar, useTheme, Divider, List 
} from 'react-native-paper';

export default function TelaInicial({ navigation }) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* --- CARD DE BOAS-VINDAS --- */}
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Avatar.Icon size={80} icon="file-document-edit" style={styles.icon} />
          <Title style={styles.title}>Bem-vindo ao Criador de Currículos</Title>
          <Paragraph style={styles.paragraph}>
            Aqui você pode criar, editar e gerenciar todos os seus currículos em um só lugar.
          </Paragraph>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            icon="plus-circle"
            style={styles.button}
            onPress={() => navigation.navigate('CriarCurrículo')}
          >
            Criar Novo Currículo
          </Button>
        </Card.Actions>
      </Card>

      {/* --- CARD RESUMO --- */}
      <Card style={styles.card}>
        <Card.Title 
          title="Resumo Rápido" 
          left={(props) => <Avatar.Icon {...props} icon="chart-pie" />} 
        />
        <Divider />
        <Card.Content>
          <Paragraph>Total de currículos: <Title>5</Title></Paragraph>
          <Paragraph>Último atualizado: <Title>02/09/2025</Title></Paragraph>
        </Card.Content>
      </Card>

      {/* --- CARD DE AÇÕES RÁPIDAS --- */}
      <Card style={styles.card}>
        <Card.Title title="Ações Rápidas" left={(props) => <Avatar.Icon {...props} icon="flash" />} />
        <Divider />
        <Card.Content>
          <List.Item
            title="Meus Currículos"
            description="Visualize e edite currículos já criados"
            left={(props) => <List.Icon {...props} icon="folder" />}
            onPress={() => navigation.navigate('MeusCurrículos')}
          />
          <List.Item
            title="Configurações"
            description="Gerenciar tema e preferências"
            left={(props) => <List.Icon {...props} icon="cog" />}
            onPress={() => navigation.navigate('Configurações')}
          />
        </Card.Content>
      </Card>

      {/* --- CARD DE DICAS --- */}
      <Card style={styles.card}>
        <Card.Title 
          title="Dicas Rápidas" 
          subtitle="Melhore ainda mais seu currículo"
          left={(props) => <Avatar.Icon {...props} icon="lightbulb-on-outline" />}
        />
        <Divider />
        <Card.Content>
          <Paragraph style={styles.tip}>✔ Seja claro e objetivo no resumo.</Paragraph>
          <Paragraph style={styles.tip}>✔ Destaque resultados em experiências.</Paragraph>
          <Paragraph style={styles.tip}>✔ Use palavras-chave da sua área.</Paragraph>
        </Card.Content>
      </Card>

      {/* --- CARD DE SUPORTE --- */}
      <Card style={styles.card}>
        <Card.Title title="Precisa de ajuda?" left={(props) => <Avatar.Icon {...props} icon="help-circle" />} />
        <Card.Content>
          <Paragraph style={styles.paragraph}>
            Caso tenha dúvidas ou sugestões, entre em contato com nosso suporte.
          </Paragraph>
          <Button mode="outlined" icon="email" onPress={() => console.log('Abrir contato')}>
            Falar com Suporte
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: { padding: 16, backgroundColor: theme.colors.background },
  card: { marginBottom: 16, backgroundColor: theme.colors.surface },
  content: { alignItems: 'center', padding: 16 },
  icon: { marginBottom: 20, backgroundColor: theme.colors.primary },
  title: { fontSize: 22, textAlign: 'center', marginBottom: 10, color: theme.colors.onSurface },
  paragraph: { textAlign: 'center', marginBottom: 20, color: theme.colors.onSurfaceVariant },
  actions: { justifyContent: 'center', padding: 10 },
  button: { margin: 8 },
  tip: { marginBottom: 8, color: theme.colors.onSurfaceVariant },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: theme.colors.primary },
});
