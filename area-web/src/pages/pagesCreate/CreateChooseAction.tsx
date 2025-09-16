import ActionItem from "../../Components/ActionItem";
import ButtonAction from "../../Components/ButtonAction";
import Header from "../../Components/Header";
import { ActionInfosItem, InfosItem } from "../../types/infosType";
import { NavigationItem } from "../../types/navigationType";



function CreateChooseReaction(navigation : NavigationItem[], infos : InfosItem, setInfos : (infos: InfosItem) => void, actions: ActionInfosItem[], reactions: ActionInfosItem[]) {
    const filteredReactions : any = {};
    reactions.forEach((reaction) => {
        const service = reaction.service ;
        if (!filteredReactions[service]) {
            filteredReactions[service] = [];
        }
        filteredReactions[service].push(reaction);
    });

    return (
        <div className="flex flex-col">
        <Header isHome={false} isLog={false}/>
        <div className="flex flex-col items-center">
        <h1 className="text-7xl font-bold  mb-4">Reaction</h1>
        <p className="text-xl mb-5">Sélectionnez votre réaction</p>
        <div className="flex flex-col items-center">
        </div>
        {
            filteredReactions && Object.keys(filteredReactions).map((service) => {
                return (
                    <div>
                        <h1>{service}</h1>
                    {
                        filteredReactions[service].map((reaction : any) => {
                            return <ActionItem type={"reaction"} navigations={navigation} infos={infos} setInfos={setInfos} actionInfo={reaction}/>
                        })
                    }
                    </div>
                )
            })
        }
        </div>
      </div>
    )
}

export default CreateChooseReaction;