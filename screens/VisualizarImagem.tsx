import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function VisualizarImagem({ route }) {
  const { uri } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
        <Text style={styles.textoVoltar}>← Voltar</Text>
      </TouchableOpacity>
      <Image
        source={{ uri }}
        style={styles.imagem}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // fundo preto para ver melhor a imagem
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagem: {
    width: '100%',
    height: '100%',
  },
  voltar: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  textoVoltar: {
    color: '#000',
    fontWeight: 'bold',
  },
});
