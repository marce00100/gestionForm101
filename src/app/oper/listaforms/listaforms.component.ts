import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  private frmLleno: any = {};

  constructor(
    private router: Router, 
    private uauth: UAuthService,
    private sform: SFormService) { }

  ngOnInit() {
    this.
    listforms();
  }
  /**
   * Cuando se presiona en el boton de nuevo form
   */
  nuevoFormulario(){
    this.router.navigate(['form101'])
  }

  /**
   * se llama al Service Para cargar el fomulario lleno con sus respuestas 
   * @param objFrmLleno Objeto con el Form lleno y respuestas
   * @returns HTML
   */

  renderformLleno(content, objFrmLleno){
    this.frmLleno = objFrmLleno;
    return this.sform.renderFormLleno("[__frm_content]", objFrmLleno)
  }

  /**
   * Para exportar se llama al service,
   */
  exportPDF() {
    this.sform.exportFormPDF();
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
            columns: [
              // {title: 'Ejemplo', data: 'ejemplo', width: '50% | 600', className: 'dt-right dt-head-center dt-body-left', type:'num',},
              {
                title: '_', 
                render: function (data, type, row, meta) {
                  return /*html*/`<span __accion_bandeja="mostrar"  __id_form_lleno=${row.id} __uid_form_lleno=${row.uid}
                                style="cursor:pointer; display:block; "class="p5 text-dark " title="Editar">
                                <i class="fa fa-tag fa-lg "></i></span>`
                }
              },
              {
                title: 'Fecha Registro', data: 'fecha_registro', 
                render: function (data, type, row, meta) {
                  return (row.fecha_registro != null && row.fecha_registro != "") ? moment(row.fecha_registro).format('DD/MM/YYYY') : "";
                }
              },
              { title: 'NUM-FORM', data: 'numero_formulario', },
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
                  return "";
                }
              },
              { title: 'Estado', data: 'estado_form_lleno' },
              // {
              //   title: 'Usuario', data: 'username', type: 'html',
              //   render: function (data, type, row, meta) {
              //     return /*html*/`<span  style="display:block; background-color:${row.estado_usuario == 'ACTIVO' ? '#edf5ff' : '#fff0f0'}" class="ph5 text-dark "><b>${row.username}</b></span>`
              //   }
              // },
              // { title: 'Razon Social', data: 'razon_social', },
              // { title: 'Rol',  data: 'rol' },
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
        /** Muestra Modalcon el formulario lleno */
        mostrarFormlleno: (uid_form_lleno) => {
          funs.spinner();
          $.get(`${ctxG.rutabase}/formenviado-reps`, { fluid: uid_form_lleno }, (resp) => {
            ctxG.formllenoSel = resp.data;
            cmp.renderformLleno("[__frm_content]", ctxG.formllenoSel);
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
            // funs.limpiarModal();
            if (accion == 'nuevo')
              cmp.nuevoFormulario();
            if (accion == 'mostrar') {
              let uid = $(e.currentTarget).attr('__uid_form_lleno');
              // let id = $(e.currentTarget).attr('__id_form_lleno');
              funs.mostrarFormlleno(uid)
            }
            
          })
        
        /** DEL MODAL */
        $(ctxG.modal)
          // /* Cancel Modal*/
          // .on('click', "[__cerrar]", () => {
          //   xyzFuns.closeModal();
          // })

          // .on('click', "[__save]", () => {
          //   // funs.saveData();
          // })
      }

      let init = () => {
        conT.cargarDatos();
      }

      listen();
      init();
    })
  };

}
