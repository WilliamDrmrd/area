import ButtonAction from "../../Components/ButtonAction";
import { AiOutlineArrowDown } from "react-icons/ai";
import Header from "../../Components/Header";
import { NavigationItem } from "../../types/navigationType";
import { getItems } from "../../Services/dictParse";
import { InfosItem, ActionInfosItem } from "../../types/infosType";


function PageCreateArea (navigation : NavigationItem[], infos : InfosItem, setInfos : (infos: InfosItem) => void, actions: ActionInfosItem[], reactions: ActionInfosItem[]) {
    return (
        <div className="flex flex-col">
        <Header isHome={false} isLog={false}/>
        <div className="flex flex-col items-center">
        <h1 className="text-7xl font-bold  mb-4">Créer</h1>
        <p className="text-xl mb-5">Commmencer à automatiser vos applications </p>
        <div className="flex flex-col items-center">
            <div style={infos.action.color === "" ? {backgroundColor: "#27917E"} : {backgroundColor: infos.action.color}}
            className="flex flex-row rounded-3xl justify-between py-24 px-12 w-full">
                <h1 className="text-background text-5xl font-bold">{infos.action.name === "" ? "Action" : infos.action.name}</h1>
                <ButtonAction color='black' text='Ajouter' onClick={getItems("action", navigation)?.onClick}/>
            </div>
            <div className="h-24 w-24 relative flex items-center justify-center">
                <div className="h-full w-5 bg-black"></div>
                <div className="absolute rounded-full h-[70px] w-[70px] flex items-center justify-center bg-black">
                  <AiOutlineArrowDown className="text-white text-5xl"></AiOutlineArrowDown>
            </div>
        </div>
            <div style={infos.reaction.color === "" ? {backgroundColor: "#27917E"} : {backgroundColor: infos.reaction.color}}
            className="flex flex-row mb-12 rounded-3xl justify-between py-24 px-12 w-full">
              <h1 className="text-background text-5xl font-bold">{infos.reaction.name === "" ? "Réaction" : infos.reaction.name}</h1>
              <ButtonAction color='black' text='Ajouter' onClick={getItems("reaction", navigation)?.onClick}/>
            </div>
        </div>
        {
            infos.action.name !== "" && infos.reaction.name !== "" ?
            <ButtonAction text="Suivant" color="#27917E" onClick={getItems("next", navigation)?.onClick}/> :
            <ButtonAction text="Suivant" color="#D7F4EF" onClick={()=>{}}/>
        }
        </div>
      </div>
    )
}

export default PageCreateArea;