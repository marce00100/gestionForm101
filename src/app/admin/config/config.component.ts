import { Component, OnInit } from '@angular/core';
import { UAuthService } from 'src/app/shared/uauth.service';
declare var $: any;
declare var _: any;
declare var xyzFuns: any;
declare var PNotify: any;
declare var DataTable:any;
declare var moment: any;

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: [],
})
export class ConfigComponent implements OnInit {

  constructor(private uAuth: UAuthService) { }

  ngOnInit() {
    this.config();
  }

  config() {
    let cmp = this;
    $(function(){

      let ctxG: any = {
        rutabase: xyzFuns.urlRestApi,
        contenedor: '#config_content',
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
              html_parent: '[__fields_config]',
              title_section: 'Parametros de Configuración',
              text_section: 'No cambie esta configuración si no está completamente seguro.',
              class: { text: "mb10", section: "mb20", title: "" },
              attr_field: '__rg_field',
              fields: [
              ]
            },
          ],
          // columns_fields: ['user_login', 'first_name', 'last_name', 'fecha_nac', 'departamento'],
        },
        listasPredefinidas: {
          estados: [{ key: 1, value: 'ACTIVO' }, { key: 0, value: 'INACTIVO' }],
        },

        /** Crea toda todas las secciones y sus fields */
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
                  <div class="form-group  ${field.class.group || ''} mbn ">
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
          $(`${container} ${selectorFieds}[required]`).removeClass(regmodel.model.classError);

          // verifica los inputs y textareas
          _.forEach($(`${container} ${selectorFieds}[required]`), function (elemInput) {
            let tagHlml = $(elemInput).prop("tagName").toLowerCase();
            if (tagHlml == 'input' || tagHlml == 'textarea' || tagHlml == 'select')
              if ($(elemInput).val() == null || $(elemInput).val().trim() == '') {
                noCumplen.push($(elemInput).attr('id'));
                $(elemInput).addClass(regmodel.model.classError);
              }
          })

          /* personalizado para tabla nims*/
          if (selectorFieds == '[__nims_operador]') {
            if ($(`${container} ${selectorFieds}[required] table tbody tr:visible`).length == 0) {
              noCumplen.push('numero_NIM');
              $(selectorFieds).addClass(regmodel.model.classError);
            }
          }

          return noCumplen;
        }
      }


      let funs = {
        crearFormulario: () => {

          /** muestra u oculta si esta habilitado Para los formularios disponibles */
          $.post(ctxG.rutabase + '/params-activos-dominio', cmp.uAuth.addToken({ dominio: 'config' }), (resp) => {
            funs.crear_array_configfields(resp.data);
            regmodel.create_fields(regmodel.model.sections);
            funs.inicializa_ConfigFieldsControls();
            funs.setData_configFields(resp.data);

          })
          
        },
        /** Crea el array de fields a traves de la BD de la tabla parametros del dominio config */
        crear_array_configfields: (arrayObj) => {
          _.forEach(arrayObj, (obj) => {
            let exampleField = {
              field: 'xxx', type: 'text', label: 'xxx', placeholder: '', title: '', help: '',
              required: true, grid_column_span: 2, class: { bloque: '', group: 'has-primary', label: 'form-label', icon: '', input: 'form-input p5 wp50' },
            };
            let field = exampleField;//_.clone(exampleField);
            field.field = obj.nombre;
            field.label = obj.label;
            field.title = obj.descripcion;
            if(obj.nombre == 'comprar_formularios')
              field.type = 'select';
            regmodel.model.sections[0].fields.push(field);
          });
        },
        /** inicializa loscombos u otros controles */
        inicializa_ConfigFieldsControls: () => {
          let estadosComprarFormularios = regmodel.listasPredefinidas.estados;
          let opts = xyzFuns.generaOpciones(estadosComprarFormularios, 'key', 'value');
            $("[__rg_field=comprar_formularios]").html(opts).val(""); /* inicializa en vacio para que se seleccione */
        },
        /** Coloca los valores de los campos de los parameros dominio config */
        setData_configFields: function (arrObj) {
          _.forEach(arrObj, (obj) => {
            $(`[__rg_field=${obj.nombre}]`).val(obj.valor);
          })
        },

        /** Obtiene todala info de un usuario, si es operador sus campos y sus nims asociados */
        getData:  () => {
          let objeto = xyzFuns.getData__fields('__rg_field');
          return objeto;
        },

        /** Guarda al usuario */
        saveData: () => {          
          let objConfigs = funs.getData();
          let cumpleRequireds = true;

          /* Comprueba si el nim asigando es vacio*/
          if (!cumpleRequireds){
            xyzFuns.alertMsg("[__error]", `Se deben llenar los campos requeridos`, ' alert-danger br-a br-danger pastel   fs14 p5  mv10', '', '', true);
            return;          
          }
          xyzFuns.spinner();
          $.post(ctxG.rutabase + '/save-configs', cmp.uAuth.addToken({ config: objConfigs }), function (resp) {
            if(resp.status=='error'){
              xyzFuns.alertMsg("[__error]", `Error: ${resp.msg}`, ' alert-danger br-a br-danger pastel   fs14 p5  mv10', '', '', true);
            }

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

      }

      //-------------------- Listeners  --------------------------------

      let listen = () => {
        /* DEL CONTENEDOR */
        $(ctxG.contenedor)
          /** Click en botones de accion como editar nuevo */
          .on('click', '[__accion]', (e) => {
            let accion = $(e.currentTarget).attr('__accion');

            if (accion == 'save') {
              funs.saveData();
            }
          })
      }

      /**
       * Inicializa 
       */  
      let init = () => {
        funs.crearFormulario();
      }

      listen();
      init();

    })


  }

}
