
import { NavigationItem } from "../types/navigationType";

export const getItems = (name: string, nav: NavigationItem[]) => {
    return nav.find((item) => item.name === name);
}