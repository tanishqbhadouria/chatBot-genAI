'use client'

import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import {useState, useEffect, useRef} from 'react';
import{ marked} from 'marked'

export default function Home() {


  const [messages, setMessages]=useState([
  ])
  const [message, setMessage] = useState('')
  
  
  const sendMessage = async () => {
   // Clear the input field
  
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
  
    setMessages((messages) => [
      ...messages,
      { role: 'user',  parts: [{ text   : message }] },  // Add the user's message to the chat
      { role: 'model',parts: [  { text  :' ' }] },  // Add a placeholder for the assistant's response
    ])
    setMessage('') 

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/api/chat", requestOptions)
  .then(async (response) =>{
    const ans = await response.text();  // Get the response text
    console.log(ans)
    setMessages((prevMessages) => {
          let lastMessage = prevMessages[prevMessages.length - 1];  // Get the last message (assistant's placeholder)
          let otherMessages = prevMessages.slice(0, -1);  // Get all other messages
      
          // Append the decoded text to the assistant's message
          return  [
            ...otherMessages,
            { ...lastMessage, parts: [{ text: marked(ans) }] },
          ]
        });
  })
 
  .catch((error) => console.error(error));
    // const response = fetch("http://localhost:3000/api/chat", {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify([...messages, { role: 'user', parts: [{ text: message }] }]),
    // }).then(async (res) => {
    //   const ans = res.text();  // Get the response text
    //   console.log(ans)
    //   setMessages((prevMessages) => {
    //     let lastMessage = prevMessages[prevMessages.length - 1];  // Get the last message (assistant's placeholder)
    //     let otherMessages = prevMessages.slice(0, -1);  // Get all other messages
    
    //     // Append the decoded text to the assistant's message
    //     return [
    //       ...otherMessages,
    //       { ...lastMessage, parts: [{ text: ans }] },
    //     ];
    //   });
    // });
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

useEffect(() => {
  scrollToBottom()
}, [messages])


  return (
   <Box
    width='100vw'
    height='100vh'
    display='flex'
    flexDirection='column'
    justifyContent='center'
    alignItems='center'
    sx={{backgroundColor: '#F5F5DC'}}
   >
    <Typography variant='h1'
     sx={{fontFamily:'new roman', fontWeight:'normal'}}
    > Medical Blog's Chatbot </Typography>
    <Stack
        direction={'column'}
        width="1000px"
        height="700px"
        border="1px solid black"
        borderRadius="3%"
        p={2}
        spacing={3}
        sx={{backgroundColor: '#D1E9F6'}}
      >
         <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
            {messages.map((mes, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                mes.role === 'model' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  mes.role === 'model'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
                dangerouslySetInnerHTML={{ __html: mes.parts[0].text }}
              >
              </Box>
            </Box>
          ))}
        </Stack>
        
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
          </Stack>
      </Stack>  
   </Box>
  );
}
