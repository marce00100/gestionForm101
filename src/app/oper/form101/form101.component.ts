import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SFormService } from 'src/app/shared/sform.service';
import { UAuthService } from 'src/app/shared/uauth.service';

declare var $: any;
declare var _: any;
declare var QRCode: any;
declare var moment: any;
declare var xyzFuns: any;

@Component({
  selector: 'app-form',
  templateUrl: './form101.component.html',
  styles: []
})
export class Form101Component implements OnInit {

  constructor(
    private router: Router,
    private uauth: UAuthService,
    private sform: SFormService,
    private routeurl: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.form();
  }

  /**
   * Verifica si existe parametros , entonces devuelve un objeto con el uid y la accion que puede ser editar o anular
   * @returns uid
   */
  existeParametro(){
    let uid = this.routeurl.snapshot.paramMap.get('uid');
    let accion = this.routeurl.snapshot.paramMap.get('accion');
    return (uid && uid.length > 0) ? { uid: uid, accion: accion } : false;
  }

  form() {
    let component = this;
    $(function () {

      let ctxG: any = {
        rutabase: xyzFuns.urlRestApi,
        content: "#formulario_101",
        timeIni: new Date(), /* Para calcular tiempo*/
        municipios: [],
        datosUserNims: [],
        objFrmData: {},
        config_comprar_formularios: 0,
      }

      let form = {
        elemhtml : {
          /* Elementos */
          pregunta_rend: /*html*/`
                            <div __card class="__elemento row_ mnw100 grow-1 " __tipo="pregunta" __id_elemento="" __pregunta_numero __titulo_principal_seccion>                          
                                <div class="__elem_texto quest quest-pregunta  "  ></div>
                                <div class="__elem_descripcion quest quest-descripcion "  ></div>
                                <div class="__elem_respuesta pl5 col-md-12_"  __tipo_respuesta="" __dependencia>
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
                                <div class="mt5 mb15">
                                        <input type="text" class="bg-white  form-control quest-input-line quest-texto __open_sm" placeholder="" style="width:80%" autocomplete="no__autocompletar" >
                                </div>`,
          respuesta_numero_rend: /*html*/` 
                                <div class="mt5 mb15">
                                        <input type="number" class="bg-white  form-control quest-input-line quest-texto __number" placeholder="" style="/*width:150px*/" autocomplete="no-autocompletar-" >
                                </div>`,
          respuesta_fecha_rend: /*html*/` 
                                <div class="mt5 mb15">
                                        <input type="date" class="bg-white  form-control quest-input-line quest-texto __date" placeholder="" style="width:150px"autocomplete="no__autocompletar"  >
                                </div>`,
          respuesta_larga_rend: /*html*/` 
                                <div class="mt5 mb15">
                                        <textarea class="bg-white  form-control quest-input-line quest-texto __open_lg" placeholder="" style="width:80%" rows="2"  ></textarea>
                                </div>`,
  
          respuesta_select_numbers_rend: /*html*/` 
                                <div class="mt5 mb15">
                                        <select class="form-control w100 ph15 __select_numbers"></select>
                                </div>`,
          
          respuesta_select_rend: /*html*/` 
                                <div class="__opciones_respuesta mt5 mb15">
                                        <select class="form-control  __select"></select>
                                </div>`,

  
          respuesta_seleccion_rend: /*html*/` 
                                <ul class="__opciones_respuesta mv10 pl15" style="list-style: none;"></ul>`,

          /* Opcion de seleccion*/
          opcion_seleccion_rend: /*html*/`
                                <li class="mt5 flex justify-around align-start flex-wrap" __opcion> 
                                    <div class="flex align-start grow-1 " style="flex-basis:50%">
                                      <input __id_opcion __opcion_texto __opcion_numero id="" type="" name="" class="" title="" value="" >
                                      <label class=" quest quest-opcion ml5" for=""></label>
                                    </div>                                    
                                </li>`,  

          /* Opcion  "Otro... "*/
          opcion_otro_rend:   /*html*/`
                                <li class="mt5 flex justify-around align-start flex-wrap" __opcion > 
                                    <div class="flex align-start grow-1 wp100" >
                                      <input  __opcion_texto="Otro" id="" type="" name="" class="" title="" value="" >
                                      <label class=" quest quest-opcion ml5" for=""></label>
                                    </div>
                                    <div class="flex align-start grow-1 " style="gap: 5px; flex-basis:50%">
                                      <input type="text"  __opcion_otro class="bg-white  form-control quest-input-line quest-texto hide" placeholder="Especifique ..."  style="width:80%; display:inline-block"  >
                                    </div>
                                </li>`,
  
          /* Opcion  "Ninguno"*/
          opcion_ninguno_rend:   /*html*/`
                                <li class="mt5 " style="display:flex; align-items: flex-start; gap: 5px"> 
                                    <input  __opcion_texto="Ninguno" id="" type="checkbox" name="" class="" title="" value="" >
                                    <label class=" quest quest-opcion" for="">Ninguno.</label> 
                                </li>`,
  
          ayuda: /*html*/`  
                <span __ayuda class="">
                    <span __ayuda_btn class=" text-center bg-primary br12 p5 ph8 ml10 fs11" title="más información..." style="cursor:pointer; position:relative">
                        <i class="fa fa-question "></i>
                    </span>
                    <div __ayuda_texto class="hide fs12 text-white" style="top: 22px; right:0px;position: absolute;background: #000000aa;padding: 15px;border-radius: 12px;min-width: 200px;  z-index: 13;"></div>
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
              let numeroPregunta = form.cortarNumero(objElem.texto);
              $(elemento).find('.__elem_texto').html(objElem.texto);
              // $(elemento).find('.__elem_texto').html(numeroPregunta.texto);
              $(elemento).attr('__pregunta_texto_completo', objElem.texto);
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

              /* Si es requerido */
              if(cnfElem.requerido)
                $(elemento).attr('required', true);
              
                /* Modifica el ancho */
              if(cnfElem.ancho)
                $(elemento).css('width', cnfElem.ancho + '%');

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
                  $(opcion).find('input').attr('__id_opcion', op.id).attr('__opcion_numero', numeroOpcion).attr('__opcion_texto', op.opcion_texto).attr('id', op.id).attr('name', objElem.id).attr('type', typeinput).attr('__goto', cnfOpcion.goto ? cnfOpcion.goto : '');
                  $(opcion).find('label').attr('for', op.id).text(`${k + 1}. ${op.opcion_texto}`);

                  /* si  tiene DIMENSIONES */
                  if (cnfElem.nombre_dimension && cnfElem.nombre_dimension.length > 0 && cnfElem.tipo_dimension && cnfElem.tipo_dimension.length > 0){
                    let dimensionHtml = /*html*/`
                        <div class="grow-1"  __dimension style="display:none">
                          <span>${cnfElem.nombre_dimension}</span>
                          <input type="${cnfElem.tipo_dimension}" __opcion_nombre_dimension="${cnfElem.nombre_dimension}" style="width: 80px; padding: 2px 5px; border: 0px; border-bottom: 1px grey solid">
                        </div>
                    `
                    $(opcion).append(dimensionHtml);
                  }

                  /* La config opcion para la ayuda */
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

                  /* Si tiene DIMENSIONES OTRO*/
                  if (cnfElem.nombre_dimension && cnfElem.nombre_dimension.length > 0 && cnfElem.tipo_dimension && cnfElem.tipo_dimension.length > 0){
                    let dimensionHtml = /*html*/`
                        <div class="grow-1" __dimension style="display:none">
                          <span>${cnfElem.nombre_dimension}</span>
                          <input type="${cnfElem.tipo_dimension}" __opcion_nombre_dimension="${cnfElem.nombre_dimension}" style="width: 80px; padding: 2px 5px; border: 0px; border-bottom: 1px grey solid">
                        </div>
                    `
                    $(bloque_otro).append(dimensionHtml);
                  }

                  $(elemento).find('.__opciones_respuesta').append(bloque_otro);
                }

                /* Opcion NINGUNO*/
                if (cnfElem.opcion_ninguno) {
                  let typeinputNinguno = 'checkbox'; // Siempre debe ser checkbox para habilitar o deshabilitar a los demas options
                  let bloque_ninguno = $(form.elemhtml.opcion_ninguno_rend);

                  let numeroCorrelativoNinguno = $(elemento).find('.__opciones_respuesta li').length + 1;
                  let id_rand = Math.random(); /* Crea un id aleatorio para el for del label con el input */
                  $(bloque_ninguno).find('input[__opcion_texto=Ninguno]').attr('__goto', cnfElem.opcion_ninguno_goto).attr('id', id_rand).attr('name', objElem.id).attr('type', typeinputNinguno);
                  $(bloque_ninguno).find('label').attr('for', id_rand).html(`${numeroCorrelativoNinguno}. Ninguno`);

                  $(elemento).find('.__opciones_respuesta').append(bloque_ninguno);
                }
              }
              if (cnfElem.tipo_respuesta == 'select') {
                $(elemento).find('.__elem_respuesta').append(form.elemhtml.respuesta_select_rend);
                // $(elemento).find(".__opciones_respuesta").append(form.elemhtml.respuesta_select_rend);
                // console.log(objElem.opciones);
                let opts = xyzFuns.generaOpciones(objElem.opciones, 'opcion_texto', 'opcion_texto');   

                /* Opcion OTRO*/
                if (cnfElem.opcion_otro) {
                  opts += /*html*/`<option value="Otro">Otro..</option>`;
                  let inputOtro = /*html*/`
                        <div class="flex align-start grow-1 " style="gap: 5px; flex-basis:50%">
                          <input type="text"  __opcion_otro class="bg-white  form-control quest-input-line quest-texto hide" placeholder="Especifique ..."  style="width:80%; display:inline-block"  >
                        </div>`;
                  $(elemento).find(".__opciones_respuesta").append(inputOtro);
                }
                $(elemento).find('.__select').html(opts);

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
        /* Separa los textos de las preguntas en numero y texto , a partir del punto .*/
        cortarNumero: (texto) => {
          let separado = texto.split(".");
          return (separado.length > 1) ? { numero: separado[0].trim(), texto: separado.slice(1).join(".").trim(), }
            : { numero: '', texto: texto, }
        },
        getData() {
          let timeFin = new Date();
          let contest = {            
            tiempo_seg: 0, 
            respuestas: []
          };

          // $.extend(contest, datosCabeceraObj);
          _.forEach($(".__elemento[__tipo='pregunta']"), function (elemento, k) {

            let tipoRespuesta = $(elemento).find('[__tipo_respuesta]').first().attr('__tipo_respuesta');
            if (tipoRespuesta == 'single' || tipoRespuesta == 'multiple' || tipoRespuesta == 'mixta') {
              _.forEach($(elemento).find("input:checked"), function (opcionChecked) {
                let opChecked = $(opcionChecked);
                let objResp: any = {
                  id_elemento: $(elemento).attr('__id_elemento'),
                  // id_opcion: opChecked.attr('__id_opcion') || null,
                  respuesta_opcion: opChecked.attr('__opcion_texto'),
                  respuesta: (opChecked.attr('__opcion_texto') == "Otro") ?
                    opChecked.closest('li').find('[__opcion_otro]').first().val() : opChecked.attr('__opcion_texto'),
                  
                  }
                  
                /* obtener las dimensiones (una sola por le momento) */  
                let dimensiones = opChecked.closest('[__opcion]').find('[__dimension]');
                if ($(dimensiones).length > 0) {
                  let arrayDimensiones = [];
                  _.forEach($(dimensiones).find('input[__opcion_nombre_dimension]'), (dimension, k) => {
                    let dim = { key: $(dimension).attr('__opcion_nombre_dimension'), value: $(dimension).val() };
                    arrayDimensiones.push(dim);
                    /* temporales solo sirven para una dimension, el que vale seria el arrayDimensiones*/
                    objResp.nombre_dimension = dim.key;
                    objResp.valor_dimension = dim.value;
                  })
                  objResp.dimensiones = JSON.stringify(arrayDimensiones);
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
            if (tipoRespuesta == 'select') {
              let respSelect = $(elemento).find(".__select");
              if(respSelect.val() && respSelect.val().trim().length > 0  ){
                let objResp = {
                  id_elemento: $(elemento).attr('__id_elemento'),
                  respuesta: respSelect.val(),
                  respuesta_opcion: respSelect.val(),
                }
                contest.respuestas.push(objResp);
              }
            }

          });
          return contest;
        },
        /**
         * Para colocar los datos en el form para edicion
         * @param respuestas array de arrays con las respuestas (pueden ser de selccion multipla)
         */
        setData: (respuestas) => {
          _.forEach(respuestas, function (respArray, k){
            let respFirst = respArray[0];
            let cnfElem = JSON.parse(respFirst.config) || {};
            if (cnfElem.tipo_respuesta && cnfElem.tipo_respuesta.length > 0){
              
              if (_.includes(['open_sm', 'number', 'date'], cnfElem.tipo_respuesta)) {
                $(`.__elemento[__tipo='pregunta'][__pregunta_texto_completo='${respFirst.texto}']`).find('input').first().val(respFirst.respuesta);
              }
              if (_.includes([ 'select_numbers', 'select'], cnfElem.tipo_respuesta)) {
                $(`.__elemento[__tipo='pregunta'][__pregunta_texto_completo='${respFirst.texto}']`).find('select').first().val(respFirst.respuesta);
              }
              if (cnfElem.tipo_respuesta == 'open_lg' ) {
                $(`.__elemento[__tipo='pregunta'][__pregunta_texto_completo='${respFirst.texto}']`).find('textarea').first().val(respFirst.respuesta);
              }

              if (cnfElem.tipo_respuesta == 'single' || cnfElem.tipo_respuesta == 'multiple' || cnfElem.tipo_respuesta == 'mixta') {
                let elemOpciones = $(`.__elemento[__tipo='pregunta'][__pregunta_texto_completo='${respFirst.texto}']`);

                _.forEach(respArray, (resp, k) => {
                  let opcionSeleccionada = $(elemOpciones).find(`input[__opcion_texto='${resp.respuesta_opcion}']`);
                  $(opcionSeleccionada).prop('checked', true).trigger('change');

                  /*si tiene dimension subimos al nivel de Li para buscar el input de dimension de la opcion*/
                  if(resp.valor_dimension && resp.valor_dimension.length > 0){
                    opcionSeleccionada.closest('li').find(`input[__opcion_nombre_dimension='${resp.nombre_dimension}']`).val(resp.valor_dimension);
                  }

                  /* si es opcion otro subimos al nivel de li, para buscarel input opcion_otro */
                  if(resp.respuesta_opcion == 'Otro'){
                    opcionSeleccionada.closest('li').find(`input[__opcion_otro]`).val(resp.respuesta);
                  }
                })
              }
                


              //TODO hacer lo mismo para ninguno
              //TODO verificar con tipos de respuestas 

            }


          })
        }
        
      }

      let funs = {
        verificaNuevoOEdicion: () => {
          let parametros = component.existeParametro();
          funs.mostrarSeccionFormularioVigentes();

          /* si no existe el parametro querystring  uid entonces es un nuevo formulario */
          if (!parametros) {
            funs.cargarComboUserNims();
            $("[__accion_form=anular]").hide();
          }
          /* si es para editar */
          else {
            let uid = parametros.uid;
            let accion = parametros.accion;
            funs.spinner();
            $.post(`${ctxG.rutabase}/form-lleno-resp-foredit`, component.uauth.addToken({ fluid: uid }), (resp) => {
              if (resp.status == 'error') {
                funs.stateView('inicial');
                funs.mostrarError(resp.msg);
                funs.spinner(false);
                return;
              }
              
              $("[__formularios_disponibles_label]").html(resp.data.formularios_disponibles);

              $("[__accion_form=anular]").show();

              let formlleno = resp.data;
              let nim_concat = `FORM-101 ${formlleno.tipo_formulario_nombre} - NIM: ${formlleno.nim} - Municipio: ${formlleno.municipio}`;
              $("[__select_nim]").append(/*html*/`<option value=${formlleno.nim}>${nim_concat}</option>`);
              $("[__select_nim] option")[0].selected = true;
              $("[__select_nim]").prop('disabled', true);

              funs.renderFormulario(formlleno);
              
              if(accion == 'anular'){
                $("[__accion_form=anular]").trigger('click');
              }
              funs.spinner(false);
            })
          }

        },
        /** Carga los Formularios inicialmente */
        cargarComboUserNims: () => {
          funs.stateView('inicial')
          funs.spinner();
          $.post(`${ctxG.rutabase}/nimsforms-activos-for-user`, component.uauth.addToken({}), (res) => {

            $("[__formularios_disponibles_label]").html(res.data[0].formularios_disponibles);

            /*Verifica si esta habilitada la compra de creditos y tambien si el usuario dispone de formularios para enviasr */
            if(ctxG.config_comprar_formularios == 1 && res.data[0].formularios_disponibles <= 0){
              funs.stateView('inicial');
              funs.mostrarError(/*html*/`No puede enviar mas formularios, se agotó su disponibilidad de formularios. 
                            <br><b>Debe adquirir una cantidad de formularios para poder enviar nuevamente.</b>
                            <p>Comuníquese con la gobernación de Chuquisaca para mas información.</p>`);
              funs.spinner(false);
              return;
            }
            /* Si no tiene NIMS asociados */
            if(res.data.length == 0){
              $("[__select_nim]").prop('disabled', true); 
              funs.mostrarError(/*html*/`<br><b>No se tiene ningún Número de NIM registrado.</b><br>
              Es posible que haya caducado o no se realizó el registro con la documentación correspondiente. 
              <br><br>Por favor contáctese con las oficinas de la Gobernación de Chuquisaca.<br>` )
              funs.spinner(false);
              return;
            }

            ctxG.datosUserNims = _.map(res.data, (item) => {
                    item.nim_concat = `FORM-101 ${item.tipo_formulario_nombre} - NIM: ${item.nim} - Municipio: ${item.municipio}`;
                    return item;
                  });
            let optsForms = xyzFuns.generaOpciones(res.data, 'nim', 'nim_concat', ' ');
            $("[__select_nim]").append(optsForms);  
            /** Si solo es una opcion se bloquea el combo */
            if(res.data.length == 1) {
              $("[__select_nim] option")[1].selected =  true; 
              $("[__select_nim]").trigger('change').prop('disabled', true); 
            }
            

            funs.spinner(0);
          });
          
        },
        /**Carga el formulario con sus elementos */
        renderFormulario: (objFormData) => {
          funs.spinner();
          /**
           * Se guarda en la variable global,
           * ya sea que venga desde selectNim que contiene los datos generales ; 
           * o que venga desde formLLenoEdit que contiene los datos generales mas un atributo con las reespuestas en forma de vector  */
          ctxG.objFrmData = objFormData         
          funs.crearDatosGeneral(objFormData);
          $.post(`${ctxG.rutabase}/get-form-elems`, component.uauth.addToken({ id_formulario: objFormData.id_formulario }), function (res) {
            if(res.status == 'error'){
              funs.mostrarError(res.msg);
              funs.spinner(false);
              return;
            }

            $("[__frm_formulario]").html("");
            form.renderizarElementos(res.data, "[__frm_formulario]");

            /* si tiene respuestas es para editar */
            if(objFormData.respuestas){
              form.setData(objFormData.respuestas);
            }
            funs.stateView('mostrar_formulario')
            funs.spinner(false);
          });
        },
        /** Carga Datos del usuario */
        crearDatosGeneral: (objDatoGeneral) => {
          /* Se llena la informacion del tipo de formulario de la cabecera*/
          $("[__tipo_mineral]").html(objDatoGeneral.tipo_formulario_nombre);
          let htmlDatosGeneral= component.sform.htmlRenderDatosGeneral(objDatoGeneral);
          $("[__frm_datos_general]").html(htmlDatosGeneral);
        },
        /** Mostrar seccion de formulatios vigentes depende si esta habilitada la configuracion de comprar_formularios */
        mostrarSeccionFormularioVigentes: () => {
          $.post(`${ctxG.rutabase}/param-valor`, component.uauth.addToken({ nombre: 'comprar_formularios', dominio: 'config' }), (res) => {
            ctxG.config_comprar_formularios = res.data;
            $("[__formularios_disponibles_section]").hide();
            if(ctxG.config_comprar_formularios == 1)
              $("[__formularios_disponibles_section]").show();
          });
        },
        /** Guarda el Form */
        save() {
          let noCumplenValidacion = funs.noCumplenValidacion(ctxG.content, '.__elemento[required]', 'error-validacion');
          if(noCumplenValidacion.length > 0)
            return;

          funs.spinner();
          delete ctxG.objFrmData.respuestas; /* se quita las respuestas, para que no sobreponga a datasend */
          let dataSend: any = form.getData();
          $.extend(dataSend, ctxG.objFrmData);

          (ctxG.objFrmData.id) ? dataSend.accion = 'editar' : dataSend.accion = 'nuevo';

          // dataSend.id_formulario = ctxG.objFrmData.id_formulario;
          console.log('Obj enviar save', dataSend);
          $.post(`${ctxG.rutabase}/save-respuestas`, component.uauth.addToken(dataSend), (res) => {
            if(res.status == 'error'){
              funs.mostrarError(res.msg);
              funs.spinner(false);
              return;
            }

            funs.spinner(false);
            funs.stateView('guardado', res.data.uid); 
          }).fail(function (r) {
            funs.mostrarError("Hubo un error inesperado.");
            funs.spinner(false);
          })
        },
        saveAnular() {
          funs.spinner();
          delete ctxG.objFrmData.respuestas; /* se quita las respuestas, para que no sobreponga a datasend */
          let dataSend = {
            id : ctxG.objFrmData.id,
            uid : ctxG.objFrmData.uid,
            accion: 'anular'
          };
          console.log('Obj enviar save', dataSend);
          $.post(`${ctxG.rutabase}/save-respuestas`, component.uauth.addToken(dataSend), (res) => {
            if(res.status == 'error'){
              funs.mostrarError(res.msg);
              funs.spinner(false);
              return;
            }

            funs.spinner(false);
            component.router.navigate(['listaforms'])
          }).fail(function (r) {
            funs.mostrarError("Hubo un error inesperado.");
            funs.spinner(false);
          })
        },
        /* Verifica requeridos */
        noCumplenValidacion: (container, selectorFieds, classError) => {

          // //TODO  quitar - solo es para pruebas para hacer pasar sin validar
          // return [];
          // //TODO end

          let noCumplen = [];
          $(`${container} ${ selectorFieds }`).find("[__tipo_respuesta]").removeClass(classError);

          // verifica los inputs y textareas
          _.forEach($(`${container} ${selectorFieds}`), (elemRequired) => {
            let tipo_respuesta = $(elemRequired).find("[__tipo_respuesta]").first().attr('__tipo_respuesta');
            if (tipo_respuesta == 'single' || tipo_respuesta == 'multiple' || tipo_respuesta == 'mixta') {
              if ($(elemRequired).find("input:checked").length <= 0) {
                noCumplen.push($(elemRequired).attr('__pregunta_numero'));
                $(elemRequired).find('[__tipo_respuesta]').addClass(classError);
              }
              if (!$(elemRequired).find('[__opcion_otro]').hasClass('hide') && $(elemRequired).find('[__opcion_otro]').val() == '') {
                noCumplen.push($(elemRequired).attr('__pregunta_numero'));;
                $(elemRequired).find('input').addClass(classError);
              }
            }
            else if(elemRequired == 'select_numbers' && $(elemRequired).find('select').first().val().length <= 0){
                noCumplen.push($(elemRequired).attr('__pregunta_numero'));            
                $(elemRequired).find('select').addClass(classError);
            }
            else if(_.includes(['open_sm', 'number', 'date', 'open_lg'], tipo_respuesta) && $(elemRequired).find('input, textarea').val().length <= 0){
              noCumplen.push($(elemRequired).attr('__pregunta_numero'));  
              $(elemRequired).find('input, textarea').addClass(classError);
            }
          })
          return  noCumplen;
        },
        /** Mjuestra ventana emergente para confirmar el evio del form */
        confirmar() {
          let noCumplenValidacion = funs.noCumplenValidacion(ctxG.content, '.__elemento[required]', 'error-validacion');
          if (noCumplenValidacion.length > 0)
            return;

          let op: any = {
            background_color: '#00000060',
            class_icon: '',
            class_texto: '',
            texto: /*html*/`
                <div class="panel mn"   style="">
                  <div class="panel-heading h-50 bg-marron--20 bg-system_ bg-success--40_ bg-666_ text-fff _darker">
                    <h5><i class="fa fa-send mr10"></i>Confirmar envío</h5>           
                    <span class="glyphicons glyphicons-remove_2 p3 close fs15" style="position: absolute; top: 5px; right: 10px; color: inherit; text-shadow: none; opacity: 0.8"></span>     
                  </div>
                  <div class="panel-body">
                    <div class="p20 fs14 bg-light text-center_ text-primary--60" style="text-align:justify; border-bottom: 1px solid #afafaf;" >
                      <p>El presente Formulario 101, tiene el carácter de declaración jurada y es de uso obligatorio para los operadores mineros, personas naturales y jurídicas que realicen el transporte y comercialización de minerales metálicos y no metálicos.</p>
                      <p><b>A partir de su emisión tiene 3 días para su utilización, caso contrario el mismo quedará sin efecto.</b></p>
                    </div>
                    <h4 class="text-center text-theme1--20 fw600">Desea continuar? </h4>
                    <div class="flex justify-evenly p10">
                      <button __accion_form="close" class="btn bg-eee ph20 br6 br-a br-dark fs14"> Cerrar</button>
                      <button __accion_form="save" class="btn btn-primary ph20 br6 br-a br-dark fs14"><i class="glyphicons glyphicons-ok"></i> Confirmar</button>
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
          $(ctxG.content).append(alert);
          $("[__alert]").show(300);
        },
        confirmarAnular() {
          let op: any = {
            background_color: '#00000060',
            class_icon: '',
            class_texto: '',
            texto: /*html*/`
                <div class="panel mn wp100"   style="">
                  <div class="panel-heading h-50 bg-danger--20 text-fff ">
                    <h5><i class="fa fa-send mr10"></i>Anular Formulario</h5>           
                    <span class="glyphicons glyphicons-remove_2 p3 close fs15" style="position: absolute; top: 5px; right: 10px; color: inherit; text-shadow: none; opacity: 0.8"></span>     
                  </div>
                  <div class="panel-body">
                    <div class="p20 fs14 bg-light text-center_ text-primary--60" style="text-align:justify; border-bottom: 1px solid #afafaf;" >
                      <p>Si elimina el presente formulario ya no podrá recuperarlo. </p>
                      <p>Esta acción quedará guardada en la base de datos, para efectos de control.</p>
                    </div>
                    <h4 class="text-center text-theme1--20 fw600">Desea anular el formulario ${ctxG.objFrmData.numero_formulario}? </h4>
                    <div class="flex justify-evenly p10">
                      <button __accion_form="close" class="btn bg-eee ph20 br6 br-a br-dark fs14"> Cerrar</button>
                      <button __accion_form="save_anular" class="btn bg-danger-60 ph20 br6 br-a br-dark fs14"> Anular</button>
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
          $(ctxG.content).append(alert);
          $("[__alert]").show(300);
        },
        /** Configura los elementos de la vista segun el contexto,solo en caso de error se requiere msg */
        stateView: (stateview, text = '') => {
          if(stateview == 'inicial'){
            // $("[__frm_content]").hide();
            $("[__frm_datos_general]").hide();
            $("[__frm_formulario]").hide();
            $("[__frm_enviar]").hide();
          }
          if(stateview == 'mostrar_formulario'){
            // $("[__frm_content]").show();
            $("[__frm_datos_general]").show();
            $("[__frm_formulario]").show();
            $("[__frm_enviar]").show();
          }
          if (stateview == 'guardado') {
            // $("[__frm_content]").show();
            $("[__frm_datos_general]").hide();
            $("[__frm_formulario]").hide();
            $("[__frm_enviar]").hide();

            let alert = /*html*/`
                      <h2 class="text-center">Se ha emitido la declaración del formulario.</h2>
                      <div class="flex justify-center p20" >
                        <div id="codigo_qr" __codigo_qr class="p5 bg-white" style="border: 5px solid #333333"></div>
                        <div class="flex flex-y justify-between">
                          <span __accion_form="share" class="fa fa-share-square-o fa-2x p5 text-dark cursor"></span>
                          <i __accion_form="downloadQR" class="glyphicons glyphicons-download_alt fa-2x p5 text-dark cursor"></i>
                        </div>
                      </div>
                      <div class="flex justify-evenly">
                        <button __accion_form="home" class="btn btn-lg btn-info br6 wp30 " >Volver a Inicio</button>
                        <button __accion_form="ver_form" __uid=${text} class="btn btn-lg btn-success br6 wp30" >Ver Formulario</button>
                      </div>
                  `;
            xyzFuns.alertMsg("[__frms]", alert, ' alert-success br-a br-success pastel   fs15 p20 br12 mt50', 'fa fa-check-circle fa-3x', '', false);
            let urlForm = component.sform.getUrlPublicForm(text)
            component.sform.generarQR("#codigo_qr", urlForm);           
          }

        },
        /** Descargar la imagen del QR*/
        downloadQR: ()=> {
          let dataUrl = document.querySelector('#codigo_qr').querySelector('img').src;
          downloadURI(dataUrl, 'qrcode.png');
          function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // delete link;
          };
        },
        /** Loscuadros de ayuda con su fondo */
        mostrarOcultarAyuda: (accion, ayuda) => {
          if (accion == 'mostrar') {
            if ($(ayuda).find('[__ayuda_texto]').hasClass('hide')) {
              /* Se ocultan all helps */
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
        /** Muestra ventana alert con mensajes de error , usado como error critico al no haber NIMS o rol no permitido */
        mostrarError: (msg) => {
          if (msg && msg.trim().length > 0)
            xyzFuns.alertMsg('[__error]', msg, 'mv10 alert-danger pastel pv15 br-a br-danger br6 fs15 wp90 ', '', '', true);
          else
            xyzFuns.alertMsgClose('[__error]');
        },
        /** Oculta ventana alert de error  */
        ocultarError: () => {
          xyzFuns.alertMsgClose('body');
        },
        /** Muestra u oculta el spinner */
        spinner: (obj = {}) => {
          xyzFuns.spinner(obj, ctxG.content)
        }


      }
      
      /** LISTENS */
      let listeners = () => {
        $(ctxG.content)
          /** Selecciona NIM */
          .on('change', "[__select_nim]", function (e) {
            let nimSel = $(e.currentTarget).val();  
            let objNimSel = _.find(ctxG.datosUserNims, item => item.nim == nimSel);           
            ( nimSel != '') ? funs.renderFormulario(objNimSel) : false;
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
          
          /* Al hacer click los botones de acciones_form ENVIAR GUARDAR CERRAR etc*/
          .on('click', "[__accion_form]", function (e) {
            let accion = $(e.currentTarget).attr("__accion_form");
            if(accion == 'send'){
              funs.confirmar();
            }
            if(accion == 'anular'){
              funs.confirmarAnular();
            }
            if (accion == 'home') {
              component.router.navigate(['listaforms'])
            }
            if(accion == 'save'){
              funs.save();
              $(e.currentTarget).closest("[__alert]").remove();
            }
            if(accion == 'save_anular'){
              funs.saveAnular();
              $(e.currentTarget).closest("[__alert]").remove();
            }
            if (accion == 'ver_form') {
              let uid = $(e.currentTarget).attr("__uid");
              component.router.navigate(['listaforms/' + uid]);
            }
            if(accion == 'downloadQR'){
              funs.downloadQR();
            }
            if(accion == 'close'){
              $(e.currentTarget).closest("[__alert]").remove();
            }
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
            
            /* para mostrar u ocultar las DImensiones */
            $(e.currentTarget).closest('[__opcion]').find('[__dimension]').toggle().find('input').val('');
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


      }


      let formInit = (() => {
        listeners();
        funs.verificaNuevoOEdicion();
      })()


    })

  };

}
