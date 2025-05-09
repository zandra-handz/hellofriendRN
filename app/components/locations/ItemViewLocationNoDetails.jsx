import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { useLocationList } from "@/src/context/LocationListContext";
import CardHours from "./CardHours";
import SectionLocationImages from "../components/SectionLocationImages";
import SectionCustomerReviews from "../SectionCustomerReviews";
import ButtonPhoneNumber from "../components/ButtonPhoneNumber";
import ButtonDirections from "../components/ButtonDirections";
import ButtonSaveLocation from "../components/ButtonSaveLocation";
import StylingRating from "../StylingRating";

const ItemViewLocationNoDetails = ({ location, unSaved }) => {
  const { selectedLocation, additionalDetails, loadingAdditionalDetails } =
    useLocationList();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationTitle}>{selectedLocation?.title}</Text>
          <Text style={styles.locationAddress}>
            {selectedLocation?.address}
          </Text>
        </View>

        <>
          <Text style={styles.name}> {selectedLocation.name}</Text>
          <ButtonSaveLocation saveable={unSaved} />
        </>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.detailsColumn}>
          <View style={styles.detailRow}>
            <ButtonDirections address={additionalDetails.address} />
          </View>
          <View style={styles.detailRow}>
            <ButtonPhoneNumber phoneNumber={additionalDetails.phone} />
            <View
              style={[
                styles.statusContainer,
                additionalDetails.hours?.open_now
                  ? styles.openNowContainer
                  : styles.closedContainer,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  additionalDetails.hours?.open_now
                    ? styles.openNowText
                    : styles.closedText,
                ]}
              >
                {additionalDetails.hours?.open_now ? "Open" : "Closed"}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <StylingRating rating={additionalDetails.rating} />
          </View>
        </View>
        {additionalDetails.hours && (
          <CardHours hours={additionalDetails.hours.weekday_text} />
        )}
      </View>

      <SectionLocationImages photos={additionalDetails.photos} />

      <SectionCustomerReviews reviews={additionalDetails.reviews} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 2,
  },
  locationContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 8,
  },
  locationTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  locationAddress: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  name: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    textTransform: "uppercase",
    flex: 1,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  detailsColumn: {
    flex: 1,
    flexDirection: "column",
    marginRight: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  phone: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 18,
  },
  statusContainer: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 30,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  openNowContainer: {
    backgroundColor: "#d4edda",
  },
  closedContainer: {
    backgroundColor: "#f8d7da",
  },
  statusText: {
    fontSize: 10,
    fontFamily: "Poppins-Bold",
  },
  openNowText: {
    color: "green",
  },
  closedText: {
    color: "red",
  },
});

export default ItemViewLocationNoDetails;
