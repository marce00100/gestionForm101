import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var _: any;
declare var xyzFuns: any;
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles: [
  ]
})
export class FormComponent implements OnInit {

  constructor() { }


  ngOnInit(): void {

    this.form();

  }


  form = function () {
    $(function () {
      let ctxG = {
        rutabase: './api',
        timeIni: new Date(), /* Para calcular tiempo*/
        municipios: [],
        cards: [],  /* Array con las cards*/
        index: 0,   /* Indice de la Card Actual*/
        pruebareal: '',  /* Si es de prueba o real*/
        tipo_form: '',  /* publico , por encuestador */
        validarCedula: true, /* Si se valida el CI con segip o no*/
        encuestado: {
          edad: 0,
          ci: '',
        }

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
              html_parent: '.__frm_datos_general',
              title_section: 'LUGAR DE RESIDENCIA HABITUAL',
              text_section: '',
              class: { text: "mb10", section: "", title: " quest-titulo" },
              fields: [
                {
                  field: 'departamento', type: 'select', label: 'Departamento', placeholder: '', title: '', help: '',
                  required: true, grid_column_span: 2, class: { group: 'has-primary', label: 'mbn ptn quest-label', icon: '', input: 'quest-input-label p5' },
                },
                {
                  field: 'municipio', type: 'select', label: 'Municipio', placeholder: '', title: '', help: '',
                  required: false, grid_column_span: 2, class: { group: 'has-primary', label: 'mbn ptn quest-label', icon: '', input: 'quest-input-label p5' },
                },
              ]
            },
            // {
            //     html_parent : '[__frm_info_opcional_contenedor]',
            //     title_section: '',//'INFORMACIÓN ADICIONAL (opcional)',
            //     text_section: '',
            //     class: { text:"mb10", section:"", title:" quest-titulo"},
            //     fields:[
            //         {
            //             field: 'id_contestado', type: 'hidden', 
            //         },
            //         {
            //             field: 'nombre_apellido', type: 'text', label: 'Nombres y Apellidos (opcional)', placeholder: '', title: '', help: '',
            //             required: false, grid_column_span: 2, class: { group: 'has-primary', label: 'mbn ptn quest-label', icon: '', input: 'quest-input-label' },
            //         },                       
            //         {
            //             field: 'mail', type: 'text', label: 'Correo Electrónico y Apellidos (opcional)', placeholder: '', title: '', help: '',
            //             required: true, grid_column_span: 2, class: { group: 'has-primary', label: 'mbn ptn quest-label', icon: '', input: 'quest-input-label' },
            //         },                        
            //         {
            //             field: 'telefono', type: 'text', label: 'Número teléfono/ Celular', placeholder: '', title: '', help: '',
            //             required: false, grid_column_span: 2, class: { group: 'has-primary', label: 'mbn ptn quest-label', icon: '', input: 'quest-input-label' },
            //         },
            //     ]
            // },
          ],
          // columns_fields: ['user_login', 'first_name', 'last_name', 'fecha_nac', 'departamento'],
        },

        listasPredefinidas: {
          departamentos: ['CHUQUISACA', 'LA PAZ', 'COCHABAMBA', 'ORURO', 'POTOSÍ', 'TARIJA', 'SANTA CRUZ', 'BENI', 'PANDO'],
          // departamentos: [ 'Chuquisaca', 'La Paz', 'Cochabamba', 'Oruro', 'Potosí', 'Tarija', 'Santa Cruz', 'Beni', 'Pando'],
        },
        create_fields: (sections) => {
          _.forEach(sections, (sec) => {
            let contenedor = $(sec.html_parent);
            /* Cabecera de cada Seccion Titulo y Texto*/
            let sectionContainer = $(/*html*/`<div __section_container class="section_container ${sec.class.section}"></div>`);
            sectionContainer.append(/*html*/ `<h3  __title_section class="title_section ${sec.class.title}" style="">${sec.title_section}</h3>`);
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

              if (field.type == 'text' || field.type == 'number' || field.type == 'date' || field.type == 'password' || field.type == 'button') {
                htmlFields += /*html*/`
                                          <div class="form-horizontal ${field.class.bloque || ''} ${field.grid_column_span ? 'grid-column-span-2' : ''}" >
                                          <div class="form-group_      ${field.class.group || ''}  ">
                                              <label  class="col-xs-11 ${field.grid_column_span ? 'col-md-3' : 'col-md-4'} control-label ${field.class.label || ''}" for="${field.field}">${field.label}</label>
                                              <div    class="col-xs-11 ${field.grid_column_span ? 'col-md-8' : 'col-md-7'}">
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
                htmlFields += /*html*/`
                                          <div class="form-horizontal ${field.grid_column_span ? 'grid-column-span-2' : ''} ">
                                          <div class="form-group_     ${field.class.group}  ">
                                              <label class="col-xs-11 ${field.grid_column_span ? 'col-md-3' : 'col-md-4'} control-label ${field.class.label}" for="${field.field}">${field.label}</label>
                                              <div class="col-xs-11   ${field.grid_column_span ? 'col-md-8' : 'col-md-7'}">
                                                  <span class="append-icon left"><i class="fa fa-list-ol"></i>
                                                  </span>
                                                  <select class="form-control pl10 col-xs-9  ${field.classinput}" id="${field.field}" __rg_field="${field.field}" name="${field.field}"
                                                  title="${field.title}"  ${field.required ? 'required' : ''} style="height:auto;" ></select>
                                                  <em class="fs12 text-dark block col-xs-12">${field.help}</em>
                                              </div>
                                          </div>
                                          </div>`
              }

            });
            sectionContainer.append(/*html*/`<div __rg_fields_container class="rg_grid_form">${htmlFields}</div>`)
            $(contenedor).append(sectionContainer);
          })


          // return contenedor;
        },

        inicializaControles: () => {
          let opts = xyzFuns.generaOpcionesArray(regmodel.listasPredefinidas.departamentos, " ");
          $("[__rg_field=departamento]").html(opts);

          // $.get(`${ctxG.rutabase}/getmunicipios`, function(resp){
          //     ctxG.municipios = resp.data;
          // });

          /* Combos DIa Mes Año*/
          let dias = _.concat(['01', '02', '03', '04', '05', '06', '07', '08', '09'], _.range(10, 31 + 1));
          $('[__rg_field=fecha_nacimiento_d]').html(xyzFuns.generaOpcionesArray(dias, " "));
          /*coloca 01 02 03 etc*/
          let meses = _.map(_.range(1, 12 + 1), function (elem) { return (`${elem}`).length == 1 ? `0${elem}` : elem });
          $('[__rg_field=fecha_nacimiento_m]').html(xyzFuns.generaOpcionesArray(meses, " "));

          let anos = _.range(2012, 1920 + 1);
          $('[__rg_field=fecha_nacimiento_y]').html(xyzFuns.generaOpcionesArray(anos, " "));
        },

        renderForm: () => {
          let sections = regmodel.model.sections;
          regmodel.create_fields(sections);
          regmodel.inicializaControles();
        },

        /* verifica los campos requeridos*/
        pasaCamposRequeridos: (user) => {
          $("[__rg_field]").closest(".form-horizontal > div ").removeClass('has-error')
          let pasa = true;
          _.forEach(regmodel.model.sections, (sec) => {
            _.forEach(sec.fields, (field) => {
              if (field.required && (user[field.field] == null || user[field.field] === '')) {
                $(`[__rg_field=${field.field}]`).closest(".form-horizontal > div ").addClass('has-error');
                pasa = false;
              }
            })
          })
          return pasa;
        }
      }


      let elemhtml = {
        /* Elementos */
        pregunta_rend: /*html*/`
                          <div __card class="__elemento row  " __tipo="pregunta" __id_elemento="" __pregunta_numero __titulo_principal_seccion>                          
                              <div class="__elem_texto quest quest-pregunta  "  ></div>
                              <div class="__elem_descripcion quest quest-descripcion "  ></div>
                              <div class="__elem_respuesta pl20 col-md-12"  __tipo_respuesta="" __dependencia>
                              </div>  
                          </div>`,
        titulo_rend: /*html*/`  
                          <div p__card class="__elemento row   quest quest-titulo" __tipo="titulo" __id_elemento="">
                              <div  class=" __elem_texto " ></div>                      
                          </div>`,
        texto_rend: /*html*/`  
                          <div p__card class="__elemento row  quest quest-texto" __tipo="texto" __id_elemento="">
                              <div  class=" __elem_texto " ></div>                      
                          </div>`,
        separador_rend: /*html*/`  
                          <div class="__elemento row " __tipo="separador" __id_elemento="">
                              <hr style="margin: 10px 0;">                     
                          </div>`,

        /* tipos de respuesta*/
        respuesta_corta_rend: /*html*/` 
                              <div class="mt15 mb20">
                                      <input type="text" class="bg-white  form-control quest-input-line quest-texto __open_sm" placeholder="Escribe tu respuesta" style="width:80%"  >
                              </div>`,
        respuesta_larga_rend: /*html*/` 
                              <div class="mt15 mb20">
                                      <textarea class="bg-white  form-control quest-input-line quest-texto __open_lg" placeholder="Escribe tu respuesta" style="width:80%" rows="2"  ></textarea>
                              </div>`,

        respuesta_select_numbers_rend: /*html*/` 
                              <div class="mt15 mb20">
                                      <select class="form-control w100 ph15 __select_numbers"></select>
                              </div>`,

        respuesta_select_tres_rend: /*html*/` 
                              <div class="mt15 mb20 fs13">
                                      <span class="__select_opciones_texto_1"></span> <select class="form-control w300 ph15 __select_opciones_1" style="width: 80%"></select>
                                      <span class="__select_opciones_texto_2"></span> <select class="form-control w300 ph15 __select_opciones_2" style="width: 80%"></select>
                                      <span class="__select_opciones_texto_3"></span> <select class="form-control w300 ph15 __select_opciones_3" style="width: 80%"></select>
                              </div>
                              <div class="__no_elemento" __tipo="pregunta_oculta" __id_elemento select_tres_op2 respuesta>
                                  <div __tipo_respuesta="pregunta_oculta"></div>
                              </div> 
                              <div class="__no_elemento" __tipo="pregunta_oculta" __id_elemento select_tres_op3 respuesta>
                                  <div __tipo_respuesta="pregunta_oculta"></div>
                              </div> `,

        respuesta_seleccion_rend: /*html*/` 
                              <ul class="__opciones_respuesta mv10 pl15" style="list-style: none;"></ul>`,

        /* Opcion de seleccion*/
        opcion_seleccion_rend: /*html*/`
                              <li class="mt5 " style="display:flex; align-items: flex-start; gap: 5px" > 
                                  <input __id_opcion __opcion_texto __opcion_numero id="" type="" name="" class="" title="" value="" >
                                  <label class=" quest quest-opcion" for=""></label> 
                              </li>`,

        /* Opcion  "Otro... "*/
        opcion_otro_rend:   /*html*/`
                              <li class="mt5 " style="display:flex; align-items: flex-start; gap: 5px"> 
                                  <input  __opcion_texto="Otro" id="" type="" name="" class="" title="" value="" >
                                  <label class=" quest quest-opcion" for=""></label> 
                                  <input type="text"  __opcion_otro class="bg-white  form-control quest-input-line quest-texto hide" placeholder="Especifique ..."  style="width:50%; display:inline-block"  >
                              </li>`,

        /* Opcion  "Ninguno"*/
        opcion_ninguno_rend:   /*html*/`
                              <li class="mt5 " style="display:flex; align-items: flex-start; gap: 5px"> 
                                  <input  __opcion_texto="Ninguno" id="" type="checkbox" name="" class="" title="" value="" >
                                  <label class=" quest quest-opcion" for="">Ninguno.</label> 
                              </li>`,

        ayuda: /*html*/`  
              <span __ayuda class="pull-right">
                  <span __ayuda_btn class=" text-center bg-primary br12 p5 ph8 ml10 fs11" title="más información..." style="cursor:pointer; position:relative">
                      <i class="fa fa-question "></i>
                  </span>
                  <div __ayuda_texto class="hide fs12 text-white" style="top: 22px; left:0px;position: absolute;background: #000000aa;padding: 15px;border-radius: 12px;min-width: 250px;  z-index: 13;"></div>
                  <div class="cuadro_fondo hide " style="position:fixed; top:0; left:0; width:100vw; height:100vh; background-color: #33333311; z-index:11">
          </div>
              </span>`

      }


      let ctxMain = {
        creaEncuesta: function () {
          // let urlArray = window.location.href.split('/');
          // ctxMain.pruebareal = urlArray[urlArray.length - 2] == 'prueba' ? 'prueba' : 'real';
          ctxG.tipo_form = $('[__tipo_form]').attr('__tipo_form');
          console.log(ctxG.tipo_form)

          ctxG.pruebareal = $('[__tipo_respuestas]').attr('__tipo_respuestas');
          funs.stateView('pruebareal');
          console.log(ctxG.pruebareal)

          ctxG.validarCedula = $('[__validacion_cedula]').length <= 0 || $('[__validacion_cedula]').attr('__validacion_cedula') == 'validacion';
          console.log('validar_cedula' + ctxG.validarCedula)

          $.get(ctxG.rutabase + '/getcuestionario', { id: 1 }, function (res) {
            ctxMain.renderizarElementos(res.data);

            funs.mostrarCards();
            $('[__frms]').removeClass('hide');

          })
        },
        renderizarElementos: function (objCuestionario) {

          $("#id_c").val(objCuestionario.id);
          // $("#c_titulo").html(objCuestionario.titulo);
          // $("#pruebareal").html(ctxMain.pruebareal == 'prueba'? 'Modo Previsualizacion, La respuestas emitidas seran para fines de PRUEBA.' : '');

          let tituloSeccion = '';

          _.forEach(objCuestionario.elementos, function (objElem, k) {
            funs.adicionaElemento(objElem.tipo);

            let elemento = $(".__frm_encuesta .__elemento").last();
            if (objElem.tipo != 'pregunta_oculta') {
              $(elemento).attr('__id_elemento', objElem.id);
            }

            if (objElem.tipo == 'titulo' || objElem.tipo == 'texto') {
              $(elemento).find('.__elem_texto').html(objElem.texto); /* Añade el texto de la pregunta titulo o texto */
            }

            if (objElem.tipo == 'titulo')
              tituloSeccion = objElem.texto; /* Para colocarlo en cada pregunta, para que se muestre en las cards*/

            if (objElem.tipo == 'pregunta') {
              let numeroPregunta = funs.cortarNumero(objElem.texto);
              $(elemento).find('.__elem_texto').html(numeroPregunta.texto);
              $(elemento).attr('__pregunta_numero', numeroPregunta.numero);
              /* Coloca la descripcion solo a las preguntas*/
              (objElem.descripcion && objElem.descripcion.length > 0) ? $(elemento).find('.__elem_descripcion').html(objElem.descripcion)
                : $(elemento).find('.__elem_descripcion').remove();

              /* Se coloca el titulo de la seccion a la que pertenece , para mostrarlo en las cards */
              $(elemento).attr('__titulo_principal_seccion', tituloSeccion);

              /* Convierte a objeto la configuracion del elemento {tipo_respuesta, ayuda:'', depende_de:  */
              let cnfElem = JSON.parse(objElem.config) || {};

              if (cnfElem.tipo_respuesta && cnfElem.tipo_respuesta.length > 0)
                $(elemento).find('[__tipo_respuesta]').first().attr('__tipo_respuesta', cnfElem.tipo_respuesta);

              /* agrega y Configura el boton ayuda si hay en el elemento */
              if (cnfElem.ayuda && cnfElem.ayuda.length > 0) {
                $(elemento).find('.__elem_texto').append(elemhtml.ayuda);
                $(elemento).find('[__ayuda_texto]').html(cnfElem.ayuda.replace(/\n/g, '<br>'));
              }

              /* Si la pregunta depende de una respuesta opcion*/
              if (cnfElem.dependencia && cnfElem.dependencia.length > 0) {
                $(elemento).find('[__tipo_respuesta]').first().attr('__dependencia', cnfElem.dependencia);
              }



              if (cnfElem.tipo_respuesta == 'single' || cnfElem.tipo_respuesta == 'multiple' || cnfElem.tipo_respuesta == 'mixta') {
                $(elemento).find('.__elem_respuesta').append(elemhtml.respuesta_seleccion_rend);

                _.forEach(objElem.opciones, function (op, k) {
                  let typeinput = cnfElem.tipo_respuesta == 'single' || cnfElem.tipo_respuesta == 'mixta' ? 'radio' : 'checkbox';

                  let cnfOpcion = JSON.parse(op.config) || {};

                  if (cnfElem.tipo_respuesta == 'mixta' && cnfOpcion.opcion_combinada)
                    typeinput = 'checkbox';

                  let opcion = $(elemhtml.opcion_seleccion_rend);
                  /* se coloca en cada checkitem el id para enlazarcon label y el name con id de elemento para agrupar */
                  let numeroOpcion = k + 1; // funs.cortarNumero(op.opcion_texto);
                  $(opcion).find('input').attr('__id_opcion', op.id).attr('__opcion_numero', numeroOpcion).attr('__opcion_texto', op.opcion_texto).attr('id', op.id).attr('name', objElem.id).attr('type', typeinput);
                  $(opcion).find('label').attr('for', op.id).text(`${k + 1}. ${op.opcion_texto}`);

                  /* la config de la opcion ayuda y goto*/
                  $(opcion).find('input').attr('__goto', cnfOpcion.goto ? cnfOpcion.goto : '');
                  if (cnfOpcion.ayuda && cnfOpcion.ayuda.length > 0) {
                    $(opcion).append(elemhtml.ayuda);
                    $(opcion).find('[__ayuda_texto]').html(cnfOpcion.ayuda.replace(/\n/g, '<br>'));
                  }

                  $(elemento).find('.__opciones_respuesta').append(opcion);
                })

                /* Opcion OTRO*/
                if (cnfElem.opcion_otro) {
                  let typeinputOtro = cnfElem.tipo_respuesta == 'single' || cnfElem.tipo_respuesta == 'mixta' ? 'radio' : 'checkbox';
                  let bloque_otro = $(elemhtml.opcion_otro_rend);

                  let numeroCorrelativoOtro = $(elemento).find('.__opciones_respuesta li').length + 1;
                  let id_rand = Math.random(); /* Crea un id aleatorio para el for del label con el input */
                  $(bloque_otro).find('input[__opcion_texto=Otro]').attr('__goto', cnfElem.opcion_otro_goto).attr('id', id_rand).attr('name', objElem.id).attr('type', typeinputOtro);
                  $(bloque_otro).find('label').attr('for', id_rand).html(`${numeroCorrelativoOtro}. Otro:`);

                  $(elemento).find('.__opciones_respuesta').append(bloque_otro);
                }

                /* Opcion NINGUNO*/
                if (cnfElem.opcion_ninguno) {
                  let typeinputNinguno = 'checkbox'; // Siempre debe ser checkbox para habilitar o deshabilitar a todos los demas
                  let bloque_ninguno = $(elemhtml.opcion_ninguno_rend);

                  let numeroCorrelativoNinguno = $(elemento).find('.__opciones_respuesta li').length + 1;
                  let id_rand = Math.random(); /* Crea un id aleatorio para el for del label con el input */
                  $(bloque_ninguno).find('input[__opcion_texto=Ninguno]').attr('__goto', cnfElem.opcion_ninguno_goto).attr('id', id_rand).attr('name', objElem.id).attr('type', typeinputNinguno);
                  $(bloque_ninguno).find('label').attr('for', id_rand).html(`${numeroCorrelativoNinguno}. Ninguno`);

                  $(elemento).find('.__opciones_respuesta').append(bloque_ninguno);
                }
              }
              if (cnfElem.tipo_respuesta == 'open_sm')
                $(elemento).find('.__elem_respuesta').append(elemhtml.respuesta_corta_rend);

              if (cnfElem.tipo_respuesta == 'open_lg')
                $(elemento).find('.__elem_respuesta').append(elemhtml.respuesta_larga_rend);

              if (cnfElem.tipo_respuesta == 'select_numbers') {
                $(elemento).find('.__elem_respuesta').append(elemhtml.respuesta_select_numbers_rend);
                let numeros = _.range(parseInt(cnfElem.min), parseInt(cnfElem.max) + 1);
                let opts = xyzFuns.generaOpcionesArray(numeros, " ");
                $(elemento).find('.__select_numbers').html(opts);
              }
              if (cnfElem.tipo_respuesta == 'select_tres') {
                $(elemento).find('.__elem_respuesta').append(elemhtml.respuesta_select_tres_rend);
                // let numeros = _.range(parseInt(cnfElem.min), parseInt(cnfElem.max) + 1);
                $(elemento).find('.__select_opciones_texto_1').html(cnfElem.op1_texto);
                $(elemento).find('.__select_opciones_texto_2').html(cnfElem.op2_texto);
                $(elemento).find('.__select_opciones_texto_3').html(cnfElem.op3_texto);
                let opciones = [];
                _.forEach(objElem.opciones, function (op) {
                  opciones.push(op.opcion_texto);
                })

                let opts = xyzFuns.generaOpcionesArray(opciones, " ");
                $(elemento).find('.__select_opciones_1').html(opts);
                $(elemento).find('.__select_opciones_2').html(opts);
                $(elemento).find('.__select_opciones_3').html(opts);

                let elemOp2 = objCuestionario.elementos[k + 1];
                $(elemento).find('[__tipo=pregunta_oculta][select_tres_op2]').attr('__id_elemento', elemOp2.id);
                let elemOp3 = objCuestionario.elementos[k + 2];
                $(elemento).find('[__tipo=pregunta_oculta][select_tres_op3]').attr('__id_elemento', elemOp3.id);
              }
            }
          });
        },
        getData() {
          let timeFin = new Date();
          let encuestadoObj = xyzFuns.getData__fields('__rg_field');
          let fecha_nacimiento_YYYYMMDD = `${encuestadoObj.fecha_nacimiento_y}-${encuestadoObj.fecha_nacimiento_m}-${encuestadoObj.fecha_nacimiento_d}`;
          let edad = ctxG.encuestado.edad;
          let contest = {
            id_cuestionario: $("#id_c").val(),
            tiempo_seg: 0, //Math.floor((timeFin - ctxG.timeIni)/1000),
            estado: ctxG.pruebareal,
            fecha_nacimiento: fecha_nacimiento_YYYYMMDD,
            con_ci: ctxG.validarCedula ? 1 : 0,
            edad: isNaN(edad) ? null : edad,
            cedula_identidad: '',
            respuestas: []
          };


          $.extend(contest, encuestadoObj);
          contest.cedula_identidad = ctxG.validarCedula ? encuestadoObj.cedula_identidad : '';

          _.forEach($(".__elemento[__tipo='pregunta'][__card='completado']"), function (elemento, k) {

            let tipoRespuesta = $(elemento).find('[__tipo_respuesta]').first().attr('__tipo_respuesta');
            if (tipoRespuesta == 'single' || tipoRespuesta == 'multiple' || tipoRespuesta == 'mixta') {
              _.forEach($(elemento).find("input:checked"), function (opcionChecked) {
                let opChecked = $(opcionChecked);
                let objResp = {
                  id_elemento: $(elemento).attr('__id_elemento'),
                  id_opcion: opChecked.attr('__id_opcion') || null,
                  respuesta_opcion: opChecked.attr('__opcion_texto'),
                  respuesta: (opChecked.attr('__opcion_texto') == "Otro") ?
                    opChecked.closest('li').find('[__opcion_otro]').first().val() : opChecked.attr('__opcion_texto'),
                }
                contest.respuestas.push(objResp);
              })
            }
            if (tipoRespuesta == 'open_sm') {
              let respuesta_corta = $(elemento).find("input");
              let objResp = {
                id_elemento: $(elemento).attr('__id_elemento'),
                respuesta: respuesta_corta.val(),
              }
              contest.respuestas.push(objResp);
            }
            if (tipoRespuesta == 'open_lg') {
              let respuesta_larga = $(elemento).find("textarea");
              let objResp = {
                id_elemento: $(elemento).attr('__id_elemento'),
                respuesta: respuesta_larga.val(),
              }
              contest.respuestas.push(objResp);
            }
            if (tipoRespuesta == 'select_numbers') {
              let num = $(elemento).find(".__select_numbers").val();
              let objResp = {
                id_elemento: $(elemento).attr('__id_elemento'),
                respuesta: num,
                respuesta_opcion: num,
              }
              contest.respuestas.push(objResp);
            }
            if (tipoRespuesta == 'select_tres') {
              let objResp = {
                id_elemento: $(elemento).attr('__id_elemento'),
                respuesta: $(elemento).find('.__select_opciones_1').val(),
                respuesta_opcion: $(elemento).find('.__select_opciones_1').val(),
              }
              $(elemento).find('[__tipo=pregunta_oculta][select_tres_op2]').attr('respuesta', $(elemento).find('.__select_opciones_2').val())
              $(elemento).find('[__tipo=pregunta_oculta][select_tres_op3]').attr('respuesta', $(elemento).find('.__select_opciones_3').val())
              contest.respuestas.push(objResp);

              let objResp2 = {
                id_elemento: $(elemento).find('[select_tres_op2]').attr('__id_elemento'),
                respuesta: $(elemento).find('[select_tres_op2]').attr('respuesta'),
                respuesta_opcion: $(elemento).find('[select_tres_op2]').attr('respuesta'),
              }
              contest.respuestas.push(objResp2);

              let objResp3 = {
                id_elemento: $(elemento).find('[select_tres_op3]').attr('__id_elemento'),
                respuesta: $(elemento).find('[select_tres_op3]').attr('respuesta'),
                respuesta_opcion: $(elemento).find('[select_tres_op3]').attr('respuesta'),
              }
              contest.respuestas.push(objResp3);
            }
          });
          return contest;
        },
        save() {
          xyzFuns.spinner();
          let dataSend = ctxMain.getData();
          // console.log(dataSend)
          $.post(`${ctxG.rutabase}/saverespuestas`, dataSend, function (res) {
            xyzFuns.spinner(false);
            if (res.estado == 'ok') {
              funs.stateView('guardado');
              let id_contestado = res.data.id;
              $('[__rg_field=id_contestado]').val(id_contestado);

            }
          }).fail(function (r) {
            funs.mostrarError("Hubo un error inesperado.");
            xyzFuns.spinner(false);
          })
        },
        saveOpcional: () => {
          let datosContestadoOpcional = xyzFuns.getData__fields('__rg_field');
          datosContestadoOpcional.id = datosContestadoOpcional.id_contestado;
          datosContestadoOpcional.id_cuestionario = $("#id_c").val();
          datosContestadoOpcional.respuestas = [];
          xyzFuns.spinner();
          $.post(`${ctxG.rutabase}/saverespuestas`, datosContestadoOpcional, function (res) {
            xyzFuns.spinner(false);
            if (res.estado == 'ok')
              funs.stateView('compartir_link')
          })

        }


      }

      let funs = {

        creaFormularioDatosEncuestado: () => {
          // let html = regmodel.renderForm();
          regmodel.create_fields(regmodel.model.sections);
          regmodel.inicializaControles();
        },

        /* Separa los textos de las preguntas en numero y texto , a partir del punto .*/
        cortarNumero: (texto) => {
          let separado = texto.split(".");
          return (separado.length > 1) ? { numero: separado[0].trim(), texto: separado.slice(1).join(".").trim(), }
            : { numero: '', texto: texto, }
        },

        adicionaElemento: function (tipoElemento) {
          let contenidoElementos = $(".__frm_encuesta");

          if (tipoElemento == 'pregunta')
            contenidoElementos.append(elemhtml.pregunta_rend);
          if (tipoElemento == 'titulo')
            contenidoElementos.append(elemhtml.titulo_rend);
          if (tipoElemento == 'texto')
            contenidoElementos.append(elemhtml.texto_rend);
          if (tipoElemento == 'separador')
            contenidoElementos.append(elemhtml.separador_rend);
        },

        stateView: (estado) => {
          if (estado == 'guardado') {
            $(".__caratula").remove();
            $(".__frm_autenticacion").remove();
            $(".__frm_datos_general").remove();
            $(".__frm_encuesta").remove();
            $(".__frm_enviar").remove();
            $(".__botones_navegacion").remove();

            // $(".__frm_info_opcional").show();
            funs.stateView('compartir_link')
          }
          if (estado == 'compartir_link') {
            $('[__frms]').remove();
            let mensje = /*html*/`
                      <h2 class="text-center">Se ha enviado exitosamente la encuesta.</h2>
            <h2>Muchas gracias por participar.</h2>
                      <br><br><br>
                      <!--<div>Copia el siguiente enlace de la Encuesta Virtual, y comparte en tus redes sociales. </div>
                      <div class="fs24 mt20">https://1raencuesta.defensoria.gob.bo/</div> -->
                  `;
            xyzFuns.alertMsg("[__contenedor_forms]", mensje, ' alert-dark pastel   fs18 p30 br12 mt50', 'fa fa-check-circle fa-3x', '', false)
          }

          if (estado == 'pruebareal') {
            let clasePruebaReal = (ctxG.pruebareal == 'real') ? 'form-real' : 'form-prueba';
            $('.panel-heading').removeClass('form-real form-prueba').addClass(clasePruebaReal)

            if (ctxG.pruebareal == 'prueba')
              $("[__titulo_principal]").prepend('FORMULARIO DE PRUEBA<br>')
          }
        },

        /* Loscuadros de ayuda con su fondo */
        mostrarOcultarAyuda: (accion, ayuda) => {
          if (accion == 'mostrar') {
            if ($(ayuda).find('[__ayuda_texto]').hasClass('hide')) {
              /* Se ocultan todos*/
              $("[__ayuda_texto]").addClass('hide');
              $(".cuadro_fondo").addClass('hide');
              /* Solo muestra la ayuda y fondo del elemento*/
              $(ayuda).find('[__ayuda_texto]').removeClass('hide');
              $(ayuda).find('.cuadro_fondo').removeClass('hide');
            }
            else {
              funs.mostrarOcultarAyuda('ocultar', $(ayuda));
            }
          }
          if (accion == 'ocultar') {
            $(ayuda).find('[__ayuda_texto]').addClass('hide');
            $(ayuda).find('.cuadro_fondo').addClass('hide');
          }
        },

        /* Modo de Tarjetas*/
        mostrarCards: () => {
          // descomentar para ver en tarjetas
          $("  hr").hide();
          // $("[__card] , .__elemento, hr").hide();
          // ctxG.cards = $("[__card]");

          $("[__frms]").removeClass('hide');

          /* posicion_inicio*/
          let indexInicial = 0;
          // descomentar para ver en tarjetas
          // let indexInicial = 2;
          // $(ctxG.cards[indexInicial]).show();
          ctxG.index = indexInicial;

          $('[__btn_navegar=anterior]').hide()
          // funs.navegacion(''); /* Para que se configuren los botones de navegación*/
          ctxG.timeIni = new Date();
        },

        /* Preguntas quemadas*/
        // manipularPreguntaQuemada: (npreguta) => {
        //     /* pregunta 3 DE ACUERDO A SU IDENTIDAD DE GÉNERO USTED ES:
        //     se configura de las respuestas de la preg 1,  
        //     si la respuesta de la 1 es la opcion 1 (biologicamente hombre), en la 3  se bloqua la opcion 2
        //     si la respuesta de la 1 es la opcion 2 (biologicamente mujer), en la 3 se bloquea la opcion 1 */
        //     if(npreguta == 0103){
        //         let preg01 = $("[__pregunta_numero=1]");
        //         let preg03 = $("[__pregunta_numero=3]");

        //         /* limpia los checked si hubiera, y hailita todos */
        //         _.forEach($(preg03).find('[__opcion_texto]'), function(op){
        //             $(op).prop("checked", false).prop("disabled", false).attr('burned', '');
        //         })

        //         /* deshabilita la 1ra o 2da opcion de la pregunta 3 , segun la opcion seleccionada en la pregunta 1 respectivamente*/
        //         if ($($(preg01).find('[__opcion_texto]')[0]).is(':checked'))
        //             $($(preg03).find('[__opcion_texto]')[1]).prop("disabled", true).attr('burned', "si");

        //         if ($($(preg01).find('[__opcion_texto]')[1]).is(':checked'))
        //             $($(preg03).find('[__opcion_texto]')[0]).prop("disabled", true).attr('burned', 'si');
        //     }

        //     /* Verifica edad: pregunta 6. ¿A QUÉ EDAD SE PERCATÓ QUE TENÍA UNA ORIENTACIÓN SEXUAL O IDENTIDAD DE GÉNERO DIVERSA?*/
        //     if(npreguta == 6){
        //         let pregunta = $("[__pregunta_numero=6]");

        //         /* limpia los checked si hubiera */
        //         _.forEach($(pregunta).find('[__opcion_texto]'), function(op){
        //             $(op).prop("checked", false);
        //         })

        //         let edad = ctxG.encuestado.edad;
        //         let rangos_etareos = [
        //                 { rango_etareo: 'infancia'    , min: 0, max: 5 },
        //                 { rango_etareo: 'ninez'       , min: 6, max: 11 },
        //                 { rango_etareo: 'adolescencia', min: 12, max: 15 },
        //                 { rango_etareo: 'juventud'    , min: 16, max: 28 },
        //                 { rango_etareo: 'adultez'     , min: 29, max: 59 },
        //                 { rango_etareo: 'mayor'       , min: 60, max: 150 },
        //         ];
        //         let indiceEdad = 99;
        //         _.forEach(rangos_etareos, function (item, k) {
        //             (edad >= item.min && edad <= item.max) ? indiceEdad = k : false;
        //         });

        //         _.forEach($(pregunta).find('li'), function(item, k){
        //             (k <= indiceEdad) ? $(item).show() : $(item).hide();
        //         })                
        //     }

        //     /* Verifica edad: pregunta 6. ¿A QUÉ EDAD SE PERCATÓ QUE TENÍA UNA ORIENTACIÓN SEXUAL O IDENTIDAD DE GÉNERO DIVERSA?*/
        //     if(npreguta == 32){
        //         let pregunta = $("[__pregunta_numero=32]");

        //         /* limpia los checked si hubiera */
        //         $(pregunta).find("[__select_numbers]").val();

        //         let edad = ctxG.encuestado.edad;

        //         _.forEach($(pregunta).find('select option'), function(item, k){
        //             ($(item).attr('value') <= edad) ? $(item).show() : $(item).hide();
        //         })                
        //     }

        //     /* pregunta 19 ¿A DÓNDE ACUDIÓ PARA ATENDERSE POR ESTA(AS) ENFERMEDAD(ES)?
        //     se configura de las respuestas de la preg 16,  
        //     si la respuesta de la 16 es la opcion 1, en la 19 se bloqua la opcion 1
        //     si la respuesta de la 16 es la opcion 2, en la 19 se bloquea la opcion 2 */
        //     if(npreguta == 1619){
        //         let preg16 = $("[__pregunta_numero=16]");
        //         let preg19 = $("[__pregunta_numero=19]");

        //         /* limpia los checked si hubiera, y hailita todos */
        //         _.forEach($(preg19).find('[__opcion_texto]'), function(op){
        //             $(op).prop("checked", false).prop("disabled", false).attr('burned', '');
        //         })

        //         /* deshabilita la 1ra o 2da opcion de la pregunta 19 , segun la opcion seleccionada en la pregunta 16 respectivamente*/
        //         if ($($(preg16).find('[__opcion_texto]')[0]).is(':checked'))
        //             $($(preg19).find('[__opcion_texto]')[0]).prop("disabled", true).attr('burned', "si");

        //         if ($($(preg16).find('[__opcion_texto]')[1]).is(':checked'))
        //             $($(preg19).find('[__opcion_texto]')[1]).prop("disabled", true).attr('burned', 'si');
        //     }

        //     /* pregunta 19 ¿A DÓNDE ACUDIÓ PARA ATENDERSE POR ESTA(AS) ENFERMEDAD(ES)?
        //     si selecciona la ultima opcion (numero 8) no busque atencion   se bloquean las demas */
        //     if(npreguta == 19){
        //         let preg = $("[__pregunta_numero=19]");

        //         let quemadoChecked = $(preg).find("[__opcion_texto='No busqué atención']").last().is(':checked');
        //         _.forEach($(preg).find('[__opcion_texto]'), function(op){
        //             if (quemadoChecked && $(op).attr('__opcion_texto') != 'No busqué atención' && $(op).attr('burned') != 'si') {
        //                 $(op).prop("checked", false).prop("disabled", true);                    
        //             }
        //             if ( !quemadoChecked && $(op).attr('burned') != 'si')
        //                 $(op).prop("disabled", false); 
        //         });
        //         /*Para el caso de la opcion otro se debe ocultar la caja de texto Otro*/
        //         if(quemadoChecked)
        //             $(preg).find('[__opcion_otro]').addClass('hide').val('');

        //     }

        //     /* pregunta 35   ¿CON QUIÉN VIVE ACTUALMENTE?
        //     si selecciona la ultima opcion (numero 7) que es solo/a/e  se bloquean las demas */
        //     if(npreguta == 35){
        //         let preg = $("[__pregunta_numero=35]");

        //         let soloChecked = $(preg).find("[__opcion_texto='Solo/a/e']").last().is(':checked');
        //         _.forEach($(preg).find('[__opcion_texto]'), function(op){
        //             if (soloChecked && $(op).attr('__opcion_texto') != 'Solo/a/e') {
        //                 $(op).prop("checked", false).prop("disabled", true);                    
        //             }
        //             if ( !soloChecked)
        //                 $(op).prop("disabled", false); 
        //         });
        //         /*Para el caso de la opcion otro se debe ocultar la caja de texto Otro*/
        //         if(soloChecked)
        //             $(preg).find('[__opcion_otro]').addClass('hide').val('');

        //     }
        // },

        /* recorrer de una card a otra*/
        recorrerCard: (actualIndex, newIndex) => {
          funs.ocultarError();
          let navegar = newIndex - actualIndex > 0 ? 'siguiente' : 'anterior';

          if (navegar == "siguiente") {
            $(ctxG.cards[actualIndex]).attr("__card", 'completado');
            $(ctxG.cards[actualIndex]).hide('slide', { direction: 'left' }, 500);
          }
          if (navegar == "anterior") {

            /* Recorre el array cards para quitar  los cards completados por atributo vacio, asi no se ve afectado si cambia el flujo*/
            for (let k = ctxG.index; k < ctxG.cards.length; k++) {
              $(ctxG.cards[k]).attr("__card", '');
            }
            $(ctxG.cards[actualIndex]).hide('slide', { direction: 'right' }, 500);
          }
          _.delay(function () {
            $(ctxG.cards[ctxG.index]).fadeIn(500);
          }, 550);

          /* Coloca el titulo de seccion en la card */
          $('[__head_card]').html($(ctxG.cards[ctxG.index]).attr('__titulo_principal_seccion') || '');

        },

        /* navegacion*/
        navegacion: (navegar) => {
          let obj: any = {};
          funs.ocultarError();
          // if ($(ctxG.cards[ctxG.index]).hasClass('__frm_autenticacion') && navegar == "siguiente" ) {
          //     funs.logicaNavegacion(ctxG.index, navegar)
          //     // if(ctxG.validarCedula)
          //         return;
          // }

          // obj = funs.logicaNavegacion(ctxG.index, navegar) ;

          // if (obj.error) {
          //     funs.mostrarError(obj.error);
          //     return;
          // }

          funs.ocultarError();
          let actualIndex = ctxG.index;
          // let newIndex = obj.newIndex;// || actualIndex;
          ctxG.index = obj.newIndex;;

          let cumpledependencia = false;
          while (!cumpledependencia) {
            let dependencia = $(ctxG.cards[ctxG.index]).find('[__tipo_respuesta]').first().attr('__dependencia');

            if (dependencia == '' || dependencia == null) {
              cumpledependencia = true;
            }
            else if (dependencia.length > 0) {
              let dependencias = dependencia.split(",");
              dependencias.forEach(dep => {
                let valores = dep.trim().split(".");
                let pregunta_numero = valores[0];
                let opcion_numero = valores[1];
                let pregunta = _.find($(ctxG.cards), function (card) {
                  return $(card).attr('__pregunta_numero') == pregunta_numero;
                })
                //$(`${ctxG.cards}[__pregunta_numero=${pregunta_numero}]`); //.find(`[__pregunta_numero=${pregunta_numero}]`);
                let opcion = $(pregunta).find(`[__opcion_numero=${opcion_numero}]`);
                if ($(opcion).is(':checked')) {
                  cumpledependencia = true;
                }
                else {

                }

              })
            }
            if (!cumpledependencia)
              ctxG.index++;
          }

          console.log(actualIndex, ctxG.index)

          funs.recorrerCard(actualIndex, ctxG.index);

          /** BLOQUEOS / MOSTRAR OCULTAR SEGUN CONDICIONES */

          /* mostrar u ocultar los botones*/
          (ctxG.index >= ctxG.cards.length - 1) ? $('[__btn_navegar=siguiente]').hide() : $('[__btn_navegar=siguiente]').show();
          (ctxG.index <= 0) ? $('[__btn_navegar=anterior]').hide() : $('[__btn_navegar=anterior]').show();


          if ($(ctxG.cards[ctxG.index]).hasClass('__frm_enviar') && navegar == "siguiente") {
            // $('[__btn_navegar=anterior]').hide()
            $('[__btn_navegar=siguiente]').hide()
            return;
          }

          // if ($(ctxG.cards[ctxG.index]).hasClass('__frm_final') && navegar == "siguiente" ) {
          //     $(ctxG.cards[ctxG.index]).append("<button class='bg-success w200'>Enviar encuesta</button> ")
          //     return;
          // }




        },

        /* Condiciones, verificaciones, saltos, validaciones */
        // logicaNavegacion: (indexActual, navegar) => {
        //     let el = {
        //         error : false,
        //         newIndex: indexActual,
        //     }
        //     let bloqueActual = ctxG.cards[indexActual]; 

        //     if(navegar == 'siguiente'){

        //         if ($(bloqueActual).hasClass('__caratula')) {
        //             el.newIndex = indexActual + 1;
        //             return el;
        //         }

        //         /* VERIFICACION DE EDAD CI SEGIP*/
        //         if ($(bloqueActual).hasClass('__frm_autenticacion')) {

        //             let cedula_identidad = $("[__rg_field=cedula_identidad]").val().trim();
        //             let complemento      = $("[__rg_field=complemento]").val().trim();
        //             let fecha_nac_d      = $("[__rg_field=fecha_nacimiento_d]").val();
        //             let fecha_nac_m      = $("[__rg_field=fecha_nacimiento_m]").val();
        //             let fecha_nac_y      = $("[__rg_field=fecha_nacimiento_y]").val();

        //             let fecha_nacimiento_DDMMYYYY = `${fecha_nac_d}/${fecha_nac_m}/${fecha_nac_y}`;

        //             /* VERIFICA CAMPOS VACIOS */
        //             if(ctxG.validarCedula){
        //                 if ( (cedula_identidad == '' ) || fecha_nac_d == '' || fecha_nac_m == '' || fecha_nac_y == '') {
        //                     el.error = "Los campos de cédula de identidad y fecha de nacimiento no pueden estar vacíos";
        //                     funs.mostrarError(el.error);
        //                     return el;
        //                 }
        //             }  
        //             else{

        //                 /* Se pone vacia el campo cedula de identidad, ya que no se lo va a registrar, nno se lo esta validando*/
        //                 $("[__rg_field=cedula_identidad]").val('')
        //                 /* Solo se valida la fecha de nacimiento que no este vacia*/
        //                 if (  fecha_nac_d == '' || fecha_nac_m == '' || fecha_nac_y == '') {
        //                     el.error = "Los campos de fecha de nacimiento no pueden estar vacíos";
        //                     funs.mostrarError(el.error);
        //                     return el;
        //                 }
        //             } 

        //             /* VERIFICA SI LA FECHA ES VALIDA */
        //             let fechaValida = moment(fecha_nacimiento_DDMMYYYY, [moment.ISO_8601, "D/M/YYYY"], true).isValid();
        //             if(!fechaValida){
        //                 el.error = "La fecha es inválida.";
        //                 funs.mostrarError(el.error);
        //                 return el;
        //             }

        //             /* VERIFICA LA EDAD > 18 AÑOS */
        //             // fecha_nacimiento_YYYYMMDD = `${fecha_nac_y}-${fecha_nac_m}-${fecha_nac_d}`;
        //             // ctxG.encuestado.edad = xyzFuns.calcularEdad(fecha_nacimiento_YYYYMMDD);
        //             if (ctxG.encuestado.edad < 18) {
        //                 el.error = `El formulario de encuesta solo es válido para personas mayores de 18 años. Tu edad es de ${ctxG.encuestado.edad} años.`;
        //                 funs.mostrarError(el.error);
        //                 return el;
        //             }

        //             /* Si no esta en modo validacion se recorre simplemente*/
        //             if (!ctxG.validarCedula) {
        //                 let actualIndex = ctxG.index;
        //                 let newIndex = ctxG.index + 1;
        //                 ctxG.index = newIndex;
        //                 funs.recorrerCard(actualIndex, ctxG.index);

        //                 return;
        //             }
        //             /* VERIFICA SI YA HA LLENADO LA ENCUESTA */
        //             /* si el campo carnet esta vacio y se está en modo de no validacion puede pasar toda esta parte  */
        //             else {
        //                 xyzFuns.spinner();
        //                 $.post(`${ctxG.rutabase}/verifica-cedula-registrada`, 
        //                     { 'cedula_identidad': cedula_identidad, '_token': $("[name=_token]").val() }, 
        //                     function (res) {
        //                             if (res.existe) {
        //                                 el.error = res.msg;
        //                                 funs.mostrarError(el.error);
        //                                 xyzFuns.spinner(false);
        //                                 return el;
        //                             }    

        //                 /******* SIRVE PARA HACER PRUEBAS LOCALES ******/
        //                 // let datosPersonaObj = {
        //                 //     'cedula_identidad' : cedula_identidad,
        //                 //     'fecha_nacimiento' : fecha_nacimiento,
        //                 //     'complemento'      : complemento,
        //                         // '_token': $("[name=_token]").val()      
        //                 // };
        //                 // $.post(`${ctxG.rutabase}/verifica-existe-persona`, datosPersonaObj, function (res) {
        //                         // if (!res.existe_persona) {
        //                         //     el.error = res.msg;
        //                         //     funs.mostrarError(el.error);
        //                         //     return el;
        //                         // }
        //                 /******************** **** ******************/

        //                 /********* SERVICIO WEB REAL CON EL SEGIP ********/
        //                 let datosPersonaObj = {
        //                     'cedula_identidad' : cedula_identidad,
        //                     'fecha_nacimiento' : fecha_nacimiento_DDMMYYYY,
        //                     'complemento'      : complemento,
        //                     '_token'             : $("[name=_token]").val()
        //                 };
        //                 $.post(`${ctxG.rutabase}/verifica-sw-existe-persona`, datosPersonaObj, function (res) {
        //                     xyzFuns.spinner(false);
        //                     /*Si existe error desde REST*/
        //                     if(res.estado == 'error'){
        //                         el.error = res.msg;
        //                         funs.mostrarError(el.error);
        //                         return el;
        //                     }

        //                     let newStringXML = res.data.replace(/a:/g, ''); /* Quita en los tags a: */
        //                     let objxml = $.parseXML( newStringXML );
        //                     let  servicioObj = {
        //                         xmlString                  : res.data,
        //                         ContrastacionEnFormatoJson : $(objxml).find('ContrastacionEnFormatoJson').text(),
        //                         CodigoRespuesta            : $(objxml).find('CodigoRespuesta').text(),
        //                         DescripcionRespuesta       : $(objxml).find('DescripcionRespuesta').text(),
        //                         CodigoUnico                : $(objxml).find('CodigoUnico').text(),
        //                         EsValido                   : $(objxml).find('EsValido').text(),
        //                         Mensaje                    : $(objxml).find('Mensaje').text(),
        //                         TipoMensaje                : $(objxml).find('TipoMensaje').text(),
        //                     }
        //                     let errorComplemento = "<br>TOMAR NOTA: El complemento <b>No es el lugar de expedición de la cédula de identidad (CI).</b> El complemento es un código alfanumérico que se añade al número de CI en casos de duplicidad confirmada de la misma. <b>Si su CI no tiene complemento debe dejar este campo vacío.</b>";
        //                     /* Si no encontro registro*/
        //                     if (!servicioObj.ContrastacionEnFormatoJson || servicioObj.ContrastacionEnFormatoJson.length == 0){
        //                         el.error = servicioObj.DescripcionRespuesta + '. No existe ninguna persona con esa información.';
        //                         if(complemento != '')
        //                             el.error += errorComplemento;
        //                         funs.mostrarError(el.error);                                
        //                         return el;
        //                     }
        //                     else{
        //                         let coincidencias = JSON.parse((servicioObj.ContrastacionEnFormatoJson).replace(/\\/g, ''));
        //                         /* si alguna coincidencia no es 1 significa que si se encontro a la persona pero el complemento o la fecha no coinciden*/
        //                         if (coincidencias.NumeroDocumento != 1 || coincidencias.FechaNacimiento != 1 || coincidencias.Complemento != 1) {
        //                             el.error = "No existe ninguna persona con la información proporcionada. ";
        //                             if(complemento != '')
        //                                 el.error += errorComplemento;
        //                             funs.mostrarError(el.error);                                    
        //                             return el;
        //                         }
        //                     }

        //                     el.newIndex = ctxG.index + 1;

        //                     funs.ocultarError();                            
        //                     let actualIndex = ctxG.index;
        //                     let newIndex = el.newIndex;
        //                     ctxG.index = newIndex;

        //                     console.log(actualIndex, newIndex)

        //                     funs.recorrerCard(actualIndex, ctxG.index);

        //                     return ;

        //                 })
        //             })
        //             }   

        //         }
        //         /* VERIFICACION datos gemneral departamento municipio*/
        //         if ($(bloqueActual).hasClass('__frm_datos_general')) {
        //             if($(bloqueActual).find("[__rg_field=departamento]").val().trim() == '' || $("[__rg_field=municipio]").val().trim() == ''){
        //                 el.error = ' Los campos no pueden estar vacios.';
        //                 return el;
        //             }
        //             el.newIndex = ctxG.index + 1;
        //             return el;
        //         }

        //         /* Verifica que el monto de ingreso percibido sea numerico y mayor que cero
        //         Pregunta 65*/
        //         if($(bloqueActual).attr('__pregunta_numero') == 65){
        //             let ingreso = $(bloqueActual).find('input').val();
        //             if (ingreso == '' || parseFloat(ingreso) <= 0)
        //                 return { error: "El campo no debe estar vacio, solo debe contener números y debe ser mayor que cero" };

        //             return {
        //                     newIndex: ctxG.index + 1 
        //                 }

        //         }

        //         /* VERIFICACION DE CONDICIONES DE LOS ELEMENTOS */
        //         if ($(bloqueActual).hasClass('__elemento')) {

        //             let tipo_respuesta = $(bloqueActual).find('[__tipo_respuesta]').first().attr('__tipo_respuesta');
        //             if(tipo_respuesta == 'single' || tipo_respuesta == 'multiple' || tipo_respuesta == 'mixta' ){
        //                 if($(bloqueActual).find("input:checked").length <= 0) {
        //                     el.error = "Debe seleccionar alguna opción";
        //                     return el;
        //                 }

        //                 if (!$(bloqueActual).find('[__opcion_otro]').hasClass('hide')){
        //                     if($(bloqueActual).find('[__opcion_otro]').val() == ''){
        //                         el.error = "Seleccionó la opción Otro, pero no escribió nada, no debe estar vacía";
        //                         return el;
        //                     }
        //                 }

        //                 let goto_numero = $(bloqueActual).find("input:checked").attr('__goto');
        //                 if(goto_numero && goto_numero.length > 0 ){
        //                     /* si goto es mayor al numero de preguntas, */
        //                     let numPReguntas = $(".__frm_encuesta [__card]").length; /* Todas las cards dentro de frm_encustas*/ 
        //                     // console.log('tiene goto')
        //                     if(goto_numero > numPReguntas)
        //                         goto_numero = 'concluir';
        //                     for (let i = ctxG.index; i < ctxG.cards.length; i++) {
        //                         let numeroPregunta = $(ctxG.cards[i]).attr('__pregunta_numero');
        //                         if(numeroPregunta == goto_numero){
        //                             return {
        //                                 newIndex: i
        //                             }
        //                         }                            
        //                     }
        //                 }
        //                 else
        //                 return {
        //                     newIndex: ctxG.index + 1 
        //                 }
        //             }
        //             else if(tipo_respuesta == 'select_numbers'){
        //                 if($(bloqueActual).find('select').first().val().length <= 0 )
        //                     return { error: 'La respuesta no puede estar vacía' };

        //                 return {
        //                     newIndex: ctxG.index + 1 
        //                 }
        //             }
        //             else if(tipo_respuesta == 'open_sm' || tipo_respuesta == 'open_lg'){
        //                 if($(bloqueActual).find('input, textarea').val().length <= 0)
        //                     return { error: 'La respuesta no puede estar vacía' };

        //                 return {
        //                     newIndex: ctxG.index + 1 
        //                 }
        //             }

        //             // $(bloqueActual).find(input);
        //             el.newIndex = ctxG.index + 1;
        //             return el
        //         }
        //     }
        //     if(navegar == 'anterior'){              
        //         let indexLastCompletado = 0;
        //         _.forEach(ctxG.cards, function(item, k){
        //             if($(item).attr('__card') == 'completado'){
        //                 indexLastCompletado = k;
        //             }
        //         })
        //         el.newIndex = indexLastCompletado;
        //         return el;
        //     }

        // },
        mostrarError: (msg) => {
          $("[__error]").html(msg).removeClass('hide');
        },
        ocultarError: () => {
          $("[__error]").html('').addClass('hide')
        },
        datosOpcionales: (btnOpcional) => {
          if (btnOpcional == 'save') {
            ctxMain.saveOpcional();
          }
          if (btnOpcional == 'no_gracias') {
            funs.stateView('compartir_link');
          }
        },
        cambiarModoValidacionCedula: () => {
          let nuevoModo = $('[__validacion_cedula]').attr('__validacion_cedula') == 'validacion' ? 'no_validacion' : 'validacion';
          $('[__validacion_cedula]').attr('__validacion_cedula', nuevoModo);

          let newClassBtn = nuevoModo == 'validacion' ? 'btn-success dark' : 'btn-dark dark';
          let newClassback = nuevoModo == 'validacion' ? 'bg-success lighter' : 'bg-light darker';
          let text = nuevoModo == 'validacion' ? 'Con Cédula' : 'Sin Cédula';

          $("[__validacion_cedula]").removeClass(' bg-success lighter bg-light darker').addClass(newClassback);
          $("[__validacion_btn]").removeClass(' btn-success  dark btn-dark').addClass(newClassBtn);
          $("[__validacion_texto]").html(text);

          ctxG.validarCedula = (nuevoModo == 'validacion');

          /* Oculta campos de CI y cmplemento*/
          let visibility = ctxG.validarCedula ? 'visible' : 'hidden';
          $(".__frm_autenticacion").find("[__rg_field=cedula_identidad]").closest(".form-horizontal").css('visibility', visibility);
          $(".__frm_autenticacion").find("[__rg_field=complemento]").closest(".form-horizontal").css('visibility', visibility);
        }


      }

      let listeners = () => {
        $("#formulario_encuesta")

          /* Tamaño de los textareas*/
          .on('change drop keydown cut paste', 'textarea', function () {
            $(this).height('auto');
            $(this).height($(this).prop('scrollHeight'));
          })

          /* Al cmbiar fecha de nacimiento calcula edad*/
          .on('change', '[__card].__frm_autenticacion select', function () {
            let fecha_nac_d = $("[__rg_field=fecha_nacimiento_d]").val();
            let fecha_nac_m = $("[__rg_field=fecha_nacimiento_m]").val();
            let fecha_nac_y = $("[__rg_field=fecha_nacimiento_y]").val();
            ctxG.encuestado.edad = xyzFuns.calcularEdad(`${fecha_nac_y}-${fecha_nac_m}-${fecha_nac_d}`);
          })

          /* AL cambiar el departamento se cargan los unicipios respectivos*/
          .on('change', '[__rg_field=departamento]', function () {
            let municipios = _.filter(ctxG.municipios, function (item) {
              return item.departamento == $('[__rg_field=departamento]').val();
            });
            let municipioOpts = xyzFuns.generaOpciones(municipios, 'municipio', 'municipio');
            $("[__rg_field=municipio]").html(municipioOpts);
          })

          /* Al hacer click en boton GUARDAR*/
          .on('click', "[__save]", function () {
            ctxMain.save();
          })

          /* Para controlar la opcion OTRO , click en cualquier opcion,  */
          .on('change', '[__opcion_texto]', function (e) {
            let elemento = $(this).closest('.__elemento');
            _.forEach($(elemento).find('[__opcion_texto=Otro]'), function (op) {
              if ($(op).is(':checked'))
                $(op).closest('li').find('[__opcion_otro]').removeClass('hide')
              else
                $(op).closest('li').find('[__opcion_otro]').addClass('hide').val('')
            })
          })

          /* Para controlar la opcion NINGUNO ,  */
          .on('change', '[__opcion_texto=Ninguno]', function (e) {
            let elemento = $(e.currentTarget).closest('.__elemento');
            let ningunoChecked = $(e.currentTarget).is(':checked');
            _.forEach($(elemento).find('[__opcion_texto]'), function (op) {
              if ($(op).attr('__opcion_texto') != 'Ninguno') {
                $(op).prop("checked", false).prop("disabled", ningunoChecked);
              }
            });

            /*Para el caso de la opcion otro se debe ocultar la caja de texto Otro*/
            if (ningunoChecked)
              $(elemento).find('[__opcion_otro]').addClass('hide').val('');
          })

          /* Click sobre el icono de ayuda*/
          .on('click', '[__ayuda_btn]', function (e) {
            let ayuda = $(e.currentTarget).closest('[__ayuda]');
            funs.mostrarOcultarAyuda('mostrar', ayuda);
          })

          /* Hacer desaparecer la ayuda al hacer click en cualquier parte de la pantalla */
          .on('click', '.cuadro_fondo, [__ayuda_texto]', function (e) {
            let ayuda = $(e.currentTarget).closest('[__ayuda]');
            funs.mostrarOcultarAyuda('ocultar', ayuda);
          })

          /* Al hacer click en los botones de navegacion */
          .on('click', '[__btn_navegar]', function (e) {
            let navegar = $(e.currentTarget).attr('__btn_navegar');
            funs.navegacion(navegar);
          })

          /* Al hacer click en los botones de navegacion */
          .on('click', '[__btn_opcional]', function (e) {
            let btnOpcional = $(e.currentTarget).attr('__btn_opcional');
            funs.datosOpcionales(btnOpcional);
          })

          /* Cuando hace click en cambiar modo  entre validar los datos de carnet o no*/
          .on('click', '[__validacion_btn]', function () {
            funs.cambiarModoValidacionCedula();
          })

      }


      let formInit = (() => {
        listeners();
        // listenersPreguntasQuemadas();
        funs.creaFormularioDatosEncuestado();
        // ctxMain.creaEncuesta();

      })()


    })

  };

}
