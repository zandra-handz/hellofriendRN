import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const CardTravelComparison = ({ myData, friendData }) => {
  return (
    <View style={styles.card}>
      <View style={styles.side}>
        <Text style={styles.title}>Me</Text>
        <View style={styles.timeContainer}>
          <FontAwesome5 name="clock" size={24} color="#555" />
          <Text style={styles.time}>{myData.time}</Text>
        </View>
        <Text style={styles.miles}>{myData.miles} miles</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.side}>
        <Text style={styles.title}>Friend</Text>
        <View style={styles.timeContainer}>
          <FontAwesome5 name="clock" size={24} color="#555" />
          <Text style={styles.time}>{friendData.time}</Text>
        </View>
        <Text style={styles.miles}>{friendData.miles} miles</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'hotpink',
    padding: 16,
    marginVertical: 8,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '100%',
  },
  side: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  time: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 8,
  },
  miles: {
    fontSize: 14,
    color: 'black',
  },
  divider: {
    width: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 16,
  },
});

export default CardTravelComparison;
