const WebSocket = require('ws');

module.exports = (req, res) => {
  const wss = new WebSocket.Server({ noServer: true });
  let ideas = [];

  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ action: 'initIdeas', ideas }));

    ws.on('message', (data) => {
      const receivedMessage = JSON.parse(data);
      console.log('Received from client:', receivedMessage);

      const { projectTitle, projectType, name, projectDescription } =
        receivedMessage;

      if (projectTitle && projectType && name && projectDescription) {
        const newIdea = {
          action: 'addDiv',
          projectTitle,
          projectType,
          name,
          projectDescription,
        };

        ideas.push(newIdea);

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(newIdea));
          }
        });
      } else {
        console.error('Missing required data:', receivedMessage);
      }
    });
  });

  req.socket.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  res.status(200).send({ message: 'WebSocket server is running' });
};
