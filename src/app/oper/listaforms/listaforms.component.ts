import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;
declare var _: any;
declare var xyzFuns: any;
declare var PNotify: any;
// declare var DataTable:any;
declare var moment: any;

@Component({
  selector: 'app-listaforms',
  templateUrl: './listaforms.component.html',
  styleUrls: ['./listaforms.component.scss'],
})
export class ListaformsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.listforms();
  }

  nuevoFormulario(){
    this.router.navigate(['form101'])
  }

  listforms() {
    let component = this;
    $(function () {
      /*El id_rol del rol operador */
      const rol_operador = 3; 

      let ctxG: any = {
        rutabase: xyzFuns.urlRestApi,
        contenedor: '#listaforms_content',
        modal: "#modal",
        dataTableTarget: "#dataT",
        dataList: [],
        id_rol_operador: rol_operador, 
        formllenoSel: {}
      }


      let conT: any = {
        dt: {},
        selectedRow: {},

        cargarDatos: function () {
          $.post(`${ctxG.rutabase}/list-forms-llenos`, {_token: localStorage.getItem('uid_uid') } ,function (resp) {
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
                  return /*html*/`<span __accion_bandeja="mostrar"  __id_form_lleno=${row.id} 
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
              { title: 'Mineral', data: 'mineral', },
              { title: 'Estado',  data: 'estado_form_lleno' },
              // {
              //   title: 'Usuario', data: 'username', type: 'html',
              //   render: function (data, type, row, meta) {
              //     return /*html*/`<span  style="display:block; background-color:${row.estado_usuario == 'Activo' ? '#edf5ff' : '#fff0f0'}" class="ph5 text-dark "><b>${row.username}</b></span>`
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
        mostrarFormlleno: (id_form_lleno) => {
          xyzFuns.spinner();
          $.post(ctxG.rutabase + '/formlleno_respuestas', { id_form_lleno: id_form_lleno }, (resp) => {
            ctxG.formllenoSel = resp.data;
            console.log('ctxG.formllenoSel', ctxG.formllenoSel)
            funs.crearDatosGeneral();
            // funs.renderFormulario();

            xyzFuns.showModal(ctxG.modal);
            let htmlRespuestas = funs.renderFormRespuestas(ctxG.formllenoSel.elementos_respuestas);
            $("[__frm_datos_respuestas]").html(htmlRespuestas);
            xyzFuns.spinner(false);


          })
        },
        /** Carga Datos del usuario */
        crearDatosGeneral: () => {
          $("[__tipo_mineral]").html(ctxG.formllenoSel.tipo_formulario == 'form1' ? 'METÁLICOS' : 'NO METÁLICOS');
          $("[__info_general=numero_formulario]").html(`${(ctxG.formllenoSel.numero_formulario) ? ctxG.formllenoSel.numero_formulario : ''}`);
          $("[__info_general=nim]").html(`${(ctxG.formllenoSel.nim) ? ctxG.formllenoSel.nim : ''}`);
          $("[__info_general=nit]").html(`${(ctxG.formllenoSel.nit) ? ctxG.formllenoSel.nit : ''}`);

          let periodo = moment(Date.now()).format('DD/MM/YYYY');
          $("[__info_general=periodo]").html(`${periodo}`);

          let htmlNombres = !_.isEmpty(ctxG.formllenoSel.nombres) ? /*html*/`<span style="font-weight:400; font-size:0.8em">Nombre: </span> <span>${ctxG.formllenoSel.nombres} ${ctxG.formllenoSel.apellidos}</span>` : '';
          let saltoLinea = !_.isEmpty(htmlNombres) && !_.isEmpty(ctxG.formllenoSel.razon_social) ? "<br>" : "";
          htmlNombres += !_.isEmpty(ctxG.formllenoSel.razon_social) ? /*html*/`${saltoLinea}<span style="font-weight:400; font-size:0.8em">Razón Social: </span> <span>${ctxG.formllenoSel.razon_social}</span>` : '';
          $("[__info_general=nombres]").html(htmlNombres);

          let htmlProcedencia = /*html*/`<span>CHUQUISACA</span>`;
          // let saltoLinea = !_.isEmpty(htmlNombres) && !_.isEmpty(ctxG.formllenoSel.razon_social) ? "<br>" : "";            
          htmlProcedencia += (ctxG.formllenoSel.municipio) ? /*html*/`<br>Municipio: <span>${ctxG.formllenoSel.municipio} - Cód. Mun.: <span>${ctxG.formllenoSel.codigo_municipio} </span>` : '';
          $("[__info_general=procedencia]").html(htmlProcedencia);
          $("[__info_general=mineral]").html(`${(ctxG.formllenoSel.mineral) ? ctxG.formllenoSel.mineral : ''}`);

        },
        /**Carga el formulario con sus elementos */
        renderFormRespuestas: (listaPreguntasResp) => {          
          let htmlResp = "";
          let tituloSeccion = '';
  
          _.forEach(listaPreguntasResp, function (resps, k) {
            let elemObj = resps[0]; 

            if(elemObj.tipo == 'titulo'){
              htmlResp += /* html*/`<h3 class="wp100 quest-titulo">${elemObj.texto}</h3>`
            }
            if(elemObj.tipo == 'pregunta'){
              let cnfElem = JSON.parse(elemObj.config) || {};
              let respuesta = resps.length == 1 ? resps[0].respuesta ?? '' : _.reduce(resps, (result, resp, k) => `${result}, ${resp.respuesta} ?? '' `);
              
              htmlResp += /* html*/`
                              <div class="flex justify-start align-start" style="width: ${cnfElem.ancho}%; border-bottom: 1px solid #ccc">
                                <span class=" p5 fw600" style="/*flex-grow:1*/">${elemObj.texto}:</span>  
                                <span class="p5" style="/*flex-grow:1*/">${respuesta}</span>  
                              </div>`
            }
          })
          return  htmlResp;
        },



        limpiarModal: () => {
          // $(`${ctxG.modal} [__rg_field]`).val('').removeClass('br-a br-danger');
          // $(`${ctxG.modal} [__op_field]`).val('').removeClass('br-a br-danger');;
          // funs.functionsNims.limpiarFieldsNims();
          // $("[__nims_operador] table tbody").html('');
          // $("[__wrapper_operador]").hide();
          
          // /* Quita las clases de error en todos los campos requeridos  */
          // $("[required]").removeClass(regmodel.model.classError);
        }
      }

      //-------------------- Listeners  --------------------------------

      let listen = () => {
        /* DEL CONTENEDOR */
        $(ctxG.contenedor)
          /** Click en botones de accion como editar nuevo */
          .on('click', '[__accion_bandeja]', (e) => {
            let accion = $(e.currentTarget).attr('__accion_bandeja');
            // funs.limpiarModal();
            if (accion == 'nuevo')
              component.nuevoFormulario();
            if (accion == 'mostrar') {
              let id = $(e.currentTarget).attr('__id_form_lleno');
              funs.mostrarFormlleno(id)
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

      /**
       * Inicializa 
       */  
      let init = () => {
        conT.cargarDatos();
      }

      listen();
      init();
    })
  };

}
