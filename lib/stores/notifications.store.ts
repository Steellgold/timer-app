// store/notificationStore.ts
import create from 'zustand';

type Notification = {
  title: string;
  body: string;
  icon?: string;
  id?: string;
};

type NotificationStore = {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
};

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification: Notification) => {
    if (!("Notification" in window)) return;
    if (notification.id && useNotificationStore.getState().notifications.find((n) => n.id === notification.id)) return;

    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon,
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(notification.title, {
            body: notification.body,
            icon: notification.icon,
          });
        }
      });
    }

    set((state) => ({
      notifications: [...state.notifications, notification],
    }));
  },
}));

export default useNotificationStore;
