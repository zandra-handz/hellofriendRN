import React, { useState} from 'react';
import BaseRowExpContModalFooter from '../components/BaseRowExpContModalFooter';
import SectionFriendAddAddresses from '../components/SectionFriendAddAddresses';

const RowExpFriendAddAddresses = ({ title="Addresses" }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const closeAddressView = () => {
        setIsExpanded(false);
    };


    return (
        <BaseRowExpContModalFooter
            iconName="map"
            iconSize={20}
            label={title}
            useToggle={true}
            value={isExpanded}
            onTogglePress={() => setIsExpanded(!isExpanded)}
            useAltButton={true}
            altButtonOther='map'
            onAltButtonPress={() => setIsExpanded(!isExpanded)} 
        >
            <SectionFriendAddAddresses toggleClose={closeAddressView}/>
        </BaseRowExpContModalFooter>
    );
};
 

export default RowExpFriendAddAddresses;
