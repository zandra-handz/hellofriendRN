
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const HintReady = ({ message, icon, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <FontAwesome name={icon} size={24} color="green" style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'top',
    width: '100%',
    paddingTop: 0,
    paddingHorizontal: 2,
  },
  icon: {
    marginRight: 0,
  },
  message: {
    marginLeft: 6,
    fontSize: 15,
    color: 'gray',
    fontStyle: 'italic',
    width: '100%',
  },
});

export default HintReady;
