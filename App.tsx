import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import Home from './screens/Home';
import CadastroObra from './screens/CadastroObra';
import DetalheObra from './screens/DetalheObra';
import CadastroFiscalizacao from './screens/CadastroFiscalizacao';
import DetalheFiscalizacao from './screens/DetalheFiscalizacao';
import EditarObra from './screens/EditarObra';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CadastroObra" component={CadastroObra} />
        <Stack.Screen name="DetalheObra" component={DetalheObra} />
        <Stack.Screen name="EditarObra" component={EditarObra} />
        <Stack.Screen name="CadastroFiscalizacao" component={CadastroFiscalizacao} />
         <Stack.Screen name="DetalheFiscalizacao" component={DetalheFiscalizacao} options={{ title: 'Detalhe da Fiscalização' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
