import Switch from "@/components/Switch";
import Tile from "@/components/Tile";
import { Device as DeviceType } from "@/utils/models";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Button, Text, useTheme } from "@rneui/themed";
import React, { useCallback, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getScheduledDays = (scheduledDays: string) => {
  const schedDays: boolean[] = new Array(7).fill(false);
  if (!scheduledDays) return schedDays;
  scheduledDays
    .split("-")
    .forEach((day) => (schedDays[DAYS.findIndex((d) => d === day)] = true));
  return schedDays;
};

const DeviceScheduleInfo = ({
  device,
  setDevice,

  isError,
}: {
  device?: DeviceType;
  setDevice: React.Dispatch<React.SetStateAction<DeviceType | undefined>>;
  isError: boolean;
}) => {
  const {
    theme: {
      colors: { primary, error, white },
    },
  } = useTheme();

  const scheduledDays = useMemo(
    () => getScheduledDays(device?.days_scheduled ?? ""),
    [device],
  );

  const showtimePicker = useCallback((timeFor: "start" | "off") => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (e, d) => {
        if (e.type === "set") {
          const date = `${d?.getHours()}:${d?.getMinutes()}`;
          if (timeFor === "start") {
            setDevice((device) => ({
              ...(device as DeviceType),
              start_time: date,
            }));
          } else {
            setDevice((device) => ({
              ...(device as DeviceType),
              off_time: date,
            }));
          }
        }
      },
      mode: "time",
    });
  }, []);

  const handleDaysSelection = useCallback(
    (dayIndex: number, day: string) => {
      if (day === "All") {
        const isAllSelected = scheduledDays.every((day) => day);
        setDevice((device) => ({
          ...(device as DeviceType),
          days_scheduled: scheduledDays
            .map((_isSelected) => !isAllSelected)
            .map((isSelected, idx) => (isSelected ? DAYS[idx] : null))
            .filter((day) => day)
            .join("-"),
        }));
      } else {
        setDevice((device) => ({
          ...(device as DeviceType),
          days_scheduled: scheduledDays
            .map((isSelected, idx) =>
              idx === dayIndex ? !isSelected : isSelected,
            )
            .map((isSelected, idx) => (isSelected ? DAYS[idx] : null))
            .filter((day) => day)
            .join("-"),
        }));
      }
    },
    [device],
  );

  return (
    <Tile>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16 }}>Scheduled</Text>
        <View
          style={{
            height: 45,
            width: 80,
            backgroundColor: primary,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
          }}
        >
          <Switch
            value={device?.is_scheduled ?? false}
            onChange={(value) =>
              setDevice((device) => ({
                ...(device as DeviceType),
                is_scheduled: value,
              }))
            }
          />
        </View>
      </View>
      {device?.is_scheduled && (
        <>
          <View>
            <Text style={{ fontSize: 16 }}>Days Scheduled</Text>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 12,
              }}
            >
              {["All", ...DAYS].map((day, idx) => (
                <TouchableOpacity
                  key={day}
                  // borderless
                  onPress={() => handleDaysSelection(idx - 1, day)} // idx-1 to ignore "All"
                  style={{
                    width: "12.5%",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 40,
                    borderTopLeftRadius: idx === 0 ? 12 : undefined,
                    borderBottomLeftRadius: idx === 0 ? 12 : undefined,
                    borderTopRightRadius: idx === 7 ? 12 : undefined,
                    borderBottomRightRadius: idx === 7 ? 12 : undefined,
                    borderRightWidth: 1,
                    borderLeftWidth: idx === 0 ? 1 : undefined,
                    borderBottomWidth: 1,
                    borderTopWidth: 1,
                    borderColor:
                      isError && !scheduledDays.some((day) => day)
                        ? error
                        : white,
                    backgroundColor: scheduledDays[idx - 1] // idx-1 to ignore "All"
                      ? "#3eb9a2"
                      : undefined,
                  }}
                >
                  <Text>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View
            style={[
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
              isError && !device?.start_time
                ? {
                    borderBottomWidth: 1,
                    borderColor: "#d66464",
                  }
                : undefined,
            ]}
          >
            <Text style={{ fontSize: 16 }}>Start Time</Text>
            <Button type="clear" onPress={() => showtimePicker("start")}>
              <Text>
                {device?.start_time ? device?.start_time : "Set Time"}
              </Text>
            </Button>
          </View>
          <View
            style={[
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
              isError && !device?.off_time
                ? {
                    borderBottomWidth: 1,
                    borderColor: "#d66464",
                  }
                : undefined,
            ]}
          >
            <Text style={{ fontSize: 16 }}>Off Time</Text>
            <Button type="clear" onPress={() => showtimePicker("off")}>
              <Text>{device?.off_time ? device?.off_time : "Set Time"}</Text>
            </Button>
          </View>
        </>
      )}
    </Tile>
  );
};

export default DeviceScheduleInfo;
