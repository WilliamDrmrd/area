import ButtonAction from "../../Components/ButtonAction";
import Header from "../../Components/Header";
import { Checkbox, FormControlLabel } from "@mui/material";
import { Link } from "react-router-dom";
import { NavigationItem } from "../../types/navigationType";
import CircleSelect from "../../Components/CircleSelect";
import { InfosItem, ActionInfosItem } from "../../types/infosType";
import DatabaseService from "../../Services/Getfield";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { info } from "console";

function CreatePageInfo(navigation : NavigationItem[], infos : InfosItem, setInfos : (infos: InfosItem) => void, actions: ActionInfosItem[], reactions: ActionInfosItem[]) {
  const colors = [
    "#27917E",
    "#D7F4EF",
    "#1877F2",
    "#1DA1F2",
    "#E4405F",
    "#D44638",
    "#181717",
    "#F48024",
    "#1E90FF",
    "#FDD835",
    "#CB3837",
    "#5865F2",
]
  const handleNameChange = (e: any) => {
    setInfos({...infos, name: e.target.value})
  }

  const handleDescChange = (e: any) => {
    setInfos({...infos, description: e.target.value})
  }
  const {currentUser } = useContext(AuthContext);
return (
  <>
    <div className="flex flex-col h-[100vh] ">
      <Header isHome={false} isLog={false}/>
      <div className="flex flex-col items-center h-full  ">
      <h1 className="text-7xl font-bold  mb-4">Créer</h1>
      <p className="text-xl mb-5">Commmencer à automatiser vos applications </p>
      <div className="flex flex-col items-center w-1/3 ">
          <input type="text" onChange={handleNameChange} placeholder={"Nom"}
          className="bg-secondary text-primary h-16 w-full px-12 rounded-xl"/>
          <textarea onChange={handleDescChange} placeholder={"Description"}
          maxLength={250}
          className="bg-secondary text-primary h-52 w-full px-12  py-5 rounded-xl mt-5"/>

                <div className="flex justify-start w-full">
                <FormControlLabel
                label="Rendre disponible à la communauté"
                control={
                    <Checkbox
                    onChange={(e) => {
                        setInfos({...infos, public: e.target.checked})
                    } }
                    defaultChecked
                    sx={{
                        color: "black",
                        '&.Mui-checked': {
                            color: "black",
                        },
                    }}
                    />
                }
                />
                </div>
            <div className="flex flex-row flex-wrap w-[80%] mb-8 ">

            {colors.map((color) => {
                return <CircleSelect color={color} infos={infos} setInfos={setInfos}/>
            })}
            </div>
        </div>
      {
         (infos.name !== "" && infos.description !== "" && infos.color !== "") ?
        <Link to={"/Explore"}>
        <ButtonAction text="Terminer" color="#27917E" onClick={
          () => {
            console.log(DatabaseService.createAutomation(currentUser, infos));
          }
        }/>
        </Link>
        :
        <ButtonAction text="Terminer" color="#D7F4EF" onClick={()=>{}}/>
      }
      </div>
    </div>
  </>
);
}

export default CreatePageInfo;