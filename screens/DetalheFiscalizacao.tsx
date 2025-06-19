import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DetalheFiscalizacao({ route }) {
  const { fiscalizacao } = route.params;
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Data:</Text>
      <Text>{new Date(fiscalizacao.data).toLocaleDateString()}</Text>

      <Text style={styles.label}>Status:</Text>
      <Text>{fiscalizacao.status}</Text>

      <Text style={styles.label}>Observações:</Text>
      <Text>{fiscalizacao.observacoes}</Text>

      {fiscalizacao.fotoUri && (
        <>
          <Text style={styles.label}>Foto:</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('VisualizarImagem', { uri: fiscalizacao.fotoUri })}
          >
            <Image source={{ uri: fiscalizacao.fotoUri }} style={styles.foto} />
          </TouchableOpacity>
        </>
      )}
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
    marginTop: 10,
  },
  foto: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});
