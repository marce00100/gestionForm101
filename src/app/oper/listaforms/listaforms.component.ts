import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SFormService } from 'src/app/shared/sform.service';
import { UAuthService } from 'src/app/shared/uauth.service';


declare var $: any;
declare var _: any;
declare var xyzFuns: any;
// declare var PNotify: any;
// declare var DataTable:any;
declare var moment: any;
declare var jspdf: any;
declare var html2canvas: any;

@Component({
  selector: 'app-listaforms',
  templateUrl: './listaforms.component.html',
  styleUrls: ['./listaforms.component.scss'],
})
export class ListaformsComponent implements OnInit {

  // private frmLleno: any = {};

  constructor(
    private router: Router, 
    private uauth: UAuthService,
    public sform: SFormService,
    private routeurl: ActivatedRoute,
  ) { }

  ngOnInit() {
    let uid = this.routeurl.snapshot.paramMap.get('uid');
    if (uid && uid.length > 0) {
      xyzFuns.spinner({}, '#listaforms_content')
      $.get(`${xyzFuns.urlRestApi}/form-lleno-resp`, { fluid: uid }, (resp) => {
        let formlleno = resp.data;
        this.sform.renderFormLlenoCompleto("[__frm_content]", formlleno);
        xyzFuns.showModal("#modalFormLleno");
        xyzFuns.spinner(false)
      })
    }


    this.listforms();
  }
  
  /**
   * se llama al Service Para cargar el fomulario lleno con sus respuestas y su qr y firmas
   * @param objFrmLleno Objeto con el Form lleno y respuestas
   * @returns HTML
   */
  renderformLlenoCompleto(content, objFrmLleno){
    // this.frmLleno = objFrmLleno;
    return this.sform.renderFormLlenoCompleto(content, objFrmLleno)
  }

  /**
   * Cuando se presiona en el boton de nuevo form o editar o anular
   */
  irFormulario101(uid = false, accion = false) {
    if (uid === false)
      this.router.navigate(['form101'])
    if (uid)
      this.router.navigate(['form101/' + uid + '/' + accion])
  }

  /**
   * Muestra mensaje temporal de .. Copiado al CLipboard
   */
  mostrarCopiado(){
    let el = $("[__copyUrl] [__copiado]");
    el.fadeIn(400);
    setTimeout(() => {
      el.fadeOut(300);
    }, 2000);
  }


