'use client'

import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked'

export default function Home() {

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  
  const sendMessage = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify([
      {
        "role": "user",
        "parts": [
          {
            "text": message
          }
        ]
      }
    ]);
  
    // Add user message to chat
    setMessages((messages) => [
      ...messages,
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: ' ' }] },  // Placeholder for response
    ]);
    setMessage('');  // Clear input field

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("/api/chat", requestOptions)
      .then(async (response) => {
        const ans = await response.text();  // Get the response text
        console.log(ans)
        setMessages((prevMessages) => {
          let lastMessage = prevMessages[prevMessages.length - 1];  // Get placeholder
          let otherMessages = prevMessages.slice(0, -1);  // Get all other messages
          return [
            ...otherMessages,
            { ...lastMessage, parts: [{ text: marked(ans) }] },
          ];
        });
      })
      .catch((error) => console.error(error));
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: '#f0f4f8',
        '@media (max-width: 768px)': {
          height: 'auto',
          padding: '20px',
        },
      }}
    >
      <Typography variant='h2' sx={{
        fontFamily: '"Poppins", sans-serif', 
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
        '@media (max-width: 768px)': {
          fontSize: '24px',
        }
      }}>
        Medical Blog's Chatbot
      </Typography>
      
      <Stack
        direction={'column'}
        width="1000px"
        height="700px"
        border="2px solid #333"
        borderRadius="12px"
        p={4}  // Increased padding for the container
        spacing={3}
        sx={{
          backgroundColor: '#ffffff',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          '@media (max-width: 768px)': {
            width: '100%',
            height: '500px',
          }
        }}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          sx={{
            paddingRight: '10px',
            '&::-webkit-scrollbar': {
              width: '5px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '10px',
            },
          }}
        >
          {messages.map((mes, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={mes.role === 'model' ? 'flex-start' : 'flex-end'}
              sx={{
                padding: '15px',  // Increased padding for each message
                '@media (max-width: 768px)': {
                  fontSize: '12px',
                }
              }}
            >
              <Box
                bgcolor={mes.role === 'model' ? '#4a90e2' : '#50e3c2'}
                color="white"
                borderRadius={16}
                p={3}  // Increased padding inside each message
                sx={{
                  maxWidth: '70%',
                  wordWrap: 'break-word',
                  '@media (max-width: 768px)': {
                    maxWidth: '90%',
                  },
                }}
                dangerouslySetInnerHTML={{ __html: mes.parts[0].text }}
              ></Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>

        <Stack direction={'row'} spacing={2} sx={{ alignItems: 'center' }}>
          <TextField
            label="Type your message"
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            sx={{
              '@media (max-width: 768px)': {
                fontSize: '14px',
              }
            }}
          />
          <Button 
            variant="contained" 
            onClick={sendMessage}
            sx={{
              backgroundColor: '#4a90e2',
              '&:hover': { backgroundColor: '#357ABD' },
              '@media (max-width: 768px)': {
                fontSize: '12px',
              }
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
