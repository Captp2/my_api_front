$.ajax({
	url: "http://localhost/my_api/users",
	success: function(data){
		var html = '';
		for (var i = data.length - 1; i >= 0; i--) {
			html += '<tr id="user_' + data[i].id +'">';
			html += '<td>' + data[i].id + '</td>';
			html += '<td>' + data[i].name + '</td>';
			html += '<td>' + data[i].email + '</td>';
			html += '<td><ul><li><a class="seetasks" data-target="' + data[i].id + '" href="#">See tasks</a></li>'; 
			html += '<li><a class="edituser" data-target="' + data[i].id + '" href="#">Edit</a></li>';
			html += '<li><a class="deleteuser" data-target="' + data[i].id + '" href="#">Delete</a></li></td>'
			html +='</tr>';
		}
		$('#users tr').first().after(html);
	}
});

$(document).ready(function(){
	$('#users').on('click', '.seetasks', function(elem){
		$('.display').remove();
		var id = elem.target.dataset.target;
		$.ajax({
			url: "http://localhost/my_api/tasks/" + id,
			success: function(data){
				html = '<form id="addTask" action="http://localhost/my_api/tasks" method="POST">';
				html += '<table>';
				html += '<tr><th>Title</th><th>Description</th><th>Creation date</th><th>Status</th><th>Actions</th></tr>';
				for (var i = data.length - 1; i >= 0; i--) {
					html += '<tr>';
					html += '<td>' + data[i].title + '</td>';
					html += '<td>' + data[i].description + '</td>';
					html += '<td>' + data[i].creation_date + '</td>';
					html += '<td>' + data[i].status + '</td>';
					html += '<td><ul><li><a class="deletetask" href="#" data-target="' + data[i].id + '">Delete</a></li>';
					html += '<li><a class="edittask" href="#" data-target="' + data[i].id + '">Edit</a></li></ul>';
					html += '<tr/>';
				}
				html += '<tr>';
				html += '<td><input type="text" name="title" placeholder="title"/></td>';
				html += '<td><input type="text" name="description" placeholder="Description"/></td>';
				html += '<td>Autofill</td>';
				html += '<td><input type="text" name="status" placeholder="status"/>';
				html += '<input type="submit" value="Add a task"/></td>';
				html += '<input type="hidden" name="user_id" value="' + id + '"/>';
				html += '<tr/>';
				html += '</table>';
				html += '</form>';
				jQuery('<div/>',{
					class: 'display',
					html: html,
				}).appendTo('body');
			}
		});
	});

	$('#users').on('click', '.edituser', function(elem){
		$('.display').remove();
		var id = elem.target.dataset.target;
		html = '<form id="edituser" action="http://localhost/my_api/users/' + id + '" method="PUT">';
		html += '<input type="text" name="name" placeholder="Name"/>';
		html += '<input type="text" name="email" placeholder="Email"/>';
		html += '<input type="hidden" id="id" name="id" value="' + id + '"/>';
		html += '<input type="submit" value="Edit user"/>';
		jQuery('<div/>',{
			class: 'display',
			html: html,
		}).appendTo('body');
	});

	$('body').on('click', '.edittask', function(elem){
		$('.display').remove();
		var id = elem.target.dataset.target;
		html = '<form id="edittask" action="http://localhost/my_api/tasks/' + id + '" method="PUT">';
		html += '<input type="text" name="title" placeholder="Title"/>';
		html += '<input type="text" name="description" placeholder="description"/>';
		html += '<input type="number" name="status" placeholder="Status"/>';
		html += '<input type="hidden" id="id" name="id" value="' + id + '"/>';
		html += '<input type="submit" value="Edit task"/>';
		jQuery('<div/>',{
			class: 'display',
			html: html,
		}).appendTo('body');
	});

	$('body').on('submit', '#addTask', function(elem){
		elem.preventDefault();
		var data = $('#addTask :input');
		data.each(function(){
			data[this.name] = $(this).val();
		});
		$.ajax({
			url: 'http://localhost/my_api/tasks/',
			type: 'POST',
			dataType: 'json',
			data: data,
			success: function(result) {
				location.reload();
			}
		});
	})

	$('body').on('submit', '#edittask', function(elem){
		elem.preventDefault();
		var data = $('#edittask :input');
		data.each(function(){
			data[this.name] = $(this).val();
		});
		$.ajax({
			url: 'http://localhost/my_api/tasks/' + data['id'],
			type: 'PUT',
			dataType: 'json',
			data: data,
			success: function(result) {
				location.reload();
			}
		});
		return false;
	});

	$('body').on('click', '.deletetask', function(elem){
		var id = elem.target.dataset.target;
		if(confirm("Are you sure you want to delete this task?")){
			$.ajax({
				url: 'http://localhost/my_api/tasks/' + id,
				type: 'DELETE',
				dataType: 'json',
				data: {
					id: id
				},
				success: function(result){
					location.reload();
				}
			})
		}
	});

	$('body').on('submit', '#edituser', function(elem){
		elem.preventDefault();
		var data = $('#edituser :input');
		data.each(function(){
			data[this.name] = $(this).val();
		});
		$.ajax({
			url: 'http://localhost/my_api/users/' + data['id'],
			type: 'PUT',
			dataType: 'json',
			data: data,
			success: function(result) {
				html = '<td>' + result.user[0].id + '</td>';
				html += '<td>' + result.user[0].name + '</td>';
				html += '<td>' + result.user[0].email + '</td>';
				html += '<td><ul><li><a class="seetasks" data-target="' + result.user[0].id + '" href="#">See tasks</a></li>';
				html += '<li><a class="edituser" data-target="' + result.user[0].id + '" href="#">Edit</a></li>';
				html += '<li><a class="deleteuser" data-target="' + result.user[0].id + '" href="#">Delete</a></li></ul></td>' 
				$('#user_' + result.user[0].id).html(html);
			}
		});
		return false;
	});

	$('#users').on('click', '.deleteuser', function(elem){
		var user_id = elem.target.dataset.target;
		if(confirm("Are you sure you want to delete this user?")){
			$.ajax({
				url: 'http://localhost/my_api/users/' + user_id,
				type: 'DELETE',
				dataType: 'json',
				data: {
					user_id: user_id
				},
				success: function(result){
					location.reload();
				}
			})
		}
	})
})