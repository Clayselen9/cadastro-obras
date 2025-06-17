import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';

interface Obra {
  id: string;
  nome: string;
  responsavel: string;
  dataInicio: string;
  previsaoTermino: string;
  descricao: string;
  localizacao: string;
  foto: string;
}

export default function Home() {
  const [obras, setObras] = useState<Obra[]>([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    carregarObras();
  }, [isFocused]);

  async function carregarObras() {
    try {
      const obrasSalvas = await AsyncStorage.getItem('obras');
      if (obrasSalvas) {
        setObras(JSON.parse(obrasSalvas));
      }
    } catch (error) {
      console.error('Erro ao carregar obras:', error);
    }
  }

  function renderItem({ item }: { item: Obra }) {
    return (
      <TouchableOpacity
        style={styles.obraItem}
        onPress={() => navigation.navigate('DetalheObra', { obra: item })}
      >
        <Text style={styles.nome}>{item.nome}</Text>
        <Text>{item.responsavel}</Text>
        <Text>Início: {item.dataInicio}</Text>
        <Text>Fim: {item.previsaoTermino}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100} // ajuste conforme necessário
      >
        <View style={styles.container}>
          <Text style={styles.titulo}>Obras em andamento</Text>

          <FlatList
            data={obras}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }} // espaço para o botão
          />

          <View style={styles.botaoContainer}>
            <TouchableOpacity
              style={styles.botao}
              onPress={() => navigation.navigate('CadastroObra')}
              activeOpacity={0.7}
            >
              <Text style={styles.botaoTexto}>Cadastrar Nova Obra</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16, backgroundColor: '#fff' },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  obraItem: {
    backgroundColor: '#eaeaea',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  nome: { fontSize: 16, fontWeight: 'bold' },
  botaoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    // sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // sombra Android
    elevation: 5,
  },
  botao: {
    backgroundColor: '#2e86de',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
