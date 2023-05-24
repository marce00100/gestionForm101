import { Injectable } from '@angular/core';

declare var $: any;
declare var _: any;
declare var xyzFuns: any;
declare var moment: any;
declare var html2canvas: any;
declare var jspdf: any;
declare var QRCode: any;

@Injectable({
  providedIn: 'root'
})
export class SFormService {

  /** Se inicializa al */


  /**
   * Variable global de CLase, se inicializa al crear dinamicamente el FFORM
   * por lo tanto estara disponible al llamar a las otras funciones
   */
  private objFrmLleno: any = {};

  constructor() { }

  /**
   * Devuelve texto HTML con la visualizacion del formulario y respuestas
   * @param objFrmLleno frmlleno con array de respuestas
   * @returns HTML
   */
  public renderFormLlenoCompleto(container, objFrmLleno, qr = true, firmas = true) {
    /* Se guarda el obgeto en la vaiable privada */
    this.objFrmLleno = objFrmLleno;
    let frm = this.htmlRenderFormModoVista(objFrmLleno);
    $(container).html(frm);

    if (qr) {
      let url = this.getUrlPublicForm();
      this.generarQR("[__codigo_qr]", url);
    }

    if (firmas) {
      $(container).find("[__sellos]").prepend(this.htmlSeccionSellos());
    }
    return frm;
  }

  /**
   * Prepara el html de la visualizacion del PDF
   * @param objFrm 
   * @returns html
   */
  private htmlRenderFormModoVista(objFrm: any) {
    
    let frm = /*html*/`
      <div __frm id="__frm" class="fs13 text-111" style=" min-height:80vh; overflow-y: auto; align-items: center; 
        min-width: 650px; max-width: 650px; width: 650px; position: relative">
        
        <div __card __frm_cabecera>
          <img src="./assets/img/gadch_vertical_light_lg_gris.png" style="width:130px; position:absolute; top: 0px;left: 20px" /> 
          ${this.htmlRenderCabecera(objFrm)}
        </div>

        <div __card __frm_datos_general >
          ${this.htmlRenderDatosGeneral(objFrm)}
        </div>
        
        <div __card __frm_datos_respuestas class=" mt10 flex flex-wrap align-start_">
          ${this.htmlRenderRespuestas(objFrm.respuestas)}
        </div>
        <div __card __sellos class="flex justify-between mt30">
          <div __card __codigo_qr ></div>
        </div>
      </div>`;
    return frm;
  }

  /**
   * Obtiene html de la cabecera Para generar la cabecera del form: titulo,subtitulo etc
   * @param objFrm objeto con valor del tipo de formulario 
   * @returns html dela cabecera
   */
  public htmlRenderCabecera(objFrm){
    let htmlCabecera = /*html*/`
            <div class="flex flex-y align-center" style="text-align: center; border-bottom: 1px solid #ccc; position:relative; ">
              
              <h1 clasS="fw600 text-theme1--30" style="margin-top:80px">FORMULARIO 101</h1>
              <h4  class="text-theme1--30 fw600 mn ">
                  PARA MINERALES <span __tipo_formulario>${objFrm.tipo_formulario_nombre || ''}</span>
              </h4>
              <div class="mt20  text-dark-darker fs12 fw600 wp80 center-block" >FORMULARIO ÚNICO DEPARTAMENTAL PARA CONTROL DE SALIDA,
                  AUTORIZACIÓN DE TRANSPORTE Y VENTA DE MINERALES <span __tipo_formulario>${objFrm.tipo_formulario_nombre || ''}</span>
                </div>
            </div>`
    return htmlCabecera;
  }

