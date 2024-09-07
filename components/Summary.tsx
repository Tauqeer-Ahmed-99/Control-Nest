import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text } from "@rneui/themed";
import React from "react";
import { useWindowDimensions, View } from "react-native";
import BorderContainer from "./BorderContainer";

interface ISummaryItem {
  name: string;
  icon: React.ReactNode;
  primaryText: string;
  secondaryText: string;
}

const summaryItems: ISummaryItem[] = [
  {
    name: "weather",
    icon: <Entypo name="cloud" size={24} color="#6BE7FF" />,
    primaryText: "27 C",
    secondaryText: "Kalyan",
  },
  {
    name: "devices",
    icon: (
      <MaterialCommunityIcons name="connection" size={24} color="#FE6CE6" />
    ),
    primaryText: "13",
    secondaryText: "Active Devices",
  },
  {
    name: "usage",
    icon: <FontAwesome6 name="bolt" size={24} color="#FFF6B0" />,
    primaryText: "312 kwh",
    secondaryText: "Usage",
  },
];

const GAP = 50;
const BORDER_WIDTH = summaryItems.length * 2 * 5;
const PADDING_HORIZONTAL = 12 * 2;

const SummaryCard = ({ summaryItem }: { summaryItem: ISummaryItem }) => {
  const { width } = useWindowDimensions();

  const cardWidth =
    (width - BORDER_WIDTH - GAP - PADDING_HORIZONTAL) / summaryItems.length;

  return (
    <BorderContainer
      borderWidth={2}
      style={{ height: 130, width: cardWidth, borderRadius: 12 }}
    >
      <View
        style={{
          height: "100%",
          width: "100%",
          padding: 12,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {summaryItem.icon}
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          {summaryItem.primaryText}
        </Text>
        <Text style={{ textAlign: "center", color: "grey" }}>
          {summaryItem.secondaryText}
        </Text>
      </View>
    </BorderContainer>
  );
};

const Summary = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
      }}
    >
      {summaryItems.map((summaryItem) => (
        <SummaryCard key={summaryItem.name} summaryItem={summaryItem} />
      ))}
    </View>
  );
};

export default Summary;
