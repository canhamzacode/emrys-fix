# Deploying on Railway

This guide explains how to deploy the Emrys DeFi Agent on Railway.

## Required Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| PORT | Port for the agent server | 8080 |
| RAILWAY_URL | Public URL of the railway deployment | emrys-production.up.railway.app |
| UAGENT_NAME | Name of the uAgent | emrys-defi-agent |

## Deployment Steps

1. Create a new Railway project
2. Link your repository or use direct deployment
3. Configure the environment variables:
   - Set `PORT` to the Railway assigned port (usually injected automatically)
   - Set `RAILWAY_URL` to your Railway domain
4. Deploy using the Procfile:
   ```
   web: cd uagents && python agent.py
   ```

## Agent Communication

The agent communicates using the uAgent messaging system through the `/submit` endpoint:

```
POST /submit
```

With body:
```json
{
  "sender": "your-client-id",
  "destination": "emrys-defi-agent",
  "message": {
    "protocol_name": "SOON SVM"
  }
}
```

## Using with the Frontend

Update the `.env` file in the frontend project:

```
NEXT_PUBLIC_UAGENT_URL=https://your-railway-domain.up.railway.app
```

## Testing the Deployment

You can test the deployment with curl:

```bash
# Send a message to get protocol info
curl -X POST -H "Content-Type: application/json" \
  -d '{"sender": "test-client", "destination": "emrys-defi-agent", "message": {"protocol_name": "SOON SVM"}}' \
  https://your-railway-domain.up.railway.app/submit
``` 