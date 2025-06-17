import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function DetalheObra({ route }) {
  const { obra } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  imagem: {
    width: '100%',
    height: 200,
    marginTop: 20,
    borderRadius: 8,
  },
});
