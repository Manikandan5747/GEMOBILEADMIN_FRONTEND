import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CommonConstants } from 'src/app/common/common.constant';


@Injectable({
  providedIn: 'root'
})
export class EventService {
  currentUser: any;
  privilegearr: any;
  private plannerId: number | null = null;
  private apiKey = 'a4db08b7-5729-4ba9-8c08-f2df493465a1';

  constructor(private http: HttpClient) { }


  setPlannerId(id: number) {
    this.plannerId = id;
    localStorage.setItem('eventPlannerId', id.toString());
  }

  getPlannerId(): number | null {
    return this.plannerId ?? Number(localStorage.getItem('eventPlannerId'));
  }
    //getCurrentUserPrivilegeArr Details
  getCurrentUserPrivilegeArr(): any {
    this.privilegearr = localStorage.getItem('privilegearr');
    return JSON.parse(this.privilegearr);
  }

  getMainEvents() {
    const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

   
return this.http.get<any>(`${CommonConstants.WEBAPI_URL}/api/listmainevents`, { headers })
  .pipe(map(response => {
    return response;
  }));

  }


getEventsTable() {
    const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

   
return this.http.get<any>(`${CommonConstants.WEBAPI_URL}/api/listofeventtable`, { headers })
  .pipe(map(response => {
    return response;
  }));

  }

validateQueryPreview(queryPreview: string) {
  const requestBody = { querypreview: queryPreview };

  return this.http.post<any>(
    `${CommonConstants.WEBAPI_URL}/api/validatequerypreview`,
    requestBody
  ).pipe(
    map(response => response)
  );
}

getEventsTableFields(tablename: string): Observable<any> {
    // Getting active access token
    return this.http.get<any>('https://geapps.germanexperts.ae:7007/api/crmservicegetaccesstokenByStatus/Active/2')
      .pipe(
        switchMap((tokenResponse: any) => {
          const token = tokenResponse?.[0]?.crm_accesstoken;


          if (!token) throw new Error('Access token not found');

          const headers = new HttpHeaders({
            'access_token': token  
          });

          return this.http.get<any>(CommonConstants.WEBAPI_URL + `/api/fieldlistagainsttable/${tablename}`, { headers });
        })
      );
  }


  getEventsTables(): Observable<any> {
    // Getting active access token
    return this.http.get<any>('https://geapps.germanexperts.ae:7007/api/crmservicegetaccesstokenByStatus/Active/2')
      .pipe(
        switchMap((tokenResponse: any) => {
          const token = tokenResponse?.[0]?.crm_accesstoken;


          if (!token) throw new Error('Access token not found');

          const headers = new HttpHeaders({
            'access_token': token  
          });

          return this.http.get<any>(CommonConstants.WEBAPI_URL + `/api/tablelist`, { headers });
        })
      );
  }
getEventsFieldValues(tableName: string, fieldName: string): Observable<any> {
  return this.http.get<any>('https://geapps.germanexperts.ae:7007/api/crmservicegetaccesstokenByStatus/Active/2')
    .pipe(
      switchMap((tokenResponse: any) => {
        const token = tokenResponse?.[0]?.crm_accesstoken;
        if (!token) throw new Error('Access token not found');

        const headers = new HttpHeaders({ 'access_token': token });

        const encodedTable = encodeURIComponent(tableName);
        const encodedField = encodeURIComponent(fieldName);

        const url = `${CommonConstants.WEBAPI_URL}/api/valuelist/${encodedTable}/${encodedField}`;
        console.log('Fetching field values from URL:', url);

        return this.http.get<any>(url, { headers });
      })
    );
}





  getEventsCompany() {
    const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

   
return this.http.get<any>(`${CommonConstants.WEBAPI_URL}/api/listeventcompany`, { headers })
  .pipe(map(response => {
    return response;
  }));

  }

  getActiveEventPlanner() {
    const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

   
return this.http.get<any>(`${CommonConstants.WEBAPI_URL}/api/listeventplanner`, { headers })
  .pipe(map(response => {
    return response;
  }));

  }
  getActiveEventPlannerFilter() {
    const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

   
return this.http.get<any>(`${CommonConstants.WEBAPI_URL}/api/listeventplannerfilter`, { headers })
  .pipe(map(response => {
    return response;
  }));

  }

    getActiveEvents() {
    const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

   
return this.http.get<any>(`${CommonConstants.WEBAPI_URL}/api/listevents`, { headers })
  .pipe(map(response => {
    return response;
  }));

  }

