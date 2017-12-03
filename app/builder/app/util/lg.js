
// ██╗      █████╗ ███╗   ██╗ ██████╗ ██╗   ██╗ █████╗  ██████╗ ███████╗
// ██║     ██╔══██╗████╗  ██║██╔════╝ ██║   ██║██╔══██╗██╔════╝ ██╔════╝
// ██║     ███████║██╔██╗ ██║██║ ████╗██║   ██║███████║██║ ████╗█████╗  
// ██║     ██╔══██║██║╚██╗██║██║   ██║██║   ██║██╔══██║██║   ██║██╔══╝  
// ███████╗██║  ██║██║ ╚████║╚██████╔╝╚██████╔╝██║  ██║╚██████╔╝███████╗
// ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
/* LANGUAGE
|
|  if the selected language is not available, the default language will be selected.
|  if instead of an object of languages ({fr:fr, en:en}) a string is provided, the same text will be used for all languages as a universal text.
|
*/
var txt = {
    // ███╗   ██╗ ██████╗ ████████╗██╗███████╗██╗ ██████╗ █████╗ ████████╗██╗ ██████╗ ███╗   ██╗███████╗
    // ████╗  ██║██╔═══██╗╚══██╔══╝██║██╔════╝██║██╔════╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
    // ██╔██╗ ██║██║   ██║   ██║   ██║█████╗  ██║██║     ███████║   ██║   ██║██║   ██║██╔██╗ ██║███████╗
    // ██║╚██╗██║██║   ██║   ██║   ██║██╔══╝  ██║██║     ██╔══██║   ██║   ██║██║   ██║██║╚██╗██║╚════██║
    // ██║ ╚████║╚██████╔╝   ██║   ██║██║     ██║╚██████╗██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║███████║
    // ╚═╝  ╚═══╝ ╚═════╝    ╚═╝   ╚═╝╚═╝     ╚═╝ ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
    "n": {
        "user_register": {
            "fr": "<strong>$name</strong>, bienvenue sur <strong class=\"nt-hey\">Hey</strong> ! Vous avez reçu <span class=\"points\">$points<i></i></span> pour vous être inscrit. Ces points sont symboliques pour le moment, mais pourraient avoir beaucoup de valeur à l'avenir. Vous en receverz plus à chaque fois que quelqu'un <span class=\"heart\"><i></i></span> votre contenu et à chaque fois que vous aiderez des gens. Félicitations!",
            "en": "<strong>$name</strong>, welcome on <strong class=\"nt-hey\">Hey</strong> ! You received <span class=\"points\">$points<i></i></span> for joining us. Those coins are honorary for the moment but might get very valuable in the future. You’ll receive more of those whenever your content gets <span class=\"heart\"><i></i></span> and whenever your help someone. Congratulations!"
        },
        "entry_upvote": {
            "fr": "<strong>$name</strong> <span class=\"heart\"><i></i></span> votre <strong>post</strong>.",
            "en": "<strong>$name</strong> <span class=\"heart\"><i></i></span> your <strong>post</strong>."
        },
        "entry_upvote_blurb": {
            "fr": "<strong>$name</strong> <span class=\"heart\"><i></i></span> votre <strong>post</strong>: <em>\"$blurb\"</em> sur <small>$url</small>",
            "en": "<strong>$name</strong> <span class=\"heart\"><i></i></span> your <strong>post</strong>: <em>\"$blurb\"</em> on <small>$url</small>"
        },
        "answer_upvote": {
            "fr": "<strong>$name</strong> <span class=\"heart\"><i></i></span> votre <strong>réponse</strong>.",
            "en": "<strong>$name</strong> <span class=\"heart\"><i></i></span> your <strong>reply</strong>."
        },
        "answer_upvote_blurb": {
            "fr": "<strong>$name</strong> <span class=\"heart\"><i></i></span> votre <strong>réponse</strong>: <em>\"$blurb\"</em> sur <small>$url</small>",
            "en": "<strong>$name</strong> <span class=\"heart\"><i></i></span> your <strong>reply</strong>: <em>\"$blurb\"</em> on <small>$url</small>"
        },
        "entry_answer": {
            "fr": "<strong>$name</strong> a répondu à votre <strong>post</strong>.",
            "en": "<strong>$name</strong> replied to your <strong>post</strong>."
        },
        "entry_answer_blurb": {
            "fr": "<strong>$name</strong> a répondu à votre <strong>post</strong>: <em>\"$blurb\"</em> sur <small>$url</small>",
            "en": "<strong>$name</strong> replied to your <strong>post</strong>: <em>\"$blurb\"</em> on <small>$url</small>"
        }
    },
    // ██████╗  █████╗  ██████╗██╗  ██╗██╗   ██╗██████╗ 
    // ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██║   ██║██╔══██╗
    // ██████╔╝███████║██║     █████╔╝ ██║   ██║██████╔╝
    // ██╔══██╗██╔══██║██║     ██╔═██╗ ██║   ██║██╔═══╝ 
    // ██████╔╝██║  ██║╚██████╗██║  ██╗╚██████╔╝██║     
    // ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝    
    "app_name": "",
    //GENERAL CONTENT
    "success": {
        "logout": {
            "fr": "Vous avez été bien déconnecté",
            "en": "You have been successfully logged out"
        },
        "file_saved": {
            "fr": "Le fichier a bien été sauvegardé",
            "en": "You file has been successfully uploaded"
        },
        "success": {
            "fr": "Succès",
            "en": "Success"
        },
        "geolocation": {
            "fr": "Position retrouvée avec succès",
            "en": "We successfully retrieved your position"
        },
        "message": {
            "fr": "Merci pour votre message",
            "nl": "Bedankt voor je bericht",
            "en": "Thanks for your message"
        }
    },
    // GENERAL
    "general": {
        "confirm": {
            "fr": "OK",
            "en": "OK"
        },
        "cancel": {
            "fr": "Annuler",
            "en": "Cancel"
        }
    },
    // //For the form validation
    // "label": {
    //     "title": {
    //         "fr": "titre",
    //         "en": "title",
    //         "nl": "titel"
    //     },
    //     "email": {
    //         "fr": "email",
    //         "en": "email",
    //         "nl": "email"
    //     },
    //     "password": {
    //         "fr": "mot de passe",
    //         "en": "password",
    //         "nl": "wachtwoord"
    //     },
    //     "password_confirmation": {
    //         "fr": "confirmation du mot de passe",
    //         "en": "password confirmation",
    //         "nl": "bevestiging van uw wachtwoord"
    //     },
    //     "first_name": {
    //         "fr": "prénom",
    //         "en": "first name",
    //         "nl": "voornaam"
    //     },
    //     "last_name": {
    //         "fr": "nom",
    //         "en": "last name",
    //         "nl": "achternaam"
    //     },
    //     "birthday": {
    //         "fr": "anniversaire",
    //         "en": "birthday",
    //         "nl": "geboortedatum"
    //     },
    //     "phone_number": {
    //         "fr": "numéro de téléphone",
    //         "en": "phone number",
    //         "nl": "telefoonnummer"
    //     },
    //     "diplomes": {
    //         "fr": "diplomes",
    //         "en": "degrees",
    //         "nl": "diploma’s"
    //     },
    //     "status": {
    //         "fr": "status",
    //         "en": "status",
    //         "nl": "status"
    //     },
    //     "experiences": {
    //         "fr": "expériences",
    //         "en": "experiences",
    //         "nl": "ervaringen"
    //     },
    //     "languages": {
    //         "fr": "langues",
    //         "en": "languages",
    //         "nl": "talen"
    //     },
    //     "date_format": {
    //         "fr": "jj/mm/aaaa",
    //         "en": "dd/mm/yyyy",
    //         "nl": "dd/mm/jjjj"
    //     },
    //     "number_of_employee": {
    //         "fr": "nombre d'employés",
    //         "en": "number of employee",
    //         "nl": "aantal werknemers"
    //     },
    //     "category_id": {
    //         "fr": "Secteur d'activité",
    //         "en": "Activity sector",
    //         "nl": "activiteitensector"
    //     },
    //     "description": {
    //         "fr": "description",
    //         "en": "description",
    //         "nl": "omschrijving"
    //     },
    //     "contact_name": {
    //         "fr": "personne de contact",
    //         "en": "contact person",
    //         "nl": "contactpersoon"
    //     },
    //     "contact_person_function": {
    //         "fr": "fonction de la personne de contact",
    //         "en": "function of the contact person",
    //         "nl": "functie van de contactpersoon"
    //     },
    //     "date_begin": {
    //         "fr": "date de début",
    //         "en": "start date",
    //         "nl": "startdatum"
    //     },
    //     "date_end": {
    //         "fr": "date de fin",
    //         "en": "end date",
    //         "nl": "einddatum"
    //     },
    //     "company": {
    //         "fr": "entreprise",
    //         "en": "company",
    //         "nl": "bedrijf"
    //     },
    //     "degree": {
    //         "fr": "diplôme",
    //         "en": "degree",
    //         "nl": "diploma"
    //     },
    //     "school": {
    //         "fr": "école",
    //         "en": "school",
    //         "nl": "school"
    //     },
    //     "ad_title": {
    //         "fr": "titre de l'annonce",
    //         "en": "ad title",
    //         "nl": "titel van de aanbieding"
    //     }
    // },
    "validation": {
        "email_taken": {
            "fr": "Cette adresse e-mail est déjà enregistrée",
            "en": "This email has already been taken",
            "nl": "Dit emailadres is reeds in gebruik"
        },
        "date": {
            "fr": "Le champ :attribute n'est pas une date valide",
            "en": "The :attribute is not a valid date.",
            "nl": "Het veld :attribute is geen geldige datum"
        },
        "date_format": {
            "fr": "Le champ :attribute ne correspond pas au format :format",
            "en": "The :attribute does not match the format :format.",
            "nl": "Het veld :attribute komt niet overeen met het formaat: format"
        },
        "email": {
            "fr": "Le champ :attribute doit être une adresse email valide",
            "en": "The :attribute must be a valid email address.",
            "nl": "Het veld :attribute moet een geldig e-mail adres zijn."
        },
        "exists": {
            "fr": "Le champ :attribute choisit n'est pas valide",
            "en": "The selected :attribute is invalid.",
            "nl": "Het geselecteerde :attribute is ongeldig"
        },
        "in": {
            "fr": "Le champ :attribute choisit n'est pas valide",
            "en": "The selected :attribute is invalid.",
            "nl": " Het geselecteerde veld :attribute is ongeldig "
        },
        "max_numeric": {
            "fr": "Le champ :attribute ne doit pas avoir une valeur supérieur à :max_numeric",
            "en": "The :attribute may not be greater than :max_numeric.",
            "nl": " Het veld :attribute mag niet groter zijn dan :max_numeric "
        },
        "max_file": {
            "fr": "Le champ :attribute ne doit pas avoir une taille de plus de :max_file kilobytes",
            "en": "The :attribute may not be greater than :max_file kilobytes.",
            "nl": " Het veld :attribute mag niet groter zijn dan :max_file kilobytes "
        },
        "max_string": {
            "fr": "Le champ :attribute ne doit pas avoir plus de :max_string caractères",
            "en": "The :attribute may not be greater than :max_string characters.",
            "nl": " Het veld :attribute mag niet meer dan :max_string tekens bevatten"
        },
        "max_array": {
            "fr": "Le champ :attribute ne doit avoir plus de :max_array éléments",
            "en": "The :attribute may not have more than :max_array items.",
            "nl": "Het veld :attribute mag niet meer dan :max_array elementen bevatten"
        },
        "min_numeric": {
            "fr": "Le champ :attribute doit avoir une valeur minimum de :min_numeric",
            "en": "The :attribute must be at least :min_numeric.",
            "nl": "Het veld :attribute moet minstens :min_numeric bedragen."
        },
        "min_file": {
            "fr": "Le champ :attribute doit avoir une taille minimum de :min_file kilobytes",
            "en": "The :attribute must be at least :min_file kilobytes.",
            "nl": "Het veld :attribute mag niet kleiner zijn dan :min_file kilobytes"
        },
        "min_array": {
            "fr": "Le champ :attribute doit avoir minimum :min_array éléments",
            "en": "The :attribute must have at least :min_array items.",
            "nl": "Het veld :attribute moet minstens :min_array elementen bevatten."
        },
        "min_string": {
            "fr": "Le champ :attribute doit avoir minimum :min_string caractères",
            "en": "The :attribute must be at least :min_string characters.",
            "nl": " Het veld :attribute moet minstens :min_string tekens bevatten."
        },
        "numeric": {
            "fr": "Le champ :attribute doit être un nombre",
            "en": "The :attribute must be a number.",
            "nl": "Het veld :attribute moet minstens een nummer zijn."
        },
        "required": {
            "fr": "Le champ :attribute est requis",
            "en": "The :attribute field is required.",
            "nl": " Het veld :attribute is vereist."
        },
        "required_with": {
            "fr": "Le champ :attribute est requis quand :values est présent",
            "en": "The :attribute field is required when :values is present.",
            "nl": " Het veld :attribute is vereist wanneer :values aanwezig zijn"
        },
        "same": {
            "fr": "Le champ :attribute et :other doivent correspondre",
            "en": "The :attribute and :other must match.",
            "nl": " Het veld :attribute en :other moeten overeenkomen"
        },
        "unique": {
            "fr": "La valeur de :attribute entrée a déjà été prise",
            "en": "The :attribute chosen has already been taken.",
            "nl": "De waarde van :attribute is reeds genomen."
        },
        "url": {
            "fr": "Le format de :attribute est une url non valide",
            "en": "The :attribute format is an invalid url.",
            "nl": "Het formaat van :attribute is een ongeldige URL."
        }
    },
    //error messages
    "error": {
        "invalid_social": {
            "fr": "Vous devez vous être enregisté via un réseau social avant de pouvoir vous connecté avec l'un de ceux-ci.",
            "en": "You have to sign up using a social network before being allowed to login with one of them.",
            "nl": " U moet zich aanmelden met behulp van een sociaal netwerk voordat U wordt toegestaan om ermee in te loggen. "
        },
        "internet": {
            "fr": "Vous avez besoin d'un accès à internet pour utiliser cette application, vérifiez votre connexion.",
            "en": "You need an internet accès to use this application, please verify you connexion.",
            "nl": " Je moet een internetverbinding om deze toepassing te gebruiken, controleert uw verbinding."
        },
        "error_offer_search": {
            "fr": "Veuillez rentrer au moins un mot clé ou un type de fonction ou checker la case \"toutes les offres\"",
            "en": "Please fill att least one keyword or choose a function or check \"see all offers\"",
            "nl": "Vul minstens één trefwoord of functietype in of vink het vak “see all offers” aan."
        },
        "Combinaison_exist": {
            "fr": "Cette combinaison candidate/offre existe déjà",
            "en": "This combination of this candidate and this offer already exists.",
            "nl": "Deze combinatie of deze kandidaat bestaan all."
        },
        "contract": {
            "fr": "Veuillez choisir un type de contrat",
            "en": "Please chose a contract type",
            "nl": "Kies een type van contract."
        },
        "function": {
            "fr": "Veuillez choisir une fonction",
            "en": "Please chose a function",
            "nl": "Kies een functie."
        },
        "geolocation": {
            "fr": "Nous n'avons pas pu retrouver votre position, assurez-vous que votre GPS est activé",
            "en": "We failed to find your location, please make sure that your GPS in enabled",
            "nl": "We hebben uw positie niet kunnen terugvinden. Controleer of uw GPS aanstaat."
        },
        "element_not_found": {
            "fr": "L'élément recherché n'a pas pu être retrouvé",
            "en": "The element could not be found",
            "nl": "Het gezochte element werd niet teruggevonden>."
        },
        "default": {
            "fr": "Une erreur inattendue s'est produite, veuillez réessayer plus tard",
            "en": "An unexpected error occured, please retry later",
            "nl": "Een onverwachte fout heeft plaatsgevonden."
        },
        "cred": {
            "fr": "Les informations de connexion sont invalides",
            "en": "Credentials are invalid",
            "nl": "Uw login-informatie is ongeldig."
        },
        "invalid": {
            "fr": "Cette requête n'est pas valide",
            "en": "Invalid request",
            "nl": "Verzoek ongeldig."
        },
        "not_found": {
            "fr": "Rien n'a été trouvé ici désolé",
            "en": "Nothing has been found sorry",
            "nl": "Sorry, nwe hebben niets gevonden."
        },
        "notlogged": {
            "fr": "Vous devez être connecté pour faire cette action",
            "en": "You have to be logged in to do this action",
            "nl": "U moet inlogge om deze actie uit te voeren."
        },
        "already_logged": {
            "fr": "Vous vous être déjà connecté",
            "en": "You are already logged in",
            "nl": "U bent al ingelogd."
        },
        "file_not_found": {
            "fr": "Le fichier n'a pas pu être trouvé",
            "en": "The file could not be found",
            "nl": "Dit bestand werd niet teruggevonden."
        },
        "file_upload_error": {
            "fr": "Le fichier n'a pas pu être uploadé correctement, veuillez réessayer",
            "en": "The file could not be uploaded correctly, please retry",
            "nl": "Het bestand werd niet correct ge-upload, probeer opnieuw"
        },
        "default_form": {
            "fr": "Vérifiez que tous les champs requis ont bien été rempli",
            "en": "Please make sure that all the required fields have been filled",
            "nl": "Controleer of alle velden correct zijn ingevuld."
        }
    }
};