import React, { useState} from 'react';
import BaseRowExpContModalFooter from '../scaffolding/BaseRowExpContModalFooter';
import SectionFriendAddAddresses from '../locations/SectionFriendAddAddresses';

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
