$(document).ready(() => {
	const $actions = $('#actions');
	const $filter = $('#filters');
	const $main = $('#main');

	init().then(() => {
		// Dropdown with calendars available to current user.
		return createDropdown({ name: 'calendar', url: endpoint(routes.manage.calendar.getCalendars.route), value: 'id', caption: 'name' }).done(calendars => {
			$filter.html(calendars);
			var btn_loadParticipants = $('<button type="button">Load</button>').on('click', (event) => {

				// Dropdown with participants in selected calendar.
				var params = { calendarid: $(event.target).parent().find('select').val() };
				createDropdown({ name: 'participant', url: endpoint(routes.manage.participant.getParticipantsForCalendar.route + '?quantity=200', params), value: 'id', caption: 'lastName}, {firstName', attr: [ 'key' ] }).done(participants => {
					var participant = $filter.find('select[name=\'participant\']');
					
					if (participant.length) participant.replaceWith(participants);
					else {
						var search = $('<input name="search" type="text"></input>').on('input', (event) => {
							var text = $(event.target).val();
							var participant = $filter.find('select[name=\'participant\']');
							var options = participant.find('option');
							options.each( (i, element) => {
								if ($(element).text().toLowerCase().includes(text.toLowerCase())) {
									participant.val($(element).val());
									return false;
								}
							});
						});
						$filter.append(search);

						$filter.append(participants);

						// Load
						var btn_load = $('<button type="button">Load</button>').on('click', (event) => {
							var params = { id: $(event.target).parent().find('select[name=\'participant\']').val() };
							load({ type: 'participant', url: endpoint(routes.manage.participant.getParticipant.route, params) }).done(form => {
								refreshForm({
									form: form,
									div: $main,
									type: 'participant',
									addUrl: endpoint(routes.manage.participant.addParticipant.route),
									updateUrl: endpoint(routes.manage.participant.updateParticipant.route),
									deleteUrl: endpoint(routes.manage.participant.deleteParticipant.route)
								});
							});
						});
						$filter.append(btn_load);

						// Sigin
						var btn_signin = $('<button type="button">Signin</button>').on('click', (event) => {
							var params = { key: $filter.find('select[name=\'participant\']').find(':selected').data('key') };
							get(endpoint(routes._.auth.signinParticipant.route, params)).done(data => {
								window.open('/dashboard', '_blank');
							});
						});
						$actions.append(btn_signin);

						// Invite
						var btn_invite = $('<button type="button">Invite</button>').on('click', (event) => {
							var params = { id: $filter.find('select[name=\'participant\']').val() };
							put(endpoint(routes.manage.participant.inviteParticipant.route, params)).done(data => {
								alert('success');
							});
						});
						$actions.append(btn_invite);
					}
				});
			});
			$filter.append(btn_loadParticipants);
		});
	})
});