# SafeHavenTO
I created a user-friendly web app which leverages Daily Shelter Occupancy Data, an API provided by the City of Toronto's open data platform to assist individuals experiencing homelessness in finding nearby shelters based on their needs and real-time availability. The app has potential for expansion to other cities like Vancouver, and Montreal.

##### All parallax images were sourced from https://unsplash.com/

##### All graphic designs in this project are original content generated by DALL-E, prompted by me.  The SafeHavenTO logo was created using Figma and is my own creative design.  Both graphic designs and logos are intended for use in this project only.
 
## Problem Statement 
The homelessness crisis is riddled with multifaceted challenges, one such obstacle is the access to timely and accurate shelter information. There's a lack of centralized, up-to-date resources for individuals in need, causing difficulties in finding suitable shelters, especially during urgent situations.  

## Solution
By seamlessly integrating modern design and functionality with an intuitive and reliable user experience (UX), such an application holds the potential to revolutionize the way individuals experiencing homelessness access vital information.  This platform aims to provide more than just basic information, but also a sense of security during times of intense vulnerability. 
The mission of our platform is to help bridge the gap between those in need and the resources available to them; to serve as a beacon of hope in addressing this pressing societal issue.  While this platform will initially exist as an informational hub, it holds the potential to expand beyond this scope through various future implementations and features.

## To Run:

#### Mapbox API Token:
To use Mapbox, you'll need a Mapbox access token.  
##### 1. Create an account here for FREE: https://account.mapbox.com/auth/signup/
##### 2. Copy your token. You can find your access tokens, create new ones, or delete existing ones on your Access Tokens page: https://account.mapbox.com/access-tokens
##### 3. Head back to VS Code/IDE and navigate to the server folder. Rename the `.env.sample` file to `.env`.
##### 4. Within `.env`, locate the field: `REACT_APP_MAPBOX="Your API Key Here"`, and replace `"Your API Key Here"` with your token (no quotes).   <br /><br />Don't forget to save!

#### Server:
VSCode/terminal: run `npm i` in server folder

VSCode/terminal: run `npm run dev` in server folder

#### Client:
VSCode/terminal: run `npm i` in client folder

VSCode/terminal: run `npm start` in client folder

## Screenshots:

<img src = "https://github.com/ffluxpavillion/SafeHavenTO/blob/master/client/src/assets/screenshots/SafeHavenTO_landing.png">
<img src = "https://github.com/ffluxpavillion/SafeHavenTO/blob/master/client/src/assets/screenshots/SafeHavenTO_about-us.png?raw=true">
<img src = "https://github.com/ffluxpavillion/SafeHavenTO/blob/master/client/src/assets/screenshots/SafeHavenTO_parallax.png">
<img src = "https://github.com/ffluxpavillion/SafeHavenTO/blob/master/client/src/assets/screenshots/SafeHavenTO_shelters-card.png">
<img src = "https://github.com/ffluxpavillion/SafeHavenTO/blob/master/client/src/assets/screenshots/SafeHavenTO_parallax-2.png">
<img src = "https://github.com/ffluxpavillion/SafeHavenTO/blob/master/client/src/assets/screenshots/SafeHavenTO_resources.png">
<img src = "https://github.com/ffluxpavillion/SafeHavenTO/blob/master/client/src/assets/screenshots/SafeHavenTO_footer.png">
