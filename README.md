# Kwaai ai-assistant ui

## How to start the application

- Install packages
  
`
    npm i
`

- Start the postgres container
  
`
    docker-compose up -d
`

- Migrate Database tables (users, user_credentials)

`
    npx prisma migrate dev --name init
`

- Start the backend expressjs server

`
    node .\src\server.js
`

- Start the Rectjs frontend

`
    npm start
`
