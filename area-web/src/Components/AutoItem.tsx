
import { useState, useEffect } from 'react';
import { InfosItem } from "../types/infosType";
import { getItems } from "../Services/dictParse";
import {Dialog } from "@mui/material";
import { Switch } from "@mui/material"
import DatabaseService from "../Services/Getfield";
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import ButtonAction from './ButtonAction';
import AutomationService from '../Services/Automation';



function AutoItem({active, infos, onClick}: {active : boolean, infos : InfosItem, onClick: () => void}) {
  console.log(infos.isSubscribed)
  const [checked, setChecked] = useState(infos.isSubscribed);
  const {currentUser } = useContext(AuthContext);
  const [additionalFields, setAdditionalFields] = useState<any>({});
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleChange = () => {
    if (!checked) {
      setChecked(true);
      setOpen(true);
      return;
    }
    setChecked(false);
    console.log("unsubscribe");
    AutomationService.unsubscribeAutomation(infos, currentUser);
  }
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await DatabaseService.getAutomationInfos(`${infos.id}`,currentUser);
        const additionnals = {
          "actions": response.action.additionalFields,
          "reactions": response.reaction.additionalFields,
        }

        // Réinitialisation des champs
        const resetFields : any= { ...additionnals };
        ['actions', 'reactions'].forEach(type => {
          Object.keys(resetFields[type]).forEach(key => {
            resetFields[type][key] = '';
          });
        });
        setAdditionalFields(resetFields);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations de l'automatisation:", error);
      }
    }
    fetch();
  }, []);
  return (
    <div style={{backgroundColor : "#27917E"}} onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClick();
      }
    }}
    className='mb-5 py-2 px-5 flex flex-col justify-between h-44 w-[500px] rounded-xl  cursor-pointer'>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className=' bg-primary'>
            {
              ['actions', 'reactions'].map(type => (
                additionalFields[type] && Object.keys(additionalFields[type]).length > 0 && (
                  <div className='flex flex-col items-center py-10'>
                    <h1 className='text-2xl text-background font-bold'>{type === 'actions' ? 'Action' : 'Réaction'}</h1>
                    {
                      Object.keys(additionalFields[type]).map(key => {
                        return (
                        <div className='flex flex-row justify-center items-center w-[400px] h-[200px] '>
                          <input type="text" value={additionalFields[type][key]} placeholder={key}
                          onChange={text => {
                            const newFields = {...additionalFields};
                            newFields[type][key] = text.target.value;
                            setAdditionalFields(newFields);
                          }}/>
                        </div>);
                      })
                    }
                    <ButtonAction border={true} color='' text="Activer" onClick={
                      () => {
                        console.log(AutomationService.subscribeAutomation(infos, additionalFields["actions"],
                        additionalFields["reactions"],  currentUser));
                        setOpen(false);
                      }
                    }></ButtonAction>
                  </div>
                )
              ))
            }
          </div>
        </Dialog>

        <h1 style={{fontWeight: 'bold'}} className='text-background text-3xl '>{infos.name}</h1>
        <div className='flex flex-row justify-between items-center'>
        <p className='text-background'>Par moi</p>
        <Switch checked={checked} color="default" onChange={handleChange}/>
        </div>

    </div>
  );
}

export default AutoItem;