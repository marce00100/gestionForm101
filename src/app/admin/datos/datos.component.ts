import { Component, OnInit } from '@angular/core';
import { UAuthService } from 'src/app/shared/uauth.service';
declare var $: any;
declare var _: any;
declare var xyzFuns: any;
declare var PNotify: any;
declare var DataTable:any;
declare var moment: any;

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  // styleUrls: ['./datos.component.scss'],
})
export class DatosComponent implements OnInit {

  constructor(private uAuth: UAuthService) { }

  ngOnInit() {
    this.seguimiento();
  }

  seguimiento() {
    let cmp = this;

    $(function () {

      let ctxG: any = {
        rutabase: xyzFuns.urlRestApi,
        contenedor: '#datos_contenedor',
        modal: "#modal",
        dataTableTarget: "#dataT",
        data: [],
      }


      let conT: any = {
        dt: {},
        selectedRow: {},

        // cargarDatos: function(){
        //     $.get(`${ctxG.rutabase}/get-usuarios`, function(resp){
        //         ctxG.data = resp.data;
        //         conT.fillDataT();
        //         // conT.fillDataT();
        //     });
        // },
        fillDataT: function (columnas, data) {
          let columns = [];
          _.forEach(columnas, function (col) {
            columns.push({ title: col, data: col, width: '120' });
          });

          conT.dt = $(ctxG.dataTableTarget).DataTable({
                    destroy: true,
                    data: data,
                    autoWidth: true,
                    // info:true,
                    scrollX: true,
                    className: 'fs-10',
                    columns: columns,
                    language: xyzFuns.dataTablesEspanol(),        
                  });

        }
      }

      let funs = {
        inicializaControles: () => {
          $.post(ctxG.rutabase + '/get-usuarios-operadores', cmp.uAuth.addToken({}), function (res) {
            let users = res.data;
            $("[__filtro=id_usuario]").html(xyzFuns.generaOpciones(users, 'id_usuario', 'usuario_operador', 'TODOS'));
          })

          // let departamentos = ['CHUQUISACA', 'LA PAZ', 'COCHABAMBA', 'ORURO', 'POTOSÍ', 'TARIJA', 'SANTA CRUZ', 'BENI', 'PANDO'];
          // let deptoOpts = xyzFuns.generaOpcionesArray(departamentos, "TODOS");
          // $("[__filtro=departamento]").html(deptoOpts);

          /*  municipios*/
          $.get(`${ctxG.rutabase}/municipiosch`, cmp.uAuth.addToken({})  ,(res) => {
            // ctxG.municipios = res.data;
            let opts = xyzFuns.generaOpciones(res.data, 'municipio', 'municipio', "TODOS");
            $("[__filtro=municipio]").html(opts); /* inicializa en vacio para que se seleccione */
          });

          let tipoFormulario = ['METALICOS', 'NO METALICOS'];
          // let tipoFormulario = [{ tipo: 'METALICOS', texto: 'METALICOS' }, { tipo: 'NO METALICOS', texto: 'NO METALICOS' }];
          let optsTipoForm = xyzFuns.generaOpcionesArray(tipoFormulario, "TODOS");
          $("[__filtro=tipo_formulario]").html(optsTipoForm);

          let estadoFormLleno = ['EMITIDO', 'ANULADO'];
          let optsEstadoFormLleno = xyzFuns.generaOpcionesArray(estadoFormLleno, "TODOS");
          $("[__filtro=estado_form_lleno]").html(optsEstadoFormLleno);
          $("[__filtro=estado_form_lleno]").val('EMITIDO');
        },

        /** Obtiene los filtros para los datos*/
        get_filtros: () => {
          return {
            tipo_formulario: $("[__filtro=tipo_formulario]").val(),
            municipio: $("[__filtro=municipio]").val(),
            fecha_reg_desde: $("[__filtro=fecha_desde]").val(),
            fecha_reg_hasta: $("[__filtro=fecha_hasta]").val(),
            id_usuario: $("[__filtro=id_usuario]").val(),
            estado_form_lleno: $("[__filtro=estado_form_lleno]").val(),
            ingenio_minero: $("[__filtro=ingenio_minero]").val(),
          }
        },

        /** Visuañliza en DT*/
        visualizar_datos: () => {
          xyzFuns.spinner(true);
          console.log(funs.get_filtros());
          $.post(`${ctxG.rutabase}/getdatos-respuestas`, cmp.uAuth.addToken(funs.get_filtros()), function (resp) {
            if (resp.estado == 'ok') {    
              conT.fillDataT(resp.columnas, resp.data);
              $("[__conteo_filtro]").html(` ${resp.data.length} Registros`);
            }
            xyzFuns.spinner(false);
          })
        },

        /** Exportar a Exxcel */
        exportar: () => {
          let filtros = funs.get_filtros();
          window.location.href = `${ctxG.rutabase}/exportexcel?` + $.param(filtros);
        },

        /** Muestra Modal los campos de preguntas con sus alias*/
        codificar_alias_pregunta: () => {
          $.post(`${ctxG.rutabase}/getpreguntas`, cmp.uAuth.addToken({}), function (res) {
            let elementos = res.data;
            let htmlAlias = /*html*/`
                                  <div  class="ph10" style="display:grid; grid-template-columns: 4fr 4fr; 
                                  align-items: center; column-gap: 10px; row-gap: 13px; height: 500px; over-flow-y:auto">
                                      <div style="align-self: baseline; ">
                                          <h3>Preguntas</h3>
                                          <span>Las preguntas tal y como están en el formulario</span>
                                      </div>     
                                      <div>     
                                          <h3>Alias</h3>
                                          <span>Nombres cortos para las columnas de EXCEL y variables Estadísticas.
                                              <br>Máximo 58 caracteres: solo letras, números, espacio y simbolos . - _ ( )  </span>
                                      </div>
                                      <hr clasS="m0" style="grid-column: span 2; margin: 0">  
                                  </div>`;
            let elementosAlias = $(htmlAlias);
            _.forEach(elementos, function (el, k) {
              let elem = /*html*/`
                                  <div>
                                      <span>${el.texto}</span>
                                  </div>
                                  <div class="has-system">
                                      <input __alias __id="${el.id}" clasS="form-control" maxlength=58 value="${el.alias ? el.alias : el.texto.substr(0, 59)}"/>
                                  </div>
                                  <hr clasS="m0" style="grid-column: span 2; margin: 0">
                              `;

              $(elementosAlias).append(elem);
            });

            $("[__contenido_modal]").html($(elementosAlias));
            $("[__titulo_modal]").html("Editar los alias de las preguntas ")
            xyzFuns.showModal("#modal");
          })

        },
        /** Guarda los Alias de las preguntas*/
        save_alias: () => {
          let listaElemsAlias = _.map($("[__alias]"), function (elem, k) {
            return { id: $(elem).attr('__id'), alias: $(elem).val() }
          })

          $.post(`${ctxG.rutabase}/guardar-alias`, cmp.uAuth.addToken({ lista_alias: listaElemsAlias }),
            function (res) {
              xyzFuns.showMensajeFlotante('Guardado', res.estado, res.msg);
              funs.cerrarModal();
            })
        },

        /** Para sincronizar la tabla de datos  */
        sincronizar_tabla: () => {
          xyzFuns.spinner(true);
          $.post(ctxG.rutabase + '/sincronizartabla', cmp.uAuth.addToken({}), function (res) {
            xyzFuns.spinner(false);
          })
        },

        cerrarModal: () => {
          $.magnificPopup.close();
        }

      }
    
    
    
        
      let listen = () => {

        $('#datos_contenedor')

          .on('click', '[__accion_datos]', function (e) {
            var elem = e.currentTarget;
            funs[$(elem).attr('__accion_datos')](); 
          })
          .on('click', '[__configuracion_alias]', function(){
            $("[__configuracion_alias_cuadro]").toggle(300);
          })


        /* Cancel Modal*/
        $("[__cerrar]").click(function () {
          funs.cerrarModal();
        });

        $("[__save_alias]").click(function () {
          funs.save_alias();
        });

      }
    
    
      /*------------------------------  INIT ---------------------------------*/
        
      let init = (() => {
        listen();
        funs.inicializaControles();

      })()
    })
    
      
      
  };

}
