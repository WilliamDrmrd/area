//@ts-nocheck

import { DB_ADDRESS } from '@env';
import { cp } from 'fs';
import { InfosItem } from '../types/infosType';

export default class DatabaseService {

  static async fetchFromDatabase(token : string | undefined, field : string) {
    const TIMEOUT = 5000; // 5 secondes
    const ip = process.env.REACT_APP_DB_ADDRESS;

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response : any = await Promise.race([
        fetch(`http://${ip}/${field}`, {
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

  static async fetchFromDatabaseWithBody(token : string | undefined, field : string, requestBody : any) {
    const TIMEOUT = 5000; // 5 secondes
    const ip = process.env.REACT_APP_DB_ADDRESS;

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response : any = await Promise.race([
        fetch(`http://${ip}/${field}`, {
          method: "POST",
          headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }),
        timeoutPromise
      ]);

      const json = await response.json();
      console.log(json);
      return json;
    } catch (error : any) {
      console.log(error);
    }
  }

  static async createAutomation(token : string | undefined, automation : InfosItem) {
    const TIMEOUT = 5000; // 5 secondes
    const ip = process.env.REACT_APP_DB_ADDRESS;

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response : any = await Promise.race([
        fetch(`http://${ip}/automations/create`, {
          method: "POST",
          headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON .stringify({
            "name" : automation.name,
            "description" : automation.description,
            "service_A_Id" : automation.serviceAId,
            "actionId" : automation.action.id,
            "service_R_Id" : automation.serviceRId,
            "reactionId" : automation.reaction.id,
          })
        }),
        timeoutPromise
      ]);

      const json = await response.json();
      console.log(json);
      return json;
    } catch (error : any) {
        console.log(error);
    }
  }
  static async getAutomationInfos(automationId : string, token : string | undefined) {
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
