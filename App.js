import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator } from "react-native";

const WeatherApp = () => {
  const [city, setCity] = useState("Torredonjimeno");
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

  const groupedForecast = groupForecastByDay(forecastData);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
        {/* Input de recherche */}
        <TextInput
          style={styles.input}
          placeholder="Entrez une ville"
          value={searchCity}
          onChangeText={setSearchCity}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <Text style={styles.buttonText}>Rechercher</Text>
        </TouchableOpacity>

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
                  <Text style={styles.description}>{weatherData.weather[0].description}</Text>
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
                    <Text>{Math.round(item.main.temp)}°C</Text>
                    <Text>{item.weather[0].main}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Prévisions sur plusieurs jours */}
            <Text style={styles.sectionTitle}>Semaine</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {Object.keys(groupedForecast).slice(1, 6).map((day, index) => { // on saute aujourd'hui
                const temps = groupedForecast[day];
                const midDayData = temps[Math.floor(temps.length / 2)]; // moyenne de la journée

                return (
                  <View key={index} style={styles.dailyItem}>
                    <Text style={styles.dayText}>
                      {new Date(day).toLocaleDateString('fr-FR', { weekday: 'long' })}
                    </Text>
                    <Text style={styles.tempRange}>
                      {Math.round(midDayData.main.temp_max)}° / {Math.round(midDayData.main.temp_min)}°
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
    backgroundColor: "#00d2ff",
  },
  container: {
    backgroundColor: "#ffffff22",
    padding: 20,
    borderRadius: 20,
    margin: 20,
    alignItems: "center",
  },
  input: {
    backgroundColor: "white",
    width: "80%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    color: "black",
  },
  button: {
    backgroundColor: "#ffffff55",
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  city: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  temperature: {
    marginVertical: 10,
    alignItems: "center",
  },
  tempText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },
  description: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
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
    alignItems: "center",
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
