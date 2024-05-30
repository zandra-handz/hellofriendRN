import React, { useState } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { useAuthUser } from '../context/AuthUserContext';
import AlertPanelBottom from './AlertPanelBottom'; // Import the AlertProfile component

const DynImageUser = () => {
  const { authUserState } = useAuthUser();
  const [showProfile, setShowProfile] = useState(false); // State to toggle the visibility of the profile

  // Function to handle button press and toggle profile visibility
  const handlePress = () => {
    setShowProfile(true);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Image
        style={styles.croppedImage}
        source={require('../img/lizard-14.jpg')} // Use the original image path
        resizeMode="contain" // or any other appropriate resizeMode
      />
      {/* Render the profile based on showProfile state */}
      {showProfile && (
        <AlertPanelBottom
          visible={showProfile}
          profileData={authUserState} // Since there's no profile data for the image user
          onClose={() => setShowProfile(false)} // Close the profile when Close button is pressed
          renderForm={() => <FormUserAddressCreate userId={authUserState.user.id} />} // Pass the form component as a prop
        />
      )}
    </TouchableOpacity>
  );
};


export default DynImageUser;

// Define styles for the image
const styles = {
  croppedImage: {
    width: 100, // Set the width of the image
    height: 100, // Set the height of the image
    resizeMode: 'contain', // or any other appropriate resizeMode
  },
};
