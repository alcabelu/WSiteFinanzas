import { Component, OnInit, Input } from '@angular/core';
import { InternosService } from './internos.service';
import { ISeries } from './series';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'int-unidades-nv4',
  templateUrl: './unidades-nv4.component.html',
  styleUrls: ['./internos.component.scss']
})
export class UnidadesNv4Component implements OnInit {

  @Input() detalleUnidadesConcepto: string;
  @Input() detalleUnidadesConceptoSegundoNivel: string;
  @Input() anio: string;
  @Input() mes: string;
  @Input() selectedCompania: number;
  @Input() selectedSucursal: string;
  @Input() tipoAuto: string;
  @Input() idReporte: string;
  @Input() deptoFlotillas: string;

  detalleUnidadesSeries: Observable<ISeries[]>;

  constructor(private _service: InternosService) { }

  ngOnInit() {
    this.detalleUnidadesSeries = this.getDetalleUnidadesSeries(this.tipoAuto, this.idReporte, this.mes);
  }

  getDetalleUnidadesSeries(tipoAuto: string = '', idReporte: string, mes: string): Observable<ISeries[]> {
    // Se usa como parametro de departamento el texto de Concepto del primer nivel,
    // sin las letras N o S que se le agregan al inicio
    let concepto = this.detalleUnidadesConcepto;

    if (concepto.startsWith('N ')) concepto = concepto.substr(2);
    else if (concepto.startsWith('S ')) concepto = concepto.substr(2);

    return this._service.getDetalleUnidadesSeries({
      idAgencia: this.selectedCompania,
      mSucursal: this.selectedSucursal,
      anio: this.anio,
      mes: mes === '' ? this.mes : mes, //Cuando se manda a llamar desde acumulado (lado verde) contiene el parametro de mes
      departamento: concepto === 'FLOTILLAS' ? this.deptoFlotillas : concepto,
      idEstadoDeResultado: 1, //QUITAR HARD CODE CUANDO TIBERIO COMPLETE EL SP
      idReporte: idReporte,
      carLine: this.detalleUnidadesConceptoSegundoNivel,
      tipoAuto: tipoAuto
    });
  }
}
