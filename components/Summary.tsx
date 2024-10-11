import { useDevicesData } from "@/hooks/useHouse";
import useWeather from "@/hooks/useWeather";
import useWeatherIcons from "@/hooks/useWeatherIcon";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text } from "@rneui/themed";
import React, { useState } from "react";
import { ActivityIndicator, useWindowDimensions, View } from "react-native";
import BorderContainer from "./BorderContainer";
import useEnergyConsumption from "@/hooks/useEnergyConsumption";
import { useUser } from "@clerk/clerk-expo";
import { TouchableOpacity } from "react-native";

interface ISummaryItem {
  name: string;
  icon: React.ReactNode;
  primaryText: React.ReactNode;
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
    name: "energy",
    icon: <FontAwesome6 name="bolt" size={24} color="#FFF6B0" />,
    primaryText: "312 kwh",
    secondaryText: "Monthly Usage",
  },
];

const GAP = 30;
const BORDER_WIDTH = summaryItems.length * 2 * 5;
const PADDING_HORIZONTAL = 12 * 2;

const SummaryView = ({
  summaryItem,
  calculateEnergyConsumption,
}: {
  summaryItem: ISummaryItem;
  calculateEnergyConsumption?: () => void;
}) => {
  const Component = (
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

      <Text
        style={{
          textAlign: "center",
          fontSize: summaryItem.primaryText === "Calculate Now" ? 12 : 20,
        }}
      >
        {summaryItem.primaryText}
      </Text>
      <Text style={{ textAlign: "center", color: "grey" }}>
        {summaryItem.secondaryText}
      </Text>
    </View>
  );

  return summaryItem.primaryText === "Calculate Now" ? (
    <TouchableOpacity onPress={() => calculateEnergyConsumption?.()}>
      {Component}
    </TouchableOpacity>
  ) : (
    Component
  );
};

const SummaryCard = ({
  summaryItem,
  calculateEnergyConsumption,
}: {
  summaryItem: ISummaryItem;
  calculateEnergyConsumption?: () => void;
}) => {
  const { width } = useWindowDimensions();
  const cardWidth =
    (width - BORDER_WIDTH - GAP - PADDING_HORIZONTAL) / summaryItems.length;

  return (
    <BorderContainer
      borderWidth={2}
      style={{ height: 130, width: cardWidth, borderRadius: 12 }}
    >
      <SummaryView
        summaryItem={summaryItem}
        calculateEnergyConsumption={calculateEnergyConsumption}
      />
    </BorderContainer>
  );
};

const Summary = () => {
  const devices = useDevicesData();
  const { data: weather, isLoading: isWeatherLoading } = useWeather();
  const icon = useWeatherIcons(weather?.current.condition.text ?? "");
  const { user } = useUser();
  const [calculateEnergyConsumption, setCalculateEnergyConsumption] =
    useState(false);
  const {
    data: energyConsumptionData,
    isLoading: isEnergyConsumptionDataLoading,
    status: energyConsumptionStatus,
    fetchStatus: energyConsumptionFetchStatus,
  } = useEnergyConsumption(
    { userId: user?.id as string },
    { enabled: calculateEnergyConsumption },
  );

  let consumption = Number(
    energyConsumptionData?.data.energy_consumption_watt_hours,
  );
  consumption = isNaN(consumption) ? 0 : consumption;
  consumption = consumption > 0 ? consumption / 1000 : consumption;

  const isEnergyConsumptionNotCalculate =
    energyConsumptionStatus === "pending" &&
    energyConsumptionFetchStatus === "idle";

  summaryItems[0].icon = icon;
  summaryItems[0].primaryText = `${weather?.current?.temp_c ?? ""}° C`;
  summaryItems[0].secondaryText = isWeatherLoading
    ? "Loading"
    : weather?.location?.name ?? "";

  summaryItems[1].primaryText = devices
    ? devices.filter((device) => device.status).length.toString()
    : "0";

  summaryItems[2].primaryText = isEnergyConsumptionNotCalculate ? (
    "Calculate Now"
  ) : isEnergyConsumptionDataLoading ? (
    <ActivityIndicator />
  ) : (
    `${consumption} kwh`
  );
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
      }}
    >
      {summaryItems.map((summaryItem) => (
        <SummaryCard
          key={summaryItem.name}
          summaryItem={summaryItem}
          calculateEnergyConsumption={() => setCalculateEnergyConsumption(true)}
        />
      ))}
    </View>
  );
};

export default Summary;
