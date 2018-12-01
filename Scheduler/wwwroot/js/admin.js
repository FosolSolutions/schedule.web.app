const SETTINGS = {
	api_dev: 'https://coeventapi.azurewebsites.net',
	api_local: 'https://localhost:44375'
};

var api;
var routes;

/**
 * Replaces placeholders {key} with the properties passed as arguments.
 * @param {string} text
 * @param {...*} args - Any number of objects that will be used to update the text. 
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
 */
function endpoint(route) {
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
 * @param {string|object} options.key - The key field(s) for each object (default: 'id').
 * @param {string|object} options.text - The text to display for each object.
 **/
function createDropdown(options) {
	var params = Object.assign({ name: '', url: '', key: 'id', text: '' }, options);
	return $.ajax({
		url: params.url
	}).then((data, status, xhr) => {
		var html = template('<select name="{name}">', { name: params.name });
		for (var i = 0; i < data.length; i++) {
			html += template('<option value="{' + params.key + '}">{' + params.text + '}</option>', data[i]);
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
 * @param type
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
 */
function load(options) {
	var params = Object.assign({ type: '', url: '' }, options);
	return get(params.url).then((data) => {
		return generateHtmlForm({ type: params.type, data: data });
	});
}

function get(url) {
	return $.ajax({
		url: url
	}).done((data, status, xhr) => {
		return data;
	});
}

function clear(form) {
	var $form = typeof(form) === 'string' ? $('#' + form) : form;
	var inputs = $form.serializeArray();
	for (let i = 0; i < inputs.length; i++) {
		$form.find(':input[name=\'' + inputs[i]['name'] + '\']').val(null);
	}
}

function add(type, url) {
	var data_type = type;
	var $form = $('#' + type);

	var data = formToObject($form);

	return $.ajax({
		type: 'POST',
		url: endpoint(url),
		contentType: 'application/json',
		data: JSON.stringify(data)
	}).then((data, status, xhr) => {
		generateHtmlForm(data_type, data);
	});
}

function update(type, url) {
	var data_type = type;
	var $form = $('#' + type);

	var data = formToObject($form);

	return $.ajax({
		type: 'PUT',
		url: endpoint(url),
		contentType: 'application/json',
		data: JSON.stringify(data)
	}).then((data, status, xhr) => {
		generateHtmlForm(data_type, data);
	});
}

function remove(type, url) {
	var data_type = type;
	var $form = $('#' + type);

	var data = formToObject($form);

	return $.ajax({
		type: 'DELETE',
		url: endpoint(url),
		contentType: 'application/json',
		data: JSON.stringify(data)
	}).then((data, status, xhr) => {
		generateHtmlForm(data_type, data);
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
		error: (xhr, status, error) => {
			var data = JSON.parse(xhr.responseText);
			errorDiv.html(data.message);
		}
	});

	errorDiv.on('click', (event) => {
		$(event.target).html('');
	});

	return get(endpoint('/api/endpoints')).done((data) => {
		routes = data;
	});
}
