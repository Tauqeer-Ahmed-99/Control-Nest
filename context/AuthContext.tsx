import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  KindeSDK,
  Storage,
  TokenType,
  UserProfile,
} from "@kinde-oss/react-native-sdk-0-7x";
import { router, useNavigationContainerRef, usePathname } from "expo-router";
import { getTypedRoute, Routes } from "@/routes/routes";

export interface IAuthContext {
  client: KindeSDK | null;
  userProfile: UserProfile | null;
  isLoadingProfile: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext>({
  client: null,
  userProfile: null,
  isLoadingProfile: false,
  login: async () => {},
  logout: async () => {},
});

const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const rootNavigation = useNavigationContainerRef();
  const pathname = usePathname();

  const client = useMemo(
    () =>
      new KindeSDK(
        process.env.EXPO_PUBLIC_KINDE_ISSUER_URL as string,
        process.env.EXPO_PUBLIC_KINDE_POST_CALLBACK_URL as string,
        process.env.EXPO_PUBLIC_KINDE_CLIENT_ID as string,
        process.env.EXPO_PUBLIC_KINDE_POST_LOGOUT_REDIRECT_URL as string,
      ),
    [],
  );

  const loadData = useCallback(async () => {
    setIsLoadingProfile(true);
    const dataPrint: any = {};
    const token = await client.getToken();
    dataPrint["Full Token"] = JSON.stringify(token);

    const accessToken = await Storage.getAccessToken();
    dataPrint["Access Token"] = accessToken;

    const getClaims = await client.getClaims();
    dataPrint["Get Claims"] = JSON.stringify(getClaims);

    const getOrganization = await client.getOrganization();
    dataPrint["Get Organization"] = JSON.stringify(getOrganization);

    const userDetails = await client.getUserDetails();
    dataPrint["User Details"] = JSON.stringify(userDetails);
    setUserProfile(userDetails);

    const getClaimJti = await client.getClaim("jti");
    dataPrint["Get Claim Jti"] = JSON.stringify(getClaimJti);

    const given_name = await client.getClaim("given_name", TokenType.ID_TOKEN);
    dataPrint["Get Claim Given Name"] = JSON.stringify(given_name);

    const getUserOrganizations = await client.getUserOrganizations();
    dataPrint["Get User Organizations"] = JSON.stringify(getUserOrganizations);

    // console.log(JSON.stringify(dataPrint, undefined, 4));

    // <-- Enable this block code when you're running debug mode to make the output prettier -->
    // const keys = Object.keys(dataPrint);
    // console.table(keys.map((k) => ({ Target: k, Result: dataPrint[k] })));
    setIsLoadingProfile(false);
  }, [client, setIsLoadingProfile, setUserProfile]);

  const checkAuthenticate = async () => {
    if (await client.isAuthenticated) {
      loadData();
    }
  };

  useEffect(() => {
    checkAuthenticate();
  }, []);

  useEffect(() => {
    const unsubscribe = rootNavigation.addListener("state", () => {
      setIsNavigationReady(true);
    });
    return function cleanup() {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [rootNavigation]);

  useEffect(() => {
    if (isNavigationReady) {
      if (userProfile) {
        if (router.canDismiss()) router.dismissAll();

        router.replace(getTypedRoute(Routes.Home));
      } else {
        if (router.canDismiss()) router.dismissAll();
        router.replace(getTypedRoute(Routes.Auth));
      }
    }
  }, [userProfile, isNavigationReady]);

  useEffect(() => {
    if (isNavigationReady) {
      if (pathname === "/" || pathname === "index") {
        if (userProfile) {
          if (router.canDismiss()) router.dismissAll();
          router.replace(getTypedRoute(Routes.Home));
        } else {
          if (router.canDismiss()) router.dismissAll();
          router.replace(getTypedRoute(Routes.Auth));
        }
      }
    }
  }, [pathname]);

  const login = async () => {
    try {
      const token = await client.login(); // You can also add org_code as parameter, f.e: client.login({org_code: 'org_123'});

      if (token) {
        loadData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      const isLoggedOut = await client.logout();
      if (isLoggedOut) {
        setUserProfile(null);
      }
    } catch (error) {
      console.group(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ client, userProfile, isLoadingProfile, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
