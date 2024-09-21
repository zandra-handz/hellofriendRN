import React, { useState} from 'react';
import BaseRowExpContModalFooter from '../components/BaseRowExpContModalFooter';
import SectionUserAddAddresses from '../components/SectionUserAddAddresses';

const RowExpUserAddAddresses = ({ title="Addresses" }) => {
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
            <SectionUserAddAddresses toggleClose={closeAddressView}/>
        </BaseRowExpContModalFooter>
    );
};
 

export default RowExpUserAddAddresses;