  /**
   * Obtiene html de la informacion o datos generales
   * @param objFrm Objeto con los datos del usuario y nim, datos generales
   * @returns 
   */
  public htmlRenderDatosGeneral(objFrm){
    let fecha_registro =  moment(objFrm.fecha_registro ? objFrm.fecha_registro : Date.now()).format('DD/MM/YYYY');

    // let htmlNombres = !_.isEmpty(objFrm.nombres) ? /*html*/`<span style="font-weight:400; font-size:0.8em">Nombre: </span> <span>${objFrm.nombres} ${objFrm.apellidos}</span>` : '';
    // let saltoLinea = !_.isEmpty(htmlNombres) && !_.isEmpty(objFrm.razon_social) ? "<br>" : "";
    // htmlNombres += !_.isEmpty(objFrm.razon_social) ? /*html*/`${saltoLinea}<span style="font-weight:400; font-size:0.8em">Razón Social: </span> <span>${objFrm.razon_social}</span>` : '';
    let htmlNombres = /*html*/`<span style="font-weight:400; font-size:0.8em">Razón Social: </span> <span>${!_.isEmpty(objFrm.razon_social) ? objFrm.razon_social : 'No aplica'}</span>`;

    let htmlProcedencia = /*html*/`<span>CHUQUISACA</span>`;         
    htmlProcedencia += (objFrm.municipio) ? /*html*/`<br>Municipio: <span>${objFrm.municipio} - Cód. Mun.: <span>${objFrm.codigo_municipio} </span>` : '';

    let htmlDatosGeneral = /*html*/`
            <div class=" wp100 mt30" >
              <div class="quest-titulo">
                DATOS REGISTRADOS
              </div>
              <div class="datos-generales">
                <div class="item-dato-general">
                  <em class="item-label">1. NÚM. DE FORMULARIO</em>
                  <div class="item-contenido text-center" __info_general="numero_formulario">${objFrm.numero_formulario || 'Automático'}</div>
                </div>
                <div class="item-dato-general">
                  <em class="item-label">2. NÚMERO DE NIM</em>
                  <div class="item-contenido text-center" __info_general="nim">${objFrm.nim || ''}</div>
                </div>
                <div class="item-dato-general">
                  <em class="item-label">3. NÚMERO DE NIT</em>
                  <div class="item-contenido text-center" __info_general="nit">${objFrm.nit || ''}</div>
                </div>
                <div class="item-dato-general">
                  <em class="item-label">4. PERIODO</em>
                  <div class="item-contenido text-center" __info_general="fecha_registro">${fecha_registro}</div>
                </div>
                <div class="item-dato-general" style="flex-basis: 100%;">
                  <em class="item-label">5. OPERADOR MINERO</em>
                  <div class="item-contenido" __info_general="nombres">${htmlNombres}</div>
                </div>
                <div class="item-dato-general" style="flex-basis: 100%;">
                  <em class="item-label">6. PROCEDENCIA</em>
                  <div class="item-contenido" __info_general="procedencia">${htmlProcedencia}</div>
                </div>
              </div>
            </div>`
    return htmlDatosGeneral;
  }

  /**
   * Renderiza el array de respuestas 
   * @param respuestas 
   * @returns html
   */
  private htmlRenderRespuestas(respuestas: any) {          
    let htmlResp = "";
    let time = Date();

    _.forEach(respuestas, function (resps, k) {
      let respFirstObj = resps[0]; 

      if(respFirstObj.tipo == 'titulo'){
        htmlResp += /* html*/`<h3 class="wp100 quest-titulo">${respFirstObj.texto}</h3>`
      }
      if(respFirstObj.tipo == 'pregunta'){
        let cnfElem = JSON.parse(respFirstObj.config) || {};

        /* CASO PREGUNTA NORMAL */
        let respuesta = respFirstObj.respuesta ? respFirstObj.respuesta.trim() : '' ;

        /**  CASOS ESPECIALES   */
        /** si es mineral puede ser array mas de uno, y ademas de que si esta vacio el valor_dimension llenarlo a mano con espacio de linea punteada vacia */
        if (respFirstObj.alias == 'mineral') {
          respuesta = _.chain(resps)
            .sortBy('id_form_lleno_respuesta')
            .reduce(
              function (result, resp) {
                let item = resp.respuesta;                
                /* Si tiene dimensiones muestra la respuesta con dimensiones */
                if ((resp.nombre_dimension && resp.nombre_dimension.length > 0) && (resp.valor_dimension && resp.valor_dimension.length > 0))
                  item += ` ${resp.valor_dimension}(${resp.nombre_dimension})`;
                /* Para crear cuadros vacios para completer una vez impreso */
                if ((resp.nombre_dimension && resp.nombre_dimension.length > 0) && (!resp.valor_dimension || resp.valor_dimension.length == 0))
                  item += ` ________(${resp.nombre_dimension})`;

                return result + `${item}, `
              }, '');
        }
        if (respFirstObj.alias == 'peso_neto' && respuesta == '') {
          respuesta = '____________';
        }
        if (respFirstObj.alias == 'peso_bruto' && respuesta == '') {
          respuesta = '____________';
        }
        if (respFirstObj.alias == 'numero_lote' && respuesta == '') {
          respuesta = '____________';
        }
        // if (respFirstObj.alias == 'mineral' && respuesta == '') {
          
        // }
        htmlResp += /* html*/`
                        <div class="flex justify-start align-center grow-1" style="width: ${cnfElem.ancho}%; border-bottom: 1px solid #ccc">
                          <span class=" p5 fw600" style="/*flex-grow:1*/">${respFirstObj.texto}:</span>  
                          <span class="p5" style="/*flex-grow:1*/">${respuesta}</span>  
                        </div>`
      }
    })
    return  htmlResp;
  }

