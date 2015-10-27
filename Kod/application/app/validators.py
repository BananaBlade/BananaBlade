from abc import ABCMeta, abstractmethod

import re

class Validator( metaclass = ABCMeta ):
    """An argument (form input, POST/GET request) validator"""

    @abstractmethod
    def __init__( self ):
        pass

    @abstractmethod
    def validate( self, arg ):
        pass


class IntValidator( Validator ):
    """Validate an integer argument"""

    def __init__( self, minimum = None, maximum = None ):
        self.minimum = minimum
        self.maximum = maximum

    def validate( self, arg ):
        return ( isinstance( arg, int )
            and ( arg >= self.minimum if self.minimum is not None else True )
            and ( arg <= self.maximum if self.maximum is not None else True ) )


class CharValidator( Validator ):
    """Validate a string argument"""

    def __init__( self, max_length = None, min_length = None, pattern = None ):
        self.min_length = min_length
        self.max_length = max_length
        self.pattern = pattern

    def validate( self, arg ):
        return ( isinstance( arg, str ) )
            and ( len( arg ) >= self.min_length if self.min_length is not None else True )
            and ( len( arg ) <= self.max_length if self.max_length is not None else True )
            and ( re.fullmatch( self.pattern, arg ) if self.pattern is not None else True ) )


class EmailValidator( CharValidator ):
    """Validate an email address"""

    def __init__( self ):
        super().__init__( min_length = 5, max_length = 64, pattern = "[a-zA-Z][a-zA-Z0-9.]*@[a-zA-Z0-9]+.[a-z]{2,}" )
