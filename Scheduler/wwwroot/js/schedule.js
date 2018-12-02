$(document).ready(() => {
	const $main = $('#main').tabs();

	function allowedToApply(event, activity, opening) {
		var criteria = event.criteria.concat(activity.criteria).concat(opening.criteria);

		if (criteria.length === 0)
			return true;

		for (let i = 0; i < criteria.length; i++) {
			for (let ci = 0; ci < criteria[i].conditions.length; ci++) {
				var condition = criteria[i].conditions[ci];
				var hasAttribute = false;
				for (let ai = 0; ai < identity.attributes.length; ai++) {
					var attribute = identity.attributes[ai];
					if (condition.key === attribute.key && ((condition.valueType === 'System.Boolean' && condition.value.toLowerCase() === attribute.value.toLowerCase()) || condition.value === attribute.value)) {
						if (!hasAttribute) hasAttribute = true; // Participant has the required attribute.
					}
				}
				if (!hasAttribute) return false;
			}
		}

		return true;
	}

	function apply(event) {
		var $btn = $(event.target);
		$btn.attr("disabled", "disabled");
		var application = {
			openingId: $btn.data('opening-id'),
			rowVersion: $btn.data('opening-rowversion'),
			answers: []
		};
		get(endpoint(routes.data.opening.getOpening, { id: application.openingId })).done(data => {
			if (data.questions.length) {
				for (let i = 0; i < data.questions.length; i++) {
					var answer = window.prompt(data.questions[i].text);
					application.answers.push({
						openingId: application.openingId,
						questionId: data.questions[i].id,
						text: answer,
						options: []
					});
				}
			}
			put(endpoint(routes.data.opening.apply.route), application).done(opening => {
				$btn.data('opening-id', opening.id).data('opening-rowversion', opening.rowVersion).off('click').on('click', unapply);
				$btn.attr("name", 'unapply');
				$btn.removeAttr("disabled");
				$btn.text(identity.displayName);

				// Add title.
				var title = opening.tags.find(t => t.key === 'Title');
				if (title) $btn.parent().next().find('div').text(title.value);
				overlay();
			});
		})
	}

	function unapply(event) {
		var $btn = $(event.target);
		$btn.attr("disabled", "disabled");
		var opening = {
			id: $btn.data('opening-id'),
			rowVersion: $btn.data('opening-rowversion'),
		};
		put(endpoint(routes.data.opening.unapply.route), opening).done(opening => {
			$btn.data('opening-id', opening.id).data('opening-rowversion', opening.rowVersion).off('click').on('click', apply);
			$btn.attr("name", 'apply');
			$btn.removeAttr("disabled");
			$btn.text(opening.name);

			// Remove title.
			$btn.parent().next().find('div').text(' ');
			overlay();
		});
	}

	function generateSchedule(options) {
		var params = Object.assign({ div: '#main', data: {}, header: null, colspan: 1, showActivityHeader: true }, options);

		var $div = typeof (options.div) === 'string' ? $(params.div) : params.div;
		var events = params.data.events;
		var html = '<table class="events">';
		if (params.header) html += params.header;
		var month = -1;
		for (let ei = 0; ei < events.length; ei++) {
			var event = events[ei];
			var activities = params.data.activities.filter(a => a.eventId === event.id);
			event.startOn = new Date(event.startOn);
			event.endsOn = new Date(event.endsOn);

			if (event.startOn.getMonth() > month) {
				html += template('<tr class="month"><td colspan={colspan}><div>{month}</div></td></tr>', { colspan: params.colspan + 2, month: event.startOn.toLocaleDateString('en-us', { month: 'long' }) });
				month++;
			}

			html += '<tr>';
			html += template('<td>{day}</td><td>{name}</td>', { name: event.name, day: event.startOn.getDate() });

			html += template('<td colspan="{colspan}">', { colspan: params.colspan });
			html += '<table class="activities">';
			if (params.showActivityHeader && activities.length > 1) { // No need for an activity heading if there is only one activity in an event.
				html += '<thead><tr>';
				// Activities.
				for (let ai = 0; ai < activities.length; ai++) {
					var activity = activities[ai];
					html += template('<th>{name}</th>', activity);
				}
				html += '</tr></thead>';
			}
			html += '<tr>';
			// Activities.
			for (let ai = 0; ai < activities.length; ai++) {
				var activity = activities[ai];
				activity.startOn = new Date(activity.startOn);
				var openings = params.data.openings.filter(o => o.activityId === activity.id);
				html += template('<td class="{name}">', activity);
				var text = '';

				if (activity.startOn.getDay() !== 0 && activity.name.startsWith('Preside') || activity.startOn.getDay() === 0 && activity.name.startsWith('Preside') && activity.startOn.getHours() > 11) {
					html += template('<div class="participant" data-opening-id="{openingId}" data-opening-rowversion="{rowVersion}">&nbsp;</div>', opening);
					continue;
				}

				// Openings.
				for (let oi = 0; oi < openings.length; oi++) {
					var opening = openings[oi];
					var title = opening.tags.find(t => t.key === 'Title');
					text = title ? title.value : '&nbsp;';

					// Participants can unapply.
					if (opening.participants.length) {
						for (let pi = 0; pi < opening.maxParticipants; pi++) {
							if (opening.participants.length > pi) {
								var participant = opening.participants[pi];
								if (participant.id === identity.participantId) {
									html += template('<button name="unapply" data-opening-id="{id}" data-opening-rowversion="{rowVersion}" type="button">{displayName}</button>', opening, participant);
								} else {
									html += template('<div class="participant">{displayName}</div>', participant);
								}
							} else {
								if (allowedToApply(event, activity, opening)) {
									html += template('<button name="apply" data-opening-id="{id}" data-opening-rowversion="{rowVersion}" type="button">{name}</button>', opening);
								} else {
									html += template('<div class="participant">{name}</div>', opening);
								}
							}
						}
					} else {
						for (let pi = 0; pi < opening.maxParticipants; pi++) {
							if (allowedToApply(event, activity, opening)) {
								html += template('<button name="apply" data-opening-id="{id}" data-opening-rowversion="{rowVersion}" type="button">{name}</button>', opening);
							} else {
								html += template('<div class="participant">{name}</div>', opening);
							}
						}
					}
				}
				html += '</td>';
			}
			if (activities.length < params.colspan) {
				html += template('<td colspan="{colspan}"><div class="participant">{text}</div></td>', { colspan: params.colspan - activities.length, text: text });
			}
			html += '</tr>';
			html += '</table>';

			html += '</td>';
			html += '</tr>';
		}
		html += '</table>';

		$div.html(html);
	}

	var endpoints = [];
	var startOn = '2019-01-01';
	var endOn = '2019-06-30';
	init().done(() => {
		endpoints.push(get(endpoint(routes.data.calendar.getCalendar.route, { id: identity.calendarId })));
		endpoints.push(get(endpoint(routes.data.event.getEventsForCalendar.route + '?startOn={startOn}&endOn={endOn}', { id: identity.calendarId, startOn: startOn, endOn: endOn })));
		endpoints.push(get(endpoint(routes.data.activity.getActivitiesForCalendar.route + '?startOn={startOn}&endOn={endOn}', { id: identity.calendarId, startOn: startOn, endOn: endOn })));
		endpoints.push(get(endpoint(routes.data.opening.getOpeningsForCalendar.route + '?startOn={startOn}&endOn={endOn}', { id: identity.calendarId, startOn: startOn, endOn: endOn })));
		$.when(...endpoints).done((calendar, events, activities, openings) => {

			var header = '<thead><tr class="activity"><th>Date</th><th>Event</th><th>Preside</th><th>Speak</th><th>Pianist</th><th>Door Keeper</th><th>Readings</th><th>Prayers</th></tr></thead>';
			var meetings = events[0].filter(e => new Date(e.startOn).getDay() !== 6);
			generateSchedule({ div: '#meetings', data: { calendar: calendar[0], events: meetings, activities: activities[0], openings: openings[0] }, header: header, colspan: 6, showActivityHeader: false });

			var cleaning = events[0].filter(e => new Date(e.startOn).getDay() === 6);
			header = '<thead><tr class="activity"><th>Date</th><th>Event</th><th></th></tr></thead>';
			generateSchedule({ div: '#cleaning', data: { calendar: calendar[0], events: cleaning, activities: activities[0], openings: openings[0] }, header: header, colspan: 1, showActivityHeader: false });
			overlay();

			$('button[name=\'apply\']').on('click', apply).button();
			$('button[name=\'unapply\']').on('click', unapply).button();
		});
	});
});