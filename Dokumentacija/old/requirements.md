# Project requirements

- Editors can create playlists (1 hour duration)
- Editors can search the entire database by all relevant track informations
- Basic users can create their own wishlists with up to 10 tracks on it
- Editors can see the tracks on users' wishlists (how often do they occur - count)
- Visitors can only see the currently playing track
- Each track has a name and it's metadata
- There are 5 user types:
    - Visitors (unregistered)
    - Basic users
    - Editors
    - Administrators (up to 10)
    - Owner (only one)
- The owner is created by the system designer
- On deployment, the owner stores radio station data and contact informations
- The owner selects the system administrators
- Administrators can change their account data, as well as the account data of all the editors and basic users
- Administrators can add and edit tracks
- Administrators can select editors
- Editors have their allotted time slots for which they create the track lists
- Time slots are arranged by agreement between the editors, and are confirmed by administrators
- Basic users can edit their own account data
- User account data consists of: first name, last name, occupation and email address
- Visitors can only see the the radio station data and the currently playing track
- User registration:
    1. User fills in the registration form
    2. An email is sent to him with the activation link
    3. After email confirmation, password is sent to his email
- Making a track list (editor):
    - Each editor can search all the tracks by any criterion
    - After selecting a track, it is transfered to the list draft, until the list is completed
    - When the list duration approaches 1 hour, the editor is notified
    - The final track on the list cannot be played for less than 15 seconds
    - After making the list, it needs to be confirmed
    - After confirmation, it is stored into the daily reproduction list
    - In every moment, there has to be a reproduction list for the following 24 hours
- Making a wish list (basic user):
    - Each user can access the list of all the tracks and choose up to 10 tracks for the wish list (for the next 24 hours)
    - The list has to be confirmed before storing
    - After confirmation, the system generates the global wish list with all the wished tracks and their wish counts
    - This general list is available to all the editors
- Administrators can see how many times was a certain track reproduced, which editor prefers which tracks, which are the most wanted tracks (via wish lists), and what is the occurrence frequency of the most wished track within a given time interval
- The system must allow concurrent work of the owner, administrators, editors and basic users
- During work, the owner and administrators must be able to see the number and names of the currently active administrators, and the number of currently active basic users
