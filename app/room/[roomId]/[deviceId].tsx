import BottomNavigation from "@/components/BottomNavigation";
import InputField from "@/components/InputField";
import Select from "@/components/Select";
import Switch from "@/components/Switch";
import Tile from "@/components/Tile";
import useAuth from "@/hooks/useAuth";
import useAvailableGPIOPins from "@/hooks/useAvailableGPIOPins";
import useDeviceMutation from "@/hooks/useDeviceMutation";
import {
  useDeviceData,
  UserHouseResponse,
  useRoomData,
} from "@/hooks/useHouse";
import useRemoveDeviceMutation from "@/hooks/useRemoveDeviceMutation";
import useSwitchDeviceMutation from "@/hooks/useSwitchDeviceMutation";
import { ApiRoutes } from "@/routes/routes";
import { Device as DeviceType, HeaderPinConfig } from "@/utils/models";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { BottomSheet, Button, Text, useTheme } from "@rneui/themed";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";

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
  const {
    theme: {
      colors: { primary, success, warning, error, white },
    },
  } = useTheme();
  const { roomId, deviceId } = useLocalSearchParams();
  const room = useRoomData(roomId as string);
  const deviceData = useDeviceData(roomId as string, deviceId as string);
  const [device, setDevice] = useState(deviceData);
  const [status, setStatus] = useState(device?.status ?? false);
  const [scheduledDays, setScheduledDays] = useState(
    getScheduledDays(device?.days_scheduled ?? ""),
  );
  const deviceNameRef = useRef(device?.device_name ?? "");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: mutateDevice, isPending: isConfigureDeviceLoading } =
    useDeviceMutation();
  const { mutate: removeDevice, isPending: isRemovingDevice } =
    useRemoveDeviceMutation();
  const { userProfile } = useAuth();
  const { data: availableGPIOPins, isLoading: isLoadingAvailableGPIOPins } =
    useAvailableGPIOPins({ userId: userProfile?.id as string });
  const { mutate: switchDevice } = useSwitchDeviceMutation();

  const handleOnChange = (value: boolean) => {
    setStatus(value);
    switchDevice(
      {
        houseId: room?.house_id,
        userId: userProfile?.id,
        userName: userProfile?.given_name,
        deviceId: device?.device_id,
        statusFrom: device?.status,
        statusTo: value,
      },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            queryClient.setQueryData(
              [ApiRoutes.UserHouse],
              (oldData: UserHouseResponse) => {
                return {
                  ...oldData,
                  data: {
                    ...oldData.data,
                    rooms: oldData.data.rooms.map((r) =>
                      r.room_id === device?.room_id
                        ? {
                            ...r,
                            devices: r.devices.map((d) =>
                              d.device_id === device?.device_id
                                ? { ...d, status: value }
                                : d,
                            ),
                          }
                        : r,
                    ),
                  },
                } as UserHouseResponse;
              },
            );
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

  const selectedPinConfig = useMemo(
    () =>
      availableGPIOPins?.data.find(
        (gpioConfig) => gpioConfig.gpio_pin_number === device?.pin_number,
      ),
    [availableGPIOPins?.data, device],
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
        setScheduledDays((prevState) => prevState.map((day) => !isAllSelected));
      } else {
        setScheduledDays((prevState) =>
          prevState.map((isSelected, idx) =>
            idx === dayIndex ? !isSelected : isSelected,
          ),
        );
      }
    },
    [scheduledDays],
  );

  const saveDeviceConfig = useCallback(async () => {
    if (device?.is_scheduled) {
      const isSomeSelected = scheduledDays.some((day) => day);
      if (!isSomeSelected || !device.start_time || !device.off_time) {
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
    mutateDevice(
      {
        houseId: room?.house_id,
        userId: userProfile?.id,
        userName: `${userProfile?.given_name ?? ""} ${
          userProfile?.family_name ?? ""
        }`.trim(),
        deviceId: device?.device_id,
        deviceName: deviceNameRef.current,
        pinNumber: device?.pin_number,
        status: device?.status,
        isScheduled: device?.is_scheduled,
        daysScheduled: daysScheduled.join("-"),
        startTime: device?.start_time ?? "",
        offTime: device?.off_time ?? "",
      },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            queryClient.invalidateQueries({ queryKey: [ApiRoutes.UserHouse] });
          } else {
            ToastAndroid.show(res.message, ToastAndroid.LONG);
          }
        },
        onError: (res) => {
          ToastAndroid.show(res.message, ToastAndroid.LONG);
        },
      },
    );
  }, [device, scheduledDays]);

  const removeDeviceConfirm = useCallback(() => {
    setIsConfirmationOpen(false);
    removeDevice(
      {
        userId: userProfile?.id,
        userName: `${userProfile?.given_name ?? ""} ${
          userProfile?.family_name ?? ""
        }`.trim(),
        houseId: room?.house_id,
        roomId,
        deviceId,
      },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            router.back();
            queryClient.invalidateQueries({ queryKey: [ApiRoutes.UserHouse] });
          } else {
            ToastAndroid.show(res.message, ToastAndroid.LONG);
          }
        },
        onError: (res) => {
          ToastAndroid.show(res.message, ToastAndroid.LONG);
        },
      },
    );
  }, []);

  const availablePins = useMemo(
    () =>
      availableGPIOPins
        ? [
            {
              gpio_pin_number: device?.pin_number,
              header_pin_number: Number(),
            } as HeaderPinConfig,
            ...availableGPIOPins.data.sort(
              (a, b) => a.gpio_pin_number - b.gpio_pin_number,
            ),
          ]
        : [],
    [availableGPIOPins],
  );

  const handleDeviceNameChange = useCallback(
    (text: string) => {
      // setDevice((device) => ({ ...device, device_name: text } as DeviceType));
      deviceNameRef.current = text;
    },
    [device],
  );

  const handleGPIOPinChange = useCallback(
    (newValue: any, index: number) => {
      setDevice(
        (device) =>
          ({ ...device, pin_number: newValue.gpio_pin_number } as DeviceType),
      );
    },
    [device, availableGPIOPins, selectedPinConfig],
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: primary,
        padding: 16,
        paddingBottom: 90,
      }}
    >
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
      >
        <View style={{ gap: 16 }}>
          <Tile>
            <InputField
              label="Device Name"
              defaultValue={deviceNameRef.current}
              onChangeText={handleDeviceNameChange}
            />
            {/* <InputField
              label="GPIO Pin"
              value={device?.pin_number.toString()}
            /> */}
            <Select
              label="GPIO Pin"
              isLoading={isLoadingAvailableGPIOPins}
              items={availablePins}
              onValueChange={handleGPIOPinChange}
              selectedValue={selectedPinConfig ?? {}}
              field="gpio_pin_number"
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
                <Switch value={status} onChange={handleOnChange} />
              </View>
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
                    <Text>
                      {device?.off_time ? device?.off_time : "Set Time"}
                    </Text>
                  </Button>
                </View>
              </>
            )}
          </Tile>
          <Tile>
            <Button
              disabled={isConfigureDeviceLoading}
              onPress={saveDeviceConfig}
            >
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
                {new Date(device!.updated_at).toLocaleDateString()} @{" "}
                {new Date(device!.updated_at).toLocaleTimeString()}
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
                {new Date(device!.created_at).toLocaleDateString()} @{" "}
                {new Date(device!.created_at).toLocaleTimeString()}
              </Text>
            </View>
          </Tile>
          <Tile>
            <Button
              type="outline"
              color="success"
              containerStyle={{
                borderRadius: 6,
                borderWidth: 1,
                borderColor: error,
              }}
              titleStyle={{ color: error }}
              onPress={() => setIsConfirmationOpen(true)}
            >
              Remove Device
            </Button>
          </Tile>
        </View>
      </ScrollView>
      <BottomNavigation />
      <BottomSheet
        isVisible={isConfirmationOpen}
        onBackdropPress={() => setIsConfirmationOpen(false)}
      >
        <View
          style={{
            height: 150,
            padding: 20,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: primary,
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 18 }}>Are you sure?</Text>
          <Text>Do you really want to delete this device?</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Button onPress={() => setIsConfirmationOpen(false)}>Cancel</Button>
            <Button color="error" onPress={() => removeDeviceConfirm()}>
              Yes
            </Button>
          </View>
        </View>
      </BottomSheet>
      <BottomSheet isVisible={isConfigureDeviceLoading || isRemovingDevice}>
        <View
          style={{
            height: 100,
            padding: 20,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: primary,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          <ActivityIndicator size="large" color={success} />
          <Text>Loading, please wait...</Text>
        </View>
      </BottomSheet>
    </View>
  );
};

export default Device;
