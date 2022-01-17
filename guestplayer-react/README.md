# GeuestPlayer React app

## Available Scripts

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\

# Deployment


### AWS
```
npm run build
serverless s3deploy -v
```

### Azure
```
azcopy sync build 'https://guestplayer.blob.core.windows.net/$web' --recursive --delete-destination true
```
