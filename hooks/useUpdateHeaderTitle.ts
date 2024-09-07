import { useEffect } from "react";
import { useNavigation } from "expo-router";

const useUpdateHeaderTitle = (title: string) => {
  const navigation = useNavigation("");
  useEffect(() => {
    navigation.setOptions({
      headerTitle: title.charAt(0).toUpperCase().concat(title.slice(1)),
    });
  }, [navigation, title]);
};

export default useUpdateHeaderTitle;
