import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface Fiscalizacao {
  id: string;
  obraId: string;
  data: string;
  status: string;
  observacoes: string;
  fotoUri?: string;
  localizacao?: {
    latitude: number;
    longitude: number;
  };
}

export default function DetalheObra({ route }) {
  const { obra } = route.params;
  const navigation = useNavigation();
  const [fiscalizacoes, setFiscalizacoes] = useState<Fiscalizacao[]>([]);

  useEffect(() => {
    async function carregarFiscalizacoes() {
      try {
        const json = await AsyncStorage.getItem('fiscalizacoes');
        const todas = json ? JSON.parse(json) : [];
        const daObra = todas.filter((f: Fiscalizacao) => f.obraId === obra.id);
        setFiscalizacoes(daObra);
      } catch (error) {
        console.log('Erro ao carregar fiscalizações:', error);
      }
    }

    carregarFiscalizacoes();
  }, [obra.id]);

  // Função para excluir obra e fiscalizações relacionadas
  async function handleExcluirObra() {
    Alert.alert('Confirmar exclusão', 'Deseja realmente excluir esta obra?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            // Excluir obra
            const obrasRaw = await AsyncStorage.getItem('obras');
            const obras = obrasRaw ? JSON.parse(obrasRaw) : [];
            const novasObras = obras.filter((o: any) => o.id !== obra.id);
            await AsyncStorage.setItem('obras', JSON.stringify(novasObras));

            // Excluir fiscalizações da obra
            const fiscalizacoesRaw = await AsyncStorage.getItem('fiscalizacoes');
            const fiscalizacoesAll = fiscalizacoesRaw ? JSON.parse(fiscalizacoesRaw) : [];
            const novasFiscalizacoes = fiscalizacoesAll.filter(
              (f: any) => f.obraId !== obra.id
            );
            await AsyncStorage.setItem('fiscalizacoes', JSON.stringify(novasFiscalizacoes));

            Alert.alert('Sucesso', 'Obra e fiscalizações excluídas');
            navigation.goBack();
          } catch (error) {
            Alert.alert('Erro', 'Erro ao excluir obra.');
          }
        },
      },
    ]);
  }

  // Função para enviar dados da obra e fiscalizações por e-mail
  function handleEnviarPorEmail() {
    let corpo = `Dados da Obra:\n`;
    corpo += `Nome: ${obra.nome}\n`;
    if (obra.responsavel) corpo += `Responsável: ${obra.responsavel}\n`;
    if (obra.dataInicio) corpo += `Data de Início: ${obra.dataInicio}\n`;
    if (obra.previsaoTermino) corpo += `Previsão de Término: ${obra.previsaoTermino}\n`;
    if (obra.descricao) corpo += `Descrição: ${obra.descricao}\n`;

    corpo += `\nFiscalizações:\n`;

    if (fiscalizacoes.length === 0) {
      corpo += 'Nenhuma fiscalização cadastrada.\n';
    } else {
      fiscalizacoes.forEach((f, i) => {
        corpo += `\n#${i + 1} - Data: ${new Date(f.data).toLocaleDateString()}\n`;
        corpo += `Status: ${f.status}\n`;
        corpo += `Observações: ${f.observacoes}\n`;
      });
    }

    const email = ''; // deixamos vazio para o usuário preencher no app de e-mail
    const assunto = `Relatório da obra: ${obra.nome}`;
    const mailto = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;

    Linking.openURL(mailto).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo de e-mail.');
    });
  }

  const renderHeader = () => (
    <View>
      <Text style={styles.titulo}>{obra.nome}</Text>
      <Text style={styles.label}>Responsável:</Text>
      <Text>{obra.responsavel}</Text>

      <Text style={styles.label}>Data de Início:</Text>
      <Text>{obra.dataInicio}</Text>

      <Text style={styles.label}>Previsão de Término:</Text>
      <Text>{obra.previsaoTermino}</Text>

      <Text style={styles.label}>Descrição:</Text>
      <Text>{obra.descricao}</Text>

      {obra.localizacao && (
        <>
          <Text style={styles.label}>Localização:</Text>
          <Text>Lat: {obra.localizacao.latitude}</Text>
          <Text>Lon: {obra.localizacao.longitude}</Text>
        </>
      )}

      {obra.imagem && (
        <Image source={{ uri: obra.imagem }} style={styles.imagem} />
      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title="Cadastrar Fiscalização"
          onPress={() =>
            navigation.navigate('CadastroFiscalizacao', { obraId: obra.id })
          }
          color="#2e86de"
        />
      </View>

      {/* Novos botões */}
      <View style={{ marginTop: 30 }}>
        <Button
          title="Editar Obra"
          onPress={() => navigation.navigate('EditarObra', { obra })}
          color="#f39c12"
        />
        <View style={{ height: 10 }} />
        <Button
          title="Excluir Obra"
          onPress={handleExcluirObra}
          color="#e74c3c"
        />
        <View style={{ height: 10 }} />
        <Button
          title="Enviar por E-mail"
          onPress={handleEnviarPorEmail}
          color="#27ae60"
        />
      </View>

      <Text style={[styles.label, { fontSize: 18, marginTop: 30 }]}>
        Fiscalizações da Obra:
      </Text>
    </View>
  );

  return (
    <FlatList
      data={fiscalizacoes}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <Text style={{ marginTop: 10 }}>Nenhuma fiscalização cadastrada.</Text>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.fiscalizacaoItem}
          onPress={() =>
            navigation.navigate('DetalheFiscalizacao', { fiscalizacao: item })
          }
        >
          <Text>Data: {new Date(item.data).toLocaleDateString()}</Text>
          <Text>Status: {item.status}</Text>
          <Text>Observações: {item.observacoes}</Text>
          {item.fotoUri && (
            <Image source={{ uri: item.fotoUri }} style={styles.foto} />
          )}
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  label: { fontWeight: 'bold', marginTop: 10 },
  imagem: { width: '100%', height: 200, marginTop: 20, borderRadius: 8 },
  fiscalizacaoItem: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  foto: {
    marginTop: 8,
    width: '100%',
    height: 150,
    borderRadius: 6,
  },
});
