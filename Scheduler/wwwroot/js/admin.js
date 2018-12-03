const SETTINGS = {
	api_dev: 'https://coeventapi.azurewebsites.net',
	api_local: 'https://localhost:44375'
};

var api;
var routes;
const identity = {
	userId: null,
	participantId: null,
	displayName: null,
	calendarId: null,
	attributes: []
};

/**
 * Replaces placeholders {key} with the properties passed as arguments.
 * @param {string} text
 * @param {...*} args - Any number of objects that will be used to update the text. 
 * @returns {string} The resulting string after it has been parsed.
 */
function template(text) {
	var result = text;
	var len = arguments.length;
	for (let i = 1; i < len; i++) {
		for (let pname in arguments[i]) {
			var value = arguments[i][pname] === undefined ? '' : arguments[i][pname];
			result = result.replace(new RegExp('\\{' + pname + '}', 'gm'), value)
		}
	}
	return result;
}

/**
 * Replaces route parameter placeholders with the properties passed as arguments.
 * If your route contains numeric placeholders {0}, the order of your arguments will important.
 * If your route contains text placeholders {id}, the first object with the property will be used.
 * @param {any} route
 * @param {...*} args - Any number of values or objects that will be used to update the text.
 * @returns {string} The url to the endpoint.
 */
function endpoint(route) {
	if (typeof (route) === 'object') route = route.route || null;
	if (!route) throw 'Invalid route';
	if (route && route[0] !== '/') route = '/' + route;
	var url = api + route;
	var len = arguments.length;
	for (let i = 1; i < len; i++) {
		var index = i - 1;
		url = url.replace(new RegExp('\\{' + index + '}', 'gi'), arguments[i]);
	}
	var args = Array.prototype.slice.call(arguments);
	args.shift();
	args.unshift(url);
	return template.apply(this, args);
}

/**
 * Get all the calendars for the currently signed in user/participant.
 * @param {object} options - The options required to create the dropdown.
 * @param {string} options.name - The name of the select.
 * @param {string} options.url - The url to the endpoint to fetch an array of objects.
 * @param {object} options.option - The option configuration within the select.
 * @param {string|object} options.value - The key field(s) for each object (default: 'id').
 * @param {string|object} options.caption - The text to display for each object.
 * @param {object} options.attr - An array of properties to add as data attributes.
 * @returns {string} The select HTML.
 **/
function createDropdown(options) {
	var params = Object.assign({ name: '', url: '', value: 'id', caption: '', attr: [] }, options);
	return $.ajax({
		url: params.url
	}).then((data, status, xhr) => {
		var html = template('<select name="{name}">', { name: params.name });
		for (let i = 0; i < data.length; i++) {
			var attr = '';
			for (let ai = 0; ai < params.attr.length; ai++) {
				attr += 'data-' + params.attr[ai] + '="{' + params.attr[ai] + '}" ';
			}
			html += template('<option ' + attr + 'value="{' + params.value + '}">{' + params.caption + '}</option>', data[i]);
		}
		html += '</select>';
		return html;
	});
}

/**
 * Only assign the properties that exist in the first object.
 * @param {object} keys - The properties to assign and the default property values.
 * @param {object} source - The source properties to copy.
 * @returns {object} A new object containing only the keys.
 */
function Assign() {
	const keys = arguments[0];
	if (arguments.length == 2) {
		return Object.assign(keys, Object.pick(arguments[1], Object.keys(keys)));
	}
	// TODO: recursive.
}

/**
 * Get the model definition for the specified type.
 * @param {string} type - The object type.
 */
function getModel(type) {
	return $.ajax({
		url: endpoint(routes._.api.model.route, { name: type })
	});
}

/**
 * Generate the html form for the specified type.
 * @param {object} options - The configuration options.
 * @param {string} options.type - The type of object that a form is being generated for.
 * @param {object} options.data - The object data.
 * @returns {string} HTML containing the form for the object.
 */
