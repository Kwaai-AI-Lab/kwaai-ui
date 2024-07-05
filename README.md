# Kwaai ai-assistant ui

## How to start the application

- Install packages
  
`
    npm i
`

- Ensure your localhost has trusted certificate

`
    brew install mkcert

    mkcert -install

    cd into /src directory

    mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost

    add localhost.pem to trusted certificates in browser
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
