import * as signalR from '@microsoft/signalr';
import { v4 as generateUuid } from 'uuid';
import * as TokenManager from '../auth/tokenManager';

export type Listener<TData> = (data: TData) => void;
export type Subscription = {
  id: string;
  method: string;
  callback: Listener<any>
};

export namespace WebsocketService {

  const partyHubUrl = process.env.REACT_APP_API_URL + '/hubs/party';
  
  let connection: signalR.HubConnection;
  
  const authorizeMethod = 'Authorize';

  const subs: { [methodName: string]: Subscription[] } = {};
  
  let initConnectionBusyFlag = false;
  const initConnection = async (): Promise<void> => {
    if (initConnectionBusyFlag) {
      return new Promise(resolve => {

        const interval = setInterval(() => {
          if (!initConnectionBusyFlag) {
            clearInterval(interval);
            resolve();
          }
        }, 100)
      })
    }

    if (connection) {
      return;
    }

    initConnectionBusyFlag = true;
    const token = await TokenManager.getBearerToken();
  
    connection = new signalR.HubConnectionBuilder()
      .withUrl(partyHubUrl)
      .withAutomaticReconnect()
      .build();
    
    
    connection.on("Disconnect", async () => {
      console.log('received disconnect');
      await connection.stop();
    });
    
    connection.start()
      .then(() => connection.invoke(authorizeMethod, token))
      .finally(() => initConnectionBusyFlag = false);
  }

  const addSubscription = <TData>(method: string, callback: Listener<TData>): Subscription => {
    const subscription: Subscription = {
      id: generateUuid(),
      method: method,
      callback: callback
    };


    if (!subs[method] || subs[method].length === 0) {
      subs[method] = [subscription];
    } else {
      subs[method].push(subscription);
    }

    // Set this every time in case connection was reset
    connection.off(method);
    connection.on(method, (data) => {
      subs[method].forEach(subscription => {
        subscription.callback(data);
      })
    });

    return subscription;
  }

  const removeSubscription = (subscription: Subscription) => {
    const method = subscription.method;

    if (!subs[method]) {
      console.error(`Error removing subscription for ${method} - no subscriptions found`);
    }

    const subscriptionIndex = subs[method].findIndex(x => x.id === subscription.id);
    subs[method].splice(subscriptionIndex, 1);

    if (subs[method].length === 0) {
      connection.off(method);
    }
  }
  
  export const subscribe = async <TData>(method: string, callback: Listener<TData>): Promise<Subscription> => {
    await initConnection();
    return addSubscription(method, callback);
  };
  
  export const unsubscribe = (subscription: Subscription) => {
    removeSubscription(subscription);
  }

}