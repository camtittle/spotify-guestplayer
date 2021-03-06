/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { TrackRequestResponse } from './api/models/TrackRequestResponse';
import { MessageType } from './models/MessageType';
import { NavigateMessage } from './models/NavigateMessage';
import { PostMessage } from './models/PostMesage';
import { NotificationType, PushNotification } from './models/PushNotification';
import { TrackRequest } from './models/TrackRequest';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }: { request: Request; url: URL }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    }

    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith('/_')) {
      return false;
    }

    // If this looks like a URL for a resource, because it contains
    // a file extension, skip.
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    // Return true to signal that we want to use the handler.
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

const isClientFocused = async () => {
  const windowClients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  });

  for (let i = 0; i < windowClients.length; i++) {
    const windowClient = windowClients[i];
    if (windowClient.focused) {
      return true;
    }
  }

  return false;
}

const clearNotifications = async () => {
  return self.registration.getNotifications().then(notifications => {
    notifications.forEach(notification => {
      notification.close();
    })
  });
}

const isTrackRequestNotification = (notification: PushNotification<any>): notification is PushNotification<TrackRequestResponse> => {
  return notification.type === NotificationType.TrackRequest;
}

const handleTrackRequestNotification = (notification: PushNotification<TrackRequestResponse>) => {
  // temporarily commenting this out

  // return self.registration.getNotifications().then(notifications => {
  //   if (notifications && notifications.length > 0) {
  //     console.log(notifications);
  //     // We have an open notification, so merge new notification with this one
  //     const existingNotification = notifications[0];
  //     const count = existingNotification.data?.newRequestCount || 1;

  //     options.body = `Tap to view`;
  //     options.data = {
  //       newRequestCount: count + 1
  //     };
  //     notificationTitle = `${options.data.newRequestCount} new track requests`;

  //     notifications.forEach(x => x.close()); // Close existing notifications
  //   } else {
  //     options.body = 'Tap to view';
  //     options.data = {
  //       newRequestCount: 1
  //     };
  //     notificationTitle = 'New track request';
  //   }
  // });

  
  let notificationTitle = 'New track request';
  let options = {
    body: 'Tap to view',
    icon: notification?.data?.artworkUrl
  };

  self.registration.showNotification(
    notificationTitle,
    options
  );
}

const handlePushNotification = (notification: PushNotification<any>) => {
  if (isTrackRequestNotification(notification)) {
    handleTrackRequestNotification(notification);
  }
};


// Push notifs
self.addEventListener('push', (e: PushEvent) => {
  const data = e.data?.json() as PushNotification<any>;

  isClientFocused().then(clientIsFocused => {
    if (clientIsFocused) {
      console.log('Ignoring push - client in focus');
      return;
    }
  
    handlePushNotification(data);
  })
});

self.addEventListener('notificationclick', function (event) {
  event.waitUntil(async function () {
    const allClients = await self.clients.matchAll({
      includeUncontrolled: true
    });

    let activeClient;

    for (const client of allClients) {
      (client as any).focus();
      activeClient = client;

      const message: PostMessage<NavigateMessage> = {
        type: 'navigate',
        message: {
          path: "/party/host/requests"
        }
      };
      activeClient.postMessage(message);
      break;
    }

    // Open a new window if no existing one is found
    if (!activeClient) {
      activeClient = await self.clients.openWindow('/party/host/requests');
    }
  }());
}, false);

addEventListener('message', event => {
  console.log(`The client sent SW a message: ${event.data}`);
  if (event.data === MessageType.ClearNotifications) {
    clearNotifications();
  }
});