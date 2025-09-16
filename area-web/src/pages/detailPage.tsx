import { InfosItem } from "../types/infosType";
import {AiOutlineClose} from "react-icons/ai";
import ButtonAction from "../Components/ButtonAction";
import { Switch } from "@mui/material";
import {  useEffect, useState } from "react";
import DatabaseService from "../Services/Getfield";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import AutomationService from "../Services/Automation";

interface Automation {
  id: number;
}

interface User {
  automations: Automation[];
}

function InfosAuto({onClose, id} : { onClose: () => void, id: number}) {
  const [automation, setAutomation] = useState<InfosItem>();
  const {currentUser } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    console.log(id);
  }

  const deleteAutomation = () => {
    console.log(id);
    console.log(currentUser);
    AutomationService.deleteAutomation(id, currentUser);
    onClose();
    window.location.reload();
  }
  useEffect(() => {
      const fetch = async () => {
      const response = await DatabaseService.fetchFromDatabase(currentUser, `automations/${id}`);

      const userData: User = await DatabaseService.fetchFromDatabase(currentUser, "users/me");

      if (userData && userData.automations && userData.automations.length > 0) {
        userData.automations.forEach((automation) => {
          if (automation.id == response.id)
            setChecked(true);
        })
      }

      setAutomation( {
        name: response.name,
        id: response.id,
        description: response.description,
        serviceAId: 1,
        serviceRId: 2,
        public: response.public,
        color: response.color,
        action: response.action,
        reaction: response.reaction,
        user: response.user,
        isSubscribed: checked
      });
    }
    fetch();
  }, []);

  return (
    <>
      <div className="flex flex-col bg-primary rounded-xl p-5 w-82 text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
          <div className="w-full mb-3  ">
            <AiOutlineClose className="text-3xl cursor-pointer" onClick={onClose}/>
          </div>
        <div className="mb-12 mx-12 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-center m-3">{automation?.name}</h1>
          <p className="text-center">
            {automation?.description}
          </p>
          <div className="mt-5 flex flex-col  ">
            <h1>Action : {automation?.action.name}</h1>
            <h1>Réaction : {automation?.reaction.name}</h1>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center">
          <ButtonAction color="black" text="supprimer" onClick={deleteAutomation}/>
        </div>
      </div>
    </>
  );
}

export default InfosAuto;