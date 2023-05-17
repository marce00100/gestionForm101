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
        xyzFuns.showModal("#modal");
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
        modal: "#modal",
        dataTableTarget: "#dataT",
        dataList: [], 
        formllenoSel: {}
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
            "order": [[ 0, "desc" ]],
            columns: [
              // {title: 'Ejemplo', data: 'ejemplo', width: '50% | 600', className: 'dt-right dt-head-center dt-body-left', type:'num',},
              
              { title: 'NUM-FORM', data: 'numero_formulario',
                render: function (data, type, row, meta) {
                  return /*html*/`<span class="${row.vigencia == 1 ? 'fw600' : ''}">${row.numero_formulario}</span>
                  <!-- <em style="display:block" class=" ${row.vigencia == 1 ? 'fw600' : ''}">${row.vigencia == 1 ? 'Vigente' : 'No vig.'}</em>-->`;
                }
              },
              {
                title: 'Fecha Registro', data: 'fecha_registro', type: 'date',
                render: function (data, type, row, meta) {
                  return (row.fecha_registro != null && row.fecha_registro != "") ? moment(row.fecha_registro).format('YYYY-MM-DD') : "";
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
                title: 'ACCIONES', sort:false, width:150, className: 'dt-head-center',
                render: function (data, type, row, meta) {
                  let buttonVer = /*html*/
                            `<span __accion_bandeja="mostrar"  __id_form_lleno=${row.id} __uid_form_lleno=${row.uid}
                              style="cursor:pointer; "class="p5 text-dark ${row.vigencia == 1 ? 'bg-success-40' : 'bg-eee'}  text-fff mr5 mt5 br6 br-a br-greyer " title="Ver">
                              <i class="fa fa-tag fa-lg "></i> ver </span>`

                  let buttonEditar = row.vigencia == 0 ? '' : 
                            /*html*/
                            `<span __accion_bandeja="editar"  __id_form_lleno=${row.id} __uid_form_lleno=${row.uid}
                            style="cursor:pointer; "class="p5 text-dark bg-warning-40 text-fff mr5 mt5 br6 br-a br-greyer " title="Editar">
                            <i class="fa fa-pencil fa-lg "></i> editar </span>` 

                  let buttonAnular = row.vigencia == 0 ? '' : 
                            /*html*/
                            `<span __accion_bandeja="anular"  __id_form_lleno=${row.id} __uid_form_lleno=${row.uid}
                            style="cursor:pointer; "class="p5 text-dark bg-danger-40 text-fff mr5 mt5 br6 br-a br-greyer " title="Anular">
                            <i class="fa fa-remove fa-lg "></i> </span>`

                  return buttonVer + buttonEditar + buttonAnular;
                }
              },

            ],
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
        conT.cargarDatos();
      }

      listen();
      init();
    })
  };

}
