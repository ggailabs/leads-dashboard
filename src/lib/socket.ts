import { Server } from 'socket.io';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Join leads room for real-time updates
    socket.join('leads');
    
    // Handle new lead creation
    socket.on('lead:created', (leadData: any) => {
      // Broadcast to all clients in leads room
      io.to('leads').emit('lead:new', leadData);
    });

    // Handle lead updates
    socket.on('lead:updated', (leadData: any) => {
      io.to('leads').emit('lead:update', leadData);
    });

    // Handle new WhatsApp messages
    socket.on('message:new', (messageData: any) => {
      io.to('leads').emit('message:received', messageData);
    });

    // Handle lead status changes
    socket.on('lead:status-changed', (data: { leadId: string; status: string }) => {
      io.to('leads').emit('lead:status', data);
    });

    // Handle messages
    socket.on('message', (msg: { text: string; senderId: string }) => {
      // Echo: broadcast message only the client who send the message
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      socket.leave('leads');
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to Lead Dashboard WebSocket!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};

// Helper functions to emit events from outside
export const emitLeadUpdate = (io: Server, leadData: any) => {
  io.to('leads').emit('lead:update', leadData);
};

export const emitNewLead = (io: Server, leadData: any) => {
  io.to('leads').emit('lead:new', leadData);
};

export const emitNewMessage = (io: Server, messageData: any) => {
  io.to('leads').emit('message:received', messageData);
};