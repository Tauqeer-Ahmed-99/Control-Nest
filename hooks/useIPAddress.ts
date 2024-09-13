import { useEffect, useState } from "react";
import * as Network from "expo-network";

const useIPAddress = () => {
  const [ipAddress, setIPAddress] = useState("");

  const getIPAddres = async () => {
    const ip = await Network.getIpAddressAsync();
    console.log(ip);
    setIPAddress(ip);
  };

  useEffect(() => {
    getIPAddres();
  }, []);

  return ipAddress;
};

export default useIPAddress;
