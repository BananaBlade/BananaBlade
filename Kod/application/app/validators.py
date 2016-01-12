from abc import ABCMeta, abstractmethod

import re

class Validator( metaclass = ABCMeta ):
    """Argument (form input, POST/GET request) validator base class"""

    @abstractmethod
    def __init__( self ):
        self.message = None

    @abstractmethod
    def validation_test( self, arg ):
        """Abstract boolean method that tests whether a given argument satisfies validation conditions"""
        pass

    def validate( self, arg ):
        if not self.validation_test( arg ):
            raise ValueError( 'Validation of {} failed'.format( arg ) if self.message is None else self.message )


class IntValidator( Validator ):
    """Validate an integer argument"""

    def __init__( self, minimum = None, maximum = None, message = None ):
        self.minimum = minimum
        self.maximum = maximum
        self.message = message

    def validation_test( self, arg ):
        return ( isinstance( arg, int )
            and ( arg >= self.minimum if self.minimum is not None else True )
            and ( arg <= self.maximum if self.maximum is not None else True ) )


class FloatValidator( Validator ):
    """Validate a float argument"""

    def __init__( self, minimum = None, maximum = None, message = None ):
        self.minimum = minimum
        self.maximum = maximum
        self.message = message

    def validation_test( self, arg ):
        return ( isinstance( arg, float )
            and ( arg >= self.minimum if self.minimum is not None else True )
            and ( arg <= self.maximum if self.maximum is not None else True ) )


class CharValidator( Validator ):
    """Validate a string argument"""

    def __init__( self, max_length = None, min_length = None, pattern = None, message = None ):
        self.min_length = min_length
        self.max_length = max_length
        self.pattern = pattern
        self.message = message

    def validation_test( self, arg ):
        return ( isinstance( arg, str )
            and ( len( arg ) >= self.min_length if self.min_length is not None else True )
            and ( len( arg ) <= self.max_length if self.max_length is not None else True )
            and ( re.fullmatch( self.pattern, arg ) if self.pattern is not None else True ) )


class EmailValidator( CharValidator ):
    """Validate an email address"""

    def __init__( self, message = 'Email adresa nije ispravnog oblika.' ):
        super().__init__( min_length = 5, max_length = 64, pattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}$", message = message )


class OIBValidator( Validator ):
    """Validate an OIB number (Osobni Identifikacijski Broj)"""

    def __init__( self, message = 'OIB nije ispravan.' ):
        self.message = message

    def validation_test( self, arg ):
        if arg is None or not arg.isdigit() or len( arg ) != 11: return False
        num = 10
        for a in arg[ :-1 ]:
            num = ( num + int( a ) ) % 10
            num = ( 2*num ) % 11 if num != 0 else 9
        check = 11 - num
        if check == 10: check = 0
        return check == int( arg[ 10 ] )
