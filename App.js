import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator, Image } from "react-native";

const WeatherApp = () => {
  const [city, setCity] = useState("Tizi Ouzou");
  const [searchCity, setSearchCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = "52b27c72eb114c25f7caeee047ec0627"; // Mets ta clé API OpenWeather ici

  const fetchWeather = async () => {
    const queryCity = searchCity || city;
    setLoading(true);
    try {
      // 1. météo actuelle
      const responseWeather = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${queryCity}&appid=${apiKey}&units=metric`
      );
      const weather = await responseWeather.json();
      setWeatherData(weather);

      // 2. prévisions
      const responseForecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${queryCity}&appid=${apiKey}&units=metric`
      );
      const forecast = await responseForecast.json();
      setForecastData(forecast.list); // toutes les prévisions (5 jours / 3h)
      
      setCity(queryCity);
      setSearchCity("");
    } catch (error) {
      console.error("Erreur récupération météo :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  // Fonction pour regrouper par jour
  const groupForecastByDay = (data) => {
    const days = {};

    data.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().split('T')[0]; // ex: "2025-04-27"

      if (!days[day]) {
        days[day] = [];
      }
      days[day].push(item);
    });

    return days;
  };
  // Fonction pour obtenir la température max et min d'une journée
const getDayTempRange = (temps) => {
  let tempMax = -Infinity;
  let tempMin = Infinity;

  temps.forEach(item => {
    if (item.main.temp_max > tempMax) tempMax = item.main.temp_max;
    if (item.main.temp_min < tempMin) tempMin = item.main.temp_min;
  });

  return { tempMax, tempMin };
};


  const groupedForecast = groupForecastByDay(forecastData);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        {/* Input de recherche */}
        <TextInput
          style={styles.searchInput}
          placeholder="Entrez une ville"
          value={searchCity}
          onChangeText={setSearchCity}
          onSubmitEditing={fetchWeather}
          placeholderTextColor="#888"
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <Text style={styles.buttonText}>Rechercher</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        {/* Chargement */}
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <>
            {/* Météo actuelle */}
            <Text style={styles.city}>{city}</Text>
            <View style={styles.temperature}>
              {weatherData ? (
                <>
                  <Text style={styles.tempText}>{Math.round(weatherData.main.temp)}°C</Text>
                  <Image
                     source={{ uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png` }}
                     style={{ width: 60, height: 60 }}
                  />
                  <Text style={styles.description}>{weatherData.weather[0].description}</Text>
                  <Text style={styles.description}>Humidité : {weatherData.main.humidity}%</Text>
                  <Text style={styles.description}>Vent : {Math.round(weatherData.wind.speed)} m/s</Text>
                </>
              ) : (
                <Text style={styles.tempText}>--°C</Text>
              )}
            </View>

            {/* Prévisions horaires */}
            <Text style={styles.sectionTitle}>Aujourd'hui</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.hourlyRow}>
                {forecastData.slice(0, 8).map((item, index) => (
                  <View key={index} style={styles.item}>
                    <Text>{new Date(item.dt * 1000).getHours()}:00</Text>
                    <Image
                     source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }}
                     style={{ width: 50, height: 50 }}
                    />
                    <Text>{Math.round(item.main.temp)}°C</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Prévisions sur plusieurs jours */}
            <Text style={styles.sectionTitle}>Semaine</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {Object.keys(groupedForecast).slice(1, 6).map((day, index) => { // on saute aujourd'hui
                const temps = groupedForecast[day];
                const { tempMax, tempMin } = getDayTempRange(temps);
                const midDayData = temps[Math.floor(temps.length / 2)]; // moyenne de la journée

                return (
                  <View key={index} style={styles.dailyItem}>
                    <Text style={styles.dayText}>
                      {new Date(day).toLocaleDateString('fr-FR', { weekday: 'long' })}
                    </Text>
                    <Image
                      source={{ uri: `https://openweathermap.org/img/wn/${midDayData.weather[0].icon}@2x.png` }}
                       style={{ width: 50, height: 50 }}
                    />
                    <Text style={styles.tempRange}>
                       {Math.round(tempMax)}° / {Math.round(tempMin)}°
                    </Text>
                    <Text style={styles.description}>
                      {midDayData.weather[0].main}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  scrollContainer: {
    paddingVertical: 40,
    backgroundColor: 'rgba(52, 187, 244, 0.54)',      //"#00d2ff",
  },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.45)', // un blanc semi-transparent qui s’intègre bien
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 15, 
    width: '90%',      // FIXE la largeur à 95% de l’écran
    alignSelf: 'center', // centre la barre
  },
  
  searchIcon: {
    fontSize: 17,
    marginRight: 10,
    color: 'white',
  },
  
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    paddingVertical: 0,
    marginRight: 10,
    minWidth: 0,  // IMPORTANT pour éviter overflow
  },
  
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    paddingVertical: 8,
    paddingHorizontal: 7,
    //borderRadius: 25,
    flexShrink: 0, // empêche le bouton de rétrécir
  },
  
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  contentContainer: {
    marginTop: 17,  // ou un padding, pour séparer visuellement
    paddingHorizontal: 10,
  },
  
  city: {
    textAlign: 'center',
    fontSize: 33,
    fontWeight: "bold",
    color: "white",
   // marginBottom: 0,
    width: '100%',
  },
  temperature: {
    marginVertical: 8,
    alignItems: "center",
  },
  tempText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
  description: {
    color: "white",
    fontSize: 18,
    marginTop: 3,
    textTransform: "capitalize",
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  hourlyRow: {
    flexDirection: "row",
    marginVertical: 10,
  },
  item: {
    backgroundColor: "#ffffff33",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
    width: 80,
  },
  dailyItem: {
    backgroundColor: "#ffffff33",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dayText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  tempRange: {
    color: "white",
    fontSize: 16,
  },
});

export default WeatherApp;
