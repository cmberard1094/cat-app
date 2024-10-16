# Welcome to the Cat app 👋

An app where users can sign-in/sign-up and upload/like/favorite their uploaded cats

## Requirements

1. Node version: LTS

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Add Cat App API KEY to EXPO_PUBLIC_CATS_API_KEY in .env file

3. Start the app

   ```bash
    npx expo start
   ```

## Notes:

1. Cat api does not have a user login/signup flow so I have a fake account creation flow
   - used so I can get images by sub_id
2. The instructions stated to use /favourite and /votes api to get the favourite and votes details, but I noticed that the /images/ endpoint already returned this data. By using the /images/ endpoint, I save 2 api calls per pagination scroll. If I were to use the /favourite and /votes api, I would have to manage each api call results in its own state (ideally a type of Map<string, Favorite/Vote>, where string is the id), so that I could easily grab those details from the renderItem function in the FlashList.
3. Utilizing expo-navigation which uses folder structure to handle routing

## Design Notes:

1. Keeping the upvote and favorite on the screen with 4 columns is a bit small for the user to interact with, if I were to enable 4 images per row, I would suggest using a bottom-sheet to display the image on its own screen and incorporate the up/down vote and favorite actions.
