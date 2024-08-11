$(document).ready(function() {
  // Obtener datos de usuarios
  $.ajax({
    url: 'https://server.miargentina.online/api/listarUsuarios',
    method: 'GET',
    success: function(data) {
      const table = $('#usuariosTable').DataTable({
        data: data,
        columns: [
          { data: 'id' },
          { data: 'usuario' },
          { data: 'cuentaDNICreado', render: function(data) { return data ? 'Sí' : 'No'; }},
          { data: null, render: function(data, type, row) {
              return '<button class="delete-btn btn btn-danger" data-usuario="' + row.usuario + '">Eliminar</button>';
            }
          }
        ],
        language: {
          "decimal": "",
          "emptyTable": "No hay datos disponibles en la tabla",
          "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
          "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
          "infoFiltered": "(filtrado de _MAX_ entradas totales)",
          "infoPostFix": "",
          "thousands": ",",
          "lengthMenu": "Mostrar _MENU_ entradas",
          "loadingRecords": "Cargando...",
          "processing": "Procesando...",
          "search": "Buscar por usuario:",
          "zeroRecords": "No se encontraron registros coincidentes",
          "paginate": {
            "first": "Primero",
            "last": "Último",
            "next": "Siguiente",
            "previous": "Anterior"
          },
          "aria": {
            "sortAscending": ": activar para ordenar la columna de manera ascendente",
            "sortDescending": ": activar para ordenar la columna de manera descendente"
          }
        }
      });

      // Manejar eliminación de usuario
      $('#usuariosTable').on('click', '.delete-btn', function() {
        const usuario = $(this).data('usuario');
        $('#confirmDeleteModal').data('usuario', usuario).modal('show');
      });

      $('#confirmDeleteBtn').on('click', function() {
        const usuario = $('#confirmDeleteModal').data('usuario');
        $.ajax({
          url: 'https://server.miargentina.online/api/eliminarUsuario/' + usuario,
          method: 'DELETE',
          success: function(response) {
            alert('Usuario eliminado correctamente');
            $('#confirmDeleteModal').modal('hide');
            table.row($('button[data-usuario="' + usuario + '"]').parents('tr')).remove().draw();
          },
          error: function(error) {
            alert('Error al eliminar el usuario');
          }
        });
      });

      // Manejar creación de usuario
      $('#createUserForm').on('submit', function(e) {
        e.preventDefault();
        const usuario = $('#usuario').val();
        const contrasena = $('#contrasena').val();
        const duracion = $('#duracion').val();
        
        if(usuario && contrasena && duracion) {
          $.ajax({
            url: 'https://server.miargentina.online/api/registerUser',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ usuario, contrasena, duracion }),
            success: function(response) {
              if (response.status === 200) {
                alert(response.message);
                $('#createUserModal').modal('hide');
                $('#createUserForm')[0].reset();
                // Agregar el nuevo usuario a la tabla
                table.row.add({
                  id: table.rows().count() + 1, // Asignar un ID temporal, ajusta según sea necesario
                  usuario: usuario,
                  cuentaDNICreado: false, // Ajustar según la lógica de tu aplicación
                  duracion: duracion
                }).draw(false);
              } else {
                alert(response.message);
              }
            },
            error: function(error) {
              if (error.responseJSON && error.responseJSON.message) {
                alert(error.responseJSON.message);
              } else {
                alert('Error al crear el usuario');
              }
            }
          });
        } else {
          alert('Por favor, completa todos los campos.');
        }
      });
    },
    error: function(error) {
      alert('Error al cargar los datos de usuarios');
    }
  });

  // Manejar cierre de sesión
  $('#logoutBtn').on('click', function() {
    localStorage.clear(); // Limpiar el localStorage
    window.location.href = '/public/Login/index.html'; // Redirigir a la página de inicio de sesión
  });
});