import ButtonAction from "../../Components/ButtonAction";
import Header from "../../Components/Header";
import { NavigationItem } from "../../types/navigationType";
import { getItems } from "../../Services/dictParse";
import { InfosItem, ActionInfosItem } from "../../types/infosType";
import ActionItem from "../../Components/ActionItem";


function CreateChooseAction(navigation : NavigationItem[], infos : InfosItem, setInfos : (infos: InfosItem) => void, actions: ActionInfosItem[], reactions: ActionInfosItem[]) {
    const filteredReactions : any = {};
    actions.forEach((action) => {
        const service = action.service ;
        if (!filteredReactions[service]) {
            filteredReactions[service] = [];
        }
        filteredReactions[service].push(action);
    });

    return (
        <div className="flex flex-col">
        <Header isHome={false} isLog={false}/>
        <div className="flex flex-col items-center">
        <h1 className="text-7xl font-bold  mb-4">Action</h1>
        <p className="text-xl mb-5">Sélectionnez votre action</p>
        <div className="flex flex-col items-center">
        {
            filteredReactions && Object.keys(filteredReactions).map((service) => {
                return (
                    <div>
                        <h1>{service}</h1>
                    {
                        filteredReactions[service].map((action : any) => {
                            return <ActionItem type={"action"} navigations={navigation} infos={infos} setInfos={setInfos} actionInfo={action}/>
                        })
                    }
                    </div>
                )
            })
        }
        </div>
        </div>
      </div>
    )
}

export default CreateChooseAction;