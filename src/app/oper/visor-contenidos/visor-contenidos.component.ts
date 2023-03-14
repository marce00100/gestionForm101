import { Component, OnInit } from '@angular/core';
import { UAuthService } from 'src/app/shared/uauth.service';

declare var $: any;
declare var _: any;
declare var xyzFuns: any;
declare var moment: any;

@Component({
  selector: 'app-visor-contenidos',
  templateUrl: './visor-contenidos.component.html',
  // styleUrls: ['./visor-contenidos.component.scss'],
})
export class VisorContenidosComponent implements OnInit {

  constructor(private uAuth: UAuthService) { }

  ngOnInit() {
    this.contenidos();
  }

  contenidos() {
    let cmp = this;
    $(function () {
      
      let ctxG: any = {
        rutabase: xyzFuns.urlRestApi,
        content: '#content',
        modal: "#modal",
        dataList: [],
      }

      let funs = {
        cargarDatos: function () {
          funs.spinner();
          $.post(`${ctxG.rutabase}/get-contents`, cmp.uAuth.addToken({ }), (resp) => {
            ctxG.dataList = resp.data;
            funs.fillContents();
            funs.spinner(false);
          });
        },
        /* llena las plantillas de contenidos html*/
        fillContents: () => {
          _.forEach(ctxG.dataList, (item, k) => {
            // let date = moment(item.fecha_registro, "YYYY-MM-DD");
            // moment.locale('es');
            // let fromNow = date.fromNow();
            let card = /*html*/`
                        <div class="flex " style="flex-direction:column; margin-bottom: 20px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 5px 20px;">
                          <h2>${item.titulo}</h2>
                          <em>Fecha de publicación: ${ moment(item.fecha_registro).format('DD/MM/YYYY')}</em>
                          <img src="${item.imagen}" style="width:200px; object-fit:cover; margin: 10px auto">
                          <div class="mt10">${item.texto_cortado} ...</div>
                          <div>
                            <div __ver_contenido=${item.id_contenido}  class="cursor text-center center-block w150 p3 bg-system br6"> Ver más ...</div>
                          </div>
                        </div>
            `;
            $("[__contents_list]").append(card);
          })
        },

        setData: function (item) {
          let card = /*html*/`
                        <div class="flex " style="flex-direction:column; margin-bottom: 20px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 5px 20px;">
                          <h2>${item.titulo}</h2>
                          <em>Fecha de publicación: ${ moment(item.fecha_registro).format('DD/MM/YYYY')}</em>
                          <img src="${item.imagen}" style="width:200px; object-fit:cover; margin: 10px auto">
                          <div class="mt10">${item.texto}</div>
                        </div>
            `;
            $("[__content_data]").html(card);

        },
        /** MuestraModal con datos del contenido  */
        verContenido: (id) => {
          let id_contenido = id;
          funs.spinner();
          $.post(ctxG.rutabase + '/get-content', cmp.uAuth.addToken({ id_contenido: id_contenido }), (resp) => {
            let data = resp.data;
            funs.setData(data);
            $("#modal [__titulo] span").html(`_`);
            xyzFuns.showModal(ctxG.modal);
            funs.spinner(false)
          })
        },
        limpiarModal: () => {
          $(`${ctxG.modal} [__rg_field]`).val('').removeClass('br-a br-danger');
          $(`${ctxG.modal} [__op_field]`).val('').removeClass('br-a br-danger');
          
          /* Quita las clases de error en todos los campos requeridos  */
          xyzFuns.alertMsgClose('[__error]');

        },
        spinner: (obj = {}) => {
          xyzFuns.spinner(obj, ctxG.content)
        }
      }

      //-------------------- Listeners  --------------------------------

      let listen = () => {
        /* DEL CONTENEDOR */
        $(ctxG.content)
          /** Click en botones de accion como verContenido nuevo */
          .on('click', '[__ver_contenido]', (e) => {
            let id_contenido = $(e.currentTarget).attr('__ver_contenido');
            funs.limpiarModal();
            funs.verContenido(id_contenido);
          })

        /** DEL MODAL */
        $(ctxG.modal)

          /* Cancel Modal*/
          .on('click', "[__cerrar]", () => {
            xyzFuns.closeModal();
          })


          /* del alert */
          .on('click', "[__alert_msg] .close", (e) => {
            $(e.currentTarget).closest('[__alert_msg]').remove();
          })    
      }

      /**
       * Inicializa 
       */  
      let init = () => {
        funs.cargarDatos();
      }

      listen();
      init();
    })
  };

}