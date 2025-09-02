import React from "react";
import { View, StyleSheet, Text  } from "react-native";
import {
  Flow,
  Swing,
  Chase,
  Circle,
  CircleFade,
  Fold,
  Grid,
  Pulse,
  Wander,
  Wave,
} from "react-native-animated-spinkit"; 

const spinners = {
  circle: Circle,
  chase: Chase,
  swing: Swing,
  pulse: Pulse,
  grid: Grid,
  flow: Flow,
  circleFade: CircleFade,
  fold: Fold,
  wander: Wander,
  wave: Wave,
};

const LoadingPage = ({
  loading,
  includeLabel = false,
  label = "",
  labelColor = "white", 
  spinnerSize = 90,
  color = "limegreen",
  spinnerType = "wander", 
}) => {
  // const [showSpinner, setShowSpinner] = useState(loading);  
 
  // useEffect(() => {
  //   if (loading) {
  //     setShowSpinner(true); 
  //   } else {
  //     setShowSpinner(false);
  //   }
  // }, [loading]);
 
  if (!loading) return null;

  const Spinner = spinners[spinnerType] || Circle;

  return (
    <View style={styles.container}>
   
      {loading && (
        <>
          {includeLabel && (
            <View style={styles.textContainer}>
              <Text style={[styles.loadingTextBold, { color: labelColor }]}>
                {label}
              </Text>
            </View>
          )}
          <View style={styles.spinnerContainer}>
            <Spinner size={spinnerSize} color={color} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  textContainer: { 
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingTextBold: {
    fontSize: 20,
    fontFamily: "Poppins-Regular",
    textAlign: "center", 
  },
});

export default LoadingPage;
