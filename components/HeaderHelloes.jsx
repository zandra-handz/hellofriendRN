import React, { useEffect, useState } from 'react';
import HeaderBaseWithSearch from '../components/HeaderBaseWithSearch';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import { fetchPastHelloes } from '../api'; 
import ItemViewHello from '../components/ItemViewHello';

const HeaderHelloes = () => {
    const { selectedFriend } = useSelectedFriend(); 
    const [helloesList, setHelloesList] = useState([]);  
    const [flattenedHelloesList, setFlattenedHelloesList] = useState([]); 
    const [isFetchingHelloes, setFetchingHelloes] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [ selectedHello, setSelectedHello ] = useState(null);

    
    const onPress = (hello) => {
       const matchedHello = helloesList.find(item => item.id === hello.id);
    
        if (matchedHello) {
            setSelectedHello(matchedHello);
            console.log('This hello is already in the list:', matchedHello);
            setIsModalVisible(true);
        } else {
            console.log('This hello is not in the list.');
        }
    };
    
      const closeModal = () => {
        setIsModalVisible(false);
      };
 
    const flattenHelloesData = (helloes) => {
        return helloes.flatMap((hello) => {
          const pastCapsules = hello.pastCapsules || []; // Ensure it's an array or an empty one if undefined
    
             return pastCapsules.length > 0 ? 
                pastCapsules.map(capsule => ({
                    id: hello.id,
                    date: hello.date,
                    type: hello.type,
                    typedLocation: hello.typedLocation,
                    locationName: hello.locationName,
                    location: hello.location,
                    additionalNotes: hello.additionalNotes || '', // Keep existing additional notes
                    capsuleId: capsule.id,     
                    capsule: capsule.capsule,   
                    typedCategory: capsule.typed_category  
                })) :
                [{
                    id: hello.id,
                    date: hello.date,
                    type: hello.type,
                    typedLocation: hello.typedLocation,
                    locationName: hello.locationName,
                    location: hello.location,
                    additionalNotes: hello.additionalNotes || '', // Keep existing additional notes
                    capsuleId: null,             
                    capsule: null,
                    typedCategory: null
                }];
        });
    };
    
    

    useEffect(() => {
        const fetchData = async () => {
            setFetchingHelloes(true);
            try {
                if (selectedFriend) {
                    const helloes = await fetchPastHelloes(selectedFriend.id);
                    const flattenedHelloes = flattenHelloesData(helloes);
                    
                    setHelloesList(helloes);  
                    setFlattenedHelloesList(flattenedHelloes);
                    console.log("fetchData Helloes List: ", helloes);
                    console.log("Flattened Helloes: ", flattenedHelloes);
                } else { 
                    setHelloesList(helloes || []);
                    setFlattenedHelloesList([]);
                }
            } catch (error) {
                console.error('Error fetching helloes list:', error);
            } finally {
                setFetchingHelloes(false);
            }
        };
        fetchData();
    }, [selectedFriend]); 

    

    return(
        <> 
        {helloesList && ( 
        <HeaderBaseWithSearch headerTitle="Helloes history" onPress={onPress} componentData={flattenedHelloesList} dataFieldToSearch={['date', 'locationName',  'capsule',  'additionalNotes']} />
        )} 
        {isModalVisible && selectedHello && (
        <ItemViewHello hello={selectedHello} onClose={closeModal} />
      )}
        </>
    );
};

export default HeaderHelloes;
