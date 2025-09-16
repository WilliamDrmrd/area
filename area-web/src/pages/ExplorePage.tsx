import AutoItem from "../Components/AutoItem";
import { InfosItem } from "../types/infosType";
import Header from "../Components/Header";
import {AiOutlineSearch} from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import ButtonAction from "../Components/ButtonAction";
import DatabaseService from "../Services/Getfield";
import AutomationService from "../Services/Automation";
import { useNavigate } from "react-router-dom";
import Modal from '@mui/material/Modal';
import InfosAuto from "./detailPage";

function ExplorePage() {
  const { currentUser , setCurrentUser} = useContext(AuthContext);
  const [automations, setAutomations] = useState<InfosItem[]>([]);
  const [active, setActive] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // État pour le terme de recherche
  const navigate = useNavigate();
  const storedToken = localStorage.getItem('accessToken');
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    const fetch = async () => {
      let actives: number[] = [];
      const res = await DatabaseService.fetchFromDatabase(currentUser, "automations/subscribed");
      res.automations.forEach((automation: any) => {
        actives.push(automation.id);
      });
      const response = await DatabaseService.fetchFromDatabase(currentUser, "automations");
      console.log("response :")
      console.log(response);

      response.reverse().forEach((automation: any) => {
        setAutomations((automations) => [
          ...automations,
          {
            name: automation.name,
            id: automation.id,
            description: automation.description,
            serviceAId: 1,
            serviceRId: 2,
            public: automation.public,
            color: automation.color,
            action: automation.action,
            reaction: automation.reaction,
            user: automation.user,
            isSubscribed: actives.includes(automation.id),
          },
        ]);
      });
    };
    fetch();
  }, []);

  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const handleClose = () => {
    setOpen(false);
    setId(0);
  };

  const filteredAutomations = automations.filter((automation) =>
    automation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col h-[100vh]">
        <Header isHome={false} isLog={false} />
        <div className="flex flex-col items-center">
          <h1 className="text-7xl font-bold mb-4">Explorer</h1>
          <div className=" flex flex-row items-center  justify-between w-[500px] h-12 rounded-full mb-5 px-5 border-2 border-gray-300">
          <input
          className="w-full h-full bg-transparent outline-none"
          type="text"
          placeholder="Rechercher des automatisations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AiOutlineSearch className="text-2xl text-gray-500"/>
          </div>
          {
            filteredAutomations.map((automation) => {
              console.log("test");
              return (
                <AutoItem
                  active={false}
                  key={automation.id}
                  infos={automation}
                  onClick={() => {
                    setId(automation.id);
                    setOpen(true);
                  }}
                />
              );
            })
          }
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <InfosAuto onClose={handleClose} id={id} />
        </Modal>
      </div>
    </>
  );
}

export default ExplorePage;
