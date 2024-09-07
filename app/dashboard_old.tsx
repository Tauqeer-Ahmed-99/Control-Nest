import AddButton from "@/components/AddButton";
import Container from "@/components/Container";
import Dialog from "@/components/Dialog";
import NoDataAvailable from "@/components/NoDataAvailable";
import useAddHouseMutation from "@/hooks/useAddHouseMutation";
import useAuth from "@/hooks/useAuth";
import useHouseDetailsMutation from "@/hooks/useHouseDetailsMutation";
import useHouse from "@/hooks/useHouse";
import useRemoveHouseMutation from "@/hooks/useRemoveHouseMutation";
import { ApiRoutes } from "@/routes/routes";
import { House } from "@/utils/models";
import { Button, Dialog as RNDialog, Text } from "@rneui/themed";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ToastAndroid, View } from "react-native";

export default function Dashboard() {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);

  const { userProfile } = useAuth();

  const { mutate: addHouse, isPending: isAddingHouse } = useAddHouseMutation();
  const { mutate: removeHouse, isPending: isRemovingHouse } =
    useRemoveHouseMutation();
  const { mutate: updateHouse, isPending } = useHouseDetailsMutation();
  const queryClient = useQueryClient();

  const data = useHouse({ userId: userProfile?.id as string });

  const onPressSettings = (item: unknown) => {
    setIsDialogVisible(true);
    setIsEditing(true);
    setSelectedHouse(item as House);
  };

  const closeDialog = () => {
    setIsDialogVisible(false);
    setIsEditing(false);
    setSelectedHouse(null);
  };

  const saveHouse = (data: {
    deviceID: string;
    password: string;
    houseName: string;
  }) => {
    if (isEditing) {
      updateHouse(
        {
          userId: userProfile?.id,
          houseId: selectedHouse?.house_id,
          houseName: data.houseName,
        },
        {
          onSuccess: (res) => {
            if (res.status === "success") {
              queryClient.invalidateQueries({
                queryKey: [ApiRoutes.UserHouse],
              });
            }
            ToastAndroid.show(res.message, ToastAndroid.LONG);
          },
          onError: (res) => {
            ToastAndroid.show(res.message, ToastAndroid.LONG);
          },
        },
      );
    } else {
      addHouse(
        {
          userId: userProfile?.id,
          deviceId: data.deviceID,
          password: data.password,
        },
        {
          onSuccess: (res) => {
            if (res.status === "success") {
              queryClient.invalidateQueries({
                queryKey: [ApiRoutes.UserHouse],
              });
            }
            ToastAndroid.show(res.message, ToastAndroid.LONG);
          },
          onError: (res) => {
            ToastAndroid.show(res.message, ToastAndroid.LONG);
          },
        },
      );
    }

    closeDialog();
  };

  const removeConfirmation = (item: House) => {
    closeDialog();
    setIsConfirmationOpen(true);
    setSelectedHouse(item);
  };

  const removeHouseConfirm = () => {
    setIsConfirmationOpen(false);
    removeHouse(
      { userId: userProfile?.id, houseId: selectedHouse?.house_id },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            queryClient.invalidateQueries({
              queryKey: [ApiRoutes.UserHouse],
            });
          }
          ToastAndroid.show(res.message, ToastAndroid.LONG);
          setSelectedHouse(null);
        },
        onError: (res) => {
          ToastAndroid.show(res.message, ToastAndroid.LONG);
          setSelectedHouse(null);
        },
      },
    );
  };

  const onRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: [ApiRoutes.UserHouse],
    });
  };

  return (
    <>
      <Container queryResult={data}>
        {data.data?.data ? (
          // <FlatList
          //   data={data.data?.data}
          //   renderItem={({ item: house }) => {
          //     return (
          //       <Card
          //         key={house.house_id}
          //         name="house"
          //         item={house}
          //         onPress={() => router.push(house.house_id as Href<string>)}
          //         onPressSettings={onPressSettings}
          //         onPressDelete={() => {}}
          //       />
          //     );
          //   }}
          // />
          <></>
        ) : (
          <NoDataAvailable
            title="You have not added any house."
            description="You can add house with credentials provided with the controller."
          />
        )}
      </Container>
      <AddButton
        iconName="home"
        visible={data.status !== "pending" && data.status !== "error"}
        onPress={() => setIsDialogVisible(true)}
      />
      <Dialog
        title={`${isEditing ? "Update" : "Add"} House`}
        message={
          isEditing
            ? "Update house details."
            : "Enter credentials provided with controller device."
        }
        isDialogVisible={isDialogVisible}
        closeDialog={closeDialog}
        application="home"
        isEditing={isEditing}
        item={isEditing ? (selectedHouse as House) : undefined}
        onSave={saveHouse}
        onDelete={removeConfirmation}
      />
      <RNDialog isVisible={isPending || isAddingHouse || isRemovingHouse}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <RNDialog.Loading loadingProps={{ size: "large" }} />
          <Text style={{ fontSize: 18 }}>
            {isAddingHouse
              ? "Adding house..."
              : isRemovingHouse
              ? `Removing ${selectedHouse?.house_name}...`
              : "Saving house name..."}
          </Text>
        </View>
      </RNDialog>
      <RNDialog isVisible={isConfirmationOpen}>
        <View style={{ gap: 16 }}>
          <Text style={{ fontWeight: 900 }}>Remove House</Text>
          <Text>
            {`Are you sure, you want to remove '${selectedHouse?.house_name}' ?`}
          </Text>
        </View>
        <RNDialog.Actions>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Button
              type="outline"
              onPress={() => {
                setIsConfirmationOpen(false);
                setSelectedHouse(null);
              }}
            >
              Cancel
            </Button>
            <Button
              buttonStyle={{ backgroundColor: "rgba(214, 61, 57, 1)" }}
              onPress={removeHouseConfirm}
            >
              Remove
            </Button>
          </View>
        </RNDialog.Actions>
      </RNDialog>
    </>
  );
}
