import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/encryption/data.service';

@Component({
  selector: 'app-view-vehicle-details',
  templateUrl: './view-vehicle-details.component.html',
  styleUrls: ['./view-vehicle-details.component.css']
})
export class ViewVehicleDetailsComponent implements OnInit {

  CommonConstants1 = 'https://geapps.germanexperts.ae:7006/';
  
  vehicleDetails :any
  storage_data_id: any;

  constructor( private dataService: DataService,) {
  
      this.storage_data_id = this.dataService.getData('vehicleappraisal_storage_data_id');
      if(this.storage_data_id){
        this.getRecord(this.storage_data_id);
      }
      
    }
  
  
    public getRecord(storage_data_id: any) {debugger
      this.dataService.findById(storage_data_id).subscribe({
        next: async (response: any) => {
          console.log("Retrieved data:", response);
          this.vehicleDetails = response?.data.items
        
      
        },
        error: (err) => {
          console.error("Error retrieving data:", err);
        }
      });
    }
  

  ngOnInit(): void {

    
  }

}
