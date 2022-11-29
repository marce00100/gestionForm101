import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var _: any;
declare var xyzFuns: any;
declare var PNotify: any;

// declare var jqxCore: any;
// declare var jqxDataTable: any;
// declare var jqxScrollbar: any;
// declare var jqxdata: any;
// declare var jqxdatatable: any;
// declare var localization_custom: any;
declare var DataTable:any;
declare var moment: any;



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: [/*'./users.component.css'*/]
})
export class UsersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.user();
  }


  user = function () {
    $(function () {
      let ctxG: any = {
        rutabase: xyzFuns.urlRestApi,
        indice: 0,
        data: [],
        municipios: []
      }

      let regmodel = {
        model: {
          title: "_",
          desc: "",
          new: true,
          update: true,
          delete: true,
          sections: [
            {
              html_parent: '[__fields_usuario]',
              title_section: 'Datos de Usuario',
              text_section: '',
              class: { text: "mb10", section: "mb15", title: "" },
              fields: [
                { field: 'id', type: 'hidden', },
                {
                  field: 'email', type: 'text', label: 'Correo electronico', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5' },
                },
                {
                  field: 'username', type: 'text', label: 'Usuario', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5' },
                },
                {
                  field: 'password', type: 'password', label: 'Password', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5' },
                },
                {
                  field: 'nombres', type: 'text', label: 'Nombres', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5' },
                },
                {
                  field: 'apellidos', type: 'text', label: 'Apellidos', placeholder: '', title: '', help: '',
                  required: false, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: 'fa fa-plus', input: 'form-input p5' },
                },
                {
                  field: 'id_rol', type: 'select', label: 'Rol', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 1, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5' },
                },
                {
                  field: 'estado_usuario', type: 'select', label: 'Estado', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 1, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5' },
                },

              ]
            },
            {
              html_parent: '[__fields_operador]',
              title_section: 'Datos del Operador Minero',
              text_section: '',
              class: { text: "mb10", section: "mb15", title: "" },
              fields: [
                {
                  field: 'razon_social', type: 'text', label: 'Razon Social', placeholder: '', title: '', help: '',
                  required: false, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5' },
                },
                {
                  field: 'nit', type: 'text', label: 'NIT', placeholder: '', title: '', help: '',
                  required: false, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5' },
                },
                {
                  field: 'nim', type: 'text', label: 'NIM', placeholder: '', title: '', help: '',
                  required: false, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5' },
                },
                {
                  field: 'departamento', type: 'select', label: 'Departamento', placeholder: '', title: '', help: '',
                  required: false, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5' },
                },
                {
                  field: 'municipio', type: 'select', label: 'Municipio', placeholder: '', title: '', help: '',
                  required: false, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5' },
                },
              ]
            },

          ],
          // columns_fields: ['user_login', 'first_name', 'last_name', 'fecha_nac', 'departamento'],
        },

        listasPredefinidas: {
          estados: ['Activo', 'Inactivo'],
          departamentos: ['CHUQUISACA', 'LA PAZ', 'COCHABAMBA', 'ORURO', 'POTOSÍ', 'TARIJA', 'SANTA CRUZ', 'BENI', 'PANDO'],
          roles: [{ id: 1, rol: 'Administrador' }, { id: 2, rol: 'Comunicador' }, { id: 3, rol: 'Operador Minero' }],
        },
        create_fields: (sections) => {
          _.forEach(sections, (sec) => {
            let contenedor = $(sec.html_parent);
            /* Cabecera de cada Seccion Titulo y Texto*/
            let sectionContainer = $(/*html*/`<div __section_container class="${sec.class.section}"></div>`);
            sectionContainer.append(/*html*/ `<h3  __title_section class="${sec.class.title}" style="">${sec.title_section}</h3>`);
            sectionContainer.append(/*html*/ `<div __text_section class="fs14 ${sec.class.text}">${sec.text_section}</div>`);

            let htmlFields = '';
            _.forEach(sec.fields, (field) => {

              field.class = (field.class) ? field.class : {};
              /* Todos los fields estan para reaccionar al Grid , para volver al estilo clasico descomentar form-horizontal y form-group. etc*/

              if (field.type == 'hidden') {
                htmlFields += /*html*/`
                                    <div class="section hidden">
                                            <input class="hidden" id="${field.field}" __rg_field="${field.field}" name="${field.field}" >
                                    </div>`
              }

              if (field.type == 'text' || field.type == 'number' || field.type == 'date' || field.type == 'password' || field.type == 'email') {
                htmlFields += 
                  /*html*/`
                    <div class="form-horizontal ${field.class.bloque || ''} ${field.grid_column_span == 2 ? 'grid-column-span-2' : ''}" >
                      <div class="form-group  ${field.class.group || ''}  mbn">
                          <label  class="col-xs-11 ${field.grid_column_span == 2 ? 'col-sm-3' : 'col-sm-6'} control-label ${field.class.label || ''}" for="${field.field}"
                          style="">${field.label}</label>
                          <div    class="col-xs-11 ${field.grid_column_span == 2 ? 'col-sm-9' : 'col-sm-6'}">
                              <span class="append-icon left"><i class="${field.class.icon}"></i>
                              </span>
                              <input type="${field.type}" class="form-control pl10 ${field.class.input || ''}" id="${field.field}" __rg_field="${field.field}" name="${field.field}"
                              placeholder="${field.placeholder}" title="${field.title}" ${field.required ? 'required' : ''}  >
                              <em class="fs12 text-dark block col-xs-12 ${field.class.em || ''} ">${field.help}</em>
                          </div>
                      </div>
                    </div>`
              }

              if (field.type == 'select') {
                htmlFields += 
                  /*html*/`
                    <div class="form-horizontal ${field.grid_column_span == 2 ? 'grid-column-span-2' : ''} ">
                      <div class="form-group  ${field.class.group  || ''} mbn ">
                          <label class="col-xs-11 ${field.grid_column_span == 2 ? 'col-sm-3' : 'col-sm-6'} control-label ${field.class.label}" for="${field.field}"
                          style="">${field.label}</label>
                          <div class="col-xs-11   ${field.grid_column_span == 2 ? 'col-sm-9' : 'col-sm-6'}">
                              <span class="append-icon left"><i class=""></i>
                              </span>
                              <select class="form-control pl10 col-xs-9  ${field.class.input || ''}" id="${field.field}" __rg_field="${field.field}" name="${field.field}"
                              title="${field.title}"  ${field.required ? 'required' : ''} ></select>
                              <em class="fs12 text-dark block col-xs-12">${field.help}</em>
                          </div>
                      </div>
                    </div>`
              }

            });
            sectionContainer.append(/*html*/`<div __rg_fields_container class="rg-grid-form">${htmlFields}</div>`)
            $(contenedor).append(sectionContainer);
          })


          // return contenedor;
        },

        inicializaControles: () => {
          let opts = xyzFuns.generaOpcionesArray(regmodel.listasPredefinidas.estados, " ");
          $("[__rg_field=estado_usuario]").html(opts);

          let optsDeptos = xyzFuns.generaOpcionesArray(regmodel.listasPredefinidas.departamentos, " ");
          $("[__rg_field=departamento]").html(optsDeptos);

          let optsRoles = xyzFuns.generaOpciones(regmodel.listasPredefinidas.roles, 'id', 'rol');
          $("[__rg_field=id_rol]").html(optsRoles);

        },

        renderForm: () => {
          let sections = regmodel.model.sections;
          regmodel.create_fields(sections);
          regmodel.inicializaControles();
        },

        /* verifica los campos requeridos*/
        pasaCamposRequeridos: (elem) => {
          $("[__rg_field]").closest(".form-horizontal > div ").removeClass('has-error')
          let pasa = true;
          _.forEach(regmodel.model.sections, (sec) => {
            _.forEach(sec.fields, (field) => {
              if (field.required && (elem[field.field] == null || elem[field.field] === '')) {
                $(`[__rg_field=${field.field}]`).closest(".form-horizontal > div ").addClass('has-error');
                pasa = false;
              }
            })
          })
          return pasa;
        }
      }

      let conT:any = {
        contenedor: '#users_contenedor',
        modal: "#modal",
        dataTableTarget: $("#dataT"),
        source: {},

        cargarDatos: function () {
          $.get(`${ctxG.rutabase}/get-usuarios`, function (resp) {
            ctxG.data = resp.data;
            conT.fillDataT();
            // conT.fillDataT();
          });
        },
        fillDataT: function () {
          /* Aqui se configura el DT y se le asigna al Contenedor*/
          $(conT.dataTableTarget).DataTable({
            destroy: true,
            data: ctxG.data,
            autoWidth: true,
            info:true,
            scrollX: true,
            columns: [
              // {title: 'Ejemplo', data: 'ejemplo', width: '50% | 600', className: 'dt-right dt-head-center dt-body-left', type:'num',},
              {
                title: 'Usuario', width:'100%',
                render: function (data, type, row, meta) {
                  return `<a __accion="editar" href="javascript:void(0);" 
                                style="cursor:pointer; text-decoration:none; display:block; background-color:${row.estado_usuario == 'Activo' ? '#edf5ff' : '#fff0f0'}" class="p5 text-dark ">
                                <i class="fa fa-pencil fa-lg  "></i>   	
                                <b>${row.username}</b></a>`
                }
              },
              { title: 'Email', data: 'email', },
              { title: 'Nombres ', data: 'nombres', },
              { title: 'Apellidos', data: 'apellidos', },
              { title: 'Razon Social', data: 'razon_social', },
              {
                title: 'Fecha Registro', data: 'created_at', 
                render: function (data, type, row, meta) {
                  return (row.created_at != null && row.created_at != "") ? moment(row.created_at).format('DD/MM/YYYY') : "";
                }
              },
              // { title: 'Departamento',  data: 'departamento' },
              // { title: 'Municipio',  data: 'municipio' },
              { title: 'Rol',  data: 'rol' },
              { title: 'Estado',  data: 'estado_usuario' },
            ],
            language: xyzFuns.dataTablesEspanol(),
          });
        },
        refreshDataT: function () {
          $.get(ctxG.rutabase + '/get-usuarios', function (resp) {
            ctxG.data = resp.data;
            conT.source.localdata = ctxG.data;
            conT.dataTableTarget.jqxDataTable("updateBoundData");
          })
        },
        // fillDataT: function () {
        //   conT.source =
        //   {
        //     dataType: "json",
        //     localdata: ctxG.data,
        //     dataFields: [
        //       { name: 'id', type: 'number' },
        //       { name: 'username', type: 'string' },
        //       { name: 'email', type: 'string' },
        //       { name: 'nombres', type: 'string' },
        //       { name: 'apellidos', type: 'string' },
        //       { name: 'razon_social', type: 'string' },
        //       { name: 'rol', type: 'string' },
        //       { name: 'id_rol', type: 'string' },
        //       { name: 'estado_usuario', type: 'string' },
        //       { name: 'departamento', type: 'string' },
        //       { name: 'municipio', type: 'string' },
        //       { name: 'created_at', type: 'date' },
        //     ],
        //     id: 'id',
        //   };

        //   var dataAdapter = new $.jqx.dataAdapter(conT.source);

        //   /* Aqui se configura el DT y se le asigna al Contenedor DIV*/
        //   conT.dataTableTarget.jqxDataTable({
        //     source: dataAdapter,
        //     theme: 'energyblue',
        //     height: 500,
        //     pageable: false,
        //     altRows: false,
        //     sortable: true,
        //     width: "100%",
        //     filterable: true,
        //     filterMode: 'simple',
        //     selectionMode: 'singleRow',
        //     // localization: getLocalization('es'),
        //     columns: [
        //       {
        //         text: 'Usuario', width: 150, align: 'center', cellsalign: 'left', dataField: 'username',
        //         cellsrenderer: function (row, column, value, rowData) {
        //           return `<a __accion="editar" href="javascript:void(0);" 
        //                         style="cursor:pointer; text-decoration:none; display:block; background-color:${rowData.estado_usuario == 'Activo' ? '#edf5ff' : '#fff0f0'}" class="p5 text-dark ">
        //                         <i class="fa fa-pencil fa-lg  "></i>   	
        //                         <b>${rowData.username}</b></a>`
        //         }
        //       },
        //       { text: 'Email', width: 200, align: 'center', cellsalign: 'left', dataField: 'email' },
        //       {
        //         text: 'Nombres ', width: 150, align: 'center', cellsalign: 'left', dataField: 'nombres',
        //       },
        //       {
        //         text: 'Apellidos', width: 150, align: 'center', cellsalign: 'left', dataField: 'apellidos',
        //       },
        //       {
        //         text: 'Razon Social', width: 180, align: 'center', cellsalign: 'left', dataField: 'razon_social',
        //       },
        //       {
        //         text: 'Fecha Registro', width: 100, align: 'center', cellsalign: 'left', dataField: 'created_at',
        //         cellsrenderer: function (row, column, value, rowData) {
        //           return (rowData.created_at != null && rowData.created_at != "") ? moment(rowData.created_at).format('DD/MM/YYYY') : "";
        //         }
        //       },
        //       { text: 'Departamento', width: 150, align: 'center', cellsalign: 'left', dataField: 'departamento' },
        //       { text: 'Municipio', width: 150, align: 'center', cellsalign: 'left', dataField: 'municipio' },
        //       { text: 'Rol', width: 100, align: 'center', cellsalign: 'left', dataField: 'rol' },
        //       { text: 'Estado', width: 100, align: 'center', cellsalign: 'left', dataField: 'estado_usuario' },
        //       // { text: 'Activo', width: 50, align:'center',  cellsalign: 'center',  dataField: 'activo',
        //       // 	cellsrenderer: function(row, column, value, rowData) {
        //       // 		let activo = rowData.activo;
        //       // 		return `<span style="color: ${ (activo == 1) ? 'blue' : 'red' }; font-weight: 700; "    > ${ (activo == 1) ?'SI' : 'NO'}</span>`
        //       // 	}
        //       // },
        //     ]
        //   });
        // },
        // refreshDataT: function () {
        //   $.get(ctxG.rutabase + '/get-usuarios', function (resp) {
        //     ctxG.data = resp.data;
        //     conT.source.localdata = ctxG.data;
        //     conT.dataTableTarget.jqxDataTable("updateBoundData");
        //   })
        // },

        nuevo: function () {
          $("#modal [__titulo] span").html(`Agregar usuario`);
          $('[__contenido_fields] input').val('');
          $('[__contenido_fields] select').val('');

          funs.showModal();
        },
        editar: function () {
          var rowSelected = conT.dataTableTarget.jqxDataTable('getSelection');
          if (rowSelected.length > 0) {
            var rowSel = rowSelected[0];
            conT.setData(rowSel);
            $("#modal [__titulo] span").html(`Modificar Usuario`);
            funs.showModal();
          }
          else {
            // swal("Seleccione el registro para modificar.");
          }
        },
        getData: function () {
          let objeto = xyzFuns.getData__fields('__rg_field');
          objeto.id_municipio = $("[__rg_field=municipio]").val();
          objeto.municipio = $("[__rg_field=municipio] option:selected").text();

          // objeto.imagen_almacenada = $("#imagen_nueva").val(); /* La imagen_almacenada se actualiza para ser anviada,  con la imagen que se ha cargado, si no se carga ninguna imagen , de entrada ambas tienen el mismo valor asi que siguen siendo iaguales */
          // objeto.tipo_contenido = ctxG.data[ctxG.indice].id_tipo_contenido; /* id del parametro que contiene el tipo_contenido*/
          return objeto;
        },
        setData: function (obj) {
          // console.log(obj)
          xyzFuns.setData__fields(obj, '__rg_field');

          $("[__rg_field][type=password]").val('este no es el password')
          $("[__rg_field][type=password]").attr('paraverificarcambio', $("[__rg_field][type=password]").val());

          // _.each(obj, function(val, key){
          //     if( $(`[__field=${key}]`).attr('type') == 'chekbox')     
          //         $(`[__field=${key}]`).prop('checked', (val == 1) ? true : false);
          //     else
          //         $(`[__field=${key}]`).val(val);
          // })

          // $("#id").val(obj.id);
          // $("#titulo").val(obj.titulo);
          // $("#texto").val(obj.texto);
          // $("#url_redireccion").val(obj.url_redireccion);
          // $("#tipo_contenido").val(obj.tipo_contenido);
          // $("#orden").val(obj.orden);            
          // $("#activo").prop("checked", obj.activo );

          // $("#imagen_almacenada").val(obj.imagen_almacenada);

          // $("#imagen_nueva").val(obj.imagen_almacenada);
          // $("[__imagen_label]").html("Imagen: " +  obj.imagen_almacenada );
          // $("[__imagen_img]").attr("src", "./public/img/uploads/" + obj.imagen_almacenada);

        },
        validateRules: function () {
          var reglasVal = {
            errorClass: "state-error",
            validClass: "state-success",
            errorElement: "em",

            rules: {
              titulo: { required: true },
              texto: { required: true },
            },

            messages: {
              titulo: { required: 'campo obligatorio' },
              texto: { required: 'campo obligatorio' },
            },

            highlight: function (element, errorClass, validClass) {
              $(element).closest('.field').addClass(errorClass).removeClass(validClass);
            },
            unhighlight: function (element, errorClass, validClass) {
              $(element).closest('.field').removeClass(errorClass).addClass(validClass);
            },
            errorPlacement: function (error, element) {
              if (element.is(":radio") || element.is(":checkbox")) {
                element.closest('.option-group').after(error);
              } else {
                error.insertAfter(element.parent());
              }
            },
            submitHandler: function (form) {
              conT.saveData();
            }
          }
          return reglasVal;
        },
        saveData: function () {
          let obj = conT.getData();
          /* Se verifica si los tiposl password han cambiado*/
          _.forEach($('[__rg_field][type=password]'), function (pass) {
            /* si no cambio no se enviael cambio para que no se modifique */
            if ($(pass).val() == $(pass).attr('paraverificarcambio')) {
              let field = $(pass).attr('__rg_field');
              delete obj[field];
            }
          })
          $.post(ctxG.rutabase + '/save-user', obj, function (resp) {
            conT.refreshDataT();
            new PNotify({
              title: resp.estado == 'ok' ? 'Guardado' : 'Error',
              text: resp.msg,
              shadow: true,
              opacity: 0.9,
              type: (resp.estado == 'ok') ? "success" : "danger",
              delay: 1500
            });
          });

        },
        // eliminar: function () {
        //   var rowSelected = conT.dataTableTarget.jqxDataTable('getSelection');
        //   if (rowSelected.length > 0) {
        //     var rowSel = rowSelected[0];
        //     swal({
        //       title: `Está seguro de eliminar el registro seleccionado ? `,
        //       text: "Se borrara complatemente y ya no podrá recuperar este registro!",
        //       type: "warning",
        //       showCancelButton: true,
        //       confirmButtonColor: "#DD6B55",
        //       confirmButtonText: "Si, eliminar!",
        //       closeOnConfirm: true
        //     }, function () {
        //       $.post(ctxG.rutabase + 'api/eliminar-contenido-key', { 'id': rowSel.id }, function (res) {
        //         new PNotify({
        //           title: (res.estado == 'ok') ? 'Eliminado' : 'Error!!',
        //           text: res.mensaje,
        //           shadow: true,
        //           opacity: 0.9,
        //           type: (res.estado == 'ok') ? "success" : 'danger',
        //           delay: 2000
        //         });
        //         conT.refreshDataT();
        //       });
        //     });
        //   }
        //   else {
        //     swal("Seleccione el registro que desea eliminar.");
        //   }
        // },
      }

      var funs = {
        crearFormulario: () => {
          regmodel.create_fields(regmodel.model.sections);
          regmodel.inicializaControles();
          $.get(`${ctxG.rutabase}/getmunicipios`, function(resp){
            ctxG.municipios = resp.data;
        });
        },
        showModal: function () {
          $(".state-error").removeClass("state-error")
          $("#form_cont em").remove();
          $.magnificPopup.open({
            removalDelay: 500, //delay removal by X to allow out-animation,
            focus: '#titulo',
            items: {
              src: "#modal"
            },
            // overflowY: 'hidden', //
            callbacks: {
              beforeOpen: function (e) {
                var Animation = "mfp-zoomIn";
                this.st.mainClass = Animation;
              }
            },
          });
        },
      }

      //-------------------- Listeners  --------------------------------

      let listen = () => {

        $(conT.contenedor).on('click', '[__accion]', function (e) {
          var elem = e.currentTarget;
          conT[$(elem).attr('__accion')](); /* equivale a conT.nuevo*/
        });

        $("#modal").on('change', '[__rg_field=departamento]', function(){
          console.log('desde aqui')
          let municipios = _.filter(ctxG.municipios, function(item){
              return item.departamento == $('[__rg_field=departamento]').val();
          });
          let municipioOpts = xyzFuns.generaOpciones(municipios, 'id_municipio', 'municipio');
          $("[__rg_field=municipio]").html(municipioOpts);
      })

        /* Cancel Modal*/
        $("[__cerrar]").click(function () {
          $.magnificPopup.close();
        });

        $("[__save]").click(function () {
          conT.saveData();
        });


      }


      /*------------------------------  INIT ---------------------------------*/

      let init = () => {

        // $("#form_cont").validate(conT.validateRules());

        conT.cargarDatos();
        funs.crearFormulario();

      }

      listen();
      init();





    })
  };


}
