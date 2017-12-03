#Documentation for nbSwipe

##Description

Allow to have swipeable content with an indicator and tabs

the SCSS is located in ui.scss (could have done a widget but the design can be application dependant, could also have added the default style in js but not necessary)

##Directive parameters

nb-swipe: the directive configuration, could include a fonction linked to each selector (tab) (can be empty)

selectors-wrapper : wrapper of the selectors (tabs), default: ".nb-swipe-selectors"
targets-wrapper : wrapper of the contents-wrapper (tabs), default: ".nb-swipe-contents-wrapper";
targets-wrapper : wrapper of the contents (tabs), default: ".nb-swipe-contents";

selectors: the name of the selectors (tabs), default: ".nb-swipe-selector"		
targets: the name of the selectors (tabs), default: ".nb-swipe-content"		
indicator: the name of the indicator (typically a bar), default: ".nb-swipe-indicator"		

active-tab: the starting active tab, default: 0

##Usage

.nb-swipe-wrapper(nb-swipe="config_for_directive" active-tab="{{active_tab_#}}" ...)
	.nb-swipe-selectors
		.nb-swipe-selector(data-ng-repeat="tab in tabs")
			.content
				//...
	.nb-swipe-indicator
	.nb-swipe-contents-wrapper
		.nb-swipe-contents
			.nb-swipe-content
				.content
					//...
			.nb-swipe-content.facebook-tab
				.content(data-ng-if="!user.facebook")
					//...
			.nb-swipe-content
				.content
					//...
			.nb-swipe-content
				.content
					//....


