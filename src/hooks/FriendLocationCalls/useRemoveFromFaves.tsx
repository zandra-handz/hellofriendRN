import { View, Text } from 'react-native'
import React from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
    userId: number;
    friendId: number;
}

const useRemoveFromFaves = ({userId, friendId}: Props) => {
  return (
    <View>
      <Text>useRemoveFromFaves</Text>
    </View>
  )
}

export default useRemoveFromFaves