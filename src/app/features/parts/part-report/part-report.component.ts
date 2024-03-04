import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';

import FetchStatus from '../../../constants/fetchStatus';
import { PartReportState } from '../store/partsReport.reducers';
import { SafePipe } from '../../../infrastructure/safe-pipe';


@Component({
    selector: 'app-part-report',
    standalone: true,
    imports: [CommonModule, MatTooltipModule, MatButtonModule, MatIconModule, SafePipe],
    styleUrl: './part-report.component.css',
    template: `
        <div class="pdf-container">
            <!-- { reportFetchStatus === FetchStatus.Loading && 
            <Spinner animation="border" role="status" >
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            }
            {
            errorMessage &&
            <Alert variant='danger'>{errorMessage}</Alert>
            }
            { reportFetchStatus === FetchStatus.Failed && 
                <Alert variant='danger'>An error occurred fetching report.</Alert>
            } -->

            <p *ngIf="hasError">An error occurred fetching report.</p>

            <div class='tool-container'>
                <button mat-fab extended color="primary" class="tool-button" aria-label="Back" (click)="handleNavBack()" matTooltip="Back to Part List">
                    <mat-icon>arrow_back</mat-icon>
                    Report
                </button> 
            </div>
            <div *ngIf="reportDataUrl">
                <iframe src="{{reportDataUrl | safe}}" class="pdf-view"></iframe>
            </div>
        </div>
    `
})

export class PartReportComponent {
    reportFetchStatus?: FetchStatus
    reportData?: SafeResourceUrl
    reportDataUrl?: String
    hasError?: Boolean = this.reportFetchStatus && this.reportFetchStatus === FetchStatus.Failed

    constructor(private store: Store<{partsReport: PartReportState}>, private router: Router, private sanitizer: DomSanitizer){
        console.log('report construct')
    }

    ngOnInit(): void {
        console.log('report init')
        this.store.select(state => state.partsReport).subscribe(s => {
            //console.log(s);
            
            this.reportFetchStatus = s.fetchStatus;
            if(s.reportData){     
                           
                console.log('hey')
                const blb = new Blob([s.reportData], {type: 'application/pdf'});
                const url = URL.createObjectURL(blb);
                //this.reportData = this.sanitizer.bypassSecurityTrustResourceUrl(url);
                this.reportDataUrl = url;
            }
        });
    }

    handleNavBack = (): void => {
        this.router.navigate(['/part-list'])
    }
}