  /** seccion Sellos */
  private htmlSeccionSellos(){
    return /*html*/`
            <div class="flex justify-around ">
              <div class="br-a br-dark flex align-end h100 " style="width:48%"> 
                <div class="h-40 wp100 text-center " style="border-top: 1px solid #555">
                  Firma/Sello Ingeniero Minero o Comercializadora
                </div>
              </div>
              <div class="br-a br-dark flex align-end h100 " style="width:48%"> 
                <div  class="h-40 wp100 text-center " style="border-top: 1px solid #333">
                  Responsable Retén de Control
                </div>
              </div>
            </div>
            `;
  }
  
  /**
   * Genera QR a artir de un texto o url 
   */
  public generarQR(container, texto) {
    let containerQR = $(container)[0];
    let qrcode = new QRCode(containerQR, {
      width: 150,
      height: 150,
      colorDark: "#333333",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.Q
    });
    qrcode.makeCode(texto);
  }
  
  /**
   * Exporta a Pdf , Considera el html ya dispuesto y un contenedor delfomulario _frm
   * @param fileName string con el nombre del archivopara exportar 
   */
  public exportFormPDF() {
    let fileName = `form101_${this.objFrmLleno.numero_formulario}`;
    let doc = new jspdf.jsPDF('l', 'pt', 'letter'); // landscape
    // let doc = new jspdf.jsPDF('p', 'pt', 'letter'); // portrait
    let marginX = 45;
    let marginY = 45;
    html2canvas($('[__frm]')[0], {
      background: 'white',
      scale: 3
    }).then((canvas) => {
      let img = canvas.toDataURL('image/PNG');
      // Add image Canvas to PDF
      let imgProps = (doc as any).getImageProperties(img);
      let pdfWidth = doc.internal.pageSize.getWidth() - 3 * marginX - 0.45 * doc.internal.pageSize.getWidth();
      let pdfHeight = (imgProps.height * pdfWidth) / (1.1 * imgProps.width);
      // let pdfWidth = doc.internal.pageSize.getWidth() - 4 * marginX;
      // let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(img, 'PNG', marginX, marginY, pdfWidth, pdfHeight, undefined, 'FAST');

      doc.setLineDash([3, 2], 0); /* Linea punteada*/
      let lineX = doc.internal.pageSize.getWidth() / 2;
      doc.line(lineX, 0, lineX, imgProps.height - 2 * marginY); /* Linea dividiendo los formularios*/
      
      doc.addImage(img, 'PNG', lineX + marginX, marginY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {    //   
      docResult.save(fileName);
    });
  }



  /**
   * Copia la Url publica al portapapeles :URL del formLleno Publico
   */
  public copyUrlPublicForm() {
    let url = this.getUrlPublicForm();
    navigator.clipboard.writeText(url);
  }

  /**
   * Abre el formLleno en una nueva ventana
   */
  public gotoUrlPublicForm() {
    let url = this.getUrlPublicForm();
    window.open(url);
  }

  /**
   * Para ontener la direccion publica
   * @param uid 
   * @returns Url del form publico
   */
  public getUrlPublicForm(uid = null) {
    let currentUrl =  window.location.href;
    let url = currentUrl.split('#')[0] + '#/verformulario/' + ((uid) ? uid : this.objFrmLleno.uid);
    return url;
  }
}
