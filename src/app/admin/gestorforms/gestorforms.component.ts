import { Component, OnInit } from '@angular/core';
import { UAuthService } from 'src/app/shared/uauth.service';
declare var $: any;
declare var _: any;
declare var xyzFuns: any;
declare var PNotify: any;


@Component({
  selector: 'app-gestor-forms',
  templateUrl: './gestorforms.component.html',
})
export class GestorFormsComponent implements OnInit {

  constructor(private uAuth: UAuthService) { }

  ngOnInit() {
    let gestor = this.gestorformularios;
    gestor();
    // this.gestorformularios();
  }

  gestorformularios = () => {
    let cmp = this; 

    $(function(){
      /*----   ctxG variable que contiene el contexto global, variables globales */
      let ctxG = {
        rutabase: xyzFuns.urlRestApi,
        content: '#gestor_formulario',
        mostrarMensajeFloat:function(obj){
          new PNotify({
            title: obj.status== 'ok' ? 'Guardado' : 'Error',
            text: obj.msg,
            shadow: true,
            opacity: 0.9,
                // addclass: noteStack,
                type: (obj.status== 'ok') ? "success" : "danger",
                // stack: Stacks[noteStack],
                width: obj.width || 300,
                delay: obj.delay || 2000
            });
  
        },
      }
    
      let elemshtml = {
        acciones_elemento: /*html*/`
            <div class="__acciones_elemento pull-right" style="position:absolute; top: 2px; right: 0px; display:flex; flex-direction: column">
              <span accion="subir" class=" text-muted p5 pr10" style="cursor: pointer; " title="Subir posición"><i class="fa fa-chevron-up fa-lg"></i></span>
              <span accion="bajar" class=" text-muted p5 pr10" style="cursor: pointer; " title="Bajar posición"><i class="fa fa-chevron-down fa-lg"></i></span>
              <span accion="quitar" class=" text-muted ml10_ p5 pr10" style="cursor: pointer; " title="Quitar elemento"><i class="fa fa-trash-o fa-lg"></i></span>
            </div>`,
        titulo: /*html*/`
            <div class="__elemento row" __tipo="titulo" __id="">
              <textarea type="text" class="quest quest-input quest-titulo __elem_texto " placeholder="Escriba el título.." rows="1"></textarea>						
              <!--<textarea type="text" class="quest-input quest-descripcion __elem_descripcion" placeholder="descripción" style="height: 30px" rows="1"></textarea>-->
              </div>`,
        texto: /*html*/`
            <div class="__elemento row" __tipo="texto" __id="">
              <textarea type="text" class="quest quest-input quest-texto __elem_texto " placeholder="Escriba el texto.."  rows="1"></textarea>					
            </div>`,
        separador: /*html*/`
            <div class="__elemento row" __tipo="separador" __id="">
              <hr style="margin: 10px 0;">
            </div>`,
        pregunta: /*html*/`
            <div class="__elemento row pv10" __tipo="pregunta" __id="">  
              <!-- Pregunta y descripcion-->
              <div class="col-xs-9">
                <textarea type="text" class="__elem_texto quest quest-input quest-pregunta" 
                placeholder="Escriba la pregunta.." rows="1"></textarea>
                <textarea type="text" class="quest-input quest-descripcion __elem_descripcion" placeholder="descripción" style="height: 30px" rows="1"></textarea>					
              </div>
    
              <!-- Ayuda y depende de-->
              <div __config=elemento class="col-xs-3 fs12 " style="position:relative; right:18px">
                <span __config_btn="requerido"   class=" text-center bg-light darker br12 p5 ph10"  title="Activar si la respuesta es obligatoria" style="cursor:pointer; z-index: 12"><i class="fa fa-lock "></i></span>
                <span __config_btn="ayuda"   class=" text-center bg-light darker br12 p5 ph10"  title="Colocar un  mensaje de ayuda" style="cursor:pointer; z-index: 12"><i class="fa fa-question "></i></span>
                <!--<span __config_btn="depende" class=" text-center bg-light darker br12 p5 ph8"   title="Esta Pregunta depende de una respuesta de otra pregunta anterior" style="cursor:pointer; z-index: 12"><i class="fa-solid fa-reply  "></i></span>-->
                <input __config_btn="ancho"   class=" text-center bg-light br12 p3 fs10"  title="El ancho de este bloque en porcentaje, pude coloca cualquier valor como 25, 33, 50, 100." style="z-index: 12; width: 35px"  value=100 >
                
                <div __config_cuadro class="text-center br8 p3 fs12 hide" style="position:absolute; left: 15px; top: 20px; 
                  z-index: 13; background-color: #0e0e27b5;"> 
                    <textarea __config_input=ayuda class=" p5 hide" style="min-height: 150px; min-width: 200px" title="Escribir la ayuda que aparecera al hacer click sobre el signo de interrogación"></textarea>
                    <!--<input __config_input=depende type="text" class="pw100 p5 hide" title="Escribir la pregunta y la opcion de la cual depende si se muestra o no esta pregunta, ejemplo 1.2 depende de la pregunta 1 opcion 2 ">-->                
                </div>
                <div class="cuadro_fondo hide " style="position:fixed; top:0; left:0; width:100vw; height:100vh; background-color: #33333333; z-index:11">
                </div>
              </div>	
    
              <!-- seleccion de tipo de respuesta -->					
              <div class="col-xs-12">
                <select __select_tipo_pregunta class=" form-control" style="height: 24px; padding: 0 15px;  width: auto;">
                  <option value="single"        >Selección simple</option>
                  <option value="multiple"      >Selección multiple</option>
                  <option value="select"        >Selección</option>
                  <!--<option value="mixta"         >Selección mixta</option>-->
                  <option value="open_sm"       >Respuesta corta</option>
                  <option value="open_lg"       >Respuesta larga</option>
                  <option value="number"        >Número</option>
                  <option value="date"          >Fecha</option>
                  <option value="select_numbers">Selector de números</option>
                </select>
              </div>
              <div class="__elem_respuesta pl5 col-xs-12 fs14">
              </div>	
            </div>`,
    
        /*Tipos de preguntas */
    
        pregunta_corta: /*html*/`
            <div style="border-bottom:1px solid grey; width: 50%; height: 30px; padding:5px">Respuesta..
            </div>`,
        pregunta_numero: /*html*/`
            <div style="border-bottom:1px solid grey; width: 50%; height: 30px; padding:5px; text-align:right">0
            </div>`,
        pregunta_fecha: /*html*/`
            <div style="border-bottom:1px solid grey; width: 50%; height: 30px; padding:5px">dd/mm/aaaa
            </div>`,
        pregunta_larga: /*html*/`
            <div style="border:1px solid grey; width: 90%; height: 70px; padding:5px; margin-top:7px">Respuesta ...
            </div>`,
        select_numbers: /*html*/`
            <div style="margin: 10px; padding: 10px ">
              <!--<select class="form-control w150 mh10"></select>-->
              <span class="mh10 p10">Rango de
                <input __select_numbers_min class="w50 ph5" value="0" placeholder="Min"> a <input __select_numbers_max class="w50 ph5" value="99" placeholder="Max"></span>
            </div>`,
    
        pregunta_seleccion: /*html*/`	
            <div  class="__respuesta_select w150 mt10 br-a br-greyerh-30 pv5 ph10" placeholder="Seleccionar opción" style="display:none"><span class="text-dark"> opciones </span>
            <i class="fa fa-angle-down pull-right"></i>
              
            </div>
            <ul class="__opciones_respuesta quest_option_single mv10 pl15" style="list-style: none;"></ul>
            <a  href="javascript:void(0)" class="__agregar_opcion_seleccion ml15"><i class="fa fa-plus-circle fa-lg"></i> Agregar opción</a>
            <span class="ml30">
              <input  type="checkbox" __opcion_otro ><span class="ml5">"Otro..."</span>
              <!--Para opcion OTRO Ayuda y salta a otra pregunta -->
              <div __config=opcion_otro class="w50 fs10 " style="position:relative; display: inline-block">
                <span __config_btn="ayuda" 		class=" text-center bg-light darker br12 p5 ph10"  title="Colocar un  mensaje de ayuda" style="cursor:pointer; z-index: 12"><i class="fa fa-question "></i></span>
                <!--<span __config_btn="goto" 		class=" text-center bg-light darker br12 p5 ph8"   title="Al responder esta opción salta a otra pregunta" style="cursor:pointer; z-index: 12"><i class="fa-solid fa-share-from-square"></i></span>-->
                
                <div __config_cuadro class="text-center br8 p3 fs12 hide" style="position:absolute; left: 15px; top: 20px; 
                  z-index: 13; background-color: #0e0e27b5;"> 
                    <textarea __config_input=ayuda class=" p5 hide" style="min-height: 150px; min-width: 200px"
                    title="Escribir la ayuda que aparecera al hacer click sobre el signo de interrogación"></textarea>
                    <!--<input __config_input=goto type="text" class="pw100 p5 hide" title="Escribir el numero pregunta a la que pasará al responder con esta opcion. Ej. 60">-->
                </div>
                <div class="cuadro_fondo hide " style="position:fixed; top:0; left:0; width:100vw; height:100vh; background-color: #33333333; z-index:11">
                </div>
              </div>	
            </span>
            <span class="ml30">
              <input  type="checkbox" __opcion_ninguno ><span class="ml5">"Ninguno"</span>
              <!--Para opcion Ninguno Ayuda y salta a otra pregunta -->
              <!--<div __config=opcion_ninguno class="w75 fs10 " style="position:relative; display: inline-block">
                <span __config_btn="goto" 		class=" text-center bg-light darker br12 p5 ph8"   title="Al responder esta opción salta a otra pregunta" style="cursor:pointer; z-index: 12"><i class="fa-solid fa-share-from-square"></i></span>
                
                <div __config_cuadro class="text-center br8 p3 fs12 hide" style="position:absolute; left: 15px; top: 20px; 
                  z-index: 13; background-color: #0e0e27b5;"> 
                    <input __config_input=goto type="text" class="pw100 p5 hide" title="Escribir el numero pregunta a la que pasará al responder con esta opcion. Ej. 60">
                </div>
                <div class="cuadro_fondo hide " style="position:fixed; top:0; left:0; width:100vw; height:100vh; background-color: #33333333; z-index:11">
                </div>
              </div>-->	
            </span>
            <span class="ml30">
              <div style="    display: inline-flex; flex-direction: column;">
                <span>
                    <input  type="checkbox" __agregar_opcion_columna_dimension ><span class="ml5">Agregar columna dimensión</span>
                </span>
                <span>
                  <input type="text" __nombre_dimension placeholder="Nombre dimensión" style="display:none">
                  <select __tipo_dimension style="display:none">
                    <option value="text">Texto</option>
                    <option value="number">Numero</option>
                    <option value="date">Fecha</option>
                  </select>
                </span>
              </div>
            </span>`,
        /*Opciones de seleccion mixta*/
        opcion_seleccion: /*html*/`					
            <li class="mt5 __opcion_seleccion" __id=""> 
              <bullet></bullet><div class="w10  __opcion_numero " style="display:inline-block"></div><input class="quest-input quest_opcion __opcion_texto " style="width:50%"  placeholder="Escriba la opción" value=""> 
    
              <!-- Ayuda y salta a otra pregunta -->
              <div __config=opcion class="w150 fs10 ml5" style="position:relative; display: inline-block">
                <span __config_btn="checkbox" 	class=" text-center bg-light darker br12 p5 ph10"  title="Opción Combinada" style="cursor:pointer; z-index: 12"><i class="fa-regular fa-square-check fa-lg"></i></span>
                <span __config_btn="ayuda" 		class=" text-center bg-light darker br12 p5 ph10"  title="Colocar un  mensaje de ayuda" style="cursor:pointer; z-index: 12"><i class="fa fa-question "></i></span>
                <!--<span __config_btn="goto" 		class=" text-center bg-light darker br12 p5 ph8"   title="Al responder esta opcion salta a otra pregunta" style="cursor:pointer; z-index: 12"><i class="fa-solid fa-share-from-square"></i></span>-->
                
                <div __config_cuadro class="text-center br8 p3 ml5 fs12 hide" style="position:absolute; left: 15px; top: 20px; 
                  z-index: 13; background-color: #0e0e27b5;"> 
                    <textarea __config_input=ayuda class=" p5 hide" style="min-height: 150px; min-width: 200px"
                    title="Escribir la ayuda que aparecera al hacer click sobre el signo de interrogación"></textarea>
                    <!--<input __config_input=goto type="text" class="pw100 p5 hide" title="Escribir el numero pregunta a la que pasará al responder con esta opcion. Ej. 60">-->
                </div>
                <div class="cuadro_fondo hide " style="position:fixed; top:0; left:0; width:100vw; height:100vh; background-color: #33333333; z-index:11">
                </div>
              </div>	
    
              <span class="hide">
                  <span accion="subir"  class="fa fa-chevron-circle-up text-muted" style="cursor:pointer"title="subir" ></span> 
                  <span accion="bajar"  class="fa fa-chevron-circle-down text-muted" style="cursor:pointer"title="bajar"></span> 
                  <span accion="quitar" class="glyphicons glyphicons-remove_2 text-muted" style="cursor:pointer"title="eliminar opcion"></span> 
              </span>	
            </li>`,   
      
      }
    
      let ctxMain = {
        adicionarElemento: (elem) => {
          let contenidoElementos = $("[__contenido_elementos]");
          if(elem == 'pregunta'){
            let newElem = $(elemshtml.pregunta);
            /*le agrega la respuesta de seleccion*/
            newElem.find('.__elem_respuesta').first().append(elemshtml.pregunta_seleccion);
            /*le agrega por defecto la respuesta de seleccion simple*/
            newElem.find('.__opciones_respuesta').first().append(elemshtml.opcion_seleccion);
            contenidoElementos.append(newElem);
          }
          if(elem == 'titulo'){
            contenidoElementos.append(elemshtml.titulo);
          }
          if(elem == 'texto'){
            contenidoElementos.append(elemshtml.texto);
          }
          if(elem == 'separador'){
            $(contenidoElementos).append(elemshtml.separador);
          }
    
          let height = $(contenidoElementos)[0].scrollHeight;
          $(contenidoElementos).animate({ scrollTop: height }, 3000);
          let elementoAdd = $(contenidoElementos).find('.__elemento').last();
          elementoAdd.trigger('click');
          elementoAdd.find('textarea').first().focus();
    
        },
        ejecutaAccionElemento: (accion, elemento) => {
          if(accion == 'quitar'){
            $(elemento).remove();
          }
          if(accion == 'subir'){
            $(elemento).insertBefore(elemento.prev())
          }
          if(accion == 'bajar'){
            $(elemento).insertAfter(elemento.next())
          }
        },
    
        seleccionaTipoRespuesta: (tipo, elemento) => {
          let elem_respuesta = $(elemento).find('.__elem_respuesta');
    
          /* si ya es de opciones y se cambia a tipo opciones css  , y no se hace nada*/
          if (elem_respuesta.find('.__opciones_respuesta').length > 0 && (tipo == 'single' || tipo == 'multiple' || tipo == 'mixta' )) {
            elem_respuesta.find('.__opciones_respuesta').removeClass('quest_option_single quest_option_multiple quest_option_mixta').addClass('quest_option_' + tipo);
            elem_respuesta.find('.__respuesta_select').hide();
            return;
          }
          /* si ya es de opciones y se cambia a select  ,solo se muestra el select y no se hace nada */
          if (elem_respuesta.find('.__opciones_respuesta').length > 0 && (tipo == 'select')) {
            elem_respuesta.find('.__opciones_respuesta').removeClass('quest_option_single quest_option_multiple quest_option_mixta').addClass('quest_option_single');
            elem_respuesta.find('.__respuesta_select').show();
            return;
          }
          if (tipo == 'select') {
            elem_respuesta.html(elemshtml.pregunta_seleccion);
            elem_respuesta.find('.__opciones_respuesta').removeClass('quest_option_single quest_option_multiple quest_option_mixta').addClass('quest_option_single');
            elem_respuesta.find('.__respuesta_select').show();
          }
          if (tipo == 'single') {
            elem_respuesta.html(elemshtml.pregunta_seleccion);
            elem_respuesta.find('.__opciones_respuesta').removeClass('quest_option_single quest_option_multiple quest_option_mixta').addClass('quest_option_single');
            elem_respuesta.find('.__respuesta_select').hide();
          }
          if (tipo == 'multiple') {
            elem_respuesta.html(elemshtml.pregunta_seleccion);
            elem_respuesta.find('.__opciones_respuesta').removeClass('quest_option_single quest_option_multiple quest_option_mixta').addClass('quest_option_multiple');
            elem_respuesta.find('.__respuesta_select').hide();
          }
          if (tipo == 'mixta') {
            elem_respuesta.html(elemshtml.pregunta_seleccion);
            elem_respuesta.find('.__opciones_respuesta').removeClass('quest_option_single quest_option_multiple quest_option_mixta').addClass('quest_option_mixta');
            elem_respuesta.find('.__respuesta_select').hide();
          }
          if (tipo == 'open_sm') {
            elem_respuesta.html(elemshtml.pregunta_corta)
          }
          if (tipo == 'open_lg') {
            elem_respuesta.html(elemshtml.pregunta_larga)
          }
          if (tipo == 'select_numbers') {
            elem_respuesta.html(elemshtml.select_numbers)
          }
          if (tipo == 'number') {
            elem_respuesta.html(elemshtml.pregunta_numero)
          }
          if (tipo == 'date') {
            elem_respuesta.html(elemshtml.pregunta_fecha)
          }
        },

        agregaOpcion: (elemento) => {
          let opcionesRespuesta = $(elemento).find('.__opciones_respuesta');
          opcionesRespuesta.append(elemshtml.opcion_seleccion);
          funs.enumeraOpciones(elemento);
          opcionesRespuesta.find('.__opcion_seleccion').last().focus();
        },
        /** obtiene data */
        getData: function () {
          let formulario = {
            id_formulario: $("[__rg_field=id_formulario]").val(),
            _token: $("[__rg_field=_token]").val(),
            elementos: [],
          }
          let elementos = $(`[__contenido_elementos] .__elemento`);
          _.forEach(elementos, function (elemento, k) {
            /* Comunes del elemento*/
            let tipoElemento = $(elemento).attr('__tipo');
            let objElem: any = {};
            objElem.id = $(elemento).attr('__id')
            objElem.tipo = tipoElemento;
            objElem.texto = $(elemento).find('.__elem_texto').first().val() || "";
            objElem.orden = k;
  
            let objConfig: any = {};
            if (tipoElemento == 'pregunta') {
              objElem.descripcion = $(elemento).find('.__elem_descripcion').first().val() || "";
              // objElem.dependencia = $(elemento).find('[__config_input=depende]').first().val().trim();
  
              objConfig.tipo_respuesta = $(elemento).find('[__select_tipo_pregunta]').first().val();
              objConfig.ayuda = $(elemento).find('[__config=elemento] [__config_input=ayuda]').first().val().trim();
              objConfig.requerido = $(elemento).find('[__config=elemento] [__config_btn=requerido]').first().hasClass('requerido')
              // objConfig.dependencia = $(elemento).find('[__config_input=depende]').first().val().trim();
              objConfig.ancho = parseInt($(elemento).find('[__config=elemento] [__config_btn=ancho]').first().val().trim());
              objConfig.ancho = (objConfig.ancho == isNaN || objConfig.ancho < 0 || objConfig.ancho > 100) ? 100 : objConfig.ancho;   
  
              if (_.includes(['single', 'multiple', 'mixta', 'select'], objConfig.tipo_respuesta)) {
  
                objConfig.opcion_otro = $(elemento).find('[__opcion_otro]').first().is(':checked');
                objConfig.opcion_otro_ayuda = $(elemento).find('[__config=opcion_otro] [__config_input=ayuda]').val();
                // if (objConfig.opcion_otro)
                //   objConfig.opcion_otro_goto = $(elemento).find('[__config=opcion_otro] [__config_input=goto]').val();
  
                objConfig.opcion_ninguno = $(elemento).find('[__opcion_ninguno]').first().is(':checked');
                // if (objConfig.opcion_ninguno)
                //   objConfig.opcion_ninguno_goto = $(elemento).find('[__config=opcion_ninguno] [__config_input=goto]').val();

                /* Para la columna dimension si esta cheked*/
                if($(elemento).find('[__agregar_opcion_columna_dimension]').first().is(':checked') && $(elemento).find('[__nombre_dimension]').val().trim().length > 0 ){
                  objConfig.nombre_dimension = $(elemento).find('[__nombre_dimension]').val();
                  objConfig.tipo_dimension = $(elemento).find('[__tipo_dimension]').val();
                }
  
                objElem.opciones = [];
  
                _.forEach($(elemento).find('.__opciones_respuesta .__opcion_seleccion'), function (op, k) {
                  let opcionBlq = $(op);
  
                  /* Es comodin si el tipo es mixta y ademas es de tipo check*/
                  let tipoComodin = $(elemento).find('[__select_tipo_pregunta]').first().val() == 'mixta' && opcionBlq.hasClass('quest_option_mixta_check');
  
                  let objOp: any = {
                    opcion_texto: opcionBlq.find('.__opcion_texto').val(),
                    orden: k,
                    id: opcionBlq.attr('__id'),
                  }
                  /* lee las config de la opcion */
                  let objOpConfig = {};
                  objOpConfig = {
                    ayuda: opcionBlq.find('[__config=opcion] [__config_input=ayuda]').first().val().trim(),
                    // goto: opcionBlq.find('[__config=opcion] [__config_input=goto]').first().val().trim(),
                    opcion_combinada: tipoComodin
                  }
  
                  objOp.config = JSON.stringify(objOpConfig);
                  objElem.opciones.push(objOp);
                })
              }
  
              if (objConfig.tipo_respuesta == 'select_numbers') {
                objConfig.min = $(elemento).find('[__select_numbers_min]').first().val();
                objConfig.max = $(elemento).find('[__select_numbers_max]').first().val();
              }
  
              objElem.config = JSON.stringify(objConfig);
            }
            formulario.elementos.push(objElem);
          })
          return formulario;
        },
        setData: function (objForm) {
          $("[__contenido_elementos]").html('');
          /* NUEVO : verifica si no existe el obj es para nuevo cuestionario*/
          if (!objForm) {
            // $(`${ctxMain.idmodal} textarea, ${ctxMain.idmodal} input`).val('');
            // ctxMain.adicionarElemento("titulo");
          }
          /* EDITAR */
          else {  
            objForm.elementos.forEach(function (objElem) {
              ctxMain.adicionarElemento(objElem.tipo);
  
              let elemento = $("[__contenido_elementos] .__elemento").last();
              $(elemento).attr('__id', objElem.id);
              $(elemento).find('.__elem_texto').val(objElem.texto);
  
              if (objElem.tipo == 'pregunta') {
                $(elemento).find('.__elem_descripcion').val(objElem.descripcion);
  
                let cnfElem = JSON.parse(objElem.config) || {};
  
                $(elemento).find('[__select_tipo_pregunta]').val(cnfElem.tipo_respuesta);
                $(elemento).find('[__select_tipo_pregunta]').trigger('change');
                $(elemento).find('[__config=elemento] [__config_input=ayuda]').val(cnfElem.ayuda);
                $(elemento).find('[__config=elemento] [__config_btn=requerido]').addClass(cnfElem.requerido ? 'requerido' : '');
                // $(elemento).find('[__config_input=depende]').val(cnfElem.dependencia);
                $(elemento).find('[__config=elemento] [__config_btn=ancho]').val(cnfElem.ancho ? cnfElem.ancho : 100  );
  
                funs.pintaBloqueConfig($(elemento).find('[__config=elemento]'));
  
  
                if (_.includes(['single', 'multiple', 'mixta', 'select'], cnfElem.tipo_respuesta)) {
                  $(elemento).find('.__opciones_respuesta').html(''); // limpia el espacio de opciones, por la opcion por defecto que deja el select trigger
  
  
                  /* recorrre las opciones*/
                  _.forEach(objElem.opciones, function (objOpcion, k) {
                    // _.forEach(objElem.opciones, function(op) {
                    let opcionSeleccion = $(elemshtml.opcion_seleccion)
                    opcionSeleccion.attr('__id', objOpcion.id);
                    opcionSeleccion.find('.__opcion_texto').first().val(objOpcion.opcion_texto);
                    opcionSeleccion.find('.__opcion_numero').first().html(parseInt(k + 1) + '. ');
    
                    let cnfOpcion = JSON.parse(objOpcion.config) || {};
  
                    opcionSeleccion.find('[__config=opcion] [__config_input=ayuda]').val(cnfOpcion.ayuda ? cnfOpcion.ayuda : '');
                    // opcionSeleccion.find('[__config=opcion] [__config_input=goto]').val(cnfOpcion.goto ? cnfOpcion.goto : '');
  
                    if (cnfElem.tipo_respuesta == 'mixta' && cnfOpcion.opcion_combinada == true) {
                      opcionSeleccion.addClass('quest_option_mixta_check');
                      // opcionSeleccion.find('[__config_btn=checkbox]').addClass('bg-info')
                    }
  
                    funs.pintaBloqueConfig(opcionSeleccion);
                    $(elemento).find('.__opciones_respuesta').first().append(opcionSeleccion);
                  });
                  /* Si tiene opcion OTRO*/
                  if (cnfElem.opcion_otro) {
                    $(elemento).find('[__opcion_otro]').prop('checked', cnfElem.opcion_otro)
                    $(elemento).find('[__config=opcion_otro] [__config_input=ayuda]').val(cnfElem.opcion_otro_ayuda);
                    // $(elemento).find('[__config=opcion_otro] [__config_input=goto]').val(cnfElem.opcion_otro_goto);
                    funs.pintaBloqueConfig($(elemento).find("[__config=opcion_otro]"));
                  }
                  /* Si tiene opcion NINGUNO*/
                  if (cnfElem.opcion_ninguno) {
                    $(elemento).find('[__opcion_ninguno]').prop('checked', cnfElem.opcion_ninguno)
                    // $(elemento).find('[__config=opcion_ninguno] [__config_input=goto]').val(cnfElem.opcion_ninguno_goto);
                    funs.pintaBloqueConfig($(elemento).find("[__config=opcion_ninguno]"));
                  }
                  /* Si tiene campo opcion nombredimension*/
                  if (cnfElem.nombre_dimension) {
                    $(elemento).find('[__agregar_opcion_columna_dimension]').prop('checked', true).trigger('change');
                    $(elemento).find('[__nombre_dimension]').val(cnfElem.nombre_dimension);
                    $(elemento).find('[__tipo_dimension]').val(cnfElem.tipo_dimension);
                  }
                }
  
                if (cnfElem.tipo_respuesta == 'select_numbers') {
                  $(elemento).find('[__select_numbers_min]').val(cnfElem.min);
                  $(elemento).find('[__select_numbers_max]').val(cnfElem.max);
                }
              }
            });
          }
        },
        save: function () {
          let objSend: any = ctxMain.getData();
          funs.spinner(true);
          $.post(ctxG.rutabase + '/save-form-elems', cmp.uAuth.addToken(objSend), function (res) {
            funs.spinner(false);
            ctxMain.setData(res.data);
  
            res.delay = 3000;
            ctxG.mostrarMensajeFloat(res);
            /* Para que se acomoden los tamaños*/
            $("[__tipo=pregunta] textarea").trigger('keydown');
          }).fail(function (r) {
            funs.spinner(false);
            ctxG.mostrarMensajeFloat({ estado: 'error', msg: 'Hubo un error inesperado' });
          });
        },
      }
    
      let funs = {
        cargarComboFomularios: () => {
          $.get(`${ctxG.rutabase}/get-forms`, cmp.uAuth.addToken({}), 
          res => {
            let comboFormularios = $("[__rg_field=id_formulario]");
            let optsForms = xyzFuns.generaOpciones(res.data, 'id', 'nombre');
            comboFormularios.append(optsForms);
            funs.cargarFormulario(comboFormularios.val());
          })
        },

        /** Carga el formulario seleccionado */
        cargarFormulario: (id_formulario) => {
          funs.spinner();

          $.post(`${ctxG.rutabase}/get-form-elems`, cmp.uAuth.addToken({ id_formulario: id_formulario }), function (res) {
            ctxMain.setData(res.data);
            /* Para que se acomoden los tamaños*/
            $("[__tipo=pregunta] textarea").trigger('keydown');
            funs.spinner(false);
          });
          /* Para que se acomoden los tamaños*/
          $("[__tipo=pregunta] textarea").trigger('keydown ');
        },
  
        
        /* Acciones de eliminar arriba abajo de las opciones*/
        ejecutaAccionOpcion: (accion, opcionBloque) => {
          let elemento = $(opcionBloque.closest('.__elemento'));
    
          if(accion == 'quitar'){
            $(opcionBloque).remove();
          }
          if(accion == 'subir'){
            $(opcionBloque).insertBefore(opcionBloque.prev())
          }
          if(accion == 'bajar'){
            $(opcionBloque).insertAfter(opcionBloque.next())
          }
          funs.enumeraOpciones(elemento)
        },
        /* Pone numeracion a las opciones */
        enumeraOpciones: (elemento) => {
          let opciones = $(elemento).find('.__opciones_respuesta li' );
          _.forEach(opciones, function(elem, k){
            $(elem).find('.__opcion_numero').html(parseInt(k + 1) + '. ');
          });
        },
        /* Mjuestra el cuadro configuracion para ayuda y depende de*/
        muestraCuadroConfig: (accion, config) => {
          /*Abrir: si tiene la clase hide es que el cuadro no estaba abierto*/
          if ($(config).find(`[__config_input=${accion}]`).hasClass('hide')) {
            $("[__config_cuadro]").addClass('hide');
            $("[__config_input]").addClass('hide');
            $(".cuadro_fondo").addClass('hide');
    
            $(config).find('.cuadro_fondo').removeClass('hide');
            if(accion == 'ayuda'){
              $(config).find('[__config_cuadro]').removeClass('hide');
              $(config).find('[__config_input=ayuda]').removeClass('hide').focus();
            }
          }
          /* cerrar cuadro*/
          else{
            funs.ocultaCuadroConfig(config);
            funs.pintaBloqueConfig(config);
          }
        },
        ocultaCuadroConfig: (config) => {
          $(config).find("[__config_cuadro]").addClass('hide');
          $(config).find("[__config_input]").addClass('hide');
          $(config).find(".cuadro_fondo").addClass('hide');
        },
        /* Si el config (ayuda o depende) tiene texto se pinta de color para indicar quetiene contenido*/
        pintaBloqueConfig: (config) => {
          let classNormal  = 'bg-light darker';
          let classAyuda   = 'bg-info light';
          let classRequerido = 'bg-danger darker';
    
          $(config).find('[__config_input=ayuda]').val() != "" ? 
            $(config).find(("[__config_btn=ayuda]")).removeClass(classNormal).addClass(classAyuda)
            : $(config).find(("[__config_btn=ayuda]")).removeClass(classAyuda).addClass(classNormal);
          
          $(config).find('[__config_btn=requerido]').hasClass('requerido')?
            $(config).find(("[__config_btn=requerido]")).removeClass(classNormal).addClass(classRequerido)
            : $(config).find(("[__config_btn=requerido]")).removeClass(classRequerido).addClass(classNormal);

        },
        spinner: (obj = {}) => {
          xyzFuns.spinner(obj, ctxG.content)
        }
    
    
    
      }
    
      let listeners = () => {
        $("#gestor_formulario")
        /** Seleccionar Formulario */
        .on('change', "[__rg_field='id_formulario']", function() {
          funs.cargarFormulario($("[__rg_field=id_formulario]").val());
        })
    
        /* heigh automatica en textareas*/
        .on('change drop keydown cut paste','textarea', function() {
            $(this).height('auto');
            $(this).height($(this).prop('scrollHeight'));
          })
    
        /* Click en agregar elemento */
        .on('click', "[__agregar_elem]", function(e){
          let elem = $(e.currentTarget).attr('__agregar_elem');
          ctxMain.adicionarElemento(elem);
        })
    
        /* Acciones mouse over y seleccion de algun elemento*/
        .on('mouseenter ', '.__elemento', function () {
          let div = $(this);
          div.addClass('elemento_over');
          div.prepend(elemshtml.acciones_elemento);        	
        })
        .on('mouseleave', '.__elemento', function(){
          let div = $(this);
          div.removeClass('elemento_over')
          div.find('.__acciones_elemento').remove();      	
        })
        .on('click', '.__elemento', function(){
          let div = $(this);
          $(".__elemento").removeClass('elemento_sel');
          div.addClass('elemento_sel');
        })
    
        /*  click en Acciones del elemento */
        .on('click', '.__acciones_elemento span', function(){
          ctxMain.ejecutaAccionElemento( $(this).attr('accion'), $(this).closest('.__elemento') );
        })
    
        /* Seleccionar el tipo de respuesta */
        .on('change', '[__select_tipo_pregunta]', function(){
          ctxMain.seleccionaTipoRespuesta( $(this).val(), $(this).closest('.__elemento'))
        })
    
        /* CLick en Agregar opcion*/
        .on('click', '.__agregar_opcion_seleccion', function () {
          ctxMain.agregaOpcion($(this).closest('.__elemento'))
        })
    
        /* Mouse enter de las opciones  y sus acciones*/
        .on('mouseenter ', 'li.__opcion_seleccion', function(){
          let div = $(this);
          div.children('span').removeClass('hide');        	
        })
        .on('mouseleave', 'li.__opcion_seleccion', function(){
          let div = $(this);
          div.children('span').addClass('hide');      	
        })
    
        /*  click en Acciones de la opcion */
        .on('click', '.__opciones_respuesta li span[accion]', function(){
          funs.ejecutaAccionOpcion( $(this).attr('accion'), $(this).closest('li') );
        })
    
        /* click en la configuraciones de un elemento pregunta (ayuda, depende de,  reqerido) */
        .on('click', '[__config] [__config_btn]', function(e){
          let configBtn = $(this);
          if (configBtn.attr('__config_btn') == 'requerido') {
            configBtn.toggleClass('requerido');
            funs.pintaBloqueConfig($(this).closest('[__config]'))
          }
          /*si el boton de configuracion es de opcion y de convertir en comodin*/
          else if (configBtn.attr('__config_btn') == 'checkbox') {
            configBtn.closest('li.__opcion_seleccion').first().toggleClass('quest_option_mixta_check')
          }
          else
            funs.muestraCuadroConfig(configBtn.attr('__config_btn'), configBtn.closest('[__config]'));
        })
        .on('click', '.cuadro_fondo', function(e){
          funs.ocultaCuadroConfig($(this).closest('[__config]'));
          funs.pintaBloqueConfig($(this).closest('[__config]'))
        })
        /* alhacer click en habilitar colunna dimension , Mostrar opciones de dimension */
        .on('change', '[__agregar_opcion_columna_dimension]', function(e){
          $(e.currentTarget).closest('.__elemento').find('[__nombre_dimension]').toggle();
          $(e.currentTarget).closest('.__elemento').find('[__tipo_dimension]').toggle();
        })
    
        /* botones acciones de la formulario guardar  ... */
        .on('click', '[__accion_formulario=save]', function(e){
          // let accion = $(this).attr("__accion_formulario");
          ctxMain.save();
        })
      }
    
      let gestionInit = (() => {
        listeners();
        funs.cargarComboFomularios();
        // funs.cargarFormulario();    
      })();

  
    });
  }
  

}
