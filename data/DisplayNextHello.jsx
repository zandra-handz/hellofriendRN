import React from 'react';
import DisplayLottieAnimation from './DisplayLottieAnimation'; // Import the DisplayLottieAnimation component
import DataNextHello from './DataNextHello';
import { useSelectedFriend } from '../context/SelectedFriendContext';


const DisplayNextHello = () => {
    const { friendDashboardData } = useSelectedFriend();

    if (!friendDashboardData || friendDashboardData.length === 0) {
        return null;
      }
    
      const firstFriendData = friendDashboardData[0];// Assuming DataNextHello provides the text/data for the label

  return (
    <DisplayLottieAnimation
      label={firstFriendData.future_date_in_words}
      animationSource={require('../assets/anims/heartincircles.json')}
      rightSideAnimation={true}
      labelFontSize={13}
      labelColor="black"
      backgroundColor="transparent"
      animationWidth={140}
      animationHeight={140}
      fontMargin={0}
      animationHMargin={-46}
      animationVMargin={-10} 
      animationBMargin={3}
    />
  );
};

export default DisplayNextHello;
