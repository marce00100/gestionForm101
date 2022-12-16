import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.form();
    // form();
  }

  volverInicio(){
    this.router.navigate(['listaforms']);
  }

  form = function () {
    let component = this;
    $(function () {

      let ctxG: any = {
        rutabase: xyzFuns.urlRestApi,
        timeIni: new Date(), /* Para calcular tiempo*/
        municipios: [],
        datosUserNims: [],
        nimSel: {},
        token: localStorage.getItem('uid_uid'),
      }

      let temp = {
        // id_usuario: 6, // 3 4 6
        id_formulario: 1
      }

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
                                <div class="mt5 mb20">
                                        <input type="text" class="bg-white  form-control quest-input-line quest-texto __open_sm" placeholder="" style="width:80%" autocomplete="no__autocompletar" >
                                </div>`,
          respuesta_numero_rend: /*html*/` 
                                <div class="mt5 mb20">
                                        <input type="number" class="bg-white  form-control quest-input-line quest-texto __number" placeholder="" style="width:150px" autocomplete="no-autocompletar-" >
                                </div>`,
          respuesta_fecha_rend: /*html*/` 
                                <div class="mt5 mb20">
                                        <input type="date" class="bg-white  form-control quest-input-line quest-texto __date" placeholder="" style="width:150px"autocomplete="no__autocompletar"  >
                                </div>`,
          respuesta_larga_rend: /*html*/` 
                                <div class="mt5 mb20">
                                        <textarea class="bg-white  form-control quest-input-line quest-texto __open_lg" placeholder="" style="width:80%" rows="2"  ></textarea>
                                </div>`,
  
          respuesta_select_numbers_rend: /*html*/` 
                                <div class="mt5 mb20">
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
              let numeroPregunta = form.cortarNumero(objElem.texto);
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

              /* Si es requerido */
              if(cnfElem.requerido)
                $(elemento).attr('require', true);
              
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
        /* Separa los textos de las preguntas en numero y texto , a partir del punto .*/
        cortarNumero: (texto) => {
          let separado = texto.split(".");
          return (separado.length > 1) ? { numero: separado[0].trim(), texto: separado.slice(1).join(".").trim(), }
            : { numero: '', texto: texto, }
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
        cargarComboUserNims: () => {
          funs.stateView('inicial')
          xyzFuns.spinner();
          $.post(`${ctxG.rutabase}/operador-nims`, {_token : ctxG.token}, (res) => {
            ctxG.datosUserNims = _.map(res.data, (item) => {
                    item.resumen = `NIM: ${item.nim}, Mineral: ${item.mineral}, Municipio: ${item.municipio}`;
                    return item;
                  });
            let optsForms = xyzFuns.generaOpciones(res.data, 'nim', 'resumen', ' ');
            $("[__select_nim]").append(optsForms);  
            /** Si solo es una opcion se bloquea el combo */
            if(res.data.length == 1) {
              $("[__select_nim] option")[1].selected =  true; 
              $("[__select_nim]").trigger('change').prop('disabled', true); 
            }
            if(res.data.length == 0){
              $("[__select_nim]").prop('disabled', true); 
              funs.stateView('error_critico', `<br><b>No se tiene ningún Número de NIM registrado.</b><br>
              Es posible que haya caducado o no se realizó el registro con la documentación correspondiente. 
              <br><br>Por favor contáctese con las oficinas de la Gobernación de Chuquisaca.<br>` )
            }

            xyzFuns.spinner(0);
          });
          
        },
        /**Carga el formulario con sus elementos */
        renderFormulario: () => {
          xyzFuns.spinner();
          funs.crearDatosGeneral();
          $.post(`${ctxG.rutabase}/get-form-elems`, { id_formulario: temp.id_formulario }, function (res) {
            $("[__frm_formulario]").html("");
            form.renderizarElementos(res.data, "[__frm_formulario]");
            xyzFuns.spinner(false);
            funs.stateView('mostrar_formulario')
          });
        },
        /** Carga Datos del usuario */
        crearDatosGeneral: () => {
          $("[__tipo_mineral]").html(ctxG.nimSel.tipo_formulario == 'form1' ? 'METÁLICOS' : 'NO METÁLICOS');
          $("[__info_general=nim]").html(`${(ctxG.nimSel.nim) ? ctxG.nimSel.nim : ''}`);
          $("[__info_general=nit]").html(`${(ctxG.nimSel.nit) ? ctxG.nimSel.nit : ''}`);

          let periodo = moment(Date.now()).format('DD/MM/YYYY');
          $("[__info_general=periodo]").html(`${periodo}`);

          let htmlNombres = !_.isEmpty(ctxG.nimSel.nombres) ? /*html*/`<span style="font-weight:400; font-size:0.8em">Nombre: </span> <span>${ctxG.nimSel.nombres} ${ctxG.nimSel.apellidos}</span>` : '';
          let saltoLinea = !_.isEmpty(htmlNombres) && !_.isEmpty(ctxG.nimSel.razon_social) ? "<br>" : "";
          htmlNombres += !_.isEmpty(ctxG.nimSel.razon_social) ? /*html*/`${saltoLinea}<span style="font-weight:400; font-size:0.8em">Razón Social: </span> <span>${ctxG.nimSel.razon_social}</span>` : '';
          $("[__info_general=nombres]").html(htmlNombres);

          let htmlProcedencia = /*html*/`<span>CHUQUISACA</span>`;
          // let saltoLinea = !_.isEmpty(htmlNombres) && !_.isEmpty(ctxG.nimSel.razon_social) ? "<br>" : "";            
          htmlProcedencia += (ctxG.nimSel.municipio) ? /*html*/`<br>Municipio: <span>${ctxG.nimSel.municipio} - Cód. Mun.: <span>${ctxG.nimSel.codigo_municipio} </span>` : '';
          $("[__info_general=procedencia]").html(htmlProcedencia);
          $("[__info_general=mineral]").html(`${(ctxG.nimSel.mineral) ? ctxG.nimSel.mineral : ''}`);

        },
        save() {
          let noCumplenValidacion = funs.noCumplenValidacion('#formulario_101', 'input', 'br-a br-danger bg-danger-80');
          console.log('nocumplen',noCumplenValidacion)
          if(noCumplenValidacion.length > 0)
            return;

          xyzFuns.spinner();
          let dataSend: any = form.getData();
          $.extend(dataSend, ctxG.nimSel);
          dataSend.id_formulario = ctxG.nimSel.tipo_formulario == 'form1' ? 1 : 1; // 2 //Esta quemado el formulario a que siempre sea el 1, solo cambian los titulos
          console.log('save', dataSend);
          $.post(`${ctxG.rutabase}/save-respuestas`, dataSend, function (res) {
            xyzFuns.spinner(false);
            if (res.status== 'ok') {
              funs.stateView('guardado');              
            }
          }).fail(function (r) {
            funs.mostrarError("Hubo un error inesperado.");
            xyzFuns.spinner(false);
          })
        },
        /* Verifica requeridos */
        noCumplenValidacion: (container, selectorFieds, classError) => {
          let noCumplen = [];
          $(`${container} ${ selectorFieds }`).removeClass(classError);

          // verifica los inputs y textareas
          _.forEach($(`${container} ${selectorFieds}`), function(elemInput){
            let tagHlml = $(elemInput).prop("tagName").toLowerCase();
            if ((tagHlml == 'input' || tagHlml == 'textarea' || tagHlml == 'select') && ($(elemInput).attr('type') !='checkbox') && $(elemInput).attr('__opcion_otro') == 'no') /*se pone una var temporal para que pase*/
              if ($(elemInput).val() == null || $(elemInput).val().trim() == '') {
                noCumplen.push($(elemInput).attr('id'));
                $(elemInput).addClass(classError);
              }

            
          })  

          return  noCumplen;
        },
        /* Configura los elementos de la vista segun el contexto,solo en caso de error se requiere msg */
        stateView: (stateview, msg = '') => {
          if(stateview == 'inicial'){
            $("[__frm_content]").hide();
            $("[__frm_datos_general]").hide();
            $("[__frm_formulario]").hide();
            $("[__frm_enviar]").hide();
          }
          if(stateview == 'mostrar_formulario'){
            $("[__frm_content]").show();
            $("[__frm_datos_general]").show();
            $("[__frm_formulario]").show();
            $("[__frm_enviar]").show();
          }
          if (stateview == 'guardado') {
            $("[__frm_content]").show();
            $("[__frm_datos_general]").hide();
            $("[__frm_formulario]").hide();
            $("[__frm_enviar]").hide();

            let alert = /*html*/`
                      <h2 class="text-center">Se ha enviado exitosamente el formulario.</h2>
                      <h2>Muchas gracias.</h2>
                      <div class="flex justify-center p20" >
                        <div id="codigo_qr" __codigo_qr class="p5 bg-white" style="border: 5px solid #333333"></div>
                        <div class="flex flex-y justify-between">
                          <i __accion_after_save="share" class="glyphicon glyphicon-share-alt fa-2x p5 text-dark cursor"></i>
                          <i __accion_after_save="download" class="glyphicons glyphicons-download_alt fa-2x p5 text-dark cursor"></i>
                        </div>
                      </div>
                      <div><button __btn_home class="btn btn-lg btn-info br6 wp66" >Volver a Inicio</button></div>
                  `;
            xyzFuns.alertMsg("[__frms]", alert, ' alert-success br-a br-success pastel   fs15 p20 br12 mt50', 'fa fa-check-circle fa-3x', '', false);
            
            funs.mostrarQR('62.171.160.162');            
          }

          if (stateview == 'error_critico') {
            $("[__frm_content]").show();
            $("[__frm_datos_general]").hide();
            $("[__frm_formulario]").hide();
            $("[__frm_enviar]").hide();

            let alert = /*html*/`
                      <div class="text-center">${msg}</div>
                      <div>
                        <button __btn_home class="btn btn-lg btn-info br-a br-dark mt20 br6 wp66">Volver a Inicio</button>
                      </div>
                  `;
            xyzFuns.alertMsg("[__frms]", alert, ' alert-danger br-a br-danger pastel   fs15 p20 br12 mt50', 'fa fa-exclamation-circle fa-2x', '', false);

          }
        },
        /* Genera QR a artir de un texto o url */
        mostrarQR: (text) => {
          let containerQR = $("[__codigo_qr]")[0];
            let qrcode = new QRCode(containerQR, {
              // text: "https://escueladigital.ga/curzar",
              width: 128,
              height: 128,
              colorDark : "#333333",
              colorLight : "#ffffff",
              correctLevel : QRCode.CorrectLevel.H
            });
            qrcode.makeCode(text);
        },
        accionesAfterSave: (accion) => {
          if(accion == 'share'){
            
          }
          if(accion == 'download'){
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

        mostrarError: (msg) => {
          $("[__error]").html(msg).removeClass('hide');
        },
        ocultarError: () => {
          $("[__error]").html('').addClass('hide')
        },

      }
      
      /** LISTENS */
      let listeners = () => {
        $("#formulario_101")
          /** Selecciona NIM */
          .on('change', "[__select_nim]", function (e) {
            ctxG.nimSel = _.find(ctxG.datosUserNims, item => item.nim == $(e.currentTarget).val());
            ($(e.currentTarget).val() != '') ? funs.renderFormulario() : false;
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
          
          /* Acciones despuesr de guardar:compartir o guardar etc*/
          .on('click', '[__accion_after_save]', (e)=>{
            let accion = $(e.currentTarget).attr('__accion_after_save');
            funs.accionesAfterSave(accion);
          })
          
          /* Click en boton volver inicio */
          .on('click', '[__btn_home]', () => { component.volverInicio()})

      }


      let formInit = (() => {
        listeners();
        funs.cargarComboUserNims();
        // funs.creaFormularioDatosCabecera();
        // form.creaFormulario();

      })()


    })

  };

}
