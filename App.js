import React from 'react';
import {
  SafeAreaView, /*protège l'interface des zones sensibles (haut de l’écran, caméra, encoche). */
  View,
  Text,
  TextInput,
  StyleSheet,/*permet de créer des styles CSS en JavaScript. */
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const HomeScreen = () => { /*creation de la page HOME */
  return (
    <SafeAreaView style={styles.container}>
    {/*champ de recherche */}
      <TextInput
        style={styles.input}
        placeholder="Rechercher une ville"
        placeholderTextColor="#aaa"
      />

      {/* Infos météo principales */}
      {/*cree un groupe qui va contenir tt les infos meteo */}
      <View style={styles.infoBlock}> 
        <Text style={styles.city}>Tizi Ouzou</Text>
        <Text style={styles.temp}>22°C</Text>
        <View style={styles.iconText}>
          <Icon name="cloud" size={28} color="#ccc" />
          <Text style={styles.description}> Nuageux</Text>
        </View>
        <Text style={styles.detail}>💧 Humidité : 60%</Text>
        <Text style={styles.detail}>💨 Vent : 5 m/s</Text>
      </View>

      {/* Prévisions horaires */}
      <Text style={styles.sectionTitle}>Prévisions</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.forecastScroll}
      >
        {[
          { time: 'Matin', icon: 'sun', temp: '18°C' },
          { time: 'Après-midi', icon: 'cloud', temp: '22°C' },
          { time: 'Soir', icon: 'cloud-rain', temp: '17°C' },
          { time: 'Nuit', icon: 'moon', temp: '15°C' },
          { time: 'Demain matin', icon: 'sun', temp: '19°C' },
        ].map((item, index) => ( 
          <View style={styles.forecastCard} key={index}>
            <Text style={styles.timeLabel}>{item.time}</Text>
            <Icon name={item.icon} size={30} color="#fff" style={{ marginVertical: 5 }} />
            <Text style={styles.forecastTemp}>{item.temp}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2f',
    padding: 20,
    paddingTop: 60,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoBlock: {
    alignItems: 'center',
    marginBottom: 30,
  },
  city: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  temp: {
    fontSize: 60,
    color: '#fff',
    fontWeight: 'bold',
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  description: {
    fontSize: 18,
    color: '#ccc',
    textTransform: 'capitalize',
  },
  detail: {
    fontSize: 16,
    color: '#bbb',
    marginTop: 5,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  forecastScroll: {
    paddingVertical: 10,
  },
  forecastCard: {
    backgroundColor: '#2a2a3f',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    width: 120,
  },
  timeLabel: {
    color: '#eee',
    fontSize: 16,
    marginBottom: 5,
  },
  forecastTemp: {
    fontSize: 16,
    color: '#eee',
  },
});