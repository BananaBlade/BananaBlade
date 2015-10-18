from enum import Enum

class AuthorizationError( Exception ):
    """An exception raised on attemped access to login-restricted area"""
    pass

class PermissionError( Exception ):
    """An exception raised when user doesn't have sufficient privileges to perform an action"""
    pass


class AccountType( Enum ):
    REGISTERED_USER = 1
    MUSIC_EDITOR = 2
    ADMINISTRATOR = 3
    OWNER = 4
