// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBXmDgTqRl267LFhDwTQquiUq1ehFMW8X4",
  authDomain: "ticket-app-bb78.firebaseapp.com",
  databaseURL: "https://ticket-app-bb78-default-rtdb.firebaseio.com",
  projectId: "ticket-app-bb78",
  storageBucket: "ticket-app-bb78.firebasestorage.app",
  messagingSenderId: "459666458556",
  appId: "1:459666458556:web:74e0ce4dd437d682a84db9"
});

const messaging = firebase.messaging();

// バックグラウンド受信時の通知表示
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || '🎟 新着チケット';
  const body = (payload.notification && payload.notification.body) || 'チケットが届きました';
  self.registration.showNotification(title, {
    body: body,
    icon: '/ticket-app/icon-192.png',
    badge: '/ticket-app/icon-192.png',
    tag: 'ticket-received',
    data: payload.data || {}
  });
});

// 通知タップでアプリを開く
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const c of clientList) {
        if (c.url.includes('/ticket-app/') && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow('/ticket-app/app.html');
    })
  );
});
