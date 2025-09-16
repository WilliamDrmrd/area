//@ts-nocheck

import DatabaseService from "./DatabaseService";

type ErrorType = {
  [statusCode: number]: string;
}

const errorMessages : ErrorType = {
  400: "Email ou mot de passe incorrect !",
  408: "La requête a mis trop de temps à répondre !",
  500: "Une erreur est survenue !",
};

export default class AccountService {

  static async login(email: string, password: string) {
    const TIMEOUT = 5000; // 5 secondes

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response : any = await Promise.race([
        fetch(`${DatabaseService.ipAdress}/auth/login`, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "email": email,
            "password": password,
          })
        }),
        timeoutPromise
      ]);

      const json = await response.json();
      json.accessToken = json.access_token;
      return {
        ...json,
        statusCode: response.status,
        message : errorMessages[response.status]
      };

    } catch (error : any) {
      if (error.message === "Network request timed out") {
        return {
          statusCode: 408, // 408 est le code HTTP pour "Request Timeout"
          message : errorMessages[408]
        };
      } else {
        return {
          statusCode: 500,
          message : errorMessages[500]
        };
      }
    }
  }

  static verifyFields(fields: any) {
    const { email, password, passwordConfirm } = fields;

    // Vérification des champs vides
    for (const key in fields) {
      if (fields[key] === '') {
        return "Veuillez remplir tous les champs";
      }
    }

    if (email) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(email)) {
        return "L'adresse e-mail n'est pas valide";
      }
    }

    if (password && passwordConfirm && password !== passwordConfirm) {
      return "Les mots de passe ne correspondent pas";
    }

    return true;
  }

  static async signUp(email: string, password: string) {
    const TIMEOUT = 5000; // 5 secondes

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response : any = await Promise.race([
        fetch(`${DatabaseService.ipAdress}/auth/register`, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "email": email,
            "password": password,
            "username": "test",
            "firstname": "test",
            "lastname": "test",
          })
        }),
        timeoutPromise
      ]);

      const json = await response.json();
      json.accessToken = json.access_token;
      return {
        ...json,
        statusCode: response.status,
        message : errorMessages[response.status]
      };

    } catch (error : any) {
      if (error.message === "Network request timed out") {
        return {
          statusCode: 408,
          message : errorMessages[408]
        };
      } else {
        return {
          statusCode: 500,
          message : errorMessages[500]
        };
      }
    }
  }

  static async connectWithOAuth(token : string, email: string) {

    const TIMEOUT = 5000; // 5 secondes

    const timeoutPromise : any = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Network request timed out"));
      }, TIMEOUT);
    });

    try {
      const response : any = await Promise.race([
        fetch(`${DatabaseService.ipAdress}/auth/oauth/login`, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "email": email,
            "token": token,
            "username": "test",
            "firstname": "test",
            "lastname": "test",
          })
        }),
        timeoutPromise
      ]);

      const json = await response.json();
      json.accessToken = json.access_token;
      return {
        ...json,
        statusCode: response.status,
        message : errorMessages[response.status]
      };

    } catch (error : any) {
      if (error.message === "Network request timed out") {
        return {
          statusCode: 408,
          message : errorMessages[408]
        };
      } else {
        return {
          statusCode: 500,
          message : errorMessages[500]
        };
      }
    }
  }
}

