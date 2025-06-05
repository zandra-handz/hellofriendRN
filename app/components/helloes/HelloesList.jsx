 
import { View, Text, StyleSheet, Dimensions } from 'react-native'; 
 import { FlashList } from "@shopify/flash-list";
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import LocationSolidSvg from '@/app/assets/svgs/location-solid.svg';  
import ButtonHello from '../buttons/helloes/ButtonHello';

const HelloesList = ({ 
    helloesData,
    onPress, 
    horizontal = true,
    singleLineScroll = false,  
    columns = 3,  
}) => {  
    const { themeStyles } = useGlobalStyle(); 
     const momentListBottomSpacer = Dimensions.get("screen").height - 400;


    return (
        <View style={[styles.container, {height: '100%'}]}>
            {helloesData && helloesData.length > 0 && (
            <>
                
            {/* <Text style={[styles.headerText, themeStyles.genericText]}>Helloes</Text>
             */}
            <FlashList
                data={helloesData}
                horizontal={horizontal && singleLineScroll}
                keyExtractor={(hello) => hello.id.toString()}
                renderItem={({ item: hello }) => (
                    <>
                        {horizontal ? (
                            <ButtonHello
                                hello={hello} 
                                onPress={() => {onPress(hello)}} 
                                iconColor={themeStyles.genericText.color}
                                color={themeStyles.genericText.color}
                                icon={LocationSolidSvg} 
                            />
                             
                        ) : (
                            <View style={{marginBottom: '2%'}}>
                                
                            <ButtonHello
                                hello={hello} 
                                onPress={() => {onPress(hello)}} 
                                iconColor={themeStyles.genericText.color}
                                color={themeStyles.genericText.color}
                                icon={LocationSolidSvg} 
                            />
                            
                            </View>
                        )}
                    </>
                )}
                numColumns={horizontal && !singleLineScroll ? columns : 1}
                columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
                estimatedItemSize={99}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollIndicatorInsets={{ right: 1 }}
                        ListFooterComponent={() => (
                          <View style={{ height: momentListBottomSpacer }} />
                        )}
            />
 
        </>
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        paddingHorizontal: 0,
        backgroundColor: 'transparent',
        width: '100%',
        minHeight: 2,
        height: '100%',
    
    },
    headerText: {
        color: 'transparent',
        fontFamily: 'Poppins-Bold',
        fontSize: 16, 
        marginBottom: 6,
    },
    imageRow: {
        justifyContent: 'space-between',
    }, 
});

export default HelloesList;
