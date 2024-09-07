import React, { useMemo, useState } from "react";
import { ToastAndroid, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { TextInput, TouchableRipple } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Dialog, Switch, Text } from "@rneui/themed";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Container from "@/components/Container";
import Tile from "@/components/Tile";
import useAuth from "@/hooks/useAuth";
import useDeviceMutation from "@/hooks/useDeviceMutation";
import { useDeviceData } from "@/hooks/useHouse";
import useUpdateHeaderTitle from "@/hooks/useUpdateHeaderTitle";
import { ApiRoutes } from "@/routes/routes";
import { Device as DeviceType } from "@/utils/models";
import useRemoveDeviceMutation from "@/hooks/useRemoveDeviceMutation";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getScheduledDays = (scheduledDays: string) => {
  const schedDays: boolean[] = new Array(7).fill(false);
  if (!scheduledDays) return schedDays;
  scheduledDays
    .split("-")
    .forEach((day) => (schedDays[DAYS.findIndex((d) => d === day)] = true));
  return schedDays;
};

const Device = () => {
  const { houseId, roomId, deviceId } = useLocalSearchParams();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const deviceData = useDeviceData(
    houseId as string,
    roomId as string,
    deviceId as string,
  );
  useUpdateHeaderTitle(deviceData!.deviceName ?? "My Device");
  const { userProfile } = useAuth();
  const [device, setDevice] = useState(deviceData);
  const [scheduledDays, setScheduledDays] = useState(
    getScheduledDays(device?.daysScheduled ?? ""),
  );
  const [isError, setIsError] = useState(false);
  const { mutate, isPending } = useDeviceMutation();
  const { mutate: removeDevice, isPending: isRemovingDevice } =
    useRemoveDeviceMutation();
  const queryClient = useQueryClient();

  const showtimePicker = (timeFor: "start" | "off") => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (e, d) => {
        if (e.type === "set") {
          const date = `${d?.getHours()}:${d?.getMinutes()}`;
          if (timeFor === "start") {
            setDevice((device) => ({
              ...(device as DeviceType),
              startTime: date,
            }));
          } else {
            setDevice((device) => ({
              ...(device as DeviceType),
              offTime: date,
            }));
          }
        }
      },
      mode: "time",
    });
  };

  const handleDaysSelection = (dayIndex: number, day: string) => {
    if (day === "All") {
      const isAllSelected = scheduledDays.every((day) => day);
      setScheduledDays((prevState) => prevState.map((day) => !isAllSelected));
    } else {
      setScheduledDays((prevState) =>
        prevState.map((isSelected, idx) =>
          idx === dayIndex ? !isSelected : isSelected,
        ),
      );
    }
  };

  const saveDeviceConfig = async () => {
    if (device?.isScheduled) {
      const isSomeSelected = scheduledDays.some((day) => day);
      if (!isSomeSelected || !device.startTime || !device.offTime) {
        setIsError(true);
        ToastAndroid.show(
          "Atlease one day must be selected and Start, Off time is required to schedule a device.",
          ToastAndroid.LONG,
        );
        return;
      }
    }
    const daysScheduled: string[] = [];
    scheduledDays.forEach((day, idx) => {
      if (day) daysScheduled.push(DAYS[idx]);
    });
    mutate(
      {
        houseId,
        userId: userProfile?.id,
        userName: `${userProfile?.given_name ?? ""} ${
          userProfile?.family_name ?? ""
        }`.trim(),
        ...device,
        startTime: device?.startTime ?? "",
        offTime: device?.offTime ?? "",
        daysScheduled: daysScheduled.join("-"),
      },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            queryClient.invalidateQueries({ queryKey: [ApiRoutes.UserHouses] });
          } else {
            ToastAndroid.show(res.message, ToastAndroid.LONG);
          }
        },
        onError: (res) => {
          ToastAndroid.show(res.message, ToastAndroid.LONG);
        },
      },
    );
  };

  const removeDeviceConfirm = () => {
    setIsConfirmationOpen(false);
    removeDevice(
      {
        userId: userProfile?.id,
        userName: `${userProfile?.given_name ?? ""} ${
          userProfile?.family_name ?? ""
        }`.trim(),
        houseId,
        roomId,
        deviceId,
      },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            router.replace(`${houseId}/${roomId}`);
            queryClient.invalidateQueries({ queryKey: [ApiRoutes.UserHouses] });
          } else {
            ToastAndroid.show(res.message, ToastAndroid.LONG);
          }
        },
        onError: (res) => {
          ToastAndroid.show(res.message, ToastAndroid.LONG);
        },
      },
    );
  };

  return (
    <Container>
      <ScrollView>
        <View style={{ gap: 16 }}>
          <Tile>
            <TextInput
              label="Device Name"
              mode="outlined"
              value={device?.deviceName}
              onChangeText={(text) =>
                setDevice((device) => ({
                  ...(device as DeviceType),
                  deviceName: text,
                }))
              }
              style={{ backgroundColor: "#FFFFFF" }}
            />
            <TextInput
              label="GPIO Pin"
              mode="outlined"
              value={device?.pinNumber.toString()}
              onChangeText={(text) =>
                setDevice((device) => ({
                  ...(device as DeviceType),
                  pinNumber: isNaN(Number(text))
                    ? (device?.pinNumber as number)
                    : Number(text),
                }))
              }
              style={{ backgroundColor: "#FFFFFF" }}
            />
          </Tile>
          <Tile>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 16 }}>Status</Text>
              <Switch
                value={device?.status}
                onValueChange={(value) =>
                  setDevice((device) => ({
                    ...(device as DeviceType),
                    status: value,
                  }))
                }
              />
            </View>
          </Tile>
          <Tile>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 16 }}>Scheduled</Text>
              <Switch
                value={device?.isScheduled}
                onValueChange={(value) => {
                  setDevice((device) => ({
                    ...(device as DeviceType),
                    isScheduled: value,
                  }));

                  if (!value) {
                    setDevice((device) => ({
                      ...(device as DeviceType),
                      startTime: "",
                      offTime: "",
                    }));
                  }
                }}
              />
            </View>
            {device?.isScheduled && (
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
                      <TouchableRipple
                        key={day}
                        borderless
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
                              ? "#d66464"
                              : "#c6c6c6",
                          backgroundColor: scheduledDays[idx - 1] // idx-1 to ignore "All"
                            ? "#3e31ab"
                            : undefined,
                        }}
                      >
                        <Text
                          style={{
                            color: scheduledDays[idx - 1] ? "white" : undefined, // idx-1 to ignore "All"
                          }}
                        >
                          {day}
                        </Text>
                      </TouchableRipple>
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
                    isError && !device.startTime
                      ? {
                          borderBottomWidth: 1,
                          borderColor: "#d66464",
                        }
                      : undefined,
                  ]}
                >
                  <Text style={{ fontSize: 16 }}>Start Time</Text>
                  <Button type="clear" onPress={() => showtimePicker("start")}>
                    {device?.startTime ? device?.startTime : "Set Time"}
                  </Button>
                </View>
                <View
                  style={[
                    {
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    },
                    isError && !device.offTime
                      ? {
                          borderBottomWidth: 1,
                          borderColor: "#d66464",
                        }
                      : undefined,
                  ]}
                >
                  <Text style={{ fontSize: 16 }}>Off Time</Text>
                  <Button type="clear" onPress={() => showtimePicker("off")}>
                    {device?.offTime ? device?.offTime : "Set Time"}
                  </Button>
                </View>
              </>
            )}
          </Tile>
          <Tile>
            <Button disabled={isPending} onPress={saveDeviceConfig}>
              Save
            </Button>
          </Tile>
          <Tile>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16 }}>Last Updated</Text>
              <Text>
                {new Date(deviceData!.updatedAt).toLocaleDateString()} @{" "}
                {new Date(deviceData!.updatedAt).toLocaleTimeString()}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16 }}>Device Created</Text>
              <Text>
                {new Date(deviceData!.createdAt).toLocaleDateString()} @{" "}
                {new Date(deviceData!.createdAt).toLocaleTimeString()}
              </Text>
            </View>
          </Tile>
          <Tile>
            <Button
              type="outline"
              color="error"
              onPress={() => setIsConfirmationOpen(true)}
            >
              Remove Device
            </Button>
          </Tile>
        </View>
        <Dialog isVisible={isPending || isRemovingDevice}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <Dialog.Loading loadingProps={{ size: "large" }} />
            <Text style={{ fontSize: 18 }}>
              {isRemovingDevice
                ? `Removing device ${device?.deviceName}...`
                : "Saving device config..."}
            </Text>
          </View>
        </Dialog>
        <Dialog isVisible={isConfirmationOpen}>
          <View style={{ gap: 16 }}>
            <Text style={{ fontWeight: 900 }}>Remove Device</Text>
            <Text>
              {`Are you sure, you want to remove '${device?.deviceName}' ?`}
            </Text>
          </View>
          <Dialog.Actions>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Button
                type="outline"
                onPress={() => {
                  setIsConfirmationOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                buttonStyle={{ backgroundColor: "rgba(214, 61, 57, 1)" }}
                onPress={removeDeviceConfirm}
              >
                Remove
              </Button>
            </View>
          </Dialog.Actions>
        </Dialog>
      </ScrollView>
    </Container>
  );
};

export default Device;
