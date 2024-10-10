import { View } from "react-native";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useTheme } from "@rneui/themed";

export default function Home() {
  const {
    theme: {
      colors: { primary },
    },
  } = useTheme();

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: primary,
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
      }}
    >
      <LoadingSkeleton height={200} width={200} borderRadius={12} />
      <LoadingSkeleton height={100} width={300} borderRadius={12} />
    </View>
  );
}
