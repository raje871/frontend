import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, ListGroup, Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Search, MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConvo) {
      fetchMessages(selectedConvo.user._id);
    }
  }, [selectedConvo]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const { data } = await API.get('/messages/conversations/list');
      setConversations(data);
      
      // Handle navigation from Internship Detail
      if (location.state?.recipient) {
        const existing = data.find(c => c.user._id === location.state.recipient._id || c.user._id === location.state.recipient);
        if (existing) {
          setSelectedConvo(existing);
        } else {
          // If no existing convo, we just set a mock convo with the user info
          // Real convo will be created on first message
          setSelectedConvo({
            user: location.state.recipient,
            lastMessage: { content: 'Start a new conversation...' }
          });
        }
      } else if (data.length > 0 && !selectedConvo) {
        setSelectedConvo(data[0]);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const { data } = await API.get(`/messages/${userId}`);
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConvo) return;

    setSending(true);
    try {
      const { data } = await API.post('/messages', {
        recipientId: selectedConvo.user._id,
        content: newMessage
      });
      setMessages([...messages, data]);
      setNewMessage('');
      // Update conversations list to show last message
      fetchConversations();
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" color="var(--accent-indigo)" /></div>;

  return (
    <div className="messages-container" style={{ height: 'calc(100vh - 120px)' }}>
      <Row className="h-100 g-3">
        {/* Conversations List */}
        <Col md={4} className="h-100">
          <Card className="border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '16px' }}>
            <div className="p-3 border-bottom">
              <h5 className="fw-bold mb-3">Messages</h5>
              <InputGroup className="bg-light rounded-pill overflow-hidden">
                <InputGroup.Text className="bg-transparent border-0"><Search size={16} /></InputGroup.Text>
                <Form.Control className="bg-transparent border-0 shadow-none ps-0" placeholder="Search chats..." />
              </InputGroup>
            </div>
            <ListGroup variant="flush" className="overflow-auto flex-grow-1">
              {conversations.length === 0 ? (
                <div className="text-center p-4 text-muted">
                  <MessageSquare size={32} className="mb-2 opacity-50" />
                  <p className="small">No conversations yet</p>
                </div>
              ) : (
                conversations.map((convo) => (
                  <ListGroup.Item
                    key={convo.user._id}
                    action
                    active={selectedConvo?.user._id === convo.user._id}
                    onClick={() => setSelectedConvo(convo)}
                    className="p-3 border-bottom-0 d-flex gap-3 align-items-center"
                    style={{ borderLeft: selectedConvo?.user._id === convo.user._id ? '4px solid var(--accent-indigo)' : '4px solid transparent' }}
                  >
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold text-primary" style={{ width: '45px', height: '45px', flexShrink: 0 }}>
                      {convo.user.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="d-flex justify-content-between align-items-baseline">
                        <h6 className="mb-0 fw-bold text-truncate">{convo.user.name}</h6>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                          {new Date(convo.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                      <p className="small text-muted mb-0 text-truncate">{convo.lastMessage.content}</p>
                    </div>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card>
        </Col>

        {/* Chat Window */}
        <Col md={8} className="h-100">
          <Card className="border-0 shadow-sm h-100 overflow-hidden d-flex flex-column" style={{ borderRadius: '16px' }}>
            {selectedConvo ? (
              <>
                <div className="p-3 border-bottom d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold text-primary" style={{ width: '40px', height: '40px' }}>
                    {selectedConvo.user.name.charAt(0)}
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">{selectedConvo.user.name}</h6>
                    <small className="text-muted">{selectedConvo.user.role}</small>
                  </div>
                </div>

                <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3 bg-light bg-opacity-10">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg._id}
                        className={`d-flex ${msg.sender === user?._id ? 'justify-content-end' : 'justify-content-start'}`}
                      >
                        <div
                          className={`p-3 ${msg.sender === user?._id ? 'bg-primary text-white' : 'bg-white border'}`}
                          style={{
                            maxWidth: '75%',
                            borderRadius: msg.sender === user?._id ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                          }}
                        >
                          <p className="mb-0">{msg.content}</p>
                          <small className={`d-block text-end mt-1 ${msg.sender === user?._id ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.65rem' }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </small>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-top">
                  <Form onSubmit={handleSend}>
                    <InputGroup className="bg-light rounded-pill overflow-hidden">
                      <Form.Control
                        className="bg-transparent border-0 shadow-none px-4"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button variant="primary" type="submit" disabled={sending} className="px-4">
                        {sending ? <Spinner size="sm" /> : <Send size={18} />}
                      </Button>
                    </InputGroup>
                  </Form>
                </div>
              </>
            ) : (
              <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                <MessageSquare size={64} className="mb-3 opacity-25" />
                <h5>Select a conversation to start chatting</h5>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Messages;
