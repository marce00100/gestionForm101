import { Component, OnInit } from '@angular/core';
import { UAuthService } from 'src/app/shared/uauth.service';
declare var $: any;
declare var _: any;
declare var xyzFuns: any;
declare var PNotify: any;
declare var DataTable:any;
declare var moment: any;
declare var summernote: any;

@Component({
  selector: 'app-gestion-contenidos',
  templateUrl: './gestion-contenidos.component.html',
  // styleUrls: ['./gestion-contenidos.component.scss'],
})
export class GestionContenidosComponent implements OnInit {

  constructor(private uAuth: UAuthService) { }

  ngOnInit() {
    this.contenidos();
  }

  contenidos() {
    let cmp = this;
    $(function () {
      
      let ctxG: any = {
        rutabase: xyzFuns.urlRestApi,
        content: '#content',
        modal: "#modal",
        dataTableTarget: "#dataT",
        dataList: [],
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
              html_parent: '[__fields]',
              title_section: 'Datos contenido',
              text_section: '',
              class: { text: "mb10", section: "mb20", title: "" },
              attr_field: '__rg_field',
              fields: [
                { field: 'id_contenido', type: 'hidden', },
                {
                  field: 'titulo', type: 'text', label: 'Título', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5 wp100' },
                },
                {
                  field: 'imagen', type: 'text', label: 'Url de Imagen visible', placeholder: '', title: '', help: '',
                  required: false, grid_column_span: 2, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5 wp100' },
                },
                {
                  field: 'prioridad', type: 'select', label: 'Prioridad', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 1, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5 wp100' },
                },
                {
                  field: 'estado_contenido', type: 'select', label: 'Estado', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 1, class: { bloque:'', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5 wp100' },
                },

              ]
            },
          ],
        },
        listasPredefinidas: {
          estados: ['ACTIVO', 'INACTIVO'],
          prioridad: [{ 'key': 1, 'text': 'ALTA' }, { 'key': 2, 'text': 'MEDIA' }, { 'key': 3, 'text': 'BAJA' }],
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

        },
        /**Iniciañizalos Selects */
        inicializaControles: () => {
          let optsEstados = xyzFuns.generaOpcionesArray(regmodel.listasPredefinidas.estados);
          $("[__rg_field=estado_contenido]").html(optsEstados);
          $("[__rg_field=estado_contenido] option")[0].selected =  true; /** inicializa en la primera opcion que es Activo */

          let prioridad = xyzFuns.generaOpciones(regmodel.listasPredefinidas.prioridad, 'key', 'text');
          $("[__rg_field=prioridad]").html(prioridad);
          $("[__rg_field=prioridad] option")[0].selected =  true; 
          
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
          funs.spinner();
          $.post(`${ctxG.rutabase}/get-contents`, cmp.uAuth.addToken({ estado: 'ALL' }), (resp) => {
            ctxG.dataList = resp.data;
            conT.fillDataT();
            funs.spinner(false);
          });
        },
        fillDataT: function () {
          /* Aqui se configura el DT y se le asigna al Contenedor*/
          conT.dt = $(ctxG.dataTableTarget).DataTable({
            destroy: true,
            data: ctxG.dataList,
            autoWidth: true,
            // info:true,
            scrollX: true,
            className: 'fs-10',
            columns: [
              // {title: 'Ejemplo', data: 'ejemplo', width: '50% | 600', className: 'dt-right dt-head-center dt-body-left', type:'num',},
              {
                title: '_', width:'100', className: 'dt-head-center', 
                render: function (data, type, row, meta) {
                  return /*html*/`<span __accion="editar"  __id_contenido=${row.id_contenido} 
                                style="display:block; "class="p5 cursor ${row.estado_contenido == 'ACTIVO' ? 'text-success-20' : 'text-danger-20'}  " title="Editar">
                                <i class="glyphicon glyphicon-paperclip fa-lg "></i> ${row.estado_contenido}</span>`
                }
              },
              {
                title: 'Fecha Registro', data: 'fecha_registro', 
                render: function (data, type, row, meta) {
                  return (row.fecha_registro != null && row.fecha_registro != "") ? moment(row.fecha_registro).format('DD/MM/YYYY') : "";
                }
              },
              {
                title: 'Titulo', data: 'titulo', width: '200', className: 'dt-head-center' 
              },
              {
                title: 'Imagen', data: 'imagen', className: 'dt-head-center',
                render: function (data, type, row, meta) {
                  return row.imagen && row.imagen.length > 0 ? `<img src='${row.imagen}' alt="NO" style="width:100px" >` : '';
                }
              },
              // { title: 'Estado ', data: 'estado_contenido', },
              { title: 'Prioridad', data: 'prioridad', },
              { title: 'Contenido', data: 'texto_cortado', width: '250', className: 'dt-head-center' },
              
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

          $('[__rg_field=texto]').summernote({
            height: 350, //set editable area's height
            minHeight: 350,
            focus: false, //set focus editable area after Initialize summernote
            toolbar: [
              ['style', ['style', 'bold', 'italic', 'underline', 'clear']],
              ['font', ['strikethrough']],
              ['fontsize', ['fontsize']],
              ['color', ['color']],
              ['para', ['ul', 'ol', 'paragraph']],
              ['height', ['height']],
              ['insert', ['link', 'picture', 'video']],
              ['table', ['table']],
              ['view', ['codeview']]
            ],
            oninit: function () { },
            onChange: function (contents, $editable) { },

          });
          
        },

        /** Obtiene toda la info de un contenido,  */
        getData:  () => {
          let data = xyzFuns.getData__fields('__rg_field');
          data.texto = $("[__rg_field=texto]").summernote('code');
          return data;
        },

        setData: function (obj) {
          xyzFuns.setData__fields(obj, '__rg_field');
          $('[__rg_field=texto]').summernote('code', obj.texto);

        },
        /** Para  nuevo muestramodal vacio */
        nuevo: () => {
          $("#modal [__titulo] span").html(`Crear Contenido`);
          xyzFuns.showModal(ctxG.modal);
        },
        /** MuestraModal con datos del contenido  */
        editar: (id) => {
          let id_contenido = id;
          funs.spinner();
          $.post(ctxG.rutabase + '/get-content', cmp.uAuth.addToken({ id_contenido: id_contenido }), (resp) => {
            let data = resp.data;
            funs.setData(data);
            $("#modal [__titulo] span").html(`Modificar Contenido`);
            xyzFuns.showModal(ctxG.modal);
            funs.spinner(false)
          })
        },
        /** Guarda al contenido */
        saveData: () => {          
          let obj: any = funs.getData();
          let cumpleRequireds = true;
          cumpleRequireds = regmodel.noCumplenValidacion('[__fields]', '[__rg_field]').length == 0;

          /* Comprueba si el nim asigando es vacio*/
          if (!cumpleRequireds){
            xyzFuns.alertMsg("[__error]", `Se deben llenar los campos requeridos`, ' alert-danger br-a br-danger pastel   fs14 p5  mv10', '', '', true);
            return;          
          }
          funs.spinner();
          $.post(ctxG.rutabase + '/save-content', cmp.uAuth.addToken(obj), function (resp) {
            if(resp.status=='error'){
              xyzFuns.alertMsg("[__error]", `Error: ${resp.msg}`, ' alert-danger br-a br-danger pastel   fs14 p5  mv10', '', '', true);
            }
            // obj.id_contenido ? conT.refreshRow(resp.data) : conT.refreshDataT();
            conT.refreshDataT();
            funs.spinner(false);
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
          $(`${ctxG.modal} [__op_field]`).val('').removeClass('br-a br-danger');
          
          /* Quita las clases de error en todos los campos requeridos  */
          $("[required]").removeClass(regmodel.model.classError);
          xyzFuns.alertMsgClose('[__error]');

        },
        spinner: (obj = {}) => {
          xyzFuns.spinner(obj, ctxG.content)
        }
      }

      //-------------------- Listeners  --------------------------------

      let listen = () => {
        /* DEL CONTENEDOR */
        $(ctxG.content)
          /** Click en botones de accion como editar nuevo */
          .on('click', '[__accion]', (e) => {
            let accion = $(e.currentTarget).attr('__accion');
            funs.limpiarModal();
            if (accion == 'nuevo')
              funs.nuevo();
            if (accion == 'editar') {
              let id = $(e.currentTarget).attr('__id_contenido');

              funs.editar(id)
            }
          })

          /** Click sobre una FILA DELA TABLA para en caso de edicion solo afectar a la fila seleccionada */
          .on('click', 'tr', (e) => {
            conT.selectedRow = e.currentTarget;
          });
        
        /** DEL MODAL */
        $(ctxG.modal)

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
