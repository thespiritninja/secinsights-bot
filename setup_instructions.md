## Setup Instructions

### Start by cloning [essential-ai-assessment](https://github.com/thespiritninja/essential-ai-assessment) repo

### Once you have cloned the repo on your local; you'll see two folders, You need to create .env files in both the folders

1. /backend
2. /frontend

- In the .env backend folder you need to add below variables

```
OPENAI_API_KEY=<YOUR_OPENAI_KEY>
SESSION_SECRET=<PUT_ANY_RANDOM_STRING>
```

- In the .env file for frontend folder you need to add below variables (You can choose to skip postgres, it won't store questions on DB)

```
DATABASE_URL=<POSTGRESQLDB_URL>
NODE_ENV=development //Keep this as is
AUTH_DRIZZLE_URL=<POSTGRESQLDB_URL>
```

### After adding the .env files we need to add the Chroma_DB, initialise the vectorstore and setup our RAG pipeline.

##### Navigate to the /backend folder and unzip the chroma_data.zip

```
/..
/frontend
	|-->/...
/backend
	|-->/chroma_data
```

##### Next execute below command to get relevant node_modules

> `npm i`

##### After all modules are installed you can execute below command, to start chroma server

> `chroma run`

##### In a different terminal run the node server by running the below command

> `npm run start`

##### Once you have the node and chroma server up test the server by hitting the below url on browser:

> http://localhost:8001/
>
> This should show `{"message":"Server Success"}`

### Now we initialise our vectorstore and build our RAG pipeline

##### Start by hitting the below url on browser:

> http://localhost:8001/initialise
>
> This should show `{"message":"DB Loaded successfully"}`

##### Next by hitting the below url on browser, we create the RAG chain (retriever):

> http://localhost:8001/build
>
> This should show `{"message":"Chain initialized successfully"}`

##### Final to test if our RAG-LLM is build correctly, test it by hitting:

> http://localhost:8001/query?question=can%20you%20give%20me%203Ms%20sales%20in%20millions%20for%20america?
>
> This should give you a JSON object with question, answer and context details

If everything goes well, we have our backend up and running, now we move to frontend

### We need to navigate to /frontend folder and run below command.

> `npm i`
>
> This will install all node_modules for our nextjs code

### Finally to run the frontend, run

> ` npm run dev`
>
> This will start the NextJS application and we can see the window.

### Now you can start asking questions through the chatbox and the details will be populated accordingly

### In case you encounter any issues with the setup feel free to reach out to me via [email](mailto://shreyassawant018@gmail.com), I'll be sure to guide you through it.

### In the meantime, I'm also in the process of hosting this application and will update you with the access link accordingly.
