import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var _: any;
declare var xyzFuns: any;
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles: []
})
export class FormComponent implements OnInit {

  constructor() { }


  ngOnInit(): void {

    this.form();
    // form();
  }


  form = function () {
    $(function () {
      let ctxG: any = {
        rutabase: xyzFuns.urlRestApi,
        timeIni: new Date(), /* Para calcular tiempo*/
        municipios: [],
        datosUser: {}

      }

      let temp = {
        id_usuario: 4,
      }

      // let regmodel = {
      //   model: {
      //     title: "_",
      //     desc: "",
      //     new: true,
      //     update: true,
      //     delete: true,
      //     sections: [
      //       {
      //         html_parent: '.__frm_datos_general',
      //         title_section: 'Datos Generales',
      //         text_section: 'Información de la Procedencia',
      //         class: { text: "mb10", section: "", title: " quest-titulo" },
      //         fields: [
      //           {
      //             field: 'numero_form', type: 'text', label: 'Número Formulario', placeholder: '', title: '', help: '',
      //             required: true, grid_column_span: 2, class: { group: 'has-primary', label: 'mbn ptn form-label', icon: '', input: 'form-input p5' },
      //           },
      //           {
      //             field: 'numero_nit', type: 'text', label: 'Número NIT', placeholder: '', title: '', help: '',
      //             required: true, grid_column_span: 2, class: { group: 'has-primary', label: 'mbn ptn form-label', icon: '', input: 'form-input p5' },
      //           },
      //           {
      //             field: 'numero:nim', type: 'text', label: 'Número NIM', placeholder: '', title: '', help: '',
      //             required: true, grid_column_span: 2, class: { group: 'has-primary', label: 'mbn ptn form-label', icon: '', input: 'form-input p5' },
      //           },
      //           {
      //             field: 'departamento', type: 'select', label: 'Departamento', placeholder: '', title: '', help: '',
      //             required: true, grid_column_span: 2, class: { group: 'has-primary', label: 'mbn ptn form-label', icon: '', input: 'form-input p5' },
      //           },
      //           {
      //             field: 'municipio', type: 'select', label: 'Municipio', placeholder: '', title: '', help: '',
      //             required: false, grid_column_span: 2, class: { group: 'has-primary', label: 'mbn ptn form-label', icon: '', input: 'form-input p5' },
      //           },
      //         ]
      //       },
      //       // {
      //       //     html_parent : '[__frm_info_opcional_contenedor]',
      //       //     title_section: '',//'INFORMACIÓN ADICIONAL (opcional)',
      //       //     text_section: '',
      //       //     class: { text:"mb10", section:"", title:" quest-titulo"},
      //       //     fields:[
      //       //         {
      //       //             field: 'id_contestado', type: 'hidden', 
      //       //         },
      //       //         {
      //       //             field: 'nombre_apellido', type: 'text', label: 'Nombres y Apellidos (opcional)', placeholder: '', title: '', help: '',
      //       //             required: false, grid_column_span: 2, class: { group: 'has-primary', label: 'mbn ptn form-label', icon: '', input: 'form-input' },
      //       //         },                       
      //       //         {
      //       //             field: 'mail', type: 'text', label: 'Correo Electrónico y Apellidos (opcional)', placeholder: '', title: '', help: '',
      //       //             required: true, grid_column_span: 2, class: { group: 'has-primary', label: 'mbn ptn form-label', icon: '', input: 'form-input' },
      //       //         },                        
      //       //         {
      //       //             field: 'telefono', type: 'text', label: 'Número teléfono/ Celular', placeholder: '', title: '', help: '',
      //       //             required: false, grid_column_span: 2, class: { group: 'has-primary', label: 'mbn ptn form-label', icon: '', input: 'form-input' },
      //       //         },
      //       //     ]
      //       // },
      //     ],
      //     // columns_fields: ['user_login', 'first_name', 'last_name', 'fecha_nac', 'departamento'],
      //   },

      //   listasPredefinidas: {
      //     departamentos: ['CHUQUISACA', 'LA PAZ', 'COCHABAMBA', 'ORURO', 'POTOSÍ', 'TARIJA', 'SANTA CRUZ', 'BENI', 'PANDO'],
      //   },
      //   create_fields: (sections) => {
      //     _.forEach(sections, (sec) => {
      //       let contenedor = $(sec.html_parent);
      //       /* Cabecera de cada Seccion Titulo y Texto*/
      //       let sectionContainer = $(/*html*/`<div __section_container class="section_container ${sec.class.section}"></div>`);
      //       sectionContainer.append(/*html*/ `<h3  __title_section class="title_section ${sec.class.title}" style="">${sec.title_section}</h3>`);
      //       sectionContainer.append(/*html*/ `<div __text_section class="fs14 ${sec.class.text}">${sec.text_section}</div>`);

      //       let htmlFields = '';
      //       _.forEach(sec.fields, (field) => {

      //         field.class = (field.class) ? field.class : {};
      //         /* Todos los fields estan para reaccionar al Grid , para volver al estilo clasico descomentar form-horizontal y form-group. etc*/

      //         if (field.type == 'hidden') {
      //           htmlFields += /*html*/`
      //                                 <div class="section hidden">
      //                                         <input class="hidden" id="${field.field}" __rg_field="${field.field}" name="${field.field}" >
      //                                 </div>`
      //         }

      //         if (field.type == 'text' || field.type == 'number' || field.type == 'date' || field.type == 'password' || field.type == 'button') {
      //           htmlFields += /*html*/`
      //                                     <div class="form-horizontal ${field.class.bloque || ''} ${field.grid_column_span ? 'grid-column-span-2' : ''}" >
      //                                     <div class="form-group_      ${field.class.group || ''}  ">
      //                                         <label  class="col-xs-11 ${field.grid_column_span ? 'col-md-3' : 'col-md-4'} control-label ${field.class.label || ''}" for="${field.field}">${field.label}</label>
      //                                         <div    class="col-xs-11 ${field.grid_column_span ? 'col-md-8' : 'col-md-7'}">
      //                                             <span class="append-icon left"><i class="${field.class.icon}"></i>
      //                                             </span>
      //                                             <input type="${field.type}" class="form-control pl10 ${field.class.input || ''}" id="${field.field}" __rg_field="${field.field}" name="${field.field}"
      //                                             placeholder="${field.placeholder}" title="${field.title}" ${field.required ? 'required' : ''}  >
      //                                             <em class="fs12 text-dark block col-xs-12 ${field.class.em || ''} ">${field.help}</em>
      //                                         </div>
      //                                     </div>
      //                                     </div>`
      //         }

      //         if (field.type == 'select') {
      //           htmlFields += /*html*/`
      //                                     <div class="form-horizontal ${field.grid_column_span ? 'grid-column-span-2' : ''} ">
      //                                     <div class="form-group_     ${field.class.group}  ">
      //                                         <label class="col-xs-11 ${field.grid_column_span ? 'col-md-3' : 'col-md-4'} control-label ${field.class.label}" for="${field.field}">${field.label}</label>
      //                                         <div class="col-xs-11   ${field.grid_column_span ? 'col-md-8' : 'col-md-7'}">
      //                                             <span class="append-icon left"><i class="fa fa-list-ol"></i>
      //                                             </span>
      //                                             <select class="form-control pl10 col-xs-9  ${field.classinput}" id="${field.field}" __rg_field="${field.field}" name="${field.field}"
      //                                             title="${field.title}"  ${field.required ? 'required' : ''} style="height:auto;" ></select>
      //                                             <em class="fs12 text-dark block col-xs-12">${field.help}</em>
      //                                         </div>
      //                                     </div>
      //                                     </div>`
      //         }

      //       });
      //       sectionContainer.append(/*html*/`<div __rg_fields_container class="rg_grid_form">${htmlFields}</div>`)
      //       $(contenedor).append(sectionContainer);
      //     })


      //     // return contenedor;
      //   },

      //   inicializaControles: () => {
      //     let opts = xyzFuns.generaOpcionesArray(regmodel.listasPredefinidas.departamentos, " ");
      //     $("[__rg_field=departamento]").html(opts);

      //     // $.get(`${ctxG.rutabase}/getmunicipios`, function(resp){
      //     //     ctxG.municipios = resp.data;
      //     // });

      //     /* Combos DIa Mes Año*/
      //     let dias = _.concat(['01', '02', '03', '04', '05', '06', '07', '08', '09'], _.range(10, 31 + 1));
      //     $('[__rg_field=fecha_nacimiento_d]').html(xyzFuns.generaOpcionesArray(dias, " "));
      //     /*coloca 01 02 03 etc*/
      //     let meses = _.map(_.range(1, 12 + 1), function (elem) { return (`${elem}`).length == 1 ? `0${elem}` : elem });
      //     $('[__rg_field=fecha_nacimiento_m]').html(xyzFuns.generaOpcionesArray(meses, " "));

      //     let anos = _.range(2012, 1920 + 1);
      //     $('[__rg_field=fecha_nacimiento_y]').html(xyzFuns.generaOpcionesArray(anos, " "));
      //   },

      //   renderForm: () => {
      //     let sections = regmodel.model.sections;
      //     regmodel.create_fields(sections);
      //     regmodel.inicializaControles();
      //   },

      //   /* verifica los campos requeridos*/
      //   pasaCamposRequeridos: (user) => {
      //     $("[__rg_field]").closest(".form-horizontal > div ").removeClass('has-error')
      //     let pasa = true;
      //     _.forEach(regmodel.model.sections, (sec) => {
      //       _.forEach(sec.fields, (field) => {
      //         if (field.required && (user[field.field] == null || user[field.field] === '')) {
      //           $(`[__rg_field=${field.field}]`).closest(".form-horizontal > div ").addClass('has-error');
      //           pasa = false;
      //         }
      //       })
      //     })
      //     return pasa;
      //   }
      // }

      let form = {
        elemhtml : {
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
          respuesta_numero_rend: /*html*/` 
                                <div class="mt15 mb20">
                                        <input type="number" class="bg-white  form-control quest-input-line quest-texto __number" placeholder="" style="width:150px"  >
                                </div>`,
          respuesta_fecha_rend: /*html*/` 
                                <div class="mt15 mb20">
                                        <input type="date" class="bg-white  form-control quest-input-line quest-texto __date" placeholder="Escribe tu respuesta" style="width:150px"  >
                                </div>`,
          respuesta_larga_rend: /*html*/` 
                                <div class="mt15 mb20">
                                        <textarea class="bg-white  form-control quest-input-line quest-texto __open_lg" placeholder="Escribe tu respuesta" style="width:80%" rows="2"  ></textarea>
                                </div>`,
  
          respuesta_select_numbers_rend: /*html*/` 
                                <div class="mt15 mb20">
                                        <select class="form-control w100 ph15 __select_numbers"></select>
                                </div>`,

  
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
  
        },
        renderizarElementos: function (objForm, contenedor) {

          let tituloSeccion = '';

          _.forEach(objForm.elementos, function (objElem, k) {
            let tipoElemento = objElem.tipo;
            let contenidoElementos = $(contenedor);
            if (tipoElemento == 'pregunta')
              contenidoElementos.append(form.elemhtml.pregunta_rend);
            if (tipoElemento == 'titulo')
              contenidoElementos.append(form.elemhtml.titulo_rend);
            if (tipoElemento == 'texto')
              contenidoElementos.append(form.elemhtml.texto_rend);
            if (tipoElemento == 'separador')
              contenidoElementos.append(form.elemhtml.separador_rend);

            let elemento = $(`${contenedor} .__elemento`).last();
            $(elemento).attr('__id_elemento', objElem.id);

            if (objElem.tipo == 'titulo' || objElem.tipo == 'texto') {
              $(elemento).find('.__elem_texto').html(objElem.texto); /* Añade el texto de la pregunta titulo o texto */
            }

            if (objElem.tipo == 'titulo')
              tituloSeccion = objElem.texto; /* Para colocarlo en cada pregunta, para que se muestre en las cards*/

            if (objElem.tipo == 'pregunta') {
              let numeroPregunta = funs.cortarNumero(objElem.texto);
              $(elemento).find('.__elem_texto').html(objElem.texto);
              // $(elemento).find('.__elem_texto').html(numeroPregunta.texto);
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
                $(elemento).find('.__elem_texto').append(form.elemhtml.ayuda);
                $(elemento).find('[__ayuda_texto]').html(cnfElem.ayuda.replace(/\n/g, '<br>'));
              }

              /* Si la pregunta depende de una respuesta opcion*/
              if (cnfElem.dependencia && cnfElem.dependencia.length > 0) {
                $(elemento).find('[__tipo_respuesta]').first().attr('__dependencia', cnfElem.dependencia);
              }



              if (cnfElem.tipo_respuesta == 'single' || cnfElem.tipo_respuesta == 'multiple' || cnfElem.tipo_respuesta == 'mixta') {
                $(elemento).find('.__elem_respuesta').append(form.elemhtml.respuesta_seleccion_rend);

                _.forEach(objElem.opciones, function (op, k) {
                  let typeinput = cnfElem.tipo_respuesta == 'single' || cnfElem.tipo_respuesta == 'mixta' ? 'radio' : 'checkbox';

                  let cnfOpcion = JSON.parse(op.config) || {};

                  if (cnfElem.tipo_respuesta == 'mixta' && cnfOpcion.opcion_combinada)
                    typeinput = 'checkbox';

                  let opcion = $(form.elemhtml.opcion_seleccion_rend);
                  /* se coloca en cada checkitem el id para enlazarcon label y el name con id de elemento para agrupar */
                  let numeroOpcion = k + 1; 
                  $(opcion).find('input').attr('__id_opcion', op.id).attr('__opcion_numero', numeroOpcion).attr('__opcion_texto', op.opcion_texto).attr('id', op.id).attr('name', objElem.id).attr('type', typeinput);
                  $(opcion).find('label').attr('for', op.id).text(`${k + 1}. ${op.opcion_texto}`);

                  /* la config de la opcion ayuda y goto*/
                  $(opcion).find('input').attr('__goto', cnfOpcion.goto ? cnfOpcion.goto : '');
                  if (cnfOpcion.ayuda && cnfOpcion.ayuda.length > 0) {
                    $(opcion).append(form.elemhtml.ayuda);
                    $(opcion).find('[__ayuda_texto]').html(cnfOpcion.ayuda.replace(/\n/g, '<br>'));
                  }

                  $(elemento).find('.__opciones_respuesta').append(opcion);
                })

                /* Opcion OTRO*/
                if (cnfElem.opcion_otro) {
                  let typeinputOtro = cnfElem.tipo_respuesta == 'single' || cnfElem.tipo_respuesta == 'mixta' ? 'radio' : 'checkbox';
                  let bloque_otro = $(form.elemhtml.opcion_otro_rend);

                  let numeroCorrelativoOtro = $(elemento).find('.__opciones_respuesta li').length + 1;
                  let id_rand = Math.random(); /* Crea un id aleatorio para el for del label con el input */
                  $(bloque_otro).find('input[__opcion_texto=Otro]').attr('__goto', cnfElem.opcion_otro_goto).attr('id', id_rand).attr('name', objElem.id).attr('type', typeinputOtro);
                  $(bloque_otro).find('label').attr('for', id_rand).html(`${numeroCorrelativoOtro}. Otro:`);

                  $(elemento).find('.__opciones_respuesta').append(bloque_otro);
                }

                /* Opcion NINGUNO*/
                if (cnfElem.opcion_ninguno) {
                  let typeinputNinguno = 'checkbox'; // Siempre debe ser checkbox para habilitar o deshabilitar a todos los demas
                  let bloque_ninguno = $(form.elemhtml.opcion_ninguno_rend);

                  let numeroCorrelativoNinguno = $(elemento).find('.__opciones_respuesta li').length + 1;
                  let id_rand = Math.random(); /* Crea un id aleatorio para el for del label con el input */
                  $(bloque_ninguno).find('input[__opcion_texto=Ninguno]').attr('__goto', cnfElem.opcion_ninguno_goto).attr('id', id_rand).attr('name', objElem.id).attr('type', typeinputNinguno);
                  $(bloque_ninguno).find('label').attr('for', id_rand).html(`${numeroCorrelativoNinguno}. Ninguno`);

                  $(elemento).find('.__opciones_respuesta').append(bloque_ninguno);
                }
              }
              if (cnfElem.tipo_respuesta == 'open_sm')
                $(elemento).find('.__elem_respuesta').append(form.elemhtml.respuesta_corta_rend);
                
                if (cnfElem.tipo_respuesta == 'number')
                $(elemento).find('.__elem_respuesta').append(form.elemhtml.respuesta_numero_rend);
                
                if (cnfElem.tipo_respuesta == 'date')
                $(elemento).find('.__elem_respuesta').append(form.elemhtml.respuesta_fecha_rend);

              if (cnfElem.tipo_respuesta == 'open_lg')
                $(elemento).find('.__elem_respuesta').append(form.elemhtml.respuesta_larga_rend);

              if (cnfElem.tipo_respuesta == 'select_numbers') {
                $(elemento).find('.__elem_respuesta').append(form.elemhtml.respuesta_select_numbers_rend);
                let numeros = _.range(parseInt(cnfElem.min), parseInt(cnfElem.max) + 1);
                let opts = xyzFuns.generaOpcionesArray(numeros, " ");
                $(elemento).find('.__select_numbers').html(opts);
              }

            }
          });
        },
        getData() {
          let timeFin = new Date();
          // let datosCabeceraObj = xyzFuns.getData__fields('__rg_field');
          let contest = {            
            tiempo_seg: 0, 
            respuestas: []
          };

          // $.extend(contest, datosCabeceraObj);
          console.log('contest',contest);
          _.forEach($(".__elemento[__tipo='pregunta']"), function (elemento, k) {

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
            if (_.includes(['open_sm', 'number', 'date'], tipoRespuesta)) { 
              let respuesta_corta = $(elemento).find("input");
              if(respuesta_corta.val() && respuesta_corta.val().trim().length > 0  ){
                let objResp = {
                  id_elemento: $(elemento).attr('__id_elemento'),
                  respuesta: respuesta_corta.val(),
                }
                contest.respuestas.push(objResp);
              }
            }
            if (tipoRespuesta == 'open_lg') {
              let respuesta_larga = $(elemento).find("textarea");
              if(respuesta_larga.val() && respuesta_larga.val().trim().length > 0  ){
                let objResp = {
                  id_elemento: $(elemento).attr('__id_elemento'),
                  respuesta: respuesta_larga.val(),
                }
                contest.respuestas.push(objResp);
              }
            }
            if (tipoRespuesta == 'select_numbers') {
              let num = $(elemento).find(".__select_numbers");
              if(num.val() && num.val().trim().length > 0  ){
                let objResp = {
                  id_elemento: $(elemento).attr('__id_elemento'),
                  respuesta: num,
                  respuesta_opcion: num,
                }
                contest.respuestas.push(objResp);
              }
            }

          });
          return contest;
        },
        
      }

      let funs = {
        /** Carga los Formularios inicialmente */
        cargarComboFomularios: () => {
          funs.stateView('inicial')
          xyzFuns.spinner();
          $.get(`${ctxG.rutabase}/get-forms`, (res) => {
            let comboFormularios = $("[__rg_field=id_formulario]");
            let optsForms = xyzFuns.generaOpciones(res.data, 'id', 'nombre','-');
            comboFormularios.append(optsForms);  
            xyzFuns.spinner(0);
          });
          
        },
        /**Carga el formulario con sus elementos */
        cargarFormulario: (id_formulario) => {
          xyzFuns.spinner();
          funs.crearDatosCabecera(temp.id_usuario);
          $.post(`${ctxG.rutabase}/get-form-elems`, { id_formulario: id_formulario }, function (res) {
            $(".__frm_formulario").html("");
            form.renderizarElementos(res.data, ".__frm_formulario");
            xyzFuns.spinner(false);
            funs.stateView('mostrar_formulario')
          });
        },
        /** Carga Datos del usuario */
        crearDatosCabecera: (id_usuario) => {
          $.post(`${ctxG.rutabase}/operador-minero`, { id_usuario: id_usuario }, function (res) {
            ctxG.datosUser = res.data;
            $("[__info_general=nim]").html(`${_.isEmpty(ctxG.datosUser.nim) ? '' : ctxG.datosUser.nim}`);
            $("[__info_general=nit]").html(`${_.isEmpty(ctxG.datosUser.nit) ? '' : ctxG.datosUser.nit}`);

            let htmlNombres = !_.isEmpty(ctxG.datosUser.nombres) ? /*html*/`<span style="font-weight:400; font-size:0.8em">Nombre: </span> <span>${ctxG.datosUser.nombres} ${ctxG.datosUser.apellidos}</span>` : '';
            let saltoLinea = !_.isEmpty(htmlNombres) && !_.isEmpty(ctxG.datosUser.razon_social) ? "<br>" : "";            
            htmlNombres += !_.isEmpty(ctxG.datosUser.razon_social) ? /*html*/`${saltoLinea}<span style="font-weight:400; font-size:0.8em">Razón Social: </span> <span>${ctxG.datosUser.razon_social}</span>` :  '';
            $("[__info_general=nombres]").html(htmlNombres);

            let htmlProcedencia = !_.isEmpty(ctxG.datosUser.departamento) ? /*html*/`<span>${ctxG.datosUser.departamento}</span>` : '';
            // let saltoLinea = !_.isEmpty(htmlNombres) && !_.isEmpty(ctxG.datosUser.razon_social) ? "<br>" : "";            
            htmlProcedencia += !_.isEmpty(ctxG.datosUser.municipio) ? /*html*/`<br>Municipio: <span>${ctxG.datosUser.municipio} - Cód. Mun.: <span>${ctxG.datosUser.codigo_municipio} </span>` :  '';
            $("[__info_general=procedencia]").html(htmlProcedencia);
            
          })
        },
        save() {
          xyzFuns.spinner();
          let dataSend: any = form.getData();
          $.extend(dataSend, ctxG.datosUser);
          dataSend.id_formulario = $("[__rg_field=id_formulario]").val(),
          console.log('save',dataSend);
          $.post(`${ctxG.rutabase}/save-respuestas`, dataSend, function (res) {
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

        /* Separa los textos de las preguntas en numero y texto , a partir del punto .*/
        cortarNumero: (texto) => {
          let separado = texto.split(".");
          return (separado.length > 1) ? { numero: separado[0].trim(), texto: separado.slice(1).join(".").trim(), }
            : { numero: '', texto: texto, }
        },



        stateView: (stateview) => {
          if(stateview == 'inicial'){
            $(".__frm_datos_general").hide();
            $(".__frm_formulario").hide();
            $(".__frm_enviar").hide();
          }
          if(stateview == 'mostrar_formulario'){
            $(".__frm_datos_general").show();
            $(".__frm_formulario").show();
            $(".__frm_enviar").show();
          }
          if (stateview == 'guardado') {
            $(".__frm_datos_general").hide();
            $(".__frm_formulario").hide();
            $(".__frm_enviar").hide();
            $(".__botones_navegacion").hide();

            // $(".__frm_info_opcional").show();
            // funs.stateView('compartir_link')

              let mensje = /*html*/`
                        <h2 class="text-center">Se ha enviado exitosamente el formulario.</h2>
                        <h2>Muchas gracias.</h2>
                        <br><br><br>
                        <!--<div>Copia el siguiente enlace de la Encuesta Virtual, y comparte en tus redes sociales. </div>
                        <div class="fs24 mt20">https://1raencuesta.defensoria.gob.bo/</div> -->
                    `;
              xyzFuns.alertMsg("[__frm_select_form]", mensje, ' alert-dark pastel   fs18 p30 br12 mt50', 'fa fa-check-circle fa-3x', '', false)
          }
          // if (stateview == 'compartir_link') {
          //   $('[__frms]').remove();
          //   let mensje = /*html*/`
          //             <h2 class="text-center">Se ha enviado exitosamente la encuesta.</h2>
          //   <h2>Muchas gracias por participar.</h2>
          //             <br><br><br>
          //             <!--<div>Copia el siguiente enlace de la Encuesta Virtual, y comparte en tus redes sociales. </div>
          //             <div class="fs24 mt20">https://1raencuesta.defensoria.gob.bo/</div> -->
          //         `;
          //   xyzFuns.alertMsg("[__contenedor_forms]", mensje, ' alert-dark pastel   fs18 p30 br12 mt50', 'fa fa-check-circle fa-3x', '', false)
          // }


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

        mostrarError: (msg) => {
          $("[__error]").html(msg).removeClass('hide');
        },
        ocultarError: () => {
          $("[__error]").html('').addClass('hide')
        },

      }

      let listeners = () => {
        $("#formulario_101")
          /** Seleccionar Formulario */
          .on('change', "[__rg_field='id_formulario']", function () {
            $("[__rg_field=id_formulario]").val() != '' ? funs.cargarFormulario($("[__rg_field=id_formulario]").val()): false;
          })
          /* Tamaño de los textareas*/
          .on('change drop keydown cut paste', 'textarea', function () {
            $(this).height('auto');
            $(this).height($(this).prop('scrollHeight'));
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
            funs.save();
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
            // funs.navegacion(navegar);
          })


      }


      let formInit = (() => {
        listeners();
        funs.cargarComboFomularios();
        // funs.creaFormularioDatosCabecera();
        // form.creaFormulario();

      })()


    })

  };

}
