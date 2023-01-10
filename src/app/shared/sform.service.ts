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
  public renderFormLleno(container, objFrmLleno, qr = true, firmas = true) {
    /* Se guarda el obgeto en la vaiable privada */
    this.objFrmLleno = objFrmLleno;
    let frm = this.htmlRenderForm(objFrmLleno);
    $(container).html(frm);

    if (qr) {
      let url = this.getUrlPublicForm();
      console.log('________',url);
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
  private htmlRenderForm(objFrm: any) {

    let periodo = moment(objFrm.periodo).format('DD/MM/YYYY');

    let htmlNombres = !_.isEmpty(objFrm.nombres) ? /*html*/`<span style="font-weight:400; font-size:0.8em">Nombre: </span> <span>${objFrm.nombres} ${objFrm.apellidos}</span>` : '';
    let saltoLinea = !_.isEmpty(htmlNombres) && !_.isEmpty(objFrm.razon_social) ? "<br>" : "";
    htmlNombres += !_.isEmpty(objFrm.razon_social) ? /*html*/`${saltoLinea}<span style="font-weight:400; font-size:0.8em">Razón Social: </span> <span>${objFrm.razon_social}</span>` : '';
    $("[__info_general=nombres]").html(htmlNombres);

    let htmlProcedencia = /*html*/`<span>CHUQUISACA</span>`;         
    htmlProcedencia += (objFrm.municipio) ? /*html*/`<br>Municipio: <span>${objFrm.municipio} - Cód. Mun.: <span>${objFrm.codigo_municipio} </span>` : '';
    
    let frm = /*html*/`
      <div __frm id="__frm" class="fs13 text-111" style=" min-height:80vh; overflow-y: auto; align-items: center; 
        min-width: 650px; max-width: 650px; width: 650px; position: relative">
        <div __card __frm_cabecera class="flex flex-y align-center" style="text-align: center; border-bottom: 1px solid #ccc; position:relative; ">
          <img src="./assets/img/gadch_vertical_light_lg_gris.png" style="width:130px; position:absolute; top: 0px;left: 20px" />  
          <h1 clasS="fw600 text-theme1--30" style="margin-top:80px">FORMULARIO 101</h1>
          <h4  class="text-theme1--30 fw600 mn ">
              PARA MINERALES <span __tipo_formulario>${objFrm.tipo_formulario_nombre}</span>
          </h4>
          <div class="mt20  text-dark-darker fs12 fw600 wp80 center-block" >FORMULARIO ÚNICO DEPARTAMENTAL PARA CONTROL DE SALIDA,
              AUTORIZACIÓN DE TRANSPORTE Y VENTA DE MINERALES <span __tipo_formulario>${objFrm.tipo_formulario_nombre}</span>
            </div>
        </div>

        <div __card __frm_datos_general class=" wp100 mt30" >
          <div class="quest-titulo">
            DATOS REGISTRADOS
          </div>
          <div class="datos-generales">
            <div class="item-dato-general">
              <em class="item-label">1. NÚM. DE FORMULARIO</em>
              <div class="item-contenido text-center" __info_general="numero_formulario">${objFrm.numero_formulario}</div>
            </div>
            <div class="item-dato-general">
              <em class="item-label">2. NÚMERO DE NIM</em>
              <div class="item-contenido text-center" __info_general="nim">${objFrm.nim}</div>
            </div>
            <div class="item-dato-general">
              <em class="item-label">3. NÚMERO DE NIT</em>
              <div class="item-contenido text-center" __info_general="nit">${objFrm.nit}</div>
            </div>
            <div class="item-dato-general">
              <em class="item-label">4. PERIODO</em>
              <div class="item-contenido text-center" __info_general="periodo">${periodo}</div>
            </div>
            <div class="item-dato-general" style="flex-basis: 100%;">
              <em class="item-label">5. OPERADOR MINERO</em>
              <div class="item-contenido" __info_general="nombres">${objFrm.nombres}</div>
            </div>
            <div class="item-dato-general" style="flex-basis: 100%;">
              <em class="item-label">6. PROCEDENCIA</em>
              <div class="item-contenido" __info_general="procedencia">${htmlProcedencia}</div>
            </div>
          </div>
        </div>
        
        <div __card __frm_datos_respuestas class=" mt10 flex flex-wrap align-start">
          ${this.htmlRenderRespuestas(objFrm.respuestas)}
        </div>
        <div __card __sellos class="flex justify-between mt30">
          <div __card __codigo_qr ></div>
        </div>
      </div>`;
    return frm;
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
      let elemObj = resps[0]; 

      if(elemObj.tipo == 'titulo'){
        htmlResp += /* html*/`<h3 class="wp100 quest-titulo">${elemObj.texto}</h3>`
      }
      if(elemObj.tipo == 'pregunta'){
        let cnfElem = JSON.parse(elemObj.config) || {};
        /* si es arraydeuno*/
        let respuesta = resps.length == 1 ? resps[0].respuesta ?? '' 
          : _.chain(resps)
          .sortBy('id_form_lleno_respuesta')
          .reduce( 
            function (result, resp) { 
              let item = resp.respuesta;
              if(resp.nombre_dimension && resp.nombre_dimension.length>0 )
                item += ` ${resp.valor_dimension}(${resp.nombre_dimension})`;
              
            return result + `${item}, `}, '');
        
        htmlResp += /* html*/`
                        <div class="flex justify-start align-start" style="width: ${cnfElem.ancho}%; border-bottom: 1px solid #ccc">
                          <span class=" p5 fw600" style="/*flex-grow:1*/">${elemObj.texto}:</span>  
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
    let doc = new jspdf.jsPDF('p', 'pt', 'letter');
    let marginX = 60;
    let marginY = 45;
    html2canvas($('[__frm]')[0], {
      background: 'white',
      scale: 3
    }).then((canvas) => {
      let img = canvas.toDataURL('image/PNG');
      // Add image Canvas to PDF
      let imgProps = (doc as any).getImageProperties(img);
      let pdfWidth = doc.internal.pageSize.getWidth() - 3 * marginX;
      let pdfHeight = (imgProps.height * pdfWidth) / (1.1 * imgProps.width);
      // let pdfWidth = doc.internal.pageSize.getWidth() - 4 * marginX;
      // let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(img, 'PNG', marginX, marginY, pdfWidth, pdfHeight, undefined, 'FAST');
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
