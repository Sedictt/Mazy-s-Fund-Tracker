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

// Play a notification sound using Web Audio API (fallback if mp3 doesn't load)
export const playNotificationSound = async (): Promise<void> => {
  try {
    // First try to play the MP3 file
    const audio = new Audio('/notification.mp3');
    audio.volume = 1.0;
    await audio.play();
  } catch (error) {
    // Fallback: Generate a beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Frequency in Hz
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (fallbackError) {
      console.log('Could not play notification sound:', fallbackError);
    }
  }
};
