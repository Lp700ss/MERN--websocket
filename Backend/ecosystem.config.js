module.exports = {
    apps: [
      {
        name: 'app', // Your main application
        script: 'app.js', // Change this to your main app's entry file
        instances: '1',
        exec_mode: 'fork',
        autorestart: true,
        watch: true,
      },
      {
        name: 'websocket', // WebSocket server
        script: 'controllers/websocketController.js', // Change this to your WebSocket controller file
        instances: '1',
        exec_mode: 'fork',
        autorestart: true,
        watch: true,
      },
    ],
  };
  