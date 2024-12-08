gcloud functions deploy placeBet \
    --runtime go123 \
    --region europe-west3 \
    --source . \
    --entry-point placeBet \
    --trigger-http \
    --allow-unauthenticated \
    --set-env-vars GOOGLE_PROJECT_ID="certainty-poker"

# Check deployment status
if [ $? -eq 0 ]; then
    echo "Deployment successful!"
else
    echo "Deployment failed!"
    exit 1
fi