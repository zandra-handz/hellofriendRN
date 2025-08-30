import { View, Text } from "react-native";
import React from "react";

import { useQueryClient } from "@tanstack/react-query";

type Props = {
  userId: string;
  locData: object;
};


// I think we will need to check that we aren't adding the same location more than once or adding one
// that is already in the list
// we may also want temp locations to be a separate cache but it might be a pain to integrate that into the location cache
// for the intended use cases
const useAddTempLocation = ({ userId, locObject }: Props) => {
  const queryClient = useQueryClient();

 
  const addTempLocation = (locObject) => {
    console.log(`new temp location in hook: `, locObject);
    queryClient.setQueryData(["locationList", userId], (old) => {
      return old ? [...old, locObject] : [locObject];
    });
  };


  const addTempLocationToBeginning = (locObject) => {
  queryClient.setQueryData(["locationList", userId], (old) => {
    return old ? [locObject, ...old] : [locObject];
  });
};

  return {
    addTempLocation,
    addTempLocationToBeginning,
  };
};

export default useAddTempLocation;
