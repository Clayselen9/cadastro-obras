import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAvoidingView, Platform } from 'react-native';


export default function CadastroObra() {
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [previsaoTermino, setPrevisaoTermino] = useState('');
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState<null | { latitude: number; longitude: number }>(null);
  const [imagem, setImagem] = useState<string | null>(null);

  // ✅ Função localização via GPS
  const obterLocalizacao = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Permita o acesso à localização.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setLocalizacao({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  // ✅ Função para tirar foto com a câmera
  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Permita o uso da câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  // ✅ Função para salvar a obra localmente
  const salvarObra = async () => {
    if (!nome || !responsavel) {
      Alert.alert('Atenção', 'Preencha os campos obrigatórios.');
      return;
    }

    const novaObra = {
      id: Date.now().toString(),
      nome,
      responsavel,
      dataInicio,
      previsaoTermino,
      descricao,
      localizacao,
      imagem,
    };

    try {
      const obrasExistentes = await AsyncStorage.getItem('obras');
      const obras = obrasExistentes ? JSON.parse(obrasExistentes) : [];

      obras.push(novaObra);
      await AsyncStorage.setItem('obras', JSON.stringify(obras));

      Alert.alert('Sucesso', 'Obra cadastrada com sucesso!');

    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar obra!');
      console.error(error);
    }
  };

    return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Nome da Obra*</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Digite o nome da obra" />

        <Text style={styles.label}>Responsável*</Text>
        <TextInput style={styles.input} value={responsavel} onChangeText={setResponsavel} placeholder="Nome do responsável" />

        <Text style={styles.label}>Data de Início</Text>
        <TextInput style={styles.input} value={dataInicio} onChangeText={setDataInicio} placeholder="DD/MM/AAAA" />

        <Text style={styles.label}>Previsão de Término</Text>
        <TextInput style={styles.input} value={previsaoTermino} onChangeText={setPrevisaoTermino} placeholder="DD/MM/AAAA" />

        <Button title="Obter Localização" onPress={obterLocalizacao} />
        {localizacao && (
          <Text style={styles.info}>Lat: {localizacao.latitude}, Lon: {localizacao.longitude}</Text>
        )}

        <Button title="Tirar Foto da Obra" onPress={tirarFoto} />
        {imagem && <Image source={{ uri: imagem }} style={styles.imagem} />}

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descrição da obra"
        />

        <View style={{ marginTop: 20 }}>
          <Button title="Salvar Obra" onPress={salvarObra} />
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 4,
    borderRadius: 5,
  },
  info: {
    marginVertical: 8,
    fontStyle: 'italic',
  },
  imagem: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});
