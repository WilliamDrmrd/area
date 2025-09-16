import { ActionInfosItem, InfosItem } from "../types/infosType";

export default class AutomationService {
  static async subscribeAutomation(automation : any, actionAdditionalFields : any,
    reactionAdditionalFields : any, token : string | undefined) {
    const TIMEOUT = 5000; // 5 secondes
    const ip = process.env.REACT_APP_DB_ADDRESS;

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      console.log(actionAdditionalFields);
      console.log(reactionAdditionalFields);
      console.log(automation);
      const response : any = await Promise.race([
        fetch(`http://${ip}/automations/${automation.id}/subscribe`, {
          method: "POST",
          headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "service_A_Id": automation.serviceAId,
            "actionId": automation.action.id,
            "actionAdditionalFields": actionAdditionalFields,

            "service_R_Id": automation.serviceRId,
            "reactionId": automation.reaction.id,
            "reactionAdditionalFields": reactionAdditionalFields,
          })
        }),
        timeoutPromise
      ]);

      const json = await response.json();
      return json;
    } catch (error : any) {
        console.log(error);
    }
  }

  static async deleteAutomation(automationId : any, token : string | undefined) {
    const TIMEOUT = 5000; // 5 secondes
    const ip = process.env.REACT_APP_DB_ADDRESS;

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response : any = await Promise.race([
        fetch(`http://${ip}/automations/${automationId}`, {
          method: "DELETE",
          headers: {
            'Authorization' : `Bearer ${token}`,
          },
        }),
        timeoutPromise
      ]);

      const json = await response.json();
      return json;
    } catch (error : any) {
        console.log(error);
    }
  }

  static async unsubscribeAutomation(automation : any, token : string | undefined) {
    const TIMEOUT = 5000; // 5 secondes
    const ip = process.env.REACT_APP_DB_ADDRESS;
    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response : any = await Promise.race([
        fetch(`http://${ip}/automations/${automation.id}/unsubscribe`, {
          method: "GET",
          headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        timeoutPromise
      ]);

      const json = await response.json();
      return json;
    } catch (error : any) {
        console.log(error);
    }
  }
}