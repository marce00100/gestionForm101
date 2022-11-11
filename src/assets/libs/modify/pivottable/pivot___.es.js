(function() {
  var callWithJQuery;

  callWithJQuery = function(pivotModule) {
    if (typeof exports === "object" && typeof module === "object") {
      return pivotModule(require("jquery"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery"], pivotModule);
    } else {
      return pivotModule(jQuery);
    }
  };

  callWithJQuery(function($) {
    var frFmt, frFmtInt, frFmtPct, nf, tpl;
    // slice = [].slice;
    nf = $.pivotUtilities.numberFormat;
    tpl = $.pivotUtilities.aggregatorTemplates;
    frFmt = nf({
      thousandsSep: ".",
      decimalSep: ","
    });
    frFmtInt = nf({
      digitsAfterDecimal: 0,
      thousandsSep: ".",
      decimalSep: ","
    });
    frFmtPct = nf({
      digitsAfterDecimal: 1,
      scaler: 100,
      suffix: "%",
      thousandsSep: ".",
      decimalSep: ","
    });

    tpl.lili = function(formatter) {
        if (formatter == null) {
            formatter = usFmt;
        }
        return function(arg) {
            console.log(arg)
            var attr;
            attr = arg[0];
            return function(data, rowKey, colKey) {
                return {
                    sum: 0,
                    push: function(record) {
                      if (!isNaN(parseFloat(record[attr]))) {
                        return this.sum += parseFloat(record[attr]);
                      }
                    },
                    value: function() {
                      return this.sum;
                    },
                    format: formatter,
                    numInputs: attr != null ? 0 : 1
                };
            };
        };
    };
    tpl.fract = function(wrapped, type, formatter) {
        if (type == null) {
          type = "total";
        }
        // type = 'row';
        // wrapped = 'sum';
        if (formatter == null) {
          formatter = usFmtPct;
        }
        formatter = frFmt;
        return function() {
          var x = arguments[0];
          var i = 0, j=0;
          x = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          
          return function(data, rowKey, colKey) {
            return {
              selector: {
                total: [[], []],
                row: [rowKey, []],
                col: [[], colKey]
              }[type],
              inner: wrapped.apply(null, x)(data, rowKey, colKey),
             vector :null,
              push: function(record) {
                // record['rowKey'] = rowKey;
                // record['colKey'] = colKey;
                var obj = {};
                this.vector[rowKey][colKey]['valor'] = this.inner.push(record);
                // obj[rowKey][colKey]['valor'] = this.inner.push(record);
                
                // console.log(this.inner)


                // i++;
                // this.inner.push(record);
                // this.vector.push(this.inner)
                
                // return 
                // console.log(this.inner.value())
                // console.log(this.inner.value())
                // console.log(record)
                // return 4;
              },
              format: formatter,
              value: function() {
                console.log(rowKey + ' ' + colKey ) ;
                console.log(this.vector);
                var r = this.inner.value() ;  /// data.getAggregator.apply(data, this.selector).inner.value();

                return r;
              },
              numInputs: wrapped.apply(null, x)().numInputs
            };
          };
        };
      }
    // };
    return $.pivotUtilities.locales.es = {
      localeStrings: {
        renderError: "Ocurrió un error durante la interpretación de la tabla dinámica.",
        computeError: "Ocurrió un error durante el cálculo de la tabla dinámica.",
        uiRenderError: "Ocurrió un error durante el dibujado de la tabla dinámica.",
        selectAll: "Todos",
        selectNone: "Ninguno",
        tooMany: "(demasiados valores)",
        filterResults: "Filtrar",
        totals: "Totales",
        vs: "vs",
        by: "por",
        apply: "aplicar",
        cancel: "cerrar"
      },
      aggregators: {
        // "Contar": tpl.count(frFmtInt),
        // "Contar valores únicos": tpl.countUnique(frFmtInt),
        // "Lista de valores únicos": tpl.listUnique(", "),
        "Cantidad total": tpl.sum(frFmtInt),
        // "Suma de enteros": tpl.sum(frFmtInt),
        "Cantidad total con decimales": tpl.sum(frFmt),
        // "Suma": tpl.sum(frFmt),
        "Promedio": tpl.average(frFmt),
        "Mínimo": tpl.min(frFmt),
        "Máximo": tpl.max(frFmt),
        "Indice  sum(a) / sum(b)": tpl.sumOverSum(frFmt),
        "Cota 80% superior": tpl.sumOverSumBound80(true, frFmt),
        "Cota 80% inferior": tpl.sumOverSumBound80(false, frFmt),
        "% part. en columna (suma)": tpl.fractionOf(tpl.sum(), "col", frFmtPct),
        "% part. en fila (suma)": tpl.fractionOf(tpl.sum(), "row", frFmtPct),
        "% part. del total (suma)": tpl.fractionOf(tpl.sum(), "total", frFmtPct),
        
        // "% participación del total (cuenta)": tpl.fractionOf(tpl.count(), "total", frFmtPct),
        // "% participación en fila (cuenta)": tpl.fractionOf(tpl.count(), "row", frFmtPct),
        // "% participación en columna (cuenta)": tpl.fractionOf(tpl.count(), "col", frFmtPct)
        
        // "haber de prueba" : tpl.lili(frFmt),
        // "fract" : tpl.fract(tpl.sum(), "row",frFmtPct),
        // "suma valor" : function(){ return tpl.sum(frFmtInt)(['valor']) }
      },
      renderers: {
        "Tabla": $.pivotUtilities.renderers["Table"],
        "Tabla con barras": $.pivotUtilities.renderers["Table Barchart"],
        "Heatmap": $.pivotUtilities.renderers["Heatmap"],
        "Heatmap por filas": $.pivotUtilities.renderers["Row Heatmap"],
        "Heatmap por columnas": $.pivotUtilities.renderers["Col Heatmap"]
      }
    };
  });

}).call(this);

//# sourceMappingURL=pivot.es.js.map