    getActiveTemplate() {
    const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

   
return this.http.get<any>(`${CommonConstants.WEBAPI_URL}/api/listeventtemplate`, { headers })
  .pipe(map(response => {
    return response;
  }));

  }

  getCountry() {
    const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

   
return this.http.get<any>(`${CommonConstants.WEBAPI_URL}/api/listofcountry`, { headers })
  .pipe(map(response => {
    return response;
  }));

  }


    getActiveQuery() {
    const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

   
return this.http.get<any>(`${CommonConstants.WEBAPI_URL}/api/listeventquery`, { headers })
  .pipe(map(response => {
    return response;
  }));

  }



    getActiveMainEvents() {
    const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

   
return this.http.get<any>(`${CommonConstants.WEBAPI_URL}/api/listmaineventsforpage`, { headers })
  .pipe(map(response => {
    return response;
  }));

  }
getEventsTemplateByName(name: string): Observable<any> {
  const headers = new HttpHeaders({
    'apikey': this.apiKey
  });

  return this.http.get<any>(
    `${CommonConstants.WEBAPI_URL}/api/listeventtemplatebyname/${name}`,
    { headers }
  );
}




   getActiveEventTableList() {
    const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

   
return this.http.get<any>(`${CommonConstants.WEBAPI_URL}/api/eventtable`, { headers })
  .pipe(map(response => {
    return response;
  }));

  }


  getActiveEventFieldList() {
  const headers = new HttpHeaders({
    'apikey': this.apiKey
  });

  return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/fieldlist", {headers: headers
  }).pipe(
    map(response => {
      return response;
    })
  );
}

getActiveEventFieldListagainstTable(table_id: number) {
  const headers = new HttpHeaders({
    'apikey': this.apiKey
  });

return this.http.get<any[]>(`${CommonConstants.WEBAPI_URL}/api/fieldlistfortablename/${table_id}`, { headers });

}



  getEventCustomers() {
  const headers = new HttpHeaders({
    'apikey': this.apiKey
  });

  return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/gettingcustomereventdetails", {headers: headers
  }).pipe(
    map(response => {
      return response;
    })
  );
}

 getEventQRCode() {
  const headers = new HttpHeaders({
    'apikey': this.apiKey
  });

  return this.http.get<any>(CommonConstants.WEBAPI_URL + "/api/gettingeventqrcodedetails", {headers: headers
  }).pipe(
    map(response => {
      return response;
    })
  );
}

getActiveEventparametername(queryId: number) {
  const headers = new HttpHeaders({ 'apikey': this.apiKey });

  return this.http.get<any>(
    `${CommonConstants.WEBAPI_URL}/api/parameternamelist/${queryId}`,
    { headers }
  );
}

getActiveEventfieldname(queryId: number) {
  const headers = new HttpHeaders({ 'apikey': this.apiKey });

  return this.http.get<any>(
    `${CommonConstants.WEBAPI_URL}/api/fieldnamelist/${queryId}`,
    { headers }
  );
}



getActiveEventparameternameagainsteventplanner(queryId: number,event_planner_id) {
  const headers = new HttpHeaders({ 'apikey': this.apiKey });

  return this.http.get<any>(
    `${CommonConstants.WEBAPI_URL}/api/parameternamelist/${queryId}/${event_planner_id}`,
    { headers }
  );
}
// getting query preview

