##Small description

Allow to controll the content off the app in different languages

#Usage

##nbTxt

retrieve content from the global text content of the app

`<div data-nb-txt="path.in.the.text">`

##nbTxtList

get content inside a list

`<div data-nb-txt-list="item.content">`

#API DOC

Some functions are added to the rootScope

###changeLanguage

Change the language displayed in the directives

###getLanguage

Get the current Language of the application

###updateDict

Change the global content of the app

####Parameter
@content the global content

###getTxt

Get the global content of the app

###addContent

Add content to the app

####Parameter
@name name of the part
@content the json content associated to the name part

###availableLanguages

return the available languages in the app

###getContent

####Parameter
@code the path in json of the global content that you want to get

Example

`$rootScope.getContent('error.login_error')`



