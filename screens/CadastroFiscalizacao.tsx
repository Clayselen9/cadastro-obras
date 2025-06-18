import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Image, ScrollView, Alert, Platform,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Obra {
  id: string;
  nome: string;
}

interface Fiscalizacao {
  id: string;
  obraId: string;
  data: string;
  status: 'Em dia' | 'Atrasada' | 'Parada';
  observacoes: string;
  fotoUri?: string;
  localizacao?: {
    latitude: number;
    longitude: number;
  };
}

export default function CadastroFiscalizacao({ navigation }) {
  const [obras, setObras] = useState<Obra[]>([]);
  const [obraSelecionada, setObraSelecionada] = useState<string>('');
  const [data, setData] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [status, setStatus] = useState<'Em dia' | 'Atrasada' | 'Parada'>('Em dia');
  const [observacoes, setObservacoes] = useState('');
  const [fotoUri, setFotoUri] = useState<string | undefined>(undefined);
  const [localizacao, setLocalizacao] = useState<{ latitude: number; longitude: number } | undefined>();

  useEffect(() => {
    carregarObras();
    pedirPermissaoLocalizacao();
  }, []);

  async function carregarObras() {
    try {
      const obrasSalvas = await AsyncStorage.getItem('obras');
      if (obrasSalvas) {
        const lista: Obra[] = JSON.parse(obrasSalvas);
        setObras(lista);
        if (lista.length > 0) setObraSelecionada(lista[0].id);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as obras');
    }
  }

  async function pedirPermissaoLocalizacao() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permissão de localização é necessária para este app.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocalizacao({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }

  async function tirarFoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permissão de câmera é necessária para tirar foto.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFotoUri(result.assets[0].uri);
    }
  }

  async function salvarFiscalizacao() {
    if (!obraSelecionada) {
      Alert.alert('Erro', 'Selecione uma obra');
      return;
    }

    const novaFiscalizacao: Fiscalizacao = {
      id: Date.now().toString(),
      obraId: obraSelecionada,
      data: data.toISOString(),
      status,
      observacoes,
      fotoUri,
      localizacao,
    };

    try {
      const fiscalizacoesSalvasRaw = await AsyncStorage.getItem('fiscalizacoes');
      let fiscalizacoesSalvas: Fiscalizacao[] = fiscalizacoesSalvasRaw
        ? JSON.parse(fiscalizacoesSalvasRaw)
        : [];

      fiscalizacoesSalvas.push(novaFiscalizacao);

      await AsyncStorage.setItem('fiscalizacoes', JSON.stringify(fiscalizacoesSalvas));

      Alert.alert('Sucesso', 'Fiscalização salva com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a fiscalização');
      console.error('Erro ao salvar fiscalização:', error);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Obra</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={obraSelecionada}
          onValueChange={(itemValue) => setObraSelecionada(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {obras.map((obra) => (
            <Picker.Item key={obra.id} label={obra.nome} value={obra.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Data da Fiscalização</Text>
      <Button title={data.toLocaleDateString()} onPress={() => setMostrarDatePicker(true)} />
      {mostrarDatePicker && (
        <DateTimePicker
          value={data}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setMostrarDatePicker(false);
            if (selectedDate) setData(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Status</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Em dia" value="Em dia" />
          <Picker.Item label="Atrasada" value="Atrasada" />
          <Picker.Item label="Parada" value="Parada" />
        </Picker>
      </View>

      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        value={observacoes}
        onChangeText={setObservacoes}
      />

      <Button title="Tirar Foto" onPress={tirarFoto} />
      {fotoUri && <Image source={{ uri: fotoUri }} style={styles.imagem} />}

      <Text style={styles.label}>Localização atual:</Text>
      {localizacao ? (
        <Text>
          Lat: {localizacao.latitude.toFixed(4)} | Lon: {localizacao.longitude.toFixed(4)}
        </Text>
      ) : (
        <Text>Obtendo localização...</Text>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Salvar Fiscalização" onPress={salvarFiscalizacao} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 8,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    marginBottom: 10,
  },
  picker: {
    height: 60, // aumentada
    paddingHorizontal: 8,
  },
  pickerItem: {
    fontSize: 16, // tamanho da fonte ajustado
  },
  imagem: {
    marginTop: 10,
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});
