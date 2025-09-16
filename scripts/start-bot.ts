import { app } from '../lib/slack/app';

(async () => {
  try {
    await app.start();
    console.log('⚡️ Peerbot is running!');
  } catch (error) {
    console.error('Error starting app:', error);
    process.exit(1);
  }
})();