function generateHtmlForm(options) {
	var params = Object.assign({ type: '', data: {} }, options);
	// Get the model definition for the specified type.
	return getModel(params.type).then(model => {
		var enums = [];
		for (let prop in model) {
			if (model[prop].isEnum) {
				enums.push(getModel(model[prop].type).then((data) => {
					model[prop].values = data;
				}));
			}
		}

		return $.when(...enums).then(() => model);
	}).then((model) => {
		var html = template('<form id="{name}">', { name: params.type });
		for (let prop in model) {
			var type = 'text';
			var readonly = '';
			switch (model[prop].type) {
				case ('Int32'):
					type = 'number';
					break;
				case ('Guid'):
					break; //readonly = 'readonly';
				case ('String'):
				default:
					break;
			}

			//var hidden_props = ['rowVersion', 'addedById', 'updatedById'];
			//if (hidden_props.includes(prop)) type = 'hidden';
			var value = params.data[prop];
			if (type == 'hidden') {
				html += template('<input name="{name}" type="{type}" value="{value}" {readonly}/>', { name: prop, type: type, value: value, readonly: readonly });
			} else {
				if (model[prop].isArray) {
				} else if (model[prop].isEnum) {
					html += template('<div><span>{name}:</span><select name="{name}">', { name: prop });
					for (let evalue in model[prop].values) {
						html += template('<option value="{value}" {selected}>{name}</option>', { name: evalue, value: evalue, selected: evalue.toUpperCase() === value.toUpperCase() ? 'selected' : '' });
					}
					html += '</select></div>';
				} else {
					html += template('<div><span>{name}:</span><input name="{name}" type="{type}" value="{value}" {readonly}/></div>', { name: prop, type: type, value: value, readonly: readonly });
				}
			}
		}
		html += '<button name="clear" type="button">Clear</button>';
		html += '<button name="add" type="button">Add</button>';
		html += '<button name="save" type="button">Save</button>';
		html += '<button name="remove" type="button">Delete</button>';
		html += '</form>';
		return html;
	});
}

/**
 * Convert the form into an object.
 * @param {element} $form
 * @returns {object} The object composed from the form input values.
 */
function formToObject($form) {
	var inputs = $form.serializeArray();
	var result = {};

	for (let i = 0; i < inputs.length; i++) {
		result[inputs[i]['name']] = inputs[i]['value'] === 'undefined' ? null : inputs[i]['value'];
	}

	return result;
}

/**
 * get and load the specified object into a form.
 * @param {any} options - Control options for what to load.
 * @param {string} options.type - The type of object that is being loaded (i.e. calendar).
 * @param {string} options.url - The endpoint url.
 * @returns {string} The form HTML.
 */
function load(options) {
	var params = Object.assign({ type: '', url: '' }, options);
	return get(params.url).then((data) => {
		return generateHtmlForm({ type: params.type, data: data });
	});
}

/**
 * Refresh the form on the page and add the control buttons.
 * @param {object} options - The configuration options.
 * @param {element|string} options.div - The element on the page that the form will be inserted to.
 * @param {element} options.form - The form to insert.
 * @param {string} options.type - The object type.
 * @param {string} options.addUrl - The endpoint url to add.
 * @param {string} options.updateUrl - The endpoint url to update.
 * @param {string} options.deleteUrl - The endpoint url to delete.
 */
function refreshForm(options) {
	var params = Object.assign({ div: '#main', form: null, type: '', addUrl: '', updateUrl: '', deleteUrl: '' }, options);
	if (typeof (params.div) === 'string') $(params.div).html(params.form);
	else params.div.html(params.form);

	$('button[name=\'clear\']').on('click', (event) => {
		clear(params.type);
	});
	$('button[name=\'add\']').on('click', (event) => {
		add(params.type, params.addUrl).done(form => refreshForm(Object.assign(params, { form: form })));
	});
	$('button[name=\'save\']').on('click', (event) => {
		update(params.type, params.updateUrl).done(form => refreshForm(Object.assign(params, { form: form })));
	});
	$('button[name=\'remove\']').on('click', (event) => {
		remove(params.type, params.deleteUrl).done(form => refreshForm(Object.assign(params, { form: form })));
	});
}

