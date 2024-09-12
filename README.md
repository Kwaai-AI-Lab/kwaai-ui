# Kwaai ai-assistant ui

## How to start the application

- Install packages
  
`
    npm i
`

- Download the backend (pAI-OS) from the following repository and run the instructions:

[pAI-OS GitHub Repository](https://github.com/pAI-OS/paios)

- Create .env file
In the root of the project, create a `.env` file and add the following line with the correct value of the server URL:
`
    REACT_APP_API_URL=http://localhost:3080/api/v1
`

- Start the frontend

`
    npm start
`
# PAI-Assistant README

Welcome to **PAI-Assistant**, a personal assistant project designed for students and professors to enhance their learning and teaching experiences. This guide will walk you through the steps to create, customize, and deploy your personal assistant using the PAI-Assistant UI.

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Creating a Persona](#creating-a-persona)
4. [Creating an Assistant](#creating-an-assistant)
5. [Managing Knowledge Base](#managing-knowledge-base)
6. [Testing Your Assistant](#testing-your-assistant)
7. [Setting Assistant Privacy](#setting-assistant-privacy)
8. [Deploying Your Assistant](#deploying-your-assistant)
9. [Interacting with Your Assistant](#interacting-with-your-assistant)

---

## Introduction

PAI-Assistant allows users to create personal assistants that retrieve information from a personalized knowledge base using a persona of their choice. Follow these instructions to set up your assistant.

---

## Prerequisites

Before you begin, make sure you have access to:
- PAI OS project Donwloaded and Running. https://github.com/pAI-OS/paios/
- Any documents or knowledge base content you wish to upload.

---

## Creating a Persona

1. Navigate to the **Persona** tab in the PAI-Assistant UI.
2. Create a new persona. This will define the personality of your assistant, determining how it will interact with users.
   - **Description**: Write a description of who your assistant is and how you’d like it to respond to queries.
3. Save your persona.

---

## Creating an Assistant

1. After creating a persona, proceed to create a new assistant.
2. Assign a **Name** and **Description** to your assistant. These fields are purely informational and won’t affect how your assistant communicates.
3. Select the persona that your assistant will use.

---

## Managing Knowledge Base

1. Upload documents (PDFs, Word, or .txt files) to your assistant's **Knowledge Base**. This is the information your assistant will refer to when generating responses.
2. You can update, delete, or view a list of the uploaded documents at any time.

---

## Testing Your Assistant

1. Test your assistant to ensure it retrieves the correct information from the knowledge base. This step will help you verify if the assistant behaves as expected.
2. Interact with the assistant to see how it responds using the selected persona and knowledge.

---

## Setting Assistant Privacy

1. You can set your assistant’s visibility to **Private**, **Public**, or leave it as a **Draft**.
   - **Private**: Only you or authorized users can access the assistant.
   - **Public**: Anyone with the link can interact with your assistant.
   - **Draft**: Keep the assistant in development mode until it's ready for use.

---

## Deploying Your Assistant

1. Once you're satisfied with your assistant, deploy it to make it available for use.
2. Navigate to your **Assistants** page to view all your assistants.

---

## Interacting with Your Assistant

1. To begin interacting with your assistant, go to the **Assistants** page.
2. Click the **Go to Course** button to launch the assistant.
3. Now you can play with your assistant, ask questions, and test its responses based on the persona and knowledge you’ve configured.

---

## Tutorial Video
https://github.com/user-attachments/assets/a599102e-a13a-40d5-8f1b-e955fb176c1b
