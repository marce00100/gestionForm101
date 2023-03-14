import { Component, OnInit } from '@angular/core';
import { UAuthService } from 'src/app/shared/uauth.service';
declare var $: any;
declare var _: any;
declare var xyzFuns: any;
declare var PNotify: any;
declare var DataTable:any;
declare var moment: any;



@Component({
  selector: 'app-users',
  templateUrl: './usuarios.component.html',
  styleUrls: [/*'./users.component.css'*/]
})
export class UsersComponent implements OnInit {

  constructor(private uAuth: UAuthService) { }

  ngOnInit(): void {
    this.user();
  }

  user() {
    let cmp = this;
    $(function () {
      
      let ctxG: any = {
        rutabase: xyzFuns.urlRestApi,
        contenedor: '#users_contenedor',
        modal: "#modal",
        dataTableTarget: "#dataT",
        usersList: [],
        municipios: [],
        id_rol_operador: 3, /*El id_rol del rol operador */
        smsList: [],
      }

      let regmodel = {
        model: {
          title: "_",
          desc: "",
          new: true,
          update: true,
          delete: true,
          classError: 'error-validacion',
          sections: [
            {
              html_parent: '[__fields_datos_usuario]',
              title_section: 'Datos de Usuario',
              text_section: '',
              class: { text: "mb10", section: "mb20", title: "" },
              attr_field: '__rg_field',
              fields: [
                { field: 'id_usuario', type: 'hidden', },
                {
                  field: 'username', type: 'text', label: 'Usuario', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5 wp50' },
                },
                {
                  field: 'email', type: 'email', label: 'Correo electronico', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5 wp80' },
                },
                {
                  field: 'password', type: 'password', label: 'Password', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5 wp50' },
                },
                {
                  field: 'nombres', type: 'text', label: 'Nombres', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5 wp80' },
                },
                {
                  field: 'apellidos', type: 'text', label: 'Apellidos', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5 wp80' },
                },
                {
                  field: 'id_rol', type: 'select', label: 'Rol', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5 wp50' },
                },
                {
                  field: 'estado_usuario', type: 'select', label: 'Estado', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5 wp50' },
                },
                {
                  field: 'numero_celular', type: 'text', label: 'Núm. de Celular', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5 wp50' },
                },

              ]
            },
            {
              html_parent: '[__fields_datos_operador]',
              title_section: 'Datos del Operador Minero',
              text_section: '',
              class: { text: "mb10", section: "mb15", title: "" },
              attr_field: '__rg_field',
              fields: [
                {
                  field: 'razon_social', type: 'text', label: 'Razon Social', placeholder: '', title: '', help: '',
                  required: false, grid_column_span: 2, class: { bloque:'', group: 'has-system', label: 'form-label', icon: '', input: 'form-input p5 wp80' },
                },
                {
                  field: 'nit', type: 'text', label: 'NIT', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: 'has-system', label: 'form-label', icon: '', input: 'form-input p5 wp50' },
                },
              ]
            },
            {
              html_parent: '[__fields_datos_nim]',
              title_section: '',
              text_section: '',
              class: { text: "mb10", section: "mb15", title: "" },
              attr_field: '__op_field',
              fields: [
                {
                  field: 'nim', type: 'text', label: 'NIM', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: '', label: 'form-label', icon: '', input: 'form-input p5 wp90' },
                },
                {
                  field: 'id_municipio', type: 'select', label: 'Municipio', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: '', label: 'form-label', icon: '', input: 'form-input p5 wp90' },
                },
                {
                  field: 'id_formulario', type: 'select', label: 'Tipo de Formulario', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: '', label: 'form-label', icon: '', input: 'form-input p5 wp90' },
                },
              ]
            },
          ],
          // columns_fields: ['user_login', 'first_name', 'last_name', 'fecha_nac', 'departamento'],
        },
        listasPredefinidas: {
          estadosUsuario: ['ACTIVO', 'INACTIVO'],
        },
        /** Crea toda todas las secciones y sus filds */
        create_fields: (sections) => {
          _.forEach(sections, (sec) => {
            let contenedor = $(sec.html_parent);
            /* Cabecera de cada Seccion Titulo y Texto*/
            let sectionContainer = $(/*html*/`<div __section_container class="${sec.class.section}"></div>`);
            sectionContainer.append(/*html*/ `<h4  __title_section class="${sec.class.title}" style="">${sec.title_section}</h4>`);
            sectionContainer.append(/*html*/ `<div __text_section class="fs13 ${sec.class.text}">${sec.text_section}</div>`);

            let htmlFields = '';
            _.forEach(sec.fields, (field) => {

              field.class = (field.class) ? field.class : {};
              /* Todos los fields estan para reaccionar al Grid , para volver al estilo clasico descomentar form-horizontal y form-group. etc*/

              if (field.type == 'hidden') {
                htmlFields += /*html*/`
                                    <div class="section hidden">
                                            <input class="hidden" id="${field.field}" ${sec.attr_field}="${field.field}" name="${field.field}" >
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
                            <input type="${field.type}" class="${field.class.input || ''} form-control pl10 " id="${field.field}" ${sec.attr_field}="${field.field}" name="${field.field}"
                            placeholder="${field.placeholder}" title="${field.title}" ${field.required ? 'required' : ''} autocomplete="off"  >
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
                            <select class="${field.class.input || ''} form-control pl10 col-xs-9  " id="${field.field}" ${sec.attr_field}="${field.field}" name="${field.field}"
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
        /**Iniciañizalos Selects */
        inicializaControles: () => {
          let optsEstadosUsuario = xyzFuns.generaOpcionesArray(regmodel.listasPredefinidas.estadosUsuario);
          $("[__rg_field=estado_usuario]").html(optsEstadosUsuario);
          $("[__rg_field=estado_usuario] option")[0].selected =  true; /** inicializa en la primera opcion que es Activo */
          
          /** ROLES */
          // http.send('post', `${ctxG.rutabase}/datafrom`, { t: 'roles', o: 'id desc' },  (res) => {
          //   let opts = xyzFuns.generaOpciones(res.data, 'id', 'descripcion');
          //   $("[__rg_field=id_rol]").html(opts).val(""); /* inicializa en vacio para que se seleccione */
          // });
          $.post(`${ctxG.rutabase}/datafrom`, cmp.uAuth.addToken({ t: 'roles', o: 'id desc' }), (res) => {
            let opts = xyzFuns.generaOpciones(res.data, 'id', 'descripcion');
            $("[__rg_field=id_rol]").html(opts).val(""); /* inicializa en vacio para que se seleccione */
          });

          /* tipos de formulario */
          $.post(`${ctxG.rutabase}/datafrom`, cmp.uAuth.addToken({ t: 'formularios', w:[` estado_formulario = 'ACTIVO' `], o: 'id' }), (res) => {
            let opts = xyzFuns.generaOpciones(res.data, 'id', 'nombre');
            $("[__op_field=id_formulario]").html(opts).val(""); /* inicializa en vacio para que se seleccione */
          });

          /*  municipios*/
          $.get(`${ctxG.rutabase}/municipiosch`, cmp.uAuth.addToken({})  ,(res) => {
            ctxG.municipios = res.data;
            let opts = xyzFuns.generaOpciones(res.data, 'id_municipio', 'municipio');
            $("[__op_field=id_municipio]").html(opts).val(""); /* inicializa en vacio para que se seleccione */
          });

        },
        /** Crea el formulario e inicializa los selects*/
        renderForm: () => {
          let sections = regmodel.model.sections;
          regmodel.create_fields(sections);
          regmodel.inicializaControles();
        },
        /* verifica los campos requeridos devuelve array con campos que no cumplen, o si all cumple array vacio*/
        noCumplenValidacion: (container, selectorFieds) => {
          let noCumplen = [];
          $(`${container} ${ selectorFieds }[required]`).removeClass(regmodel.model.classError);

          // verifica los inputs y textareas
          _.forEach($(`${container} ${selectorFieds}[required]`), function(elemInput){
            let tagHlml = $(elemInput).prop("tagName").toLowerCase();
            if (tagHlml == 'input' || tagHlml == 'textarea' || tagHlml == 'select')
              if ($(elemInput).val() == null || $(elemInput).val().trim() == '') {
                noCumplen.push($(elemInput).attr('id'));
                $(elemInput).addClass(regmodel.model.classError);
              }            
          })   

          /* personalizado para tabla nims*/
          if(selectorFieds == '[__nims_operador]'){
            if($(`${container} ${selectorFieds}[required] table tbody tr:visible`).length == 0){
              noCumplen.push('numero_NIM');
              $(selectorFieds).addClass(regmodel.model.classError);
            }
          }

          return  noCumplen;
        }


      }

      let conT: any = {
        dt: {},
        selectedRow: {},

        cargarDatos: function () {
          xyzFuns.spinner();
          $.get(`${ctxG.rutabase}/get-usuarios`, cmp.uAuth.addToken({}), (resp) => {
            ctxG.usersList = resp.data;
            conT.fillDataT();
            xyzFuns.spinner(false);
          });
        },
        fillDataT: function () {
          /* Aqui se configura el DT y se le asigna al Contenedor*/
          conT.dt = $(ctxG.dataTableTarget).DataTable({
            destroy: true,
            data: ctxG.usersList,
            autoWidth: true,
            order: [4, 'asc'],
            // info:true,
            scrollX: true,
            className: 'fs-10',
            columns: [
              // {title: 'Ejemplo', data: 'ejemplo', width: '50% | 600', className: 'dt-right dt-head-center dt-body-left', type:'num',},
              {
                title: '_',
                render: function (data, type, row, meta) {
                  return /*html*/`
                        <span  class="cursor p3" title="Editar" __accion="editar"  __id_usuario=${row.id_usuario} >
                            <i class="fa-solid fa-user-pen fa-lg ${row.estado_usuario == 'ACTIVO' ? 'text-success-20' : 'text-danger-20'}  "></i> <span class="hide">${row.estado_usuario}</span>
                        </span>`
                }
              },
              {
                title: 'SMS', "orderable": "false", visible: false,
                render: function (data, type, row, meta) {
                  return /*html*/`
                            <input type="checkbox" __sms __id_usuario=${row.id_usuario} __numero_celular=${row.numero_celular} __concat="${row.username}  (${row.numero_celular})" >`
                }
              },
              {
                title: 'Usuario', data: 'username', type: 'html',
                render: function (data, type, row, meta) {
                  return /*html*/`<span __accion="editar"  __id_usuario=${row.id_usuario}  style="display:block; background-color:${row.estado_usuario == 'ACTIVO' ? '#edf5ff' : '#fff0f0'}" class="ph5 text-dark cursor">
                                    <b>${row.username}</b>
                                  </span>`
                }
              },
              { title: 'Rol',  data: 'rol' },
              { title: 'Apellidos', data: 'apellidos', width: '120', },
              { title: 'Nombres ', data: 'nombres', width: '120' },
              { title: 'Razon Social', data: 'razon_social', width: '200' },
              {
                title: 'Fecha Registro', data: 'fecha_registro', 
                render: function (data, type, row, meta) {
                  return (row.fecha_registro != null && row.fecha_registro != "") ? moment(row.fecha_registro).format('DD/MM/YYYY') : "";
                }
              },
              { title: 'Email', data: 'email', },
              { title: 'Celular', data: 'numero_celular', },
            ],
            language: xyzFuns.dataTablesEspanol(),
          });
        },
        refreshDataT: () => {
          conT.dt.clear().destroy();
          conT.cargarDatos();
        },
        refreshRow: (rowData) => {
          conT.dt.row(conT.selectedRow).data(rowData).invalidate()
        }

      }

      let funs = {
        crearFormulario: () => {
          regmodel.create_fields(regmodel.model.sections);
          regmodel.inicializaControles();
          
        },

        /** opciones propias de la venta de Datos Nim */
        functionsNims: {
          /* Obtiene los datos del formulario Datos nim op_field */
          getDatosNimFromFields: ()=> {
            let objDataNims = xyzFuns.getData__fields('__op_field');

            objDataNims.id_formulario        =  $("[__op_field=id_formulario]").val();
            objDataNims.tipo_formulario_nombre =  $('[__op_field=id_formulario]').find(":selected").text();

            let municipioSelected = _.find(ctxG.municipios, item => item.id_municipio == objDataNims.id_municipio);
            objDataNims.municipio = municipioSelected.municipio;
            objDataNims.codigo_municipio = municipioSelected.codigo_municipio;

            objDataNims.estado_nim = 'ACTIVO';
            return objDataNims;
          },
          /* Agrega las opciones del NIM al cuadro  */
          agregaDatosNim: () => {
            let noCumplenValidacion = regmodel.noCumplenValidacion('[__fields_datos_nim]', '[__op_field]');
            if(noCumplenValidacion.length > 0)
              return;
              
            let objDatosNim = funs.functionsNims.getDatosNimFromFields();
            let row = funs.functionsNims.agregaRowDatosNim(objDatosNim); 
                    
            $("[__wrapper_datos_nim]").toggle(200);
          },
          /* Genera el htmlpara agregar al cuadro / tabla de Nims del operador */
          agregaRowDatosNim: (obj) => {
            let row = /*html*/`
                      <tr __id="${obj.id || ''}" __nim="${obj.nim}" __id_municipio="${obj.id_municipio}"  
                          __id_formulario="${obj.id_formulario}"  __estado_nim="${obj.estado_nim}"  class="" style="border-bottom: 1px solid #ccc">
                        <td class="p5">${obj.nim}</td>  
                        <td class="p5">${obj.municipio}</td>  
                        <td class="p5">${obj.codigo_municipio}</td>  
                        <td class="p5">${obj.tipo_formulario_nombre}</td>  
                        <td class="p5"><span __accion_datos_nim=quitar class="fa fa-trash ph5 cursor "></span></td>  
                      </tr>`;
            $("[__nims_operador] table tbody").append(row);              
          },
          /* Obtiene la informacion de los nims asociados a un operador */
          getNims: () => {
            let objNims = [];
            _.forEach($("[__nims_operador]  tr[__nim]"), (row) => {
              let elemRow = $(row);
              let obj: any = {};
              obj.id              = elemRow.attr("__id");
              obj.nim             = elemRow.attr("__nim");
              obj.id_municipio    = elemRow.attr("__id_municipio");
              obj.id_formulario   = elemRow.attr("__id_formulario");
              obj.estado_nim      = elemRow.attr("__estado_nim");

              objNims.push(obj);
            });
            return objNims;

          },
          /** Coloca los datos nis asociados de un usuario operador */
          setNims: (nims) => {
            _.forEach(nims, (item) => {
              funs.functionsNims.agregaRowDatosNim(item);
            })
          },
          limpiarFieldsNims: ()=>{
            $("[__op_field]").val('').removeClass('br-a br-danger');
          }

        },
        /** Obtiene todala info de un usuario, si es operador sus campos y sus nims asociados */
        getData:  () => {
          let objeto = xyzFuns.getData__fields('__rg_field');

          //* Se verifica si los tiposl password han cambiado*/
          _.forEach($('[__rg_field][type=password]'), function (pass) {
            if ($(pass).val() == $(pass).attr('paraverificarcambio')) {
              let field = $(pass).attr('__rg_field');
              /* Solo se envia si se modifico el password */
              delete objeto[field];
            }
          })
          /** En caso de usuario no operador no se envia ni razon_social ni nit */
          if ($("[__rg_field=id_rol]").val() != ctxG.id_rol_operador){
            delete(objeto.razon_social);
            delete(objeto.nit);
            return objeto;
          }
          objeto.nims = funs.functionsNims.getNims();
          return objeto;
        },

        setData: function (obj) {
          xyzFuns.setData__fields(obj, '__rg_field');

          $("[__rg_field][type=password]").val('este no es el password ')
          $("[__rg_field][type=password]").attr('paraverificarcambio', $("[__rg_field][type=password]").val());

          funs.functionsNims.setNims(obj.nims);
        },
        /** Para usuario nuevo muestramodal vacio */
        nuevo: () => {
          $("#modal [__titulo] span").html(`Agregar usuario`);
          xyzFuns.showModal(ctxG.modal);
        },
        /** MuestraModal con datos del usuario  */
        editar: (id) => {
          let id_usuario = id;
          xyzFuns.spinner();
          $.post(ctxG.rutabase + '/get-user', cmp.uAuth.addToken({ id_usuario: id_usuario }), (resp) => {
            let user = resp.data;
            funs.setData(user);
            $("#modal [__titulo] span").html(`Modificar Usuario`);
            xyzFuns.showModal(ctxG.modal);
            /* Muestra la parte de operador o no, segun id_rol*/
            (user.id_rol == ctxG.id_rol_operador) ? $("[__wrapper_operador]").show() : $("[__wrapper_operador]").hide();
            xyzFuns.spinner(false)
          })
        },
        /** Guarda al usuario */
        saveData: () => {          
          let obj = funs.getData();
          let cumpleRequireds = true;
          if(obj.id_rol != ctxG.id_rol_operador)
            cumpleRequireds =  regmodel.noCumplenValidacion('[__fields_datos_usuario]', '[__rg_field]').length == 0;
          /* Si es operdor */
          else{
            cumpleRequireds = regmodel.noCumplenValidacion(ctxG.modal, '[__rg_field]').length == 0 && regmodel.noCumplenValidacion(ctxG.modal, "[__nims_operador]").length == 0;
          }
          /* Comprueba si el nim asigando es vacio*/
          if (!cumpleRequireds){
            xyzFuns.alertMsg("[__error]", `Se deben llenar los campos requeridos`, ' alert-danger br-a br-danger pastel   fs14 p5  mv10', '', '', true);
            return;          
          }
          xyzFuns.spinner();
          $.post(ctxG.rutabase + '/save-user', cmp.uAuth.addToken(obj), function (resp) {
            if(resp.status=='error'){
              xyzFuns.alertMsg("[__error]", `Error: ${resp.msg}`, ' alert-danger br-a br-danger pastel   fs14 p5  mv10', '', '', true);
            }
            // obj.id_usuario ? conT.refreshRow(resp.data) : conT.refreshDataT();
            conT.refreshDataT();
            xyzFuns.spinner(false);
            new PNotify({
              title: resp.status== 'ok' ? 'Guardado' : 'Error',
              text: resp.msg,
              shadow: true,
              opacity: 0.9,
              type: (resp.status== 'ok') ? "success" : "danger",
              delay: 1500
            });
            xyzFuns.closeModal();
          });

        },
        limpiarModal: () => {
          $(`${ctxG.modal} [__rg_field]`).val('').removeClass('br-a br-danger');
          $(`${ctxG.modal} [__op_field]`).val('').removeClass('br-a br-danger');;
          funs.functionsNims.limpiarFieldsNims();
          $("[__nims_operador] table tbody").html('');
          $("[__wrapper_operador]").hide();
          
          /* Quita las clases de error en todos los campos requeridos  */
          $("[required]").removeClass(regmodel.model.classError);
          xyzFuns.alertMsgClose('[__error]');

        },
        panelSMS() {
          ctxG.smsList = [];
          let checkeds = $(`${ctxG.dataTableTarget}`).find("[__sms]:checked");
          let destinatarios = "";
          _.forEach(checkeds, function(user){
            destinatarios += $(user).attr('__concat') + ', ' ;
            let cel = $(user).attr('__numero_celular');
            if (cel && (cel.length == 8 || cel.length == 11))
              ctxG.smsList.push(cel);
          })
          let op: any = {
            background_color: '#00000060',
            class_icon: '',
            class_texto: '',
            texto: /*html*/`
                <div class="panel mn"   style="">
                  <div class="panel-heading h-50 bg-marron--20 bg-system_ bg-success--40_ bg-666_ text-fff _darker">
                    <h5><i class="fa fa-send mr10"></i>Enviar Notificaciónes SMS</h5>           
                    <span class="glyphicons glyphicons-remove_2 p3 close fs15" style="position: absolute; top: 5px; right: 10px; color: inherit; text-shadow: none; opacity: 0.8"></span>     
                  </div>
                  <div class="panel-body">
                    <div>Destinatarios</div>
                    <div __sms_destinatarios class="p20 fs14 bg-light text-center_ text-primary--60" style="text-align:justify; border-bottom: 1px solid #afafaf;" >
                        ${destinatarios}
                    </div>
                    <div>Mensaje <span __sms_contador></span></div>
                    <div>
                      <textarea __sms_mensaje class="wp100 "></textarea>
                    </div>
                    <div class="flex justify-evenly p10">
                      <button __accion="close_panel_sms" class="btn bg-eee ph20 br6 br-a br-dark fs14"> Cerrar</button>
                      <button __accion="send_sms" class="btn btn-primary ph20 br6 br-a br-dark fs14"><i class="glyphicons glyphicons-ok"></i> Enviar SMS</button>
                    </div>
                  </div>
                </div>`
          }
          let alert = /*html*/`
                    <div __alert style="display:none; z-index: 99000"> 
                      <div class="flex justify-center align-center wp100 " style="height: 100vh; z-index: 99000; position: fixed; top: 0px; left: 0vw; 
                      background-color: ${op.background_color} ">
                        <div class="flex justify-center align-center br3"style="  width: calc(300px + 25vw); max-width: 90%; 
                          background-color: #f4f4f8; box-shadow: 0px 0px 8px 0px #0000004a; position: relative; top: -50px">                        
                              ${op.texto}
                        </div>
                      </div>
                    </div> `;
          $(ctxG.contenedor).append(alert);
          $("[__alert]").show(300);
        },
        sendSMS(){
          let mensaje = $("[__sms_mensaje]").val().substring(0, 48);

          _.forEach(ctxG.smsList, function(cel){
            $.post(`${ctxG.rutabase}/sms`, cmp.uAuth.addToken({ mensaje: mensaje, numero_celular: cel }), (res) => {
              console.log('respuesta_server', res);
            });
          })
          new PNotify({
            title:'Enviando SMS',
            text: 'Se estan enviando los mensajes',
            shadow: true,
            opacity: 0.9,
            type: "success",
            delay: 2500
          });
          $("[__accion=close_panel_sms]").trigger('click');
        }
      }

      //-------------------- Listeners  --------------------------------

      let listen = () => {
        /* DEL CONTENEDOR */
        $(ctxG.contenedor)
          /** Click en botones de accion como editar nuevo */
          .on('click', '[__accion]', (e) => {
            let accion = $(e.currentTarget).attr('__accion');
            funs.limpiarModal();
            if (accion == 'nuevo')
              funs.nuevo();
            if (accion == 'editar') {
              let id = $(e.currentTarget).attr('__id_usuario');
              funs.editar(id)
            }
            if (accion == 'habilitar_sms') {
              $('[__accion=abrir_panel_sms]').toggle(400);
              let column = $(ctxG.dataTableTarget).DataTable().column(1);
              column.visible(!column.visible());
            }
            if (accion == 'abrir_panel_sms') {
              funs.panelSMS();
            }
            if (accion == 'send_sms') {
              funs.sendSMS();
            }
            if (accion == 'close_panel_sms') {
              $(e.currentTarget).closest("[__alert]").remove();
            }
          })

        
        /** DEL MODAL */
        $(ctxG.modal)
          /** Cambiar el rol se habiliota cuadro de operador minero si es idrol ctxG.id_rol_operador */
          .on('change', '[__rg_field=id_rol]', (e) => {
            let id_rol_selected = parseInt($(e.currentTarget).val());
            (id_rol_selected == ctxG.id_rol_operador) ? $("[__wrapper_operador]").show(400) : $("[__wrapper_operador]").hide(400);
          })

          /** Al hacer click en botones para agregar opciones del numero nim , se abre o se cierra el cuadro de agregar numero nim */
          .on('click', "[__accion_datos_nim]", (e) => {
            let accion_datos_nim = $(e.currentTarget).attr('__accion_datos_nim');

            if (accion_datos_nim == 'nuevo_nim' || accion_datos_nim == 'cerrar_nim'){
              $("[__wrapper_datos_nim]").toggle(200);
              funs.functionsNims.limpiarFieldsNims();
            }

            if(accion_datos_nim == 'aceptar_nim')
              funs.functionsNims.agregaDatosNim();
            /* Click en el icono de eliminar quita la fila,  */
            if(accion_datos_nim == 'quitar'){
              let row = $(e.currentTarget).closest('tr');
              (_.isEmpty($(row).attr('__id'))) ? $(row).remove() :  $(row).hide().attr('__estado_nim','ELIMINADO');
            }            
          })

          /* Cancel Modal*/
          .on('click', "[__cerrar]", () => {
            xyzFuns.closeModal();
          })

          .on('click', "[__save]", () => {
            funs.saveData();
          })
          /* del alert */
          .on('click', "[__alert_msg] .close", (e) => {
            $(e.currentTarget).closest('[__alert_msg]').remove();
          })
          


      }

      /**
       * Inicializa 
       */  
      let init = () => {
        conT.cargarDatos();
        funs.crearFormulario();
      }

      listen();
      init();
    })
  };


}