function get(url) {
	return $.ajax({
		url: url
	}).done((data, status, xhr) => {
		return data;
	});
}

function put(url, data) {
	return $.ajax({
		type: 'PUT',
		url: url,
		data: JSON.stringify(data),
		contentType: 'application/json'
	}).done((data, status, xhr) => {
		return data;
	});
}

function post(url, data) {
	return $.ajax({
		type: 'POST',
		url: url,
		data: JSON.stringify(data),
		contentType: 'application/json'
	}).done((data, status, xhr) => {
		return data;
	});
}

/**
 * Clear the form values.
 * @param {string|object} form - The form 'id' or the form element.
 */
function clear(form) {
	var $form = typeof(form) === 'string' ? $('#' + form) : form;
	var inputs = $form.serializeArray();
	for (let i = 0; i < inputs.length; i++) {
		$form.find(':input[name=\'' + inputs[i]['name'] + '\']').val(null);
	}
}

/**
 * Add the object to the datasource and generate a new form.
 * @param {string} type - The object type.
 * @param {string} url - The url to the endpoint.
 * @returns {string} The form HTML.
 */
function add(type, url) {
	var data_type = type;
	var $form = $('#' + type);

	var data = formToObject($form);

	return $.ajax({
		type: 'POST',
		url: url,
		contentType: 'application/json',
		data: JSON.stringify(data)
	}).then((data, status, xhr) => {
		return generateHtmlForm({ type: data_type, data: data });
	});
}

/**
 * Update the object int the datasource and generate a new form.
 * @param {string} type - The object type.
 * @param {string} url - The url to the endpoint.
 * @returns {string} The form HTML.
 */
function update(type, url) {
	var data_type = type;
	var $form = $('#' + type);

	var data = formToObject($form);

	return $.ajax({
		type: 'PUT',
		url: url,
		contentType: 'application/json',
		data: JSON.stringify(data)
	}).then((data, status, xhr) => {
		return generateHtmlForm({ type: data_type, data: data });
	});
}

/**
 * Delete the object from the datasource and clear form.
 * @param {string} type - The object type.
 * @param {string} url - The url to the endpoint.
 */
function remove(type, url) {
	var data_type = type;
	var $form = $('#' + type);

	var data = formToObject($form);

	return $.ajax({
		type: 'DELETE',
		url: url,
		contentType: 'application/json',
		data: JSON.stringify(data)
	}).then((data, status, xhr) => {
		clear($form);
	});
}

/**
 * Initialize admin page.
 * @param {object} options - Configuration options.
 * @param {string} options.errorDiv - The div to report errors to.
 * @param {string} options.api - The domain to the api.
 */
function init(options) {
	var params = Object.assign({ errorDiv: '#error', api: SETTINGS.api_dev }, options);
	var errorDiv = typeof(params.errorDiv) === 'string' ? $(params.errorDiv) : params.errorDiv;
	api = params.api;

	$.ajaxSetup({
		type: 'GET',
		crossDomain: true,
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		},
		beforeSend: (xhr, settings) => {
			$('#loader').show();
		},
		error: (xhr, status, error) => {
			var data = JSON.parse(xhr.responseText);
			var msg = data.message || 'We\'re very sorry an error has occured.  The request has returned a ' + status;
			alert(msg);
			overlay();
		}
	});

	errorDiv.on('click', (event) => {
		$(event.target).html('');
	});

	return get(endpoint('/api/endpoints')).then(data => {
		routes = data;
		return get(endpoint(routes._.auth.currentPrincipal.route));
	}).done((data) => {
		identity.participantId = data.id;
		identity.displayName = data.displayName;
		identity.calendarId = data.calendarId;
		identity.attributes = data.attributes;
	});
}

function overlay() {
	$('#loader').toggle();
}


function signinBackdoorUser() {
	get(endpoint(routes._.auth.backdoorUser.route)).done(data => {
		alert('success');
	})
}