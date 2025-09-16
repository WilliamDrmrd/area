//@ts-nocheck

export default class DatabaseService {

  static ipAdress = "";

  static async verifyIpAdress(ip : string) {
    const fullIp = "http://" + ip + ":8080";
    const TIMEOUT = 5000;

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response = await Promise.race([
        fetch(`${fullIp}/`, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }),
        timeoutPromise
      ]);

      this.ipAdress = fullIp;
      return true;
    } catch (error : any) {
        console.log(error.message);
      return false;
    }
  }

  static async fetchFromDatabase(token : string | undefined, field : string) {
    const TIMEOUT = 5000; // 5 secondes

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response : any = await Promise.race([
        fetch(`${this.ipAdress}/${field}`, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
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

  static async createAutomation(name : string, desc : string,
    selectedAction : any, selectedReaction : any, token : string | undefined) {
    const TIMEOUT = 5000; // 5 secondes

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response : any = await Promise.race([
        fetch(`${this.ipAdress}/automations/create`, {
          method: "POST",
          headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON .stringify({
            "name" : name,
            "description" : desc,
            "service_A_Id" : selectedAction["serviceId"],
            "actionId" : selectedAction["item"]["id"],
            "service_R_Id" : selectedReaction["serviceId"],
            "reactionId" : selectedReaction["item"]["id"],
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

  static async deleteAutomation(automationId : string, token : string | undefined) {
    const TIMEOUT = 5000; // 5 secondes

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response : any = await Promise.race([
        fetch(`${this.ipAdress}/automations/${automationId}`, {
          method: "DELETE",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
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

  static async getAutomationInfos(automationId : string, token : string | undefined) {
    const TIMEOUT = 5000; // 5 secondes

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response : any = await Promise.race([
        fetch(`${this.ipAdress}/automations/${automationId}`, {
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

  static async getAutomationsOn(token : string | undefined) {
    const TIMEOUT = 5000; // 5 secondes

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response : any = await Promise.race([
        fetch(`${this.ipAdress}/automations/subscribed`, {
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

  static async subscribeAutomation(automation : any, actionAdditionalFields : any,
    reactionAdditionalFields : any, token : string | undefined) {
    const TIMEOUT = 5000; // 5 secondes

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response : any = await Promise.race([
        fetch(`${this.ipAdress}/automations/${automation.id}/subscribe`, {
          method: "POST",
          headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON .stringify({
            "service_A_Id": automation.actionId,
            "actionId": automation.action.id,
            "actionAdditionalFields": actionAdditionalFields,

            "service_R_Id": automation.reactionId,
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

  static async unsubscribeAutomation(automationId : any, token : string | undefined) {
    const TIMEOUT = 5000; // 5 secondes

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response : any = await Promise.race([
        fetch(`${this.ipAdress}/automations/${automationId}/unsubscribe`, {
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

  static async sendCodeOAuth(code : string, serviceName : string, state : string, token : string | undefined) {
    const TIMEOUT = 5000; // 5 secondes

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response : any = await Promise.race([
        fetch(`${this.ipAdress}/services/${serviceName.toLowerCase()}/auth`, {
          method: "POST",
          headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON .stringify({
            "code" : code,
            "state" : state,
            "redirectUri" : "exp://127.0.0.1:8082/"
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
}

