// src/screens/LoginScreen.js
import React, { useContext } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Card, Title, Paragraph, Avatar, useTheme, TextInput } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          {/* Logo ou ícone principal */}
          <Avatar.Icon size={90} icon="account-circle" style={styles.icon}/>
          <Title style={styles.title}>Bem-vindo!</Title>
          <Paragraph style={styles.paragraph}>
            Entre para acessar seus currículos salvos e personalizar o app.
          </Paragraph>

          {/* Campos de login (futuro: integração com backend) */}
          <TextInput 
            label="E-mail"
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput 
            label="Senha"
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <Button 
            mode="contained" 
            icon="login"
            style={styles.loginButton}
            onPress={() => login()}
          >
            Entrar
          </Button>

          {/* Ações extras */}
          <Button 
            mode="text" 
            onPress={() => console.log("Esqueci minha senha")}
          >
            Esqueci minha senha
          </Button>
          <Button 
            mode="text" 
            onPress={() => console.log("Cadastrar nova conta")}
          >
            Criar nova conta
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    paddingVertical: 20,
  },
  content: {
    alignItems: 'center',
  },
  icon: { 
    backgroundColor: theme.colors.primary, 
    marginBottom: 20 
  },
  title: { 
    fontSize: 26, 
    marginBottom: 10, 
    color: theme.colors.onSurface,
    fontWeight: 'bold'
  },
  paragraph: { 
    textAlign: 'center', 
    marginBottom: 20, 
    color: theme.colors.onSurfaceVariant 
  },
  input: { 
    width: '100%', 
    marginBottom: 12 
  },
  loginButton: { 
    width: '100%', 
    marginTop: 10, 
    padding: 6 
  }
});
