import React from 'react';
import { TouchableOpacity, StyleSheet, View, Dimensions  } from 'react-native';
import { FlashList } from "@shopify/flash-list";  
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

 
import ButtonCalendarDateSvgAndLabel from '../components/ButtonCalendarDateSvgAndLabel';
 
const ButtonBaseLargeHorScroll = ({
  height, 
  satelliteCount = 2, 
  satelliteOnPress,  
}) => { 
  const globalStyles = useGlobalStyle();
  const { width } = Dimensions.get('window'); 
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { setFriend } = useSelectedFriend();
  
  
  
  const extractNumberDate = (dateString) => {
    const match = dateString.match(/\d+/);  
    return match ? match[0] : '';  
  };

  const extractMonth = (dateString) => {
    const match = dateString.match(/([a-zA-Z]+)\s+\d+/);  
    return match ? match[1].slice(0, 3).toUpperCase() : ''; 
  };



  const satelliteWidth = (width / 3.5);

  const handlePress = (hello) => {
    const { id, name } = hello.friend; 
    const selectedFriend = id === null ? null : { id: id, name: name }; 
    setFriend(selectedFriend);  

  };


  const renderUpcomingHelloes = () => {

    return (
      <FlashList
        data={upcomingHelloes.slice(0)}
        horizontal={true}
        keyExtractor={(item, index) => `satellite-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.button,
              { width: satelliteWidth },
            ]}
            onPress={() => handlePress(item)}
          >
            <ButtonCalendarDateSvgAndLabel 
              numberDate={extractNumberDate(item.future_date_in_words)}
              month={extractMonth(item.future_date_in_words)} 
              label={item.friend_name}
              width={40} 
              height={40} 
              showMonth={false} 
              enabled={true}  
              color='white' 
              onPress={() => handlePress(item)}
            />
          </TouchableOpacity>
        )}
        estimatedItemSize={54}
        showsHorizontalScrollIndicator={false}
        scrollIndicatorInsets={{ right: 1 }}
      />
    );
  };
  

  return (
    <View style={[styles.container, {height: height}]}>
       
        <View style={styles.buttonContainer}>
         
            <>
             
          {renderUpcomingHelloes()} 
          </>  
        </View>  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',  
    borderRadius: 30,
    overflow: 'hidden',
  }, 
  satelliteSection: {
    width: '33.33%', 
    borderRadius: 0,
    marginLeft: -20,
    paddingLeft: 0,  
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
  },
  satelliteButton: { 
    alignItems: 'center',  
    alignContents: 'center', 
    justifyContent: 'space-around',  
  },
  buttonContainer: {
    flexDirection: 'row', 
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
  },
  button: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center', 
    borderRadius: 0, 
    borderRightWidth: .8,
    borderColor: 'darkgray', 
    paddingTop: 30,
    height: '100%',
    width: 50,
    backgroundColor: 'transparent',

    
  },
  satelliteText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
    color: 'white',
    
  },
});

export default ButtonBaseLargeHorScroll;
