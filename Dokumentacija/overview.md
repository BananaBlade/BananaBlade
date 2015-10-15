# A preliminary overview of the application structure

## Models
- Track:
    - attributes
        - name : String
        - artist : String
        - duration : Int (in seconds)
        - file_format : String
        - sample_rate : Float (in kHz)
        - bits_per_sample : Int
        - genre : String
        - publisher : String
        - carrier_type : String (? unknown meaning)
        - year : Int
        // Special
        -

    - methods:
        - add_track: @classmethod
        -

- User:
    - attributes:
        - first_name : String
        - last_name : String
        - occupation : String
        - email : String
        - password_hash : String
        - account_type : Int (an enum, 1 to 4)
        // Special
        - active : Bool
        - activation_code : String

    - variants:
        - Owner:
            - Disable inserting an owner, can only be added on  deployment
            - Can choose Administrators, to a maximum of 10

        - Administrator:
            - Can add and edit Tracks
            - Can choose Editors
        - Editor:
            - attributes:
                - daily_time_start : Time
                - daily_time_end : Time
                - (? requested_time )
        - RegisteredUser:
            - Can edit his own data

    - methods:
        - register_user : @classmethod
        - authenticate_user : @classmethod
        

## Notes
- Radio station data to be stored into flask config object
- Registration
