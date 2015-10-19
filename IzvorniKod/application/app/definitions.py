from enum import Enum

class AuthorizationError( Exception ):
    """"""
    pass

class PermissiomError( Exception ):
    """"""
    pass


class AccountType( Enum ):
    USER = 1
    EDITOR = 2
    ADMINISTRATOR = 3
    OWNER = 4
