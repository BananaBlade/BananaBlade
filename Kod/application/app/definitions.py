class AuthenticationError( Exception ):
    """An exception raised on wrong login attempt"""
    pass

class AuthorizationError( Exception ):
    """An exception raised on attemped access to login-restricted area"""
    pass

class PermissionError( Exception ):
    """An exception raised when user doesn't have sufficient privileges to perform an action"""
    pass


class AccountType:
    """User account type constants"""
    UNREGISTERED = 0
    USER = 1
    EDITOR = 2
    ADMINISTRATOR = 3
    OWNER = 4


class NotificationCategory:
    """Notification category constants"""
    INFO = 1
    WARNING = 2
