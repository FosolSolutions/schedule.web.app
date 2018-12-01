$(document).ready(() => {
	const $actions = $('#actions');
	const $filter = $('#filters');
	const $main = $('#main');

	init().then(() => {
		return createDropdown({ name: 'calendar', url: endpoint(routes.manage.calendar.getCalendars.route), value: 'id', caption: 'name' }).done(dropdown => {
			$filter.html(dropdown);

			// Load
			var btn_load = $('<button type="button">Load</button>').on('click', (event) => {
				var params = { id: $(event.target).parent().find('select[name=\'calendar\']').val() };
				load({ type: 'calendar', url: endpoint(routes.manage.calendar.getCalendar.route, params) }).done(form => {
					refreshForm({
						form: form,
						div: $main,
						type: 'calendar',
						addUrl: endpoint(routes.manage.calendar.addCalendar.route),
						updateUrl: endpoint(routes.manage.calendar.updateCalendar.route),
						deleteUrl: endpoint(routes.manage.calendar.deleteCalendar.route)
					});
				});
			});
			$filter.append(btn_load);

			// Select
			var btn_signin = $('<button type="button">Select</button>').on('click', (event) => {
				var params = { calendarid: $filter.find('select[name=\'calendar\']').val() };
				put(endpoint(routes.manage.calendar.selectCalendar.route, params)).done(data => {
					window.open('/dashboard', '_blank');
				});
			});
			$actions.append(btn_signin);

			// Invite all Participants
			var btn_signin = $('<button type="button">Invite Participants</button>').on('click', (event) => {
				var params = { calendarid: $filter.find('select[name=\'calendar\']').val() };
				put(endpoint(routes.manage.calendar.inviteParticipants.route, params)).done(data => {
					alert('success');
				});
			});
			$actions.append(btn_signin);
		});
	})
});