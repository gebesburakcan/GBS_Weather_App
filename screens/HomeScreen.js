import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState ,onPress} from 'react';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image } from 'react-native';
import theme from '../theme/index';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import {CalendarDaysIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {MapPinIcon} from 'react-native-heroicons/solid';
import {debounce} from 'lodash';
import { fetchLocations, fetchWeatherForecast } from '../api/weather';
import { weatherImages } from '../constants';
import * as Progress from 'react-native-progress';
import { getData, storeData } from '../utils/asyncStorage';



export default function HomeScreen() {
    const [showSearch, toggleSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favoriteCities, setFavoriteCities] = useState([]);

    const navigation = useNavigation();

const toggleFavorite = async (city, country, temperature) => {
  const isFavorite = favoriteCities.some((fav) => fav.city === city);
  if (!isFavorite) {
    // Favorilere ekle
    const newFavorite = { city, country, temperature };
    const updatedFavorites = [...favoriteCities, newFavorite];
    setFavoriteCities(updatedFavorites);
    await storeData(city, JSON.stringify(newFavorite));
    // Favoriler ekranına git
    navigation.navigate('Favorite');
  } else {
    // Favorilerden kaldır
    const updatedFavorites = favoriteCities.filter((fav) => fav.city !== city);
    setFavoriteCities(updatedFavorites);
    await AsyncStorage.removeItem(city);
  }
};
    
    

    const handleLocation = (loc) => {
        console.log('location : ', loc);
        setLocations([]);
        toggleSearch(false);
        setLoading(true);
        fetchWeatherForecast({
            cityName: loc.name,
            days: 7
        }).then(data => {
            setWeather(data);
            setLoading(false);
            storeData('city', loc.name);
            console.log('got forecast: ', data);
        })
    }

    const handleSearch = value => {
        //fetch location
        if (value.length > 2) {
            fetchLocations({ cityName: value }).then(data => {
                setLocations(data);
                console.log('got data:', data);
            })
        }
    }

    useEffect(() => {
        fetchMyWeatherData();
    }, []);

    const fetchMyWeatherData = async () => {
        let myCity = await getData('city');
        let cityName = 'London';
        if (myCity) cityName = myCity;
        fetchWeatherForecast({
            cityName,
            days: '7'
        }).then(data => {
            setWeather(data);
            setLoading(false);
        })
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

    const { current, location } = weather || {};

    return (
        <View style={{ flex: 1, position: 'relative' }}>
            <StatusBar style='light' />
            <Image blurRadius={10} source={require('../assets/images/bg.jpeg')} style={{ position: 'absolute', height: '100%', width: '100%' }} />

            {
                loading ? (
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Progress.CircleSnail thickness={10} size={140} color="skyblue" />
                    </View>
                ) : (
                    <SafeAreaView style={{ flex: 1 }}>
                        {/* search section */}
                        <View style={{ height: '7%', marginTop: 50, marginLeft: 20, marginRight: 20, position: 'relative', zIndex: 50 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderRadius: 25, backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }}>
                                {
                                    showSearch ? (
                                        <TextInput
                                            onChangeText={handleTextDebounce}
                                            placeholder='Search City'
                                            placeholderTextColor={'lightgray'}
                                            style={{ paddingLeft: 6, height: 40, paddingBottom: 1, flex: 1, fontSize: 16, color: 'white' }}
                                        />

                                    ) : null
                                }
                                <TouchableOpacity
                                    onPress={() => { toggleSearch(!showSearch) }}
                                    style={{ backgroundColor: theme.bgWhite(0.3), borderRadius: 100, padding: 10, margin: 5 }}>
                                    <MagnifyingGlassIcon size={25} color="white" />
                                </TouchableOpacity>
                            </View>
                            {
                                locations.length > 0 && showSearch ? (
                                    <View style={{ position: 'absolute', width: '100%', backgroundColor: '#D1D5DB', top: 70, borderRadius: 25 }}>
                                        {
                                            locations.map((loc, index) => {
                                                let showBorder = index + 1 != locations.length;
                                                let borderClass = showBorder ? { borderBottomWidth: 2, borderBottomColor: '#9CA3AF' } : {};
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => handleLocation(loc)}
                                                        key={index}
                                                        style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, marginBottom: 5, ...borderClass }}>
                                                        <MapPinIcon size={20} color="gray" />
                                                        <Text style={{ color: 'black', fontSize: 18, marginLeft: 10 }}>{loc?.name}, {loc?.country}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                ) : null
                            }
                        </View>
                        {/* forecast section */}
                        <ScrollView style={{ flex: 1, marginLeft: 20, marginRight: 20, marginBottom: 20,marginTop:20 }}>
                            {/* location details */}
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>{location?.name} <Text style={{ color: '#9CA3AF', fontSize: 18 }}>{' ' + location?.country}</Text></Text>
                                {/* Weather Image */}
                                <Image
                                    source={weatherImages[current?.condition?.text]}
                                    style={{ width: 150, height: 150, marginTop: 10 }}
                                />
                            </View>
                            {/* degree celcius */}
                            <View style={{ marginTop: 10 ,alignItems:'center'}}>
                                <Text style={{ color: 'white', fontSize: 50, fontWeight: 'bold', marginLeft: 5 }}>{current?.temp_c}&#176;</Text>
                                <Text style={{ color: 'white', fontSize: 20, marginLeft: 5 }}>{current?.condition?.text}</Text>
                                
                            </View>
                            {/* other stats */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={require('../assets/icons/wind.png')} style={{ width: 24, height: 24 }} />
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{current?.wind_kph}km</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={require('../assets/icons/uv-index.png')} style={{ width: 24, height: 24,padding:2,borderRadius:5,marginRight:3 ,backgroundColor:'white'}} />
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{current?.uv}<Text style={{fontSize:12,fontWeight:'bold'}}>J / m2</Text></Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={require('../assets/icons/drop.png')} style={{ width: 24, height: 24 }} />
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{current?.humidity}%</Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={require('../assets/icons/sun.png')} style={{ width: 24, height: 24 }} />
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
                                </View>
                            </View>

                            {/* forecast for next days */}
                            <View style={{ marginTop: 20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <CalendarDaysIcon size={22} color="white" />
                                    <Text style={{ color: 'white', fontSize: 18 }}>Daily forecast</Text>
                                </View>

                                <ScrollView
                                    horizontal
                                    contentContainerStyle={{ paddingHorizontal: 15 }}
                                    showsHorizontalScrollIndicator={false}>
                                    {
                                        weather?.forecast?.forecastday?.map((item, index) => {
                                            let date = new Date(item.date);
                                            let options = { weekday: 'long' };
                                            let dayName = date.toLocaleDateString('en-US', options);
                                            dayName = dayName.split(',')[0];
                                            return (
                                                <View key={index} style={{ justifyContent: 'center', alignItems: 'center', width: 120, borderRadius: 25, paddingVertical: 15, paddingHorizontal: 10, marginRight: 10, backgroundColor: theme.bgWhite(0.15) }}>
                                                    <Image source={{ uri: 'https:' + item?.day?.condition?.icon }} style={{ width: 50, height: 50 }} />
                                                    <Text style={{ color: 'white', fontSize: 16, marginTop: 5 }}>{dayName}</Text>
                                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 5 }}>{item?.day?.avgtemp_c}&#176;</Text>
                                                </View>
                                            )
                                        })
                                    }
                                </ScrollView>

                            </View>
                            <View style={{ flex: 1, alignItems:'center', marginTop: 30, flexDirection:'row', justifyContent:'center' }}>
  <TouchableOpacity
    style={styles.favoritesButton}
    onPress={() => toggleFavorite(location?.name, location?.country, current?.temp_c)}
  >
    <Icon
      name={favoriteCities.some((fav) => fav.city === location?.name) ? 'heart' : 'heart-o'}
      size={40}
      color={favoriteCities.some((fav) => fav.city === location?.name) ? 'red' : 'white'}
    />
  </TouchableOpacity>
</View>

                        </ScrollView>
                    </SafeAreaView>
                )
            }
        </View>
    )
}



const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent', // Düğme arkaplanı şeffaf
      borderColor: '#333', // Düğme kenarlık rengi
    },
    iconContainer: {
      marginRight: 5,
      flexDirection:'row',
    },
    text: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
    },
    favoritesButton:{
        flexDirection:'column', alignItems:'center',justifyContent:'center',marginLeft:20,backgroundColor:'transparent',padding:5,borderRadius:8
    }
  });