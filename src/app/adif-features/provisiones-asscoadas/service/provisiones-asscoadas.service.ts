import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { PageQuery } from '../../../shared/adif-data-table/data-table/data-table.component';

export interface Budget {
  codigo_sap_expediente: string;
  cod_sociedad: string;
}

export interface ResponseProvisionesAsscodas {
    key: {
      codigo: string;
      cod_sociedad: string;
      periodo?: string;
    };
    timestamp?: number;
}

export interface ProvisionesAsscodas {
  codigo_sap_expediente: string;
  cod_sociedad: string;
  periodo?: string;
  timestamp?: number;
  codigo?: string;
}

export interface ProvisionesContent {
  content: ResponseProvisionesAsscodas[];
  numberOfElements: number;
  totalElements: number;
}

export interface SearchProvisionesContent {
  content: ResponseProvisionesAsscodas[];
  numberOfElements: number;
  totalElements: number;
}

export interface SearchProvisiones {
  codigo: string;
  page: number;
  size: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProvisionesAsscoadasService {
  userSelection: ProvisionesAsscodas;
  private readonly podListnerUri = environment.provision_serverUrl + '/adif/grpc';
  private readonly allActionsUri = environment.provision_serverUrl + '/adif/contables';
  private readonly listAllUri = environment.provision_serverUrl + '/adif/list/';
  private readonly saveUri = environment.provision_serverUrl + '/adif/codigo';
  private readonly searchUri = environment.provision_serverUrl + '/adif/codigo/search/';
  private readonly searchCodigoUri = environment.provision_serverUrl + '/adif/codigo/autosearch';
  private readonly deleteCodigoUri = environment.provision_serverUrl + '/adif/codigo/delete';
  constructor(
    private http: HttpClient
  ) { console.log(environment.provision_serverUrl);}

  userSelectedRow(row) {
    this.userSelection = row;
  }

  getUserSelection() {
    return this.userSelection;
  }

  save(data: ProvisionesAsscodas) {
    return this.http.post<ProvisionesContent>(this.saveUri, data);
  }

  listAll(tstamp, pageQuery: PageQuery): Observable<ProvisionesContent> {
    return this.http.get<ProvisionesContent>(this.listAllUri + tstamp + '/' + pageQuery.pageIndex + '/' + pageQuery.pageSize);
  }

  searchCodigo(search): Observable<Budget> {
    return this.http.post<Budget>(this.searchCodigoUri, {
      'codigo_sap_expediente': search
    });
  }

  searchWithDate(data: SearchProvisiones): Observable<SearchProvisionesContent> {
    return this.http.post<SearchProvisionesContent>(this.searchUri, data);
  }

  delete(data: ResponseProvisionesAsscodas): Observable<any> {
    return this.http.post(this.deleteCodigoUri,
      { codigo_sap_expediente: data.key.codigo,
        cod_sociedad: data.key.cod_sociedad,
        timestamp: data.timestamp
      });
  }

  podListner() {
    return this.http.get(this.podListnerUri, {responseType: 'text'});
  }
}
