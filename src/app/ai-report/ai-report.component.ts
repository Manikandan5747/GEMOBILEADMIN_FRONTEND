import { Component } from '@angular/core';
import { AiReportService } from './ai-report.service';

@Component({
  selector: 'app-ai-report',
  templateUrl: './ai-report.component.html',
  styleUrls: ['./ai-report.component.css']
})
export class AiReportComponent {

  question = '';
  loading = false;
  response: any = null;

  constructor(private aiReportService: AiReportService) {}

generateReport() {
  if (!this.question.trim()) {
    return;
  }

  this.loading = true;
  this.response = null;

  this.aiReportService.generateReport(this.question).subscribe({
    next: (result) => {
      console.log('AI Report Response:', result);

      this.response = result;
      this.loading = false;
    },

    error: (error) => {
      console.error('AI Report Error:', error);

      this.response = {
        success: false,
        message: 'Failed to generate report'
      };

      this.loading = false;
    }
  });
}
}