  /**
   * Metodos y funciones JQ
   */
  listforms() {
    let cmp = this;
    $(function () {

      let ctxG: any = {
        rutabase: xyzFuns.urlRestApi,
        content: '#listaforms_content',
        modal: "#modalFormLleno",
        dataTableTarget: "#dataT",
        dataList: [], 
        formllenoSel: {},
        temporizadores: []
      }


      let conT = {
        dt: {},
        selectedRow: {},

        cargarDatos: function () {
          $.post(`${ctxG.rutabase}/forms-llenos-user`, cmp.uauth.addToken({}) ,function (resp) {
            ctxG.dataList = resp.data;
            conT.fillDataT();
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
            order: [[ 0, "desc" ]],
            columns: [
              // {title: 'Ejemplo', data: 'ejemplo', width: '50% | 600', className: 'dt-right dt-head-center dt-body-left', type:'num',},
              
              { title: 'NUM-FORM', data: 'numero_formulario',
                render: function (data, type, row, meta) {
                  return /*html*/`<span class="${row.vigencia == 1 ? 'fw600' : ''}">${row.numero_formulario}</span>`;
                }
              },
              {
                title: 'Fecha Registro', data: 'fecha_registro', type: 'date', width: 100,
                render: function (data, type, row, meta) {
                  return (row.fecha_registro != null && row.fecha_registro != "") ? moment(row.fecha_registro).format('YYYY-MM-DD hh:mm') : "";
                }
              },
              { title: 'NIM', data: 'nim', },
              {
                title: 'Municipio', data: 'cod - municipio', 
                render: function (data, type, row, meta) {
                  return `${row.codigo_municipio} - ${row.municipio}`;
                }
              },
              {
                title: 'Mineral', data: 'id',
                render: function (data, type, row, meta) {
                  let minerales = row.respuestas.mineral[0].respuesta
                  return minerales;
                }
              },
              // { title: 'Estado', data: 'estado_form_lleno' },
              {
                title: 'ACCIONES', sort:false, width:180, className: 'dt-head-center',
                render: function (data, type, row, meta) {
                  let segRestantesServer = row.segundos_restantes_modificacion;
                  let buttonVer = /*html*/
                            `<div __accion_bandeja="mostrar"  __id_form_lleno=${row.id_form_lleno} __uid_form_lleno=${row.uid}
                              style="display: inline-flex; align-items: center "class="p5 h-40 text-dark ${row.vigencia == 1 ? 'bg-success-40' : 'bg-eee'}  text-fff mr5 mt5 br6 br-a br-greyer cursor " title="Ver">
                              <i class="fa fa-tag fa-lg mr5"></i> ver </div>`;

                  let buttonEditar = row.vigencia == 0 ? '' : 
                            (
                              row.puede_modificar == 0 ? '':
                              /*html*/
                              `<div __accion_bandeja="editar"  __id_form_lleno="${row.id_form_lleno}" __uid_form_lleno=${row.uid}
                              __seg_restantes_server=${segRestantesServer ? segRestantesServer : 'no_aplica' }
                              style="display: inline-flex; align-items: center; "class="p5 h-40 text-dark bg-warning-40 text-fff mr5 mt5 br6 br-a br-greyer cursor " title="Editar">
                                <i class="fa fa-pencil fa-lg mr5 "></i>
                                <div style="display: inline-grid">
                                  <span>editar</span>
                                  <span __seg_restantes_calc style="font-size: 0.8em; margin-top: -4px;"></span>
                                </div>
                              </div>`
                            ); 

                  let buttonAnular = row.vigencia == 0 ? '' : 
                            /*html*/
                            `<div __accion_bandeja="anular"  __id_form_lleno=${row.id_form_lleno} __uid_form_lleno=${row.uid}
                            style="display: inline-block; "class="p5 text-dark bg-danger-40 text-fff mr5 mt5 br6 br-a br-greyer cursor" title="Anular">
                            <i class="fa fa-remove fa-lg "></i> </div>`;

                  return buttonVer + buttonEditar + buttonAnular;
                }
              },
            ],
            /** evento cuando se carga por primera vez la tabla */
            initComplete: function(){
              funs.colocaTemporizadorModificacion();             
            },
            language: xyzFuns.dataTablesEspanol(),
          });
        },
        // refreshDataT: () => {
        //   conT.dt.clear().destroy();
        //   conT.cargarDatos();
        // },
        // refreshRow: (rowData) => {
        //   conT.dt.row(conT.selectedRow).data(rowData).invalidate()
        // }

      }

      let funs = {
        /**
         * Muestra Modalcon el formulario lleno
         * @param uid_form_lleno valor uid del formulario lleno
         */
        mostrarFormlleno: (uid_form_lleno) => {
          funs.spinner();
          $.get(`${ctxG.rutabase}/form-lleno-resp`, { fluid: uid_form_lleno }, (resp) => {
            ctxG.formllenoSel = resp.data;
            cmp.renderformLlenoCompleto("[__frm_content]", ctxG.formllenoSel);
            xyzFuns.showModal(ctxG.modal);
            funs.spinner(false);
          })
        },
        /**
         * Se coloca el tiempo dinamicocomo temporizador en los botones de edicion, eliminandolos si pasa el tiempo disponible
         */
        colocaTemporizadorModificacion: () => {
           // Función para actualizar el contador y ocultar los botones
          function actualizarContador() {
            let botonesEditar = $("[__accion_bandeja=editar]");                
            _.forEach(botonesEditar, (elem) => {
              let seg_restantes = $(elem).attr('__seg_restantes_server');
              if (seg_restantes == 'no_aplica')
                return;

              seg_restantes = parseInt(seg_restantes);
              if (seg_restantes > 0) {
                let id_form_lleno = $(elem).attr('__id_form_lleno');
                let duracion = moment.duration(seg_restantes, 'seconds');
                // moment(minutos, 'm').format('mm') + ':' + moment(segundosRestantes, 's').format('ss');
                // Obtener los minutos y segundos y se le da formato con cero a la izq en caso de ser un digito
                let horas = duracion.hours(); 
                let minutos = moment(duracion.minutes(), 'm').format('mm'); 
                let segundos = moment(duracion.seconds(),'s').format('ss');
                $(elem).find('[__seg_restantes_calc]').html(`${horas}:${minutos}:${segundos}`)
                seg_restantes--;
                $(elem).attr('__seg_restantes_server', seg_restantes);
              }
              else{
                $(elem).remove();
              }
            })
            if(botonesEditar.length == 0) 
            clearInterval(temporizadorBotones);
          }
          let temporizadorBotones = setInterval(actualizarContador, 1000);
        },

        spinner: (obj = {}) => {
          xyzFuns.spinner(obj, ctxG.content)
        },
      }

      //______________________________________ LISTENERS ________________________________________

      let listen = () => {
        /* DEL CONTENEDOR */
        $(ctxG.content)
          /** Click en botones de accion como editar nuevo */
          .on('click', '[__accion_bandeja]', (e) => {
            let accion = $(e.currentTarget).attr('__accion_bandeja');

            if (accion == 'nuevo')
              cmp.irFormulario101();
            if (accion == 'editar' || accion == 'anular') {
              let uid = $(e.currentTarget).attr('__uid_form_lleno');
              cmp.irFormulario101(uid, accion)
            }
            if (accion == 'mostrar') {
              let uid = $(e.currentTarget).attr('__uid_form_lleno');
              funs.mostrarFormlleno(uid)
            }
            
          })
        
        /** DEL MODAL */
        $(ctxG.modal)
          .on('click', "[__click_form]", (e) => {
            let accion = $(e.currentTarget).attr("__click_form");

          })
      }

      let init = () => {
        listen();
        conT.cargarDatos();
      }

      init();
    })
  };

}
