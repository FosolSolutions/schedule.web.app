$(document).ready(() => {
	const $main = $('#main');

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

	function generateSchedule(options) {
		var params = Object.assign({ data: {} }, options);

		var events = params.data.events;
		var html = '<table class="schedule">';
		html += '<tr><th>Date</th><th>Event</th><th>Activities</th></tr>';
		for (let ei = 0; ei < events.length; ei++) {
			var event = events[ei];
			var activities = params.data.activities.filter(a => a.eventId === event.id);
			event.startOn = new Date(event.startOn).toLocaleDateString();
			event.endsOn = new Date(event.endsOn).toLocaleDateString();
			html += '<tr>';
			html += template('<td>{startOn}</td><td>{name}</td>', event);

			html += '<td>';
			html += '<table class="activity">';
			html += '<tr>';
			// Activities.
			for (let ai = 0; ai < activities.length; ai++) {
				var activity = activities[ai];
				html += template('<th>{name}</th>', activity);
			}
			html += '</tr>';
			html += '<tr>';
			// Openings.
			for (let ai = 0; ai < activities.length; ai++) {
				var activity = activities[ai];
				var openings = params.data.openings.filter(o => o.activityId === activity.id);
				html += template('<td class="{name}">', activity);
				for (let oi = 0; oi < openings.length; oi++) {
					var opening = openings[oi];

					// Participants can unapply.
					if (opening.participants.length) {
						for (let pi = 0; pi < opening.participants.length; pi++) {
							var participant = opening.participants[pi];
							if (participant.id === identity.participantId) {
								html += template('<button name="unapply" data-opening-id="{openingId}" data-opening-rowversion="{orowVersion}" type="button">{displayName}</button>', participant, { openingId: opening.id, orowVersion: opening.rowVersion });
							} else {
								html += template('<div class="active">{displayName}</div>', participant);
							}
						}
					} else {
						for (let pi = 0; pi < opening.maxParticipants; pi++) {
							if (allowedToApply(event, activity, opening)) {
								html += template('<button name="apply" data-opening-id="{id}" data-opening-rowversion="{rowVersion}" type="button">{name}</button>', opening);
							} else {
								html += template('<span>{name}</span>', opening);
							}
						}
					}
				}
				html += '</td>';
			}
			html += '</tr>';
			html += '</table>';

			html += '</td>';
			html += '</tr>';
		}
		html += '</table>';

		$main.html(html);

		function apply(event) {
			var $btn = $(event.target);
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
					var unapply_btn = $(template('<button name="unapply" data-opening-id="{id}" data-opening-rowversion="{rowVersion}" type="button">{displayName}</button>', opening, identity)).on('click', unapply);
					$btn.replaceWith(unapply_btn);
				});
			})
		}

		function unapply(event) {
			var $btn = $(event.target);
			var opening = {
				id: $btn.data('opening-id'),
				rowVersion: $btn.data('opening-rowversion'),
			};
			put(endpoint(routes.data.opening.unapply.route), opening).done(opening => {
				var apply_btn = $(template('<button name="apply" data-opening-id="{id}" data-opening-rowversion="{rowVersion}" type="button">{name}</button>', opening)).on('click', apply);
				$btn.replaceWith(apply_btn);
			});
		}

		$('button[name=\'apply\']').on('click', apply);

		$('button[name=\'unapply\']').on('click', unapply);
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
			generateSchedule({ data: { calendar: calendar[0], events: events[0], activities: activities[0], openings: openings[0] } });
		});
	});
});