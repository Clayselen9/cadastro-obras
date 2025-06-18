import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function EditarObra({ route }) {
  const { obra } = route.params;
  const navigation = useNavigation();

  const [nome, setNome] = useState(obra.nome || '');
  const [responsavel, setResponsavel] = useState(obra.responsavel || '');
  const [dataInicio, setDataInicio] = useState(obra.dataInicio || '');
  const [previsaoTermino, setPrevisaoTermino] = useState(obra.previsaoTermino || '');
  const [descricao, setDescricao] = useState(obra.descricao || '');

  async function salvarAlteracoes() {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O nome da obra é obrigatório.');
      return;
    }

    try {
      const obrasRaw = await AsyncStorage.getItem('obras');
      const obras = obrasRaw ? JSON.parse(obrasRaw) : [];

      const indice = obras.findIndex((o: any) => o.id === obra.id);
      if (indice === -1) {
        Alert.alert('Erro', 'Obra não encontrada para edição.');
        return;
      }

      obras[indice] = {
        ...obras[indice],
        nome,
        responsavel,
        dataInicio,
        previsaoTermino,
        descricao,
      };

      await AsyncStorage.setItem('obras', JSON.stringify(obras));

      Alert.alert('Sucesso', 'Obra atualizada com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
      console.log(error);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome da Obra</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Nome da obra"
      />

      <Text style={styles.label}>Responsável</Text>
      <TextInput
        style={styles.input}
        value={responsavel}
        onChangeText={setResponsavel}
        placeholder="Responsável pela obra"
      />

      <Text style={styles.label}>Data de Início</Text>
      <TextInput
        style={styles.input}
        value={dataInicio}
        onChangeText={setDataInicio}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Previsão de Término</Text>
      <TextInput
        style={styles.input}
        value={previsaoTermino}
        onChangeText={setPrevisaoTermino}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Descrição da obra"
        multiline
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Salvar Alterações" onPress={salvarAlteracoes} color="#2e86de" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
});
