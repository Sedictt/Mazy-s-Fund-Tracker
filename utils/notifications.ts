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

// Pre-create audio instance for better reliability
let notificationAudio: HTMLAudioElement | null = null;

// Initialize audio on first call
const initializeAudio = () => {
  if (!notificationAudio) {
    // Try with the current origin to build the full URL
    const audioUrl = `${window.location.origin}/notification.mp3`;
    console.log('🔊 Attempting to load audio from:', audioUrl);
    
    notificationAudio = new Audio(audioUrl);
    notificationAudio.volume = 0.5;
    
    // Add error event listener
    notificationAudio.addEventListener('error', (e) => {
      console.error('❌ Audio loading error:', e);
      console.error('Audio error details:', notificationAudio?.error);
    });
    
    // Add loaded event listener
    notificationAudio.addEventListener('canplaythrough', () => {
      console.log('✅ Audio loaded successfully');
    });
    
    // Preload the audio
    notificationAudio.load();
  }
  return notificationAudio;
};

// Play the custom notification sound
export const playNotificationSound = async (): Promise<void> => {
  try {
    const audio = initializeAudio();
    // Reset to start if already playing
    audio.currentTime = 0;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      await playPromise;
      console.log('✅ Notification sound played successfully');
    }
  } catch (error) {
    console.error('❌ Could not play notification sound:', error);
    // If it fails, try creating a fresh audio element with full URL
    try {
      const audioUrl = `${window.location.origin}/notification.mp3`;
      console.log('🔄 Retrying with fresh audio element:', audioUrl);
      const freshAudio = new Audio(audioUrl);
      freshAudio.volume = 0.5;
      await freshAudio.play();
      console.log('✅ Notification sound played with fresh audio element');
    } catch (retryError) {
      console.error('❌ Retry also failed:', retryError);
    }
  }
};
