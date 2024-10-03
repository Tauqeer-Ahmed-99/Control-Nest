import InputField from "@/components/InputField";
import Select from "@/components/Select";
import Tile from "@/components/Tile";
import useAvailableGPIOPins from "@/hooks/useAvailableGPIOPins";
import { Device as DeviceType, HeaderPinConfig } from "@/utils/models";
import { useUser } from "@clerk/clerk-expo";
import React, { useCallback, useMemo } from "react";

const DeviceInputFieldsInfo = ({
  device,
  setDevice,
  deviceNameRef,
}: {
  device?: DeviceType;
  setDevice: React.Dispatch<React.SetStateAction<DeviceType | undefined>>;
  deviceNameRef: React.MutableRefObject<string>;
}) => {
  const { user } = useUser();
  const { data: availableGPIOPins, isLoading: isLoadingAvailableGPIOPins } =
    useAvailableGPIOPins({ userId: user?.id as string });

  const selectedPinConfig = useMemo(
    () =>
      availableGPIOPins?.data.find(
        (gpioConfig) => gpioConfig.gpio_pin_number === device?.pin_number,
      ),
    [availableGPIOPins?.data, device],
  );

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
    <Tile>
      <InputField
        label="Device Name"
        defaultValue={deviceNameRef.current}
        onChangeText={handleDeviceNameChange}
      />
      <Select
        label="GPIO Pin"
        isLoading={isLoadingAvailableGPIOPins}
        items={availablePins}
        onValueChange={handleGPIOPinChange}
        selectedValue={selectedPinConfig ?? {}}
        field="gpio_pin_number"
      />
    </Tile>
  );
};

export default DeviceInputFieldsInfo;
