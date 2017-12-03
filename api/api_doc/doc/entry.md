# CREATE ENTRY
route : POST /entry
ctrl : EntryController.create
service : EntryService.create

# note :
- if page does not exist, we need to create it first, for that we need more params

@params :
- page | location{href,hostname}
- user
- content
- type

- snippet:
	- language
	- content