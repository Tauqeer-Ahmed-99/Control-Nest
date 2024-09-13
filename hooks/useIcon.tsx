import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@rneui/themed";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { getRandomItem } from "@/utils/helpers";

const useIcon = (name: string): { icon: React.JSX.Element; color: string } => {
  const {
    theme: {
      colors: { success, warning, error },
    },
  } = useTheme();

  const [iconData, setIconData] = useState({
    icon: <MaterialIcons name="light" size={24} color={success} />,
    color: success,
  });

  const COLORS = [success, warning, error];

  const color = getRandomItem(COLORS);

  const ICONS = [
    {
      name: "living",
      icon: <MaterialCommunityIcons name="sofa" size={24} color={color} />,
    },
    {
      name: "living",
      icon: (
        <MaterialCommunityIcons name="sofa-single" size={24} color={color} />
      ),
    },
    {
      name: "hall",
      icon: <MaterialCommunityIcons name="sofa" size={24} color={color} />,
    },
    {
      name: "hall",
      icon: (
        <MaterialCommunityIcons name="sofa-single" size={24} color={color} />
      ),
    },
    {
      name: "bed",
      icon: <Ionicons name="bed" size={24} color={color} />,
    },
    {
      name: "cctv",
      icon: <MaterialCommunityIcons name="cctv" size={24} color={color} />,
    },
    {
      name: "router",
      icon: <MaterialIcons name="router" size={24} color={color} />,
    },
    {
      name: "lamp",
      icon: <MaterialCommunityIcons name="lamp" size={24} color={color} />,
    },
    {
      name: "fan",
      icon: (
        <MaterialCommunityIcons name="ceiling-fan" size={24} color={color} />
      ),
    },
    {
      name: "fan",
      icon: <MaterialCommunityIcons name="fan" size={24} color={color} />,
    },
    {
      name: "light",
      icon: <FontAwesome name="lightbulb-o" size={24} color={color} />,
    },
    {
      name: "light",
      icon: <MaterialIcons name="light" size={24} color={color} />,
    },
  ];

  const icons = useMemo(
    () => ICONS.filter((icon) => name.toLowerCase().includes(icon.name)),
    [name],
  );

  useEffect(() => {
    if (icons.length === 0) {
      setIconData({
        icon: <MaterialIcons name="light" size={24} color={color} />,
        color,
      });
    } else if (icons.length === 1) {
      setIconData({ icon: icons[0].icon, color });
    } else {
      setIconData({ icon: getRandomItem(icons).icon, color });
    }
  }, []);

  return iconData;
};

export default useIcon;
