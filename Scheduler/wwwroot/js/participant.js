$(document).ready(() => {
	const $filter = $('#filters');
	const $main = $('#main');

	init({
		api: SETTINGS.api_local
	}).then(() => {
		return createDropdown({ name: 'calendar', url: endpoint(routes.manage.calendar.getCalendars.route), key: 'id', text: 'name' }).done(calendars => {
			$filter.html(calendars);
			var btn_loadParticipants = $('<button type="button">Load</button>').on('click', (event) => {
				var calendarId = $(event.target).parent().find('select').val();
				createDropdown({ name: 'participant', url: endpoint(routes.manage.participant.getParticipantsForCalendar.route, { calendarid: calendarId }), key: 'id', text: 'lastName}, {firstName' }).done(participants => {
					var participant = $filter.find('select[name=\'participant\']');
					
					if (participant.length) participant.replaceWith(participants);
					else {
						$filter.append(participants);

						var btn_loadParticipant = $('<button type="button">Load</button>').on('click', (event) => {
							var keys = { id: $(event.target).parent().find('select').val() };
							load({ type: 'participant', url: endpoint(routes.manage.participant.getParticipant.route, keys) }).done(form => {
								$main.html(form);

								$('button[name=\'clear\']').on('click', (event) => {
									clear('participant');
								});
								$('button[name=\'add\']').on('click', (event) => {
									add('participant', routes.manage.participant.addParticipant.route);
								});
								$('button[name=\'save\']').on('click', (event) => {
									update('participant', routes.manage.participant.updateParticipant.route);
								});
								$('button[name=\'remove\']').on('click', (event) => {
									remove('participant', routes.manage.participant.deleteParticipant.route);
								});
							});
						});
						$filter.append(btn_loadParticipant);

						var btn_signin = $('<button type="button">Signin</button>').on('click', (event) => {
							var keys = { key: $main.find('input[name=\'key\']').val() };

							get(endpoint(routes._.auth.signinParticipant.route, keys)).done(data => {
								alert('success');
							});
						});
						$filter.append('</br>').append(btn_signin);
					}
				});
			});
			$filter.append(btn_loadParticipants);
		});
	})
});