getActiveEventQueryPreview(queryId: number) {
  const headers = new HttpHeaders({ 'apikey': this.apiKey });

  return this.http.get<any>(
    `${CommonConstants.WEBAPI_URL}/api/gettingquerypreview/${queryId}`,
    { headers }
  );
}







    createEvent(params: any) {
      const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/createmaineventandsubevent", params, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createEventPlanner(params: any) {
      const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/eventplanner", params, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }

  createEventPlannerfilter(params: any) {
      const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/eventplannerfilter", params, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }
    createEventField(params: any) {
      const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/eventfield", params, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


getEventPlannerFiltersById(eventPlannerId: number) {
  const headers = new HttpHeaders({
    'apikey': this.apiKey
  });

  return this.http.get<any>(`${CommonConstants.WEBAPI_URL}/api/listeventplannerfilter/${eventPlannerId}`, { headers })
    .pipe(map(response => response));
}

deleteFilter(filterId: number, userId: number): Observable<any> {
  const headers = new HttpHeaders({
    'apikey': this.apiKey
  });

  const body = {
    userid: userId
  };

  return this.http.post<any>(`${CommonConstants.WEBAPI_URL}/api/listeventplannerfilterinactive/${filterId}`, body, { headers });
}


deleteEventCustomer(eventcustid: number, userId: number): Observable<any> {
  const headers = new HttpHeaders({
    'apikey': this.apiKey
  });

  const body = {
    userid: userId
  };

  return this.http.post<any>(`${CommonConstants.WEBAPI_URL}/api/updatecustomerdetails/${eventcustid}`, body, { headers });
}


  getParametersByQuery(queryId: number) {
  const headers = new HttpHeaders({
    'apikey': this.apiKey
  });

  return this.http.get<any>(`${CommonConstants.WEBAPI_URL}/api/parameternamelist/${queryId}`, { headers })
    .pipe(map(response => response));
}




   createEventTable(params: any) {
      const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/eventtable", params, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


    createTemplate(params: any) {
      const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/eventtemplate", params, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


    createQuery(params: any) {
      const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/eventquery", params, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


 createMainEvent(params: any) {
      const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

    return this.http.post<any>(CommonConstants.WEBAPI_URL + "/api/mainevents", params, { headers: headers })
      .pipe(map(response => {
        return response;
      }));
  }


 getEventById(event_id: number) {
  const headers = new HttpHeaders({
    'apikey': this.apiKey
  });
  return this.http.get<any>(CommonConstants.WEBAPI_URL + `/api/events/${event_id}`, { headers });
}


 getEventQueryById(query_id: number) {
  const headers = new HttpHeaders({
    'apikey': this.apiKey
  });
  return this.http.get<any>(CommonConstants.WEBAPI_URL + `/api/listeventqueryagainstid/${query_id}`, { headers });
}

updateEvent(params: any) {
  const headers = new HttpHeaders({
    'apikey': this.apiKey,
    'Content-Type': 'application/json'  
  });
  return this.http.post<any>(
    CommonConstants.WEBAPI_URL + `/api/updateevents/${params.event_id}`,
    params,
    { headers }
  );
}

updateEventTemplate(params: any) {
  const headers = new HttpHeaders({
    'apikey': this.apiKey,
    'Content-Type': 'application/json'  
  });
  return this.http.post<any>(
    CommonConstants.WEBAPI_URL + `/api/updateeventtemplate/${params.id}`,
    params,
    { headers }
  );
}


updateEventPlanner(id: number, formData: FormData): Observable<any> {
  const headers = new HttpHeaders({
    'apikey': this.apiKey
  });
  return this.http.post<any>(
    CommonConstants.WEBAPI_URL + `/api/updateeventplannerandfilter/${id}`,formData,
    { headers });
}


uploadEventPlannerExcel(formData: FormData) {
  const headers = new HttpHeaders({
    'apikey': this.apiKey
  });
  //return this.http.post('/uploadeventplannerfromexcel', formData, { headers });
   return this.http.post<any>(
    CommonConstants.WEBAPI_URL + `/api/uploadeventplannerfromexcel`,formData,
    { headers });
}
savingcustomereventdetails() {

   return this.http.post<any>(
    CommonConstants.WEBAPI_URL + `/api/savingcustomereventdetailsfromeventplanner`,
    {  });
}
updateEventQuery(params: any) {
  const headers = new HttpHeaders({
    'apikey': this.apiKey,
    'Content-Type': 'application/json'  
  });
  return this.http.post<any>(
    CommonConstants.WEBAPI_URL + `/api/updateeventquery/${params.query_id}`,
    params,
    { headers }
  );
}


deleteEventTableField(field_id: number) {
  const headers = new HttpHeaders({
    'apikey': this.apiKey,
    'Content-Type': 'application/json'
  });
  return this.http.post<any>(
    `${CommonConstants.WEBAPI_URL}/api/deleteeventtablefield/${field_id}`,
    { headers }
  );
}


 




updateMainEvent(params: any) {
  const headers = new HttpHeaders({
    'apikey': this.apiKey,
    'Content-Type': 'application/json'  
  });
  return this.http.post<any>(
    CommonConstants.WEBAPI_URL + `/api/updatemainevents/${params.main_event_id}`,
    params,
    { headers }
  );
}


updateEventTable(params: any) {
  const headers = new HttpHeaders({
    'apikey': this.apiKey,
    'Content-Type': 'application/json'  
  });
  return this.http.post<any>(
    CommonConstants.WEBAPI_URL + `/api/updateeventtable/${params.table_id}`,
    params,
    { headers }
  );
}

  // Optional: Add more methods here, like getEventById, createEvent, etc.
}
