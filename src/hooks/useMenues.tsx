// import { View, Text } from "react-native";
// import React from "react";
// import useCurrentLocation from "./useCurrentLocation";

// const useMenues = () => {


//       const { currentLocationDetails } = useCurrentLocation();



//   const getAddressMenu = (userAddresses) => {
//     if (userAddresses && userAddresses.length > 0) {
//       const menuItems = userAddresses.map((address) => {
//         const uniqueKey = `${address.title}-${address.coordinates ? address.coordinates.join(",") : `${address.latitude},${address.longitude}`}`;

//         return {
//           key: uniqueKey,
//           id: address.id,
//           address: address.address,
//           title: address.title,
//           label: address.title,
//           isDefault: address.is_default,
//           latitude: address.coordinates
//             ? address.coordinates[0]
//             : address.latitude,
//           longitude: address.coordinates
//             ? address.coordinates[1]
//             : address.longitude,
//         };
//       });
//       return menuItems;
//     } else {
//         return null;
//     }
//   };

//       const getDefaultAddress = (addressList) => {
//         return (
            
//         addressList.find((address) => address.is_default === true)
//         )
//     };


//         const getCurrentAddress = () => {
//         if (currentLocationDetails) {
//             return (
              
//             currentLocationDetails
              
//             )
//         };};


//         const getDefaultUserAddress = (addresses) => {
//             const current = getCurrentAddress();

//             if (current) {
//                 return current
//             }

//             return getCurrentAddress(addresses);

//         };



//   return {getCurrentAddress, getDefaultAddress, getAddressMenu, getDefaultUserAddress};
// };

// export default useMenues;
