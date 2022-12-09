import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { format, parseISO } from 'date-fns';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { IonicModule } from '@ionic/angular';

import { LoggingPageRoutingModule } from './logging-routing.module';

import { LoggingPage } from './logging.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoggingPageRoutingModule,
    
  ],
  declarations: [LoggingPage]
})
export class LoggingPageModule {}
