import React, { useRef } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator } from 'react-native';
import CardUpcoming from './CardUpcoming';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';

const TabScreenNext = () => {
    const { upcomingHelloes, isLoading } = useUpcomingHelloes();
    const listRef = useRef(null);

    // Function to scroll to top of the list
    const scrollToTop = () => {
        if (listRef.current) {
            listRef.current.scrollToOffset({ offset: 0, animated: true });
        }
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.spinnerContainer} accessibilityLabel="Loading upcoming hellos">
                    <ActivityIndicator size="large" color="hotpink" />
                </View>
            ) : (
                <FlatList
                    ref={listRef}
                    data={upcomingHelloes}
                    renderItem={({ item }) => (
                        <CardUpcoming
                            title={item.friend_name}
                            description={item.future_date_in_words}
                            thought_capsules_by_category={item.thought_capsules_by_category}
                            key={item.id}
                            accessibilityLabel={`Upcoming Hello with ${item.friend_name}, ${item.future_date_in_words}`}
                        />
                    )}
                    keyExtractor={item => item.id.toString()}
                    accessibilityRole="list"
                    keyboardShouldPersistTaps="handled"
                    onContentSizeChange={scrollToTop} // Scroll to top when content size changes (e.g., new data loaded)
                    accessibilityViewIsModal={false} // Ensure accessibility respects parent container
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TabScreenNext;
