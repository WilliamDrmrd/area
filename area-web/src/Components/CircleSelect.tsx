import {InfosItem} from "../types/infosType";
function CircleSelect ({infos, color, setInfos} : {infos : InfosItem,  color: string, setInfos: (infos: InfosItem) => void}){

    return (
        <div style={{backgroundColor: color}} onClick={() => {
            setInfos({...infos, color: color});
        }
        } className={`cursor-pointer m-3 w-[60px] h-[60px]  ${infos.color === color ? "border-black border-2":""}  rounded-full`}>

        </div>
    )
}

export default CircleSelect;