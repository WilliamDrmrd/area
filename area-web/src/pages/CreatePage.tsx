import { useEffect, useState, useContext } from "react";
import PageCreateArea from "./pagesCreate/pageCreateArea";
import CreateChooseAction from "./pagesCreate/CreateChooseReaction";
import CreateChooseReaction from "./pagesCreate/CreateChooseAction";
import CreatePageInfo from "./pagesCreate/CreatePageInfo";
import { NavigationItem } from "../types/navigationType";
import { ActionInfosItem, InfosItem } from "../types/infosType";
import DatabaseService from "../Services/Getfield";
import { AuthContext } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";

function CreatePage() {
  const {currentUser } = useContext(AuthContext);
  const [actions, setActions] = useState<ActionInfosItem[]>([]);
  const [reactions, setReactions] = useState<ActionInfosItem[]>([]);
  const navigate = useNavigate();
  const storedToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    const fetch = async () => {
      const response = await DatabaseService.fetchFromDatabase(currentUser, "services");
      response.forEach((services : any) => {
        services.actions.forEach((actionItem : any) => {
          setActions((actions) => [...actions, {name: actionItem.name, id: actionItem.id, service: services.name, serviceId: services.id, color:"#27917E"}]);
        });
        services.reactions.forEach((reaction : any) => {
          setReactions((reactions) => [...reactions, {name: reaction.name, id: reaction.id, service: services.name, serviceId: services.id, color:"#27917E"}]);
        });
      });
    }
    fetch();
  }, []);
  const pages = [
    PageCreateArea,
    CreatePageInfo,
    CreateChooseAction,
    CreateChooseReaction,
  ]
  const [page, setPage] = useState(0);
  const [infos, setInfos] = useState<InfosItem>({
    name: "",
    description: "",
    public: false,
    color: "",
    serviceAId: 0,
    serviceRId: 0,
    id: 0,
    action: {name: "", id: "", service: "", serviceId: 0, color: ""},
    reaction: {name: "", id: "", service: "", serviceId: 0, color: ""},
    user: "",
    isSubscribed: false,
  } );
  const nextPage = () => {
    setPage(1);
  }
  const goBack = () => {
    setPage(0);
  }
  const goChooseAction = () => {
    setPage(2);
  }
  const goChooseReaction = () => {
    setPage(3);
  }

  const navigation :  NavigationItem[] = [
    {name: "action", onClick: goChooseAction},
    {name: "reaction", onClick: goChooseReaction},
    {name: "back", onClick: goBack},
    {name: "next", onClick: nextPage},
  ]
  return (
    <div>
      {pages[page](navigation, infos, setInfos, actions, reactions)}
    </div>
  );
}

export default CreatePage;