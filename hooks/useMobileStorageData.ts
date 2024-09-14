import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";

const useMobileStorageData = (key: string) => {
  return useQuery<string | null>({
    queryKey: ["mobile-storage", key],
    queryFn: async () => {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : value;
    },
  });
};

export const useMobileStorageMutation = (key: string) => {
  return useMutation({
    mutationKey: ["mobile-storage", key],
    mutationFn: async (value: unknown) => {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    },
  });
};

export default useMobileStorageData;
