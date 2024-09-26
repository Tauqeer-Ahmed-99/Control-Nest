import { View } from "react-native";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function Home() {
  return (
    <View>
      {[...new Array(6)].map((_, idx) => (
        <LoadingSkeleton key={idx} borderRadius={12} />
      ))}
    </View>
  );
}
