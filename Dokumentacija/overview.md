# A preliminary overview of the application structure

## Models
- **Track**:
    - *attributes*
        - name : *String*
        - artist : *String*
        - duration : *Int (in seconds)*
        - file_format : *String*
        - sample_rate : *Float (in kHz)*
        - bits_per_sample : *Int*
        - genre : *String*
        - publisher : *String*
        - carrier_type : *String (? unknown meaning)*
        - year : *Int*
        // Special
        - (? play_count )
    - *methods*:
        - add_track : *@classmethod*
        - get_track : *@classmethod*
        - edit_track
        - delete_track
        - increment_play_count
        - get_wishlist : *@classmethod*
        - get_search : *@classmethod*
- **User**:
    - *attributes*:
        - first_name : *String*
        - last_name : *String*
        - occupation : *String*
        - email : *String*
        - password_hash : *String*
        - account_type : *Int (an enum, 1 to 4)*
        // Special
        - active : *Bool*
        - activation_code : *String*
    - *variants*:
        - **Owner**:
            - Disable inserting an owner, can only be added on  deployment
            - Can choose Administrators, to a maximum of 10
        - **Administrator**:
            - Can add and edit Tracks
            - Can choose Editors
        - **Editor**:
            - attributes:
                - time_slot_start : Time
                - (? requested_time )
        - **RegisteredUser**:
            - Can edit his own data
    - *methods*:
        - register_user : *@classmethod*
        - authenticate_user : *@classmethod*
        - count_administrators : *@staticmethod*
- **TrackList**:    A playlist of all the tracks
    - *attributes*:
        - track : *Track*
        - editor : *User*
        - start_time : *DateTime*
        - play_duration : *Int (in seconds)*
    - *methods*:
        - add_track : *@classmethod*
- **Wishes**:   Songs wished by the registered users
    - *attributes*:
        - track : *Track*
        - wish_time : *DateTime*
        - wisher : *User*
    - *methods*:
        

## Notes
- Radio station data to be stored into flask config object
- Registration requires sending an activation code via email, confirmation by link
