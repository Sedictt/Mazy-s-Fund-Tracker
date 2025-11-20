// Request notification permission from the user
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Show a contribution success notification
export const showContributionNotification = (memberName: string, amount: number) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification('Contribution Recorded! 🎉', {
      body: `${memberName} has successfully contributed ₱${amount.toFixed(2)}`,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: 'contribution-success',
      requireInteraction: false,
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    // Optional: Handle click on notification
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

// Check if notifications are supported
export const areNotificationsSupported = (): boolean => {
  return 'Notification' in window;
};
