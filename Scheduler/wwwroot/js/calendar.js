$(document).ready(() => {
	const $filter = $('#filter');
	const $main = $('#main');

	init({
		api: SETTINGS.api_local
	}).then(() => {
		$('#load').on('click', () => {
			var keys = { id: $('select[name=\'calendar\']').val() };
			load({ type: 'calendar', url: endpoint(routes.data.calendar.getCalendar.route, keys) }).done(form => {
				$main.html(form);

				$('button[name=\'clear\']').on('click', (event) => {
					clear('calendar');
				});
				$('button[name=\'add\']').on('click', (event) => {
					add('calendar', routes.manage.calendar.addCalendar.route);
				});
				$('button[name=\'save\']').on('click', (event) => {
					update('calendar', routes.manage.calendar.updateCalendar.route);
				});
				$('button[name=\'remove\']').on('click', (event) => {
					remove('calendar', routes.manage.calendar.deleteCalendar.route);
				});
			});
		});
		return createDropdown({ name: 'calendar', url: endpoint(routes.manage.calendar.getCalendars.route), key: 'id', text: 'name' }).done(dropdown => {
			$filter.html(dropdown);
		});
	})
});