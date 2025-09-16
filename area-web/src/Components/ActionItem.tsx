import { useContext, useEffect, useRef, useState } from "react";
import { ActionInfosItem, InfosItem } from "../types/infosType";
import { getItems } from "../Services/dictParse";
import ButtonAction from "./ButtonAction";
import { NavigationItem } from "../types/navigationType";
import DatabaseService from "../Services/Getfield";
import { AuthContext } from "../Context/AuthProvider";

interface ServiceData {
  name: string;
  isOAuth: boolean;
  id: number;
}

interface Creds {
  validUntil: Date;
  serviceId: number;
}

interface User {
  serviceCredentials: Creds[];
}

interface RequestData {
  link: string;
  clientId: string;
  scope: string;
  state: string;
  redirectUri: string;
  responseType?: string;
}

interface authReponseData {
  message: string;
  status: number;
  code: string;
  state: string;
}

function ActionItem({
  navigations,
  infos,
  actionInfo,
  setInfos,
  type,
}: {
  navigations: NavigationItem[];
  infos: InfosItem;
  setInfos: (infos: InfosItem) => void;
  actionInfo: ActionInfosItem;
  type: "action" | "reaction";
}) {
  const { currentUser } = useContext(AuthContext);
  const [authState, setAuthState] = useState<number>(0);
  const [meUser, setMeUser] = useState<User | null>(null);
  const externalPopupRef = useRef<Window | null>(null);
  const serviceDataRef = useRef<ServiceData | null>(null);

  useEffect(() => {
    function handleMessage(event: any) {
      if (
        event.data.code &&
        event.data.state &&
        serviceDataRef.current &&
        externalPopupRef.current
      ) {
        externalPopupRef.current.close();
        DatabaseService.fetchFromDatabaseWithBody(
          currentUser,
          `services/${serviceDataRef.current.name.toLowerCase()}/auth`,
          {
            code: event.data.code,
            state: event.data.state,
          },
        )
          .then((response: authReponseData) => {
            if (response.status != 200) setAuthState(1);
            else {
              setAuthState(5);
              ButtonClick(false);
            }
          })
          .catch(() => {
            setAuthState(1);
          })
          .finally(() => {
            externalPopupRef.current = null;
          });
      }
    }
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const fetchService = async () => {
      const response = await DatabaseService.fetchFromDatabase(
        currentUser,
        "services",
      );
      response.forEach((service: any) => {
        if (service.name == actionInfo.service) {
          serviceDataRef.current = service;
        }
      });
    };

    const fetchUser = async () => {
      const response = await DatabaseService.fetchFromDatabase(
        currentUser,
        "users/me",
      );
      setMeUser(response);
      return response;
    };

    const fetchRequestData = async (): Promise<RequestData | null> => {
      if (!serviceDataRef.current) return null;
      return await DatabaseService.fetchFromDatabase(
        currentUser,
        `services/${serviceDataRef.current.name.toLowerCase()}/authData`,
      );
    };

    if (!serviceDataRef.current && authState != 1) {
      fetchService()
        .then(() => {
          setAuthState(1);
        })
        .catch((err) => {
          setAuthState(1);
          console.error(err);
        });
      return;
    }

    if (authState == 0 || authState == 1 || authState != 2) return;

    setAuthState(3);
    // si isOAuth == false:
    //setAuthState(5);
    if (serviceDataRef.current && !serviceDataRef.current.isOAuth) {
      setAuthState(5);
      ButtonClick(false);
      return;
    }
    //sinon
    //  get ServicesCredentials for ce service.
    //  si ServiceCredentials for this user and (ServiceCredentials for this user AND validUntil - que actuellement):
    //    setAuthState(5);
    //  sinon
    //    setAuthState(4);
    //    GET pour avoir les infos a par rapport a la request a faire et la faire en ASYNC
    //    quand on a cloturé la request et renvoyé au back avec confirmation grace au post
    //      setAuthState(5);
    fetchUser()
      .then((user) => {
        if (
          serviceDataRef.current &&
          user &&
          user.serviceCredentials &&
          (() => {
            let isValid = false;

            user.serviceCredentials.forEach((serviceCreds: Creds) => {
              if (
                serviceCreds.serviceId == serviceDataRef.current?.id &&
                new Date(serviceCreds.validUntil) > new Date()
              )
                isValid = true;
            });
            return isValid;
          })()
        ) {
          setAuthState(5);
          ButtonClick(false);
        } else {
          setAuthState(4);
          fetchRequestData().then((requestData) => {
            if (!requestData || !serviceDataRef.current)
              throw new Error("requestData is null");
            const width = 500;
            const height = 400;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2.5;
            const title = `${serviceDataRef.current.name} authentication`;
            let url = `${requestData.link}?client_id=${encodeURIComponent(
              requestData.clientId,
            )}&scope=${encodeURIComponent(
              requestData.scope,
            )}&state=${encodeURIComponent(requestData.state)}`;

            console.log(serviceDataRef.current.name);

            url +=
              serviceDataRef?.current?.name !== "Github"
                ? `&redirect_uri=${encodeURIComponent(
                    requestData.redirectUri,
                  )}`
                : "";

            url += requestData.responseType
              ? `&response_type=${encodeURIComponent(requestData.responseType)}`
              : "";
            console.log(url);
            externalPopupRef.current = window.open(
              url,
              title,
              `width=${width},height=${height},left=${left},top=${top}`,
            );
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [authState]);

  function ButtonClick(isCalledFromButton: boolean) {
    if (authState == 0 || authState == 1) setAuthState(2);

    if (authState != 5 && isCalledFromButton) return;

    getItems("back", navigations)?.onClick();
    if (type === "reaction") setInfos({ ...infos, reaction: actionInfo });
    else setInfos({ ...infos, action: actionInfo });
  }

  return (
    <div
      style={{ backgroundColor: actionInfo.color }}
      className=" mb-5 py-2 px-5 flex items-center flex-row justify-between h-32 w-[600px] rounded-xl"
    >
      <h1 className="text-background text-3xl ">{actionInfo.name}</h1>
      <div className="flex flex-row justify-between items-center">
        <ButtonAction
          border={true}
          text="Choisir"
          color={(() => {
            if (authState != 4) {
              return "transparent";
            } else {
              return "red";
            }
          })()}
          onClick={() => ButtonClick(true)}
        />
      </div>
    </div>
  );
}

export default ActionItem;
