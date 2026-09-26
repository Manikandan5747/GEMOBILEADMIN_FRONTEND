import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/service/event/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-event-planner-filter',
  templateUrl: './manage-event-planner-filter.component.html',
  styleUrls: ['./manage-event-planner-filter.component.css']
 
})
export class ManageEventPlannerFilterComponent implements OnInit {
  eventPlanner: any = null;

  plannerDetailsExpanded = true;
  filterDetailsExpanded = true;

  eventPlannerId!: any;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {

  this.eventPlannerId = this.eventService.getPlannerId();

  if (this.eventPlannerId) {
    this.loadEventPlannerDetails();
  } else {
    Swal.fire('Error', 'Invalid event planner ID', 'error');
  }
  }

 loadEventPlannerDetails(): void {
  this.isLoading = true;  
  this.eventService.getEventPlannerFiltersById(this.eventPlannerId).subscribe({
    next: (res: any) => {
      this.isLoading = false;
      if (res && res.success && res.data) {
        this.eventPlanner = res.data;
        console.log("Event Planner Data:", this.eventPlanner);
      } else {
        Swal.fire('Info', 'No data found.', 'info');
        this.eventPlanner = null;
      }
    },
    error: (err) => {
      
      this.isLoading = false;
      console.error('Error fetching event planner details:', err);
      Swal.fire('Error', 'Failed to load event planner details', 'error');
    }
  });
}

  goBack(): void {
    this.router.navigate(['/event_planner']);
  